/*********************************************************
 * This file contains a function to restart a KNX device *
 *********************************************************/

import RawModErrors from '../Errors'
import KnxMessageTemplates from '../KnxMessageTemplates'
import KnxNetProtocol from '../KnxNetProtocol'
import KnxAddress from '../KnxAddress'
import KnxConstants from '../../KnxConstants'

export default {
  /*
   * Function: KnxRestartDevice.restartDevice()
   *
   *      This functions can be used to restart a KNX device
   *      Logically, it restarts all applications running on the device
   *      But that is not the case if an application is in runstate three (KnxConstants.KNX_RSM_STATES)
   *
   * Arguments:
   *      target          The target device address
   *                      E.g.: '1.2.2', '1.2.3', '1.4.5'
   *                      Type: String
   *
   *      source          The source device address to be used
   *                      If set to null, the address of the KNX-IP interface will be used
   *                      Should be null most of the time
   *                      E.g.: '1.2.3', null
   *                      Type: String, null
   *
   *      conContext      The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                      Type: require('advanced_knx').Connection()
   *
   *      errContext      The RawMod error context - needed to indicate errors
   *                      Type: require('advanced_knx').RawMod.errorHandler
   *
   * Return:
   *      Returns a promise which resolves with zero on success and with one if something went wrong
   *      If the second is the case, an error will be added to errContext.errorStack
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.INVALID_ADDRESS - The address the was requested to be written is invalid
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *
   *      There may be other errors not labeled by RawMod (thrown by the socket API when sending messages)
   */
  restartDevice: async (target, source, conContext, errContext) => {
    return new Promise(async resolve => {
      // Create empty vars
      let err
      let rawModErr
      let connReq
      let deviceRestartMsg

      // This function validates the arguments
      const checkArguments = () => {
        // This function checks if all the arguments are defined
        const checkArgumentsDefined = () => {
          // Check if the errContext is defined
          if (errContext == null) {
            return 1
          }

          // Check if all the other parameters are defined
          if ((target == null) || (conContext == null)) {
            err = new Error(RawModErrors.UNDEF_ARGS.errorMsg)
            rawModErr = errContext.createNewError.errorID(err, RawModErrors.UNDEF_ARGS)

            errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check if all arguments have the correct type
        const checkArgumentTypes = () => {
          if (target.constructor !== String) {
            err = new Error(RawModErrors.INVALID_ARGTYPES.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGTYPES.errorID)

            errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check the values of the target and the source arguments
        const checkTargetAndSource = () => {
          let retVal = 0

          // Validate target
          if (KnxAddress.validateAddrStr(target) === -1 ||
            KnxAddress.getAddrType(target) !== KnxConstants.KNX_ADDR_TYPES.DEVICE) {
            err = new Error(RawModErrors.INVALID_TARGET.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_TARGET.errorID)

            errContext.addNewError(rawModErr)

            retVal = 1
          }

          // Validate source, if defined - otherwise, no validation is needed since the KNX-IP interfaces address will be used
          if (source) {
            if (KnxAddress.validateAddrStr(source) === -1 ||
              KnxAddress.getAddrType(source) !== KnxConstants.KNX_ADDR_TYPES.DEVICE) {
              err = new Error(RawModErrors.INVALID_SOURCE.errorMsg)
              rawModErr = errContext.createNewError(err, RawModErrors.INVALID_SOURCE.errorID)

              errContext.addNewError(rawModErr)

              retVal = 1
            }
          }

          // Return
          return retVal
        }

        // Call the checking functions
        if (checkArgumentsDefined()) { return 1 }
        if (checkArgumentTypes()) { return 1 }
        if (checkTargetAndSource()) { return 1 }
      }

      // This function forges all the needed messages
      const forgeMessages = () => {
        deviceRestartMsg = KnxMessageTemplates.deviceRestartRequest(target, source)
        connReq = KnxMessageTemplates.ucdConnRequest(target, source)
      }

      // This function sends the connect and the restart request to the target - restart will disconnect automatically
      const sendConnDeviceRestartRequest = () => {
        return new Promise(resolve => {
          // Send the UCD connect request
          KnxNetProtocol.sendTunnRequest(connReq, conContext, function (sendErr) {
            if (sendErr) {
              // Create the RawModError object
              rawModErr = errContext.createNewError(sendErr, null)

              // Push it onto the errorStack
              errContext.addNewError(rawModErr)

              // Return 1
              resolve(1)
            } else {
              // Send the device restart request
              KnxNetProtocol.sendTunnRequest(deviceRestartMsg, conContext, sendErr => {
                // Check for errors
                if (sendErr) {
                  // Create the RawModError object
                  rawModErr = errContext.createNewError(sendErr, null)

                  // Push it onto the errorStack
                  errContext.addNewError(rawModErr)

                  // Return 1
                  resolve(1)
                }
              })
            }
          })
        })
      }

      // Call all functions defined above
      if (checkArguments()) { resolve(1); return }
      forgeMessages()
      if (await sendConnDeviceRestartRequest()) { resolve(1) }
    })
  }
}
