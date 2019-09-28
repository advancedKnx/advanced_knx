import Knx from '../../src'
import CheckResourceAvailable from '../../src/RawMod/CheckResourceAvailable'
import KnxAddress from '../../src/RawMod/KnxAddress'

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

      // Evaluate the result of an operation
      const evalResult = result => {
        if (typeof result === 'object') {
          // Its the result of a read operation
          if (result.error) {
            console.log('[-] Error! (%d)\n', result.error, Knx.RawMod.errorHandler.getErrorByNumber(result.error))
            return 1
          } else {
            // Check if there is a key except data, usedAccessMethod and error - would be extracted data
            for (let key of Object.keys(result)) {
              if (['data', 'error', 'usedAccessMethod'].lastIndexOf(key) === -1) {
                console.log('[*] Got %s: %j', key, result[key])
              }
            }
          }
        } else if (result) {
          console.log('[-] Error! (%d)\n', result, Knx.RawMod.errorHandler.getLastError())
          return 1
        }
      }

      // Helper function to get the maskversion of a device and check if a certain resource exists for it
      const getMaskAndCheck = async (devAddr, resourceName) => {
        console.log('[*] Getting maskversion for device: %s', devAddr)
        let val = await Knx.RawMod.KnxReadMaskversion.readMaskversion(devAddr, null, 2000, con, Knx.RawMod.errorHandler)

        if (evalResult(val)) { await disconnect() }

        let mv = val.data[0] << 8 | val.data[1]

        console.log('[*] Got MV: %d', mv)

        console.log('[*] Checking if "%s" is available for mv %d', resourceName, mv)

        if (CheckResourceAvailable(mv, resourceName)) {
          console.log('[*] Resource available!')
          return mv
        } else {
          console.log('[*] Resource NOT available')
          disconnect()
        }
      }

      // Check which operation to perform
      if (process.argv[2] === 'switch_state') {
        console.log('[*] Writing GroupValue %d to %s ...', process.argv[3], process.argv[4])

        con.write(process.argv[4], parseInt(process.argv[3], 10), null)

        console.log('[*] Reading value from %s ...', process.argv[4])

        con.read(process.argv[4], (src, data) => {
          console.log('[*] Got response from %s: %j', src, data)
        })
      } else if (process.argv[2] === 'set_progmode') {
        let mv = await getMaskAndCheck(process.argv[4], 'ProgrammingMode')

        console.log('[*] Setting the progmode status of %d to %s (mv = %d) ...', process.argv[3], process.argv[4], mv)
        let pmval = Buffer.from([parseInt(process.argv[3])])
        let val = await Knx.RawMod.KnxWriteDeviceResource.writeDeviceResource(process.argv[4], null, mv,
          'ProgrammingMode', Knx.RawMod.KNX_KNXNET_CONSTANTS.RESOURCE_ACCESS_TYPES.ALL,
          pmval, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_physical_addr') {
        console.log('[*] Sending physical address request to broadcast and listening for answer ...')
        let val = await Knx.RawMod.KnxGetDeviceAddress.readDeviceAddress(5000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'write_physical_addr') {
        console.log('[*] Sending physical address write request to broadcast ...')
        let val = await Knx.RawMod.KnxSetDeviceAddress.setDeviceAddress(process.argv[3], con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_serial_number') {
        let val = await Knx.RawMod.KnxReadSerialNumber.readSerialNumber(process.argv[3], 2000, 0x0701, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_order_number') {
        let val = await Knx.RawMod.KnxReadOrderNumber.readOrderNumber(process.argv[3], 2000, 0x0701, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_application_id') {
        let val = await Knx.RawMod.KnxReadApplicationID.readApplicationID(process.argv[4], parseInt(process.argv[3]), 2000, 0x0701, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_application_runstate') {
        let val = await Knx.RawMod.KnxRunStateMachine.getRSMState(process.argv[3], null, 0x0701, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_application_loadstate') {
        let val = await Knx.RawMod.KnxLoadStateMachine.getLSMState(process.argv[3], null, 0x0701, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_gaddr_tbl_loadstate') {
        let val = await Knx.RawMod.KnxReadGroupAddrTblLoadState.readGroupAddrTblLoadState(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_gassociation_tbl_loadstate') {
        let val = await Knx.RawMod.KnxReadGroupAssociationTblLoadState.readGroupAssociationTblLoadState(process.argv[3], 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_manufacturer_id') {
        let val = await Knx.RawMod.KnxReadManufacturerID.readManufacturerID(process.argv[3], 2000, 0x0705, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'send_rsm_cmd') {
        const rsmcmdname = Knx.RawMod.KNX_KNXNET_CONSTANTS.keyText(Knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_RSM_CMDS, parseInt(process.argv[3]))

        console.log('[*] Sending the %s (%d) cmd to the RSM of %s ...', rsmcmdname, parseInt(process.argv[3]), process.argv[4])
        let val = await Knx.RawMod.KnxRunStateMachine.sendRSMCMD(process.argv[4], null, 0x0701, 2000, parseInt(process.argv[3]), con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_rsm_state') {
        console.log('[*] Reading the RSM state of %s ...', process.argv[3])
        let val = await Knx.RawMod.KnxRunStateMachine.getRSMState(process.argv[3], null, 0x0701, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'send_lsm_cmd') {
        const rsmcmdname = Knx.RawMod.KNX_KNXNET_CONSTANTS.keyText(Knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_LSM_CMDS, parseInt(process.argv[3]))

        console.log('[*] Sending the %s (%d) cmd to the LSM of %s ...', rsmcmdname, parseInt(process.argv[3]), process.argv[4])
        let val = await Knx.RawMod.KnxLoadStateMachine.sendLSMCMD(process.argv[4], null, 0x0701, 2000, parseInt(process.argv[3]), con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_lsm_state') {
        console.log('[*] Reading the RSM state of %s ...', process.argv[3])
        let val = await Knx.RawMod.KnxLoadStateMachine.getLSMState(process.argv[3], null, 0x0701, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_adc_value') {
        console.log('[*] Reading the ADC value of %s @ channel %d with %d reads ...', process.argv[5], parseInt(process.argv[3]), parseInt(process.argv[4]))

        let val = await Knx.RawMod.KnxReadDeviceADC.readDeviceADC(process.argv[5], null, parseInt(process.argv[3]), parseInt(process.argv[4]), 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'restart_device') {
        console.log('[*] Restarting %s ...', process.argv[3])

        let val = await Knx.RawMod.KnxRestartDevice.restartDevice(process.argv[3], null, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_maskversion') {
        console.log('[*] Reading maskversion of %s ...', process.argv[3])

        let val = await Knx.RawMod.KnxReadMaskversion.readMaskversion(process.argv[3], null, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'read_device_resource') {
        const mv = await getMaskAndCheck(process.argv[3], process.argv[4])

        console.log('[*] Reading from %s (resource="%s" mv=%d)', process.argv[3], process.argv[4], mv)

        let val = await Knx.RawMod.KnxReadDeviceResource.readDeviceResource(process.argv[3], null, mv,
          process.argv[4], Knx.RawMod.KNX_KNXNET_CONSTANTS.RESOURCE_ACCESS_TYPES.ALL, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'write_device_resource') {
        const mv = await getMaskAndCheck(process.argv[3], process.argv[4])

        const wval = Buffer.from(JSON.parse(process.argv[5])['data'])

        console.log('[*] Writing %j to %s (resource="%s" mv=%d)', wval, process.argv[3], process.argv[4], mv)

        let val = await Knx.RawMod.KnxWriteDeviceResource.writeDeviceResource(process.argv[3], null, mv, process.argv[4],
          Knx.RawMod.KNX_KNXNET_CONSTANTS.RESOURCE_ACCESS_TYPES.ALL, wval, 2000, con, Knx.RawMod.errorHandler)

        evalResult(val)
      } else if (process.argv[2] === 'nothing') {
      } else {
        console.log('[-] Unknown operation \'%s\' ...\n\tTry: %s %s help', process.argv[2], process.argv[0], process.argv[1])
        con.Disconnect()
        return
      }

      console.log('\nCustom Message Handlers: %j\n', con.handlers.customMsgHandlers)
    },

    event: function (evt, src, dst, val) {
      let tmpDst

      if (dst && dst.constructor !== String) {
        tmpDst = KnxAddress.binToStrGrpL3(KnxAddress.Uint8ArrToUint16Addr(dst))
      } else {
        // Device addresses come as strings because there is only one way to represent them
        tmpDst = dst
      }

      console.log(evt, src, tmpDst, val)
    },

    error: function (stat) {
      console.log('err: %j', stat)
    },

    rawMsgCb: function (rawKnxMsg /*, rawMsgJson */) {
      // console.log(rawMsgJson)
      console.log(rawKnxMsg)
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
          console.log('Custom message handler (addr: 1.1.3, apdu.apci: \'PropertyValue_Response\') triggered!')
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
  console.log('                 set_progmode                    [state(2n, 2n+1)] [DeviceAddress(1.2.3, 1.1.1, ...)] [maskVersion]')
  console.log('                 write_physical_addr             [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_physical_addr')
  console.log('                 read_serial_number              [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_order_number               [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_application_id             [index(1, 2)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_application_runstate       [index(1, 2)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_application_loadstate      [index(1, 2)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_gaddr_tbl_loadstate        [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_gassociation_tbl_loadstate [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_manufacturer_id            [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_maskversion                [address(1.2.3, 1.1.1, ...)]')
  console.log('                 set_application_runstate        [newState(0=NOP, 1=RESTART, 2=HALT)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_adc_Value                  [channel(1, ...)] [readCount(1, 2, 8, ...)] [address(1.2.3, 1.1.1, ...)]')
  console.log('                 read_device_resource            [address(1.2.3, 1.1.1, ...)] [resource_name]')
  console.log('                 write_device_resource           [address(1.2.3, 1.1.1, ...)] [resource_name] [value(\'{"data":[...dataarray...]}\')]')
  console.log('                 nothing')
  console.log('\nExample: yarn liveTest switch_state 1 0/1/0')
  process.exit(0)
}

// This function disconnects from the KNX-IP interface
const disconnect = () => {
  // This promise wont resolve. Ever.
  return new Promise(resolve => {
    if (con.isConnected) {
      // Check if the function was already called
      if (disconnectCalled) {
        return
      }

      disconnectCalled = true

      console.log('[*] Disconnecting ...')
      con.Disconnect()
    } else {
      console.log('[*] Already disconnected ...')
    }

    // For for two seconds to make sure the connection is closed
    setTimeout(() => {
      process.exit()
    }, 2000)
  })
}

// Catch every event and call the disconnect() function
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, disconnect)
})

// Connect to the KNX-IP interface
let err = con.Connect()

if (err && err.constructor === Error) {
  console.log(err)
}
