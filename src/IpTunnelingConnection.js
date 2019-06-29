/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const dgram = require('dgram')
const KnxLog = require('./KnxLog.js')

function IpTunnelingConnection (instance, options) {
  instance.BindSocket = function (cb) {
    let udpSocket = dgram.createSocket('udp4')

    udpSocket.bind(function () {
      KnxLog.get().debug('IpTunnelingConnection.BindSocket %s:%d',
        instance.localAddress, udpSocket.address().port)

      // Make the local port accessible for other functions etc.
      instance.localPort = udpSocket.address().port

      cb && cb(udpSocket)
    })

    return udpSocket
  }

  instance.Connect = function () {
    let sm = this

    // Check the return value
    this.localAddress = this.getLocalAddress()

    if (!this.localAddress) {
      return Error('Unable to get local address!')
    } else if (this.localAddress.constructor === Error) {
      return this.localAddress
    }

    // create the socket
    this.socket = this.BindSocket(function (socket) {
      socket.on('error', function (errmsg) {
        KnxLog.get().debug('Socket error: %j', errmsg)
      })

      socket.on('message', function (msg, rinfo, callback) {
        KnxLog.get().debug('Inbound message: %s', msg.toString('hex'))
        sm.onUdpSocketMessage(msg, rinfo, callback)
      })

      // start connection sequence
      sm.transition('connecting')
    })

    return this
  }

  return instance
}

module.exports = IpTunnelingConnection
