/******************************************************************************
 * This file contains a function to read the progmode status of an KNX device *
 ******************************************************************************/

import KnxReadDevMem from './KnxReadDevMem'
import KnxConstants from '../KnxConstants'

export default {
  /*
   * Function: KnxGetProgmodeStatus.getProgmodeStatus()
   *
   *      This function reads the programming mode status of KNX devices
   *      It uses the KnxReadDevMem.readDevMem() function and does not introduce any own errors
   *
   * Arguments:
   *
   *      target          The target device address. E.g.: 1.2.3 or 10.12.25, ...
   *                      Type: String
   *
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65542 ('The target failed to respond!')
   *                      Type: Integer
   *
   *      conContext      The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                      Type: require('Connection.js').Connection()
   *
   *      errContext      The RawMod error context - needed to indicate errors
   *                      Type: require('RawMod/RawModErrorHandler.js').RawModErrorHandler()
   *
   * Return:
   *      Returns a promise which resolves with
   *
   *        {
   *          data: [progmodeStatus],
   *          error: 0
   *        }
   *
   *      (where progmodeStatus is the programming mode status of the device) on success and
   *
   *        {
   *          data: null,
   *          error: 1
   *        }
   *
   *      on error ...
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.ERR_ReadDevMem_UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.ERR_ReadDevMem_INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.ERR_ReadDevMem_INVALID_READLEN - The length argument has an invalid value
   *      RawModErrors.ERR_ReadDevMem_TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  getProgmodeStatus: async (target, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      let retVal = {
        data: null,
        error: 0
      }

      /*
       * Pass the request to KnxReadDevMem.readDevMem()
       *      source (conContext.options.phsyAddr) is the KNX-device address of the KNX-IP interface
       *      address ([0x00, 0x60] == KnxConstants.KNX_MEMORY_ADDRS.MEMORY_PROGMODE_ADDR) is the address of the position of the programming-mode flags on all KXN-devices
       *      length (1) is the amount of bytes to read from the address
       */
      let val = await KnxReadDevMem.readDevMem(target, conContext.options.physAddr, KnxConstants.KNX_MEMORY_ADDRS.MEMORY_PROGMODE_ADDR, 1, recvTimeout, conContext, errContext)

      // Copy the data into 'retVal' and cut off the first two bytes - the memory address
      if (!(retVal.error = val.error)) {
        retVal.data = val.data.slice(2)
      }

      // Return the result
      resolve(retVal)
    })
  }
}
