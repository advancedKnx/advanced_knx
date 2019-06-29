/******************************************************************************
 * This file contains a function to read the progmode status of an KNX device *
 ******************************************************************************/

import KnxWriteDevMem from './KnxWriteDevMem'
import KnxConstants from '../KnxConstants'

export default {
  /*
   * Function: KnxGetProgmodeStatus.setProgmodeStatus()
   *
   *      This function enables/disables the programming mode of KNX devices
   *      It uses the KnxWriteDevMem.writeDevMem() function and does not introduce any own errors
   *
   * Arguments:
   *
   *      target          The target device address. E.g.: 1.2.3 or 10.12.25, ...
   *                      Type: String
   *
   *      status          The new programming mode status that should applied
   *                      status = 2*n + 1    To enable programming mode  (Commonly used: 0x81 [129])
   *                      status = 2*n        To disable programming mode (Commonly used: 0x00 [0])
   *                      ... for n being a element of the natural numbers
   *                      status must be greater than or equal to zero and smaller than 256
   *                      Type: Integer, Boolean
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
   *      Returns a promise which resolves with zero on success and with one if something went wrong
   *      If the second is the case, a error will be added to errContext.errorStack
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.ERR_ReadDevMem_UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.ERR_ReadDevMem_INVALID_ARGTYPES - At least one arguments has an invalid type
   *      RawModErrors.ERR_WriteDevMem_INVALID_DATALEN - The data argument has an invalid length
   *      RawModErrors.ERR_WriteDevMem_TARGET_NOTACK- The target device did actively not acknowledge
   *      RawModErrors.ERR_WriteDevMem_TIMEOUT_REACHED - The target device failed to respond in recvTimeout ms
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  setProgmodeStatus: async (target, status, recvTimeout, conContext, errContext) => {
    /*
     * Pass the request to KnxWriteDevmem.writeDevMem()
     *      source (conContext.options.phsyAddr) is the KNX-device address of the KNX-IP interface
     *      address ([0x00, 0x60] == KnxConstants.KNX_MEMORY_ADDRS.MEMORY_PROGMODE_ADDR) is the address of the position of the programming-mode flags on all KXN-devices
     */
    return KnxWriteDevMem.writeDevMem(target, conContext.options.physAddr, KnxConstants.KNX_MEMORY_ADDRS.MEMORY_PROGMODE_ADDR,
      Buffer.from([status]), recvTimeout, conContext, errContext)
  }
}
