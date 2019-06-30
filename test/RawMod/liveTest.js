import Knx from '../../src'

// Only for development
let disconnectCalled = false

const con = Knx.Connection({
  ipAddr: '192.168.1.102',
  ipPort: 3671,
  interface: 'enp5s0',
  logLevel: 'info', // overwrites debug (below)
  manualConnect: true,
  minimumDelay: 0,
  debug: false, // When false, log level is info
  autoReconnect: true,
  reconnectDelayMs: 1000,
  receiveAckTimeout: 1000,
  readGroupValTimeout: 4000,
  connstateRequestInterval: 10000,
  connstateResponseTimeout: 2000,
  handlers: {
    connected: async () => {
      console.log('>>> Successfully connected to the KNX-IP interface @ %s <<<', con.ipAddr)

      // Check which operation to perform
      if (process.argv[2] === 'switch_state') {
        console.log('[*] Writing GroupValue %d to %s ...', process.argv[3], process.argv[4])

        con.write(process.argv[4], parseInt(process.argv[3], 10), null)

        console.log('[*] Reading value from %s ...', process.argv[4])

        con.read(process.argv[4], (src, data) => {
          console.log('[*] Got response from %s: %j', src, data)
        })
      } else if (process.argv[2] === 'set_progmode') {
        console.log('[*] Setting the progmode status of %d to %s ...', process.argv[3], process.argv[4])
        let val = await Knx.RawMod.KnxSetProgmodeStatus.setProgmodeStatus(process.argv[4], process.argv[3], 1000, con, Knx.RawMod.errorHandler)

        if (val === 1) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Reading the progmode status from %s ...', process.argv[4])
        val = await Knx.RawMod.KnxGetProgmodeStatus.getProgmodeStatus(process.argv[4], 1000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] New status: %d', val.data[0])
      } else if (process.argv[2] === 'read_physical_addr') {
        console.log('[*] Sending physical address request to broadcast and listening for answer ...')
        let val = await Knx.RawMod.KnxGetDeviceAddress.getDeviceAddress(5000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer: %j', val.data)
      } else if (process.argv[2] === 'write_physical_addr') {
        console.log('[*] Sending physical address write request to broadcast ...')
        let val = await Knx.RawMod.KnxSetDeviceAddress.setDeviceAddress(process.argv[3], con, Knx.RawMod.errorHandler)

        if (val) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }
      } else if (process.argv[2] === 'read_serial_number') {
        let val = await Knx.RawMod.KnxReadSerialNumber.readSerialNumber(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_order_number') {
        let val = await Knx.RawMod.KnxReadOrderNumber.readOrderNumber(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_application_id') {
        let val = await Knx.RawMod.KnxReadApplicationID.readApplicationID(process.argv[4], parseInt(process.argv[3]), 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_application_runstate') {
        let val = await Knx.RawMod.KnxReadApplicationRunstate.readApplicationRunstate(process.argv[4], parseInt(process.argv[3]), 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_application_loadstate') {
        let val = await Knx.RawMod.KnxReadApplicationLoadstate.readApplicationLoadstate(process.argv[4], parseInt(process.argv[3]), 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_gaddr_tbl_loadstate') {
        let val = await Knx.RawMod.KnxReadGroupAddrTblLoadState.readGroupAddrTblLoadState(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_gassociation_tbl_loadstate') {
        let val = await Knx.RawMod.KnxReadGroupAssociationTblLoadState.readGroupAssociationTblLoadState(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'read_manufacturer_id') {
        let val = await Knx.RawMod.KnxReadManufacturerID.readManufacturerID(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('[-] Error!\n', Knx.RawMod.errorHandler.getLastError())
          return
        }

        console.log('[*] Got answer:', Buffer.from(val.data))
      } else if (process.argv[2] === 'set_application_runstate') {
        console.log('[*] Setting the runstate of application %d of %s to %d ...', parseInt(process.argv[3]), process.argv[5], parseInt(process.argv[4]))
        let val = await Knx.RawMod.KnxSetApplicationRunstate.setApplicationRunstate(process.argv[5], parseInt((process.argv[3])), parseInt(process.argv[4]), 2000, con, Knx.RawMod.errorHandler)

        if (val) {
          console.log('ERROR:', Knx.RawMod.errorHandler.getLastError())
        }

        val = await Knx.RawMod.KnxReadApplicationRunstate.readApplicationRunstate(process.argv[5], parseInt(process.argv[3]), 2000, con, Knx.RawMod.errorHandler)

        if (val.error) {
          console.log('ERROR:', Knx.RawMod.errorHandler.getLastError())
        } else {
          console.log('New Application(%d) Runstate:', parseInt(process.argv[3]), val.data)
        }
      } else if (process.argv[2] === 'nothing') {
      } else {
        console.log('[-] Unknown operation \'%s\' ...\n\tTry: %s %s help', process.argv[2], process.argv[0], process.argv[1])
        con.Disconnect()
        return
      }

      console.log('\nCustom Message Handlers: %j\n', con.handlers.customMsgHandlers)
    },

    event: function (evt, src, dst, val) {
      // console.log(evt, src, dst, val)
    },

    error: function (stat) {
      console.log('err: %j', stat)
    },

    rawMsgCb: function (rawKnxMsg /*, rawMsgJson */) {
      // console.log(rawMsgJson)
      // console.log(rawKnxMsg)
    },

    connFailCb: function () {
      console.log('[Cool callback function] Connection to the KNX-IP Interface failed!')
    },

    outOfConnectionsCb: function () {
      console.log('[Even cooler callback function] The KNX-IP Interface reached its connection limit!')
    },

    waitAckTimeoutCb: function () {
      console.log('[Wait Acknowledge Timeout Callback] Timeout reached when waiting for acknowledge message')
    },

    sendFailCb: function (err) {
      console.log('[Send Fail Callback] Error while sending a message:', err)
    },

    customMsgHandlers: [
      {
        template: {
          cemi: {
            src_addr: '1.1.3',
            apdu: {
              apci: 'PropertyValue_Response'
            }
          }
        },
        callback: function (rawMsgJson) {
          // console.log('RESPONSE:', rawMsgJson.cemi.apdu.data, rawMsgJson.cemi.apdu.data[4] !== 3 ? 'HERE' : '')
        }
      }
    ]
  }
})

// Check if the user wants some help
if (process.argv[2] === 'help') {
  console.log('\nUsage: yarn liveTest operation [options]\n')
  console.log('Operations and their options:')
  console.log('                 switch_state                    [state(0, 1)]     [GroupAddress(0/1/0, 1/1/1, ...)]')
  console.log('                 set_progmode                    [state(2n, 2n+1)] [DeviceAddress(1.2.3, 1.1.1, ...)]')
  console.log('                 write_physical_addr             [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_physical_addr')
  console.log('                 read_serial_number              [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_order_number               [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_application_id             [index(1, 2)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_application_runstate       [index(1, 2)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_application_loadstate      [index(1, 2)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_gaddr_tbl_loadstate        [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_gassociation_tbl_loadstate [address(1.2.3, 1.1.1, ...)]')
  console.log('                 set_application_runstate        [index(1, 2)] [newState(0, 1, 3)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 nothing')
  console.log('\nExample: yarn liveTest switch_state 1 0/1/0')
  process.exit(0)
}

// This function disconnects from the KNX-IP interface
const disconnect = () => {
  if (con.isConnected) {
    if (disconnectCalled) {
      return
    }

    disconnectCalled = true

    console.log('[*] Disconnecting ...')
    con.Disconnect()
  } else {
    console.log('[*] Already disconnected ...')
  }

  setTimeout(() => {
    process.exit()
  }, 2000)
}

// Catch every event and call the disconnect() function
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, disconnect)
})

// Connect to the KNX-IP interface
let err = con.Connect()

if (err && err.constructor === Error) {
  console.log(err)
}
