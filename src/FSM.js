/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

import RawModHandlers from './RawMod/Handlers'

const os = require('os')
const util = require('util')
const ipaddr = require('ipaddr.js')
const machina = require('machina')
const KnxConstants = require('./KnxConstants.js')
const IpRoutingConnection = require('./IpRoutingConnection.js')
const IpTunnelingConnection = require('./IpTunnelingConnection.js')
const KnxLog = require('./KnxLog.js')
const Address = require('./Address.js')

/*
 * Defined by RawMod
 * defining standards is ALWAYS a good idea
 */
const RECONNECT_DELAY_DEFAULT = 3000 // Delay between reconnection attempts (ms)
const AUTO_RECONNECT_DEFAULT = true // Enables/Disables automatic reconnection
const DEFAULT_RECEIVE_ACK_TIMEOUT = 2000 // How long to wait for a acknowledge message from the KNX-IP interface (ms)
const DEFAULT_MINIMUM_DELAY = 20 // How long to wait after sending a message to send the next one
const DEFAULT_CONNSTATE_REQUEST_INTERVAL = 10000 // Request the connection state from the KNX-IP interface every 10 seconds by default
const DEFAULT_CONNSTATE_RESPONSE_TIMEOUT = 1500 // Wait 1.5 seconds for a connection state response before declaring a connecting lost by default

