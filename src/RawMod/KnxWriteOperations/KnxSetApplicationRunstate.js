/**********************************************************************************
 * This file contains a function to set the application runstate of an KNX device *
 **********************************************************************************/

import KnxConstants from '../../KnxConstants'
import RawModErrors from '../Errors'
import KnxWriteDevMem from './KnxWriteDevMem'

export default {
  /*
   * Function: KnxSetApplicationRunstate.setApplicationRunstate()
   *
   *      This function sets a devices application runstate
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
   *      newState          The runstate to be set
   *                        E.g.: (See KnxConstants.KNX_DEV_APLLICATION_RUNSTATES)
   *                          0x0: Application stopped
   *                          0x1: Application running
   *                          0x2: Application Ready (Does not seem to work)
   *                          0x3: Application Terminated
   *
   *                          Some devices ignore the '0x0' status, '0x3' might be used in this case
   *
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
   *      Returns a promise which resolves with zero on success and with one if something went wrong
   *      If the second is the case, a error will be added to errContext.errorStack
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.ERR_ReadPropertyValue.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.ERR_ReadPropertyValue.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.ERR_ReadPropertyValue.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.ERR_Generic.INVALID_ARGVAL - A argument has an invalid value (applicationIndex)
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  setApplicationRunstate: async (target, applicationIndex, newState, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      // Get the correct target memory address
      let address

      if (applicationIndex === 1) {
        address = KnxConstants.KNX_MEMORY_ADDRS.MEMORY_RUNSTATE_APP1_ADDR
      } else if (applicationIndex === 2) {
        address = KnxConstants.KNX_MEMORY_ADDRS.MEMORY_LOADSTATE_APP2_ADDR
      } else {
        const err = new Error(RawModErrors.ERR_Generic.INVALID_ARGVAL.errorMsg)
        const rawModErr = errContext.createNewError(err, RawModErrors.ERR_Generic.INVALID_ARGVAL)

        errContext.addNewError(rawModErr)

        resolve({ error: 1, data: null })

        return
      }

      /*
       * Pass the request to KnxWriteDevMem.writeDevMem()
       */
      let val = await KnxWriteDevMem.writeDevMem(target, conContext.options.physAddr, address,
        Buffer.from([newState]), recvTimeout, conContext, errContext)

      // Return the result
      resolve(val)
    })
  }
}
