/***********************************************************************************
 * This file contains a function to read the application runstate of an KNX device *
 ***********************************************************************************/

import KnxReadPropertyValue from './KnxReadPropertyValue'
import KnxConstants from '../KnxConstants'
import RawModErrors from './Errors'

export default {
  /*
   * Function: KnxGetProgmodeStatus.readApplicationRunstate()
   *
   *      This function reads a devices application runstate
   *      (The runstate of one of the two applications)
   *      It uses the KnxReadPropertyValue.readPropertyValue() function
   *
   * Arguments:
   *
   *      target            The KNX device address of the target device
   *                        E.g.: '1.1.0', '1.1.250', ...
   *                        Type: String
   *
   *      applicationIndex  The index of the application to get the runstate from
   *                        Can be one or two
   *                        E.g.: 1, 2
   *                        Type: Number
   *
   *      recvTimeout       How long to wait for an acknowledge message from the target in milliseconds
   *                        Due to network-lags etc., a value gt. 500 is recommended
   *                        E.g.: 500, 1000, 250, 2000
   *                        Type: Number
   *
   *      conContext        The KNX connection context
   *
   *      errContext        The RawMod error context
   *
   * Return:
   *      Returns a promise which resolves with the following JSON object:
   *
   *      {
   *        error: x,
   *        data: y
   *      }
   *
   *      If everything goes well, error will be zero and data will be the response-data of the target device
   *      The following data represents the value of the requested property.
   *
   *        {
   *          error: 0,
   *          data: Buffer.from([0x01])
   *        }
   *
   *      On error, error will be set to one and data will be null
   *
   *        {
   *          error: 1,
   *          data: null
   *        }
   *
   *      If the second is the case, a error will be added to errContext.errorStack
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.ERR_ReadPropertyValue.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.ERR_ReadPropertyValue.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.ERR_ReadPropertyValue.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.ERR_ReadPropertyValue.INVALID_ARGVAL - A argument has an invalid value (applicationIndex)
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readApplicationRunstate: async (target, applicationIndex, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      // Get the correct objectIndex
      let objectIndex

      if (applicationIndex === 1) {
        objectIndex = KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_RunState.objectIndex
      } else if (applicationIndex === 2) {
        objectIndex = KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_2_RunState.objectIndex
      } else {
        const err = new Error(RawModErrors.ERR_ReadPropertyValue.INVALID_ARGVAL.errorMsg)
        const rawModErr = errContext.createNewError(err, RawModErrors.ERR_ReadPropertyValue.INVALID_ARGVAL)

        errContext.addNewError(rawModErr)

        resolve({ error: 1, data: null })

        return
      }

      /*
       * Pass the request to KnxReadPropertyValue.readPropertyValue()
       */
      let val = await KnxReadPropertyValue.readPropertyValue(target, conContext.options.physAddr,
        objectIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_RunState.startIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_RunState.propertyID,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_RunState.elementCount,
        recvTimeout, conContext, errContext)

      if (!val.error) {
        // Cut of the first four bytes
        val.data = val.data.slice(4)
      }

      // Return the result
      resolve(val)
    })
  }
}
