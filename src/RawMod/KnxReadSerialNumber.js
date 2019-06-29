/****************************************************************************
 * This file contains a function to read the serial number of an KNX device *
 ****************************************************************************/

import KnxReadPropertyValue from './KnxReadPropertyValue'
import KnxConstants from '../KnxConstants'

export default {
  /*
   * Function: KnxGetProgmodeStatus.readSerialNumber()
   *
   *      This function reads a device serial number
   *      It uses the KnxReadPropertyValue.readPropertyValue() function
   *
   * Arguments:
   *
   *      target        The KNX device address of the target device
   *                    E.g.: '1.1.0', '1.1.250', ...
   *                    Type: String
   *
   *      recvTimeout   How long to wait for an acknowledge message from the target in milliseconds
   *                    Due to network-lags etc., a value gt. 500 is recommended
   *                    E.g.: 500, 1000, 250, 2000
   *                    Type: Number
   *
   *      conContext    The KNX connection context
   *
   *      errContext    The RawMod error context
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
   *      The first four bytes are information about the data being responded (eq. to the first four bytes of the request message)
   *      These four bytes are formed like this:
   *        Buffer.from([objectIndex, propertyID, ((elementCount & 0b1111) << 4) | (startIndex >> 8) & 0b1111, startIndex & 0b11111111])
   *
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
   *      RawModErrors.ERR_ReadPropertyValue.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.ERR_ReadPropertyValue.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.ERR_ReadPropertyValue.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readSerialNumber: async (target, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      /*
       * Pass the request to KnxReadPropertyValue.readPropertyValue()
       */
      let val = await KnxReadPropertyValue.readPropertyValue(target, conContext.options.physAddr,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.SerialNumber.objectIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.SerialNumber.startIndex,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.SerialNumber.propertyID,
        KnxConstants.KNX_DEV_PROPERTY_INFORMATION.SerialNumber.elementCount,
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
