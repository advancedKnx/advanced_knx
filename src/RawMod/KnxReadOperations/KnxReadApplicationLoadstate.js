/************************************************************************************
 * This file contains a function to read the application loadstate of an KNX device *
 ************************************************************************************/

import KnxConstants from '../../KnxConstants'
import RawModErrors from '../Errors'
import KnxReadPropertyValue from './KnxReadPropertyValue'

export default {
  /*
   * Function: KnxGetProgmodeStatus.readApplicationLoadstate()
   *
   *      This function reads a devices application loadstate
   *      (The loadstate of one of the two applications)
   *      It uses the KnxReadDevMem().readDevMem() function
   *
   * Arguments:
   *
   *      target            The KNX device address of the target device
   *                        E.g.: '1.1.0', '1.1.250', ...
   *                        Type: String
   *
   *      applicationIndex  The index of the application to get the loadstate from
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
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.INVALID_ARGVAL - A argument has an invalid value (applicationIndex)
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readApplicationLoadstate: async (target, applicationIndex, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      // Get the correct objectIndex
      let objectIndex

      if (applicationIndex === 1) {
        objectIndex = KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_LoadState.objectIndex
      } else if (applicationIndex === 2) {
        objectIndex = KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_2_LoadState.objectIndex
      } else {
        const err = new Error(RawModErrors.INVALID_ARGVAL.errorMsg)
        const rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGVAL)

        errContext.addNewError(rawModErr)

        resolve({ error: 1, data: null })

        return
      }

      /*
       * Pass the request to KnxReadPropertyValue.readPropertyValue()
       * (Values for Application 1 can be used - eq. for Application 2)
       */
      let val = await KnxReadPropertyValue.readPropertyValue(target, conContext.options.physAddr,
        objectIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_LoadState.startIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_LoadState.propertyID,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_LoadState.elementCount,
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
