/**********************************************************************
 * This file contains a function to write a KNX device property value *
 **********************************************************************/

import RawModErrors from './Errors'
import KnxMessageTemplates from './KnxMessageTemplates'
import KnxNetProtocol from './KnxNetProtocol'
import RawModCustomMsgHandlers from './CustomMsgHandlers'
import RawModCustomMsgHandlerTemplates from './CustomMessageHandlerTemplates'
import KnxAddress from './KnxAddress'
import KnxConstants from '../KnxConstants'

export default {
  /*
   * Function: KnxWriteDevMem.writePropertyValue()
   *
   *      This function writes the value of an specific property to a KNX device
   *
   *
   * Arguments:
   *
   *      target          The target device address. E.g.: 1.2.3 or 10.12.25, ...
   *                      Type: String
   *
   *      source          Source address to use. When set to null, the device address of the KNX-Interface will be used
   *                      Note that this option should be set to null most of the time
   *                      E.g.: 2.3.4, 11.13.26 or null, ...
   *                      Type: String/null
   *
   *      objectIndex     Index of the object to read the property from
   *                      E.g.: 0x00
   *                      Type: Number
   *
   *      startIndex      Index to start from
   *                      E.g.: 0x01
   *                      Type: Number
   *
   *      propertyID      ID of the property to read
   *                      E.g.: 0x0b
   *                      Type: Number
   *
   *      elementCount    Number of elements to read
   *                      E.g.: 0x01
   *                      Type: Number
   *
   *      data            The data to be sent as property value
   *                      E.g.: Buffer.from([0x00, 0x83, 0x3f, 0xc4, 0xe0, 0x32])
   *                      Type: Buffer
   *
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65541 ('The target failed to respond!')
   *                      Type: Integer
   *
   *      conContext      The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                      Type: require('Connection.js').Connection()
   *
   *      errContext      The RawMod error context - needed to indicate errors
   *                      Type: require('RawMod/RawModErrorHandler.js').RawModErrorHandler()
   *
   * Return:
   *      Returns a promise which resolves with zero on success and with one if something went wrong
   *      If the second is the case, a error will be added to errContext.errorStack
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.ERR_ReadDevMem.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.ERR_ReadDevMem.INVALID_ARGTYPES - At least one arguments has an invalid type
   *      RawModErrors.ERR_WriteDevMem.INVALID_DATALEN - The data argument has an invalid length
   *      RawModErrors.ERR_WriteDevMem.TARGET_NOTACK- The target device did actively not acknowledge
   *      RawModErrors.ERR_WriteDevMem.TIMEOUT_REACHED - The target device failed to respond in recvTimeout ms
   *      RawModErrors.ERR_ReadDevMem.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.ERR_ReadDevMem.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  writePropertyValue: async (target, source, objectIndex, startIndex, propertyID, elementCount, data, recvTimeout, conContext, errContext) => {
    /*
     * The process works like following:
     *      Send a UCD connection request to the target device
     *      Send a property value write request
     *      (The device should send a NCD acknowledge message, wait for it)
     *      Send a NCD acknowledge message back to the device
     *      Send a UCD disconnect request
     */

    return new Promise(async (resolve) => {
      // Create a empty vars
      let err
      let rawModErr
      let connReq
      let propValWriteReq
      let ackMsg
      let dconnMsg
      let timeoutRef
      let ncdAckHandlerTemplate
      let ncdNackHandlerTemplate

      // This function validates the arguments
      const checkArguments = () => {
        // This function checks if all the arguments are defined
        const checkArgumentsDefined = () => {
          // Check if the errContext is defined
          if (errContext == null) {
            return 1
          }

          // Check if all the other parameters are defined
          if (!(target && recvTimeout && conContext && data)) {
            err = new Error(RawModErrors.ERR_ReadPropertyValue.UNDEF_ARGS.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.ERR_ReadPropertyValue.UNDEF_ARGS)

            errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check if all arguments have the correct type
        const checkArgumentTypes = () => {
          if ((target.constructor !== String) || (source ? source.constructor !== String : false) ||
            (objectIndex.constructor !== Number) || (propertyID.constructor !== Number) || (data.constructor !== Buffer) ||
            (startIndex.constructor !== Number) || (elementCount.constructor !== Number) || (recvTimeout.constructor !== Number)) {
            err = new Error(RawModErrors.ERR_ReadPropertyValue.INVALID_ARGTYPES.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.ERR_ReadPropertyValue.INVALID_ARGTYPES.errorID)

            errContext.addNewError(rawModErr)

            return 1
          }
        }

        // This function checks the data argument (data.length <= 10 && >= 1)
        const checkDataVal = () => {
          if ((data.length > 10) || data.length < 1) {
            err = new Error(RawModErrors.ERR_WriteDevMem.INVALID_DATALEN.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.ERR_WriteDevMem.INVALID_DATALEN.errorID)

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
            err = new Error(RawModErrors.ERR_WriteDevMem.INVALID_TARGET.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.ERR_WriteDevMem.INVALID_TARGET.errorID)

            errContext.addNewError(rawModErr)

            retVal = 1
          }

          // Validate source, if defined
          if (source) {
            if (KnxAddress.validateAddrStr(source) === -1 ||
              KnxAddress.getAddrType(source) !== KnxConstants.KNX_ADDR_TYPES.DEVICE) {
              err = new Error(RawModErrors.ERR_WriteDevMem.INVALID_SOURCE.errorMsg)
              rawModErr = errContext.createNewError(err, RawModErrors.ERR_WriteDevMem.INVALID_SOURCE.errorID)

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
        if (checkDataVal()) { return 1 }
        if (checkTargetAndSource()) { return 1 }
      }

      // This function forges all needed messages
      const forgeMessages = () => {
        connReq = KnxMessageTemplates.ucdConnRequest(target, source)
        propValWriteReq = KnxMessageTemplates.propertyValueWriteRequest(target, source,
          objectIndex, propertyID, elementCount, startIndex, data)
        ackMsg = KnxMessageTemplates.ncdAckMsg(target, source)
        dconnMsg = KnxMessageTemplates.ucdDconnMsg(target, source)
      }

      // This function prepares the custom message handler templates
      const prepareCustomMessageHandlerTemplates = () => {
        ncdAckHandlerTemplate = RawModCustomMsgHandlerTemplates.ncdAckHandlerTemplate(target, source || conContext.options.physAddr)
        ncdNackHandlerTemplate = RawModCustomMsgHandlerTemplates.ncdNackHandlerTemplate(target, source || conContext.options.physAddr)
      }

      // A handler for the acknowledge message (Contains the 'everything-went-right' exit point)
      const ncdAckMsgHandler = () => {
        // Check if timeoutRef is null (=> if the handler was already called once)
        if (timeoutRef == null) {
          return
        }

        // Clear the timeout, set timeoutRef to null, remove handlers
        clearTimeout(timeoutRef)
        timeoutRef = null
        removeHandlers()

        // Send a NCD acknowledge message to the device
        KnxNetProtocol.sendTunnRequest(ackMsg, conContext, function (sendErr) {
          if (sendErr) {
            rawModErr = errContext.createNewError(sendErr, null)
            errContext.addNewError(rawModErr)

            resolve(1)
          } else {
            /*
             * Send the UCD disconnect message
             */
            KnxNetProtocol.sendTunnRequest(dconnMsg, conContext, function (sendErr) {
              if (sendErr) {
                rawModErr = errContext.createNewError(sendErr, null)
                errContext.addNewError(rawModErr)

                resolve(1)

                return
              }

              // Success - Give '0' back
              resolve(0)
            })
          }
        })
      }

      // A handler for the not-acknowledge message
      const ncdNackMsgHandler = () => {
        // Check if timeoutRef is null (=> if the handler was already called once)
        if (timeoutRef == null) {
          return
        }

        // Clear the timeout, set timeoutRef to null, remove handlers
        clearTimeout(timeoutRef)
        timeoutRef = null
        removeHandlers()

        // Send the UCD disconnect message
        KnxNetProtocol.sendTunnRequest(dconnMsg, conContext, function (sendErr) {
          if (sendErr) {
            rawModErr = errContext.createNewError(sendErr, null)
            errContext.addNewError(rawModErr)

            resolve({ error: 1, data: null })

            return
          }

          err = new Error(RawModErrors.ERR_WriteDevMem.TARGET_NOTACK.errorMsg)
          rawModErr = errContext.createNewError(sendErr, RawModErrors.ERR_WriteDevMem.TARGET_NOTACK.errorID)

          errContext.addNewError(rawModErr)

          resolve(1)
        })
      }

      // Register the handlers defined above
      const registerHandlers = () => {
        RawModCustomMsgHandlers.registerCustomMsgHandler(ncdAckHandlerTemplate, ncdAckMsgHandler, conContext)
        RawModCustomMsgHandlers.registerCustomMsgHandler(ncdNackHandlerTemplate, ncdNackMsgHandler, conContext)
      }

      // This function is later used to remove handlers registered below
      const removeHandlers = () => {
        RawModCustomMsgHandlers.removeCustomMsgHandler(ncdAckHandlerTemplate, conContext)
        RawModCustomMsgHandlers.removeCustomMsgHandler(ncdNackHandlerTemplate, conContext)
      }

      // This function sends the connect and write requests
      const sendConnAndWriteReq = () => {
        return new Promise(resolve => {
          // Send the UCD connection request
          KnxNetProtocol.sendTunnRequest(connReq, conContext, function (sendErr) {
            if (sendErr) {
              // Create the RawModError object
              rawModErr = errContext.createNewError(sendErr, null)

              // Push it onto the errorStack
              errContext.addNewError(rawModErr)

              // Return 1
              resolve(1)
            } else {
              // Send the memory write request
              KnxNetProtocol.sendTunnRequest(propValWriteReq, conContext, function (sendErr) {
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

      // This function creates a timeout for the arrival of the response of the KNX device
      const createRecvTimeout = () => {
        /*
         * Set a timeout that will remove the handlers if recvTimeout was reached
         * Reaching that timeout means that the device failed to respond
         */
        timeoutRef = setTimeout(function () {
          // Remove handlers
          removeHandlers()

          // Create a Error() object
          err = new Error(RawModErrors.ERR_WriteDevMem.TIMEOUT_REACHED.errorMsg)

          // Create a RawModError object
          rawModErr = errContext.createNewError(err, RawModErrors.ERR_WriteDevMem.TIMEOUT_REACHED.errorID)

          // Push it onto the errorStack
          errContext.addNewError(rawModErr)

          // Return 1
          resolve(1)
        }, recvTimeout)
      }

      // Call the functions defined above
      if (checkArguments()) { resolve(1); return }
      forgeMessages()
      prepareCustomMessageHandlerTemplates()
      registerHandlers()
      createRecvTimeout(resolve)
      if (await sendConnAndWriteReq()) { resolve(1) }
    })
  }
}
