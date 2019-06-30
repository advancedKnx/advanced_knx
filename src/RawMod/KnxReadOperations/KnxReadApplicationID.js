/*************************************************************************
 * This file contains a function to read application ID of an KNX device *
 *************************************************************************/

import KnxReadPropertyValue from './KnxReadPropertyValue'
import KnxConstants from '../../KnxConstants'
import RawModErrors from '../Errors'

export default {
  /*
   * Function: KnxGetProgmodeStatus.readApplicationID()
   *
   *      This function reads a devices application ID
   *      (One of the two application IDs)
   *      It uses the KnxReadPropertyValue.readPropertyValue() function
   *
   * Arguments:
   *
   *      target            The KNX device address of the target device
   *                        E.g.: '1.1.0', '1.1.250', ...
   *                        Type: String
   *
   *      applicationIndex  The index of the application to get the ID from
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
   *          data: Buffer.from([0x00, 0x83, 0x3f, 0xc4, 0xe0, 0x32])
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
  readApplicationID: async (target, applicationIndex, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      // Get the correct objectIndex
      let objectIndex

      if (applicationIndex === 1) {
        objectIndex = KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_ID.objectIndex
      } else if (applicationIndex === 2) {
        objectIndex = KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_2_ID.objectIndex
      } else {
        const err = new Error(RawModErrors.INVALID_ARGVAL.errorMsg)
        const rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGVAL)

        errContext.addNewError(rawModErr)

        resolve({ error: 1, data: null })

        return
      }

      /*
       * Pass the request to KnxReadPropertyValue.readPropertyValue()
       */
      let val = await KnxReadPropertyValue.readPropertyValue(target, conContext.options.physAddr,
        objectIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_ID.startIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_ID.propertyID,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.Application_1_ID.elementCount,
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