const states = {
  uninitialized: {
    '*': function () {
      // Set this.isConnected
      this.isConnected = false

      // try to connect
      this.transition('connecting')
    }
  },
  jumptoconnecting: {
    _onEnter: function () {
      this.transition('connecting')
    }
  },
  connecting: {
    _onEnter: function () {
      /*
       * check if there was a re-connect delay specified
       * One reconnect attempt takes two different methods
       *  => reconnectDelay has to be divided by two
       * And check if autoReconnect was specified
       */
      let reconnectDelay = this.options.reconnectDelayMs / 2 || RECONNECT_DELAY_DEFAULT / 2
      let autoReconnect = this.options.hasOwnProperty('autoReconnect') ? this.options.autoReconnect : AUTO_RECONNECT_DEFAULT

      // Check if the user called to disconnect
      if (this.disconnectCalled) {
        autoReconnect = false
      }

      // tell listeners that we disconnected
      // putting this here will result in a correct state for our listeners
      this.emit('disconnected')

      let sm = this
      this.log.debug(util.format('useTunneling=%j', this.useTunneling))
      if (this.useTunneling) {
        sm.connection_attempts = -1
        if (!this.localAddress) throw Error('Not bound to an IPv4 non-loopback interface')
        this.log.debug(util.format('Connecting via %s...', sm.localAddress))
        // we retry 3 times, then restart the whole cycle using a slower and slower rate (max delay is 5 minutes)
        this.connecttimer = setInterval(function () {
          sm.connection_attempts += 1
          if (sm.connection_attempts >= 1) {
            clearInterval(sm.connecttimer)
            // quite a few KNXnet/IP devices drop any tunneling packets received via multicast
            if (sm.remoteEndpoint.addr.range() === 'multicast') {
              this.log.warn('connection timed out, falling back to pure routing mode...')
              sm.usingMulticastTunneling = true
              sm.transition('connected')
            } else {
              /*
               * Call RawModHandlers.connFailHandler() when the connection fails
               */
              RawModHandlers.connFailHandler(this)

              /*
               * check if reconnecting is allowed
               */
              if (autoReconnect) {
                /*
                 * try to reconnect if autoReconnect is set to true
                 */
                this.log.warn('connection timed out ... reconnecting')
                // restart connecting cycle (cannot jump straight to 'connecting' so we use an intermediate state)
                sm.transition('jumptoconnecting')
              } else {
                /*
                 * disconnect and leave everything up to the user if autoReconnect is not set to true
                 */
                this.log.warn('connection timed out ... disconnecting')
                this.Disconnect()
              }
            }
          } else {
            this.send(this.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECT_REQUEST))
          }
        }.bind(this), reconnectDelay)
        delete this.channel_id
        delete this.conntime
        delete this.lastSentTime
        // send connect request directly
        this.send(this.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECT_REQUEST))
      } else {
        // no connection sequence needed in pure multicast routing
        this.transition('connected')
      }
    },
    _onExit: function () {
      clearInterval(this.connecttimer)
    },
    inbound_CONNECT_RESPONSE: function (datagram) {
      let sm = this
      this.log.debug(util.format('got connect response'))
      if (datagram.hasOwnProperty('connstate') && datagram.connstate.status === KnxConstants.RESPONSECODE.E_NO_MORE_CONNECTIONS) {
        clearInterval(sm.connecttimer)

        /*
         * Call RawModHandlers.outOfConnectionsHandler() when the KNX-IP interface reported that it ran out of connections
         */
        RawModHandlers.outOfConnectionsHandler(this)

        this.log.debug('The KNXnet/IP server could not accept the new data connection (Maximum reached)')
        this.log.debug('Killing connection...')

        /*
         * kill the connection
         */
        this.Disconnect()
      } else {
        // store channel ID into the Connection object
        this.channel_id = datagram.connstate.channel_id

        // Clear timeout for connection state requests to prevent it from sending requests with old eq. invalid data
        clearInterval(this.idletimer)

        // set the global knx address
        this.options.physAddr = Address.toString(Buffer.from([datagram.cri.knx_layer, datagram.cri.unused]))

        // send connectionstate request directly
        this.send(this.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST), err => {
          /*
           * Call RawModHandlers.sendFailHandler() when sending a message failed
           */
          if (err) {
            RawModHandlers.sendFailHandler(err, this)
          }
        })
      }
    },
    inbound_CONNECTIONSTATE_RESPONSE: function (datagram) {
      if (this.useTunneling) {
        const str = KnxConstants.keyText('RESPONSECODE', datagram.connstate.status)
        this.log.debug(util.format(
          'Got connection state response, connstate: %s, channel ID: %d',
          str, datagram.connstate.channel_id))
        this.transition('connected')
      }
    },
    '*': function (data) {
      this.log.debug(util.format('*** deferring Until Transition %j', data))
      this.deferUntilTransition('idle')
    }
  },
  connected: {
    _onEnter: function () {
      // Reset connection reattempts cycle counter for next disconnect
      this.reconnection_cycles = 0

      // Reset outgoing sequence counter..
      this.seqnum = -1

      // Set this.isConnected
      this.isConnected = true

      /* important note: the sequence counter is SEPARATE for incoming and
        outgoing datagrams. We only keep track of the OUTGOING L_Data.req
        and we simply acknowledge the incoming datagrams with their own seqnum */
      this.lastSentTime = this.conntime = Date.now()
      this.log.debug(util.format('--- Connected in %s mode ---', this.useTunneling ? 'TUNNELING' : 'ROUTING'))
      this.transition('idle')
      this.emit('connected')
    }
  },
  disconnecting: {
    _onEnter: function () {
      if (this.useTunneling) {
        // Set this.disconnectCalled
        this.disconnectCalled = true

        const sm = this
        const aliveFor = this.conntime ? Date.now() - this.conntime : 0
        KnxLog.get().debug('(%s):\tconnection alive for %d seconds', this.compositeState(), aliveFor / 1000)
        this.disconnecttimer = setTimeout(function () {
          KnxLog.get().debug('(%s):\tconnection timed out', sm.compositeState())
          sm.socket.close()
          sm.transition('uninitialized')
          sm.emit('disconnected')
        }, 3000)
        //
        this.send(this.prepareDatagram(KnxConstants.SERVICE_TYPE.DISCONNECT_REQUEST), err => {
          /*
           * Call RawModHandlers.sendFailHandler() when sending a message failed
           */
          if (err) {
            RawModHandlers.sendFailHandler(err, this)
          }

          KnxLog.get().debug('(%s):\tsent DISCONNECT_REQUEST', sm.compositeState())
        })
      }
    },
    _onExit: function () {
      clearTimeout(this.disconnecttimer)
    },
    inbound_DISCONNECT_RESPONSE: function (/* datagram */) {
      if (this.useTunneling) {
        KnxLog.get().debug('(%s):\tgot disconnect response', this.compositeState())
        this.socket.close()
        this.transition('uninitialized')
        this.emit('disconnected')
      }
    }
  },
  idle: {
    _onEnter: function () {
      if (this.useTunneling) {
        this.idletimer = setTimeout(function () {
          // time out on inactivity...
          this.transition('requestingConnState')
        }.bind(this), this.options.connstateRequestInterval || DEFAULT_CONNSTATE_REQUEST_INTERVAL)
      }
      // debuglog the current FSM state plus a custom message
      KnxLog.get().debug('(%s):\t%s', this.compositeState(), ' zzzz...')
      // process any deferred items from the FSM internal queue
      this.processQueue()
    },
    _onExit: function () {
      clearTimeout(this.idletimer)
    },
    // while idle we can either...

    // 1) queue an OUTGOING routing indication...
    outbound_ROUTING_INDICATION: function (datagram, cb) {
      let sm = this
      let elapsed = Date.now() - this.lastSentTime

      // Get the correct minimumDelay value
      let mDelay
      this.options.minimumDelay ? mDelay = this.options.minimumDelay : mDelay = DEFAULT_MINIMUM_DELAY

      // if no minimum delay set OR the last sent datagram was long ago...
      if (elapsed >= mDelay) {
        // ... send now
        this.transition('sendDatagram', datagram, cb)
      } else {
        // .. or else, let the FSM handle it later
        setTimeout(function () {
          sm.handle('outbound_ROUTING_INDICATION', datagram, cb)
        }, mDelay - elapsed)
      }
    },

    // 2) queue an OUTGOING tunnelling request...
    outbound_TUNNELING_REQUEST: function (datagram, cb) {
      let sm = this

      // Get the correct minimumDelay value
      let mDelay
      this.options.minimumDelay ? mDelay = this.options.minimumDelay : mDelay = DEFAULT_MINIMUM_DELAY

      if (this.useTunneling) {
        let elapsed = Date.now() - this.lastSentTime

        // Check if mDelay ms passed and if there is a acknowledge message to be waited for and if the currentlySending flag is false
        if (elapsed >= mDelay && !this.waitingForAck && !this.currentlySending) {
          // Send now
          this.transition('sendDatagram', datagram, cb)
        } else {
          // Wait the needed amount of time and try again
          setTimeout(function () {
            sm.handle('outbound_TUNNELING_REQUEST', datagram, cb)
          }, mDelay - elapsed + 10)
        }
      } else {
        KnxLog.get().debug('(%s):\tdropping outbound TUNNELING_REQUEST, we\'re in routing mode', this.compositeState())
      }
    },

    // 3) receive an INBOUND tunneling request INDICATION (L_Data.ind)
    'inbound_TUNNELING_REQUEST_L_Data.ind': function (datagram) {
      if (this.useTunneling) {
        this.transition('recvTunnReqIndication', datagram)
      }
    },

    /* 4) receive an INBOUND tunneling request CONFIRMATION (L_Data.con) to one of our sent tunnreq's
     * We don't need to explicitly wait for a L_Data.con confirmation that the datagram has in fact
     *  reached its intended destination. This usually requires setting the 'Sending' flag
     *  in ETS, usually on the 'primary' device that contains the actuator endpoint
     */
    'inbound_TUNNELING_REQUEST_L_Data.con': function (datagram) {
      if (this.useTunneling) {
        let msg
        let confirmed = this.sentTunnRequests[datagram.cemi.dest_addr]
        if (confirmed) {
          msg = 'delivery confirmation (L_Data.con) received'
          delete this.sentTunnRequests[datagram.cemi.dest_addr]
          this.emit('confirmed', confirmed)
        } else {
          msg = 'unknown dest addr'
        }
        KnxLog.get().trace('(%s): %s %s', this.compositeState(), datagram.cemi.dest_addr, msg)
        this.acknowledge(datagram)
      }
    },

    // 5) receive an INBOUND ROUTING_INDICATION (L_Data.ind)
    'inbound_ROUTING_INDICATION_L_Data.ind': function (datagram) {
      this.emitEvent(datagram)
    },

    inbound_DISCONNECT_REQUEST: function (/* datagram */) {
      if (this.useTunneling) {
        this.transition('connecting')
      }
    }

  },
  requestingConnState: {
    // if idle for too long, request connection state from the KNX IP router
    _onEnter: function () {
      let sm = this
      KnxLog.get().trace('(%s): Requesting Connection State', this.compositeState())
      this.send(this.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST), err => {
        /*
         * Call RawModHandlers.sendFailHandler() when sending a message failed
         */
        if (err) {
          RawModHandlers.sendFailHandler(err, this)
        }
      })

      this.connstatetimer = setTimeout(function () {
        let msg = 'timed out waiting for CONNECTIONSTATE_RESPONSE'
        KnxLog.get().trace('(%s): %s', sm.compositeState(), msg)
        sm.transition('connecting')
        sm.emit('error', msg)
      }, this.options.connstateResponseTimeout || DEFAULT_CONNSTATE_RESPONSE_TIMEOUT)
    },
    _onExit: function () {
      clearTimeout(this.connstatetimer)
    },
    inbound_CONNECTIONSTATE_RESPONSE: function (datagram) {
      let state = KnxConstants.keyText('RESPONSECODE', datagram.connstate.status)
      if (datagram.connstate.status === 0) {
        this.transition('idle')
      } else {
        this.log.debug(util.format(
          '*** error: %s *** (connstate.code: %d)', state, datagram.connstate.status))
        this.transition('connecting')
        this.emit('error', state)
      }
    },
    '*': function (data) {
      this.log.debug(util.format('*** deferring %s until transition to idle', data.inputType))
      this.deferUntilTransition('idle')
    }
  },
  sendDatagram: {
    _onEnter: function (datagram, cb) {
      const sm = this

      // Switch the currentlySending flag to true
      this.currentlySending = true

      // send the telegram on the wire
      this.seqnum += 1

      if (this.useTunneling) datagram.tunnstate.seqnum = this.seqnum & 0xFF

      this.send(datagram, err => {
        /*
         * Call RawModHandlers.sendFailHandler() when sending a message failed
         */
        if (err) {
          // Report the failure
          RawModHandlers.sendFailHandler(err, sm)

          // Revert the change applied to this.seqnum because no message was sent
          this.seqnum--

          // Go into the idle state
          this.transition('idle')
        } else {
          // Append the message to the array of sent messages
          if (sm.useTunneling) sm.sentTunnRequests[datagram.cemi.dest_addr] = datagram

          // Set this.lastSentTime
          this.lastSentTime = Date.now()
          this.log.debug(util.format('>>>>>>> seqnum: %d', this.seqnum))

          if (this.useTunneling) {
            // Go over to waiting for the acknowledge message
            this.transition('sendTunnReq_waitACK', datagram)
          } else {
            // Switch into the idle state
            this.transition('idle')
          }
        }

        // Clear the currentlySending flag
        sm.currentlySending = false

        // Call cb
        if (cb) cb(err)
      })
    },
    '*': function (data) {
      this.log.debug(util.format('*** deferring %s until transition to idle', data.inputType))
      this.deferUntilTransition('idle')
    }
  },
  sendTunnReq_waitACK: {
    /*
     * Wait for tunneling acknowledgement by the IP router; this means the sent UDP packet
     * reached the IP router and NOT that the datagram reached its final destination
     */
    _onEnter: function (datagram) {
      const sm = this

      // Signalize that a acknowledge message is waited
      this.waitingForAck = true

      // this.log.debug('setting up tunnreq timeout for %j', datagram);
      this.tunnelingAckTimer = setTimeout(() => {
        /*
         * Call RawModHandlers.waitAckTimeoutHandler() when a timeout is reached while waiting for a acknowledge message
         */
        RawModHandlers.waitAckTimeoutHandler(this)

        sm.transition('idle')
        sm.emit('tunnelreqfailed', datagram)
      }, this.options.receiveAckTimeout || DEFAULT_RECEIVE_ACK_TIMEOUT)
    },
    _onExit: function () {
      // Signalize that the awaited acknowledge message was received and clear the timeout
      this.waitingForAck = false
      clearTimeout(this.tunnelingAckTimer)
    },
    inbound_TUNNELING_ACK: function (datagram) {
      this.log.debug(util.format('===== datagram %d acknowledged by IP router', datagram.tunnstate.seqnum))
      this.transition('idle')
    },
    '*': function (data) {
      this.log.debug(util.format('*** deferring %s until transition to idle', data.inputType))
      this.deferUntilTransition('idle')
    }
  },
  recvTunnReqIndication: {
    _onEnter: function (datagram) {
      const sm = this
      sm.seqnumRecv = datagram.tunnstate.seqnum
      sm.acknowledge(datagram)
      sm.transition('idle')
      sm.emitEvent(datagram)
    },
    '*': function (data) {
      this.log.debug(util.format('*** deferring Until Transition %j', data))
      this.deferUntilTransition('idle')
    }
  }
}

const initialize = function (options) {
  this.prototype = null
  this.options = options || {}
  this.log = KnxLog.get(options)
  this.localAddress = null
  this.waitingForAck = false
  this.currentlySending = false
  this.ThreeLevelGroupAddressing = true
  this.reconnection_cycles = 0
  this.sentTunnRequests = {}
  this.disconnectCalled = false
  this.isConnected = false
  this.useTunneling = options.forceTunneling || false
  this.remoteEndpoint = {
    addrstring: options.ipAddr,
    addr: ipaddr.parse(options.ipAddr),
    port: options.ipPort || 3671
  }

  let range = this.remoteEndpoint.addr.range()
  this.log.debug('initializing %s connection to %s', range, this.remoteEndpoint.addrstring)
  switch (range) {
    case 'multicast':
      IpRoutingConnection(this, options)
      break
    case 'unicast':
    case 'private':
    case 'loopback':
      this.useTunneling = true
      IpTunnelingConnection(this, options)
      break
    default:
      throw util.format('IP address % (%s) cannot be used for KNX', options.ipAddr, range)
  }
}
const acknowledge = function (datagram) {
  let ack = this.prepareDatagram(KnxConstants.SERVICE_TYPE.TUNNELING_ACK, datagram)

  // copy the sequence number and acknowledge
  ack.tunnstate.seqnum = datagram.tunnstate.seqnum
  this.send(ack, err => {
    /*
     * Call RawModHandlers.sendFailHandler() when sending a message failed
     */
    if (err) {
      RawModHandlers.sendFailHandler(err, this)
    }
  })
}
const emitEvent = function (datagram) {
  // emit events in a multitude of targets - ORDER IS IMPORTANT!
  let evtName = datagram.cemi.apdu.apci

  // 1. 'event_<dest_addr>', ''GroupValue_Write', src, data
  this.emit(util.format('event_%s', datagram.cemi.dest_addr),
    evtName, datagram.cemi.src_addr, datagram.cemi.apdu.data)

  // 2. 'GroupValue_Write_1/2/3', src, data
  this.emit(util.format('%s_%s', evtName, datagram.cemi.dest_addr),
    datagram.cemi.src_addr, datagram.cemi.apdu.data)

  // 3. 'GroupValue_Write', src, dest, data
  this.emit(evtName, datagram.cemi.src_addr, datagram.cemi.dest_addr, datagram.cemi.apdu.data)

  // 4. 'event', 'GroupValue_Write', src, dest, data
  this.emit('event', evtName, datagram.cemi.src_addr, datagram.cemi.dest_addr, datagram.cemi.apdu.data)
}
const getIPv4Interfaces = function () {
  // get the local address of the IPv4 interface we're going to use
  let candidateInterfaces = {}
  let interfaces = os.networkInterfaces()
  for (let iface in interfaces) {
    for (let key in interfaces[iface]) {
      let intf = interfaces[iface][key]
      if (intf.family === 'IPv4' && !intf.internal) {
        this.log.trace(util.format(
          'candidate interface: %s (%j)', iface, intf
        ))
        candidateInterfaces[iface] = intf
      }
    }
  }

  return candidateInterfaces
}
const getLocalAddress = function () {
  let candidateInterfaces = this.getIPv4Interfaces()
  // if user has declared a desired interface then use it
  if (this.options && this.options.interface) {
    if (!candidateInterfaces.hasOwnProperty(this.options.interface)) {
      return Error('Interface ' + this.options.interface + ' not found or has no useful IPv4 address!')
    } else {
      return candidateInterfaces[this.options.interface].address
    }
  }
  // just return the first available IPv4 non-loopback interface
  if (Object.keys(candidateInterfaces).length > 0) {
    return candidateInterfaces[Object.keys(candidateInterfaces)[0]].address
  }
  // no local IpV4 interfaces?
  throw Error('No valid IPv4 interfaces detected')
}

export default machina.Fsm.extend({
  initialState: 'uninitialized',
  namespace: 'knxnet',
  states: states,

  initialize: initialize,
  acknowledge: acknowledge,
  emitEvent: emitEvent,
  getIPv4Interfaces: getIPv4Interfaces,
  getLocalAddress: getLocalAddress
})
