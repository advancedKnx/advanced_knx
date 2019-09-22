/*
 * This file contains functions to interact with a devices Run State Machine
 * Information on this can be found in README-operation_rawmod.md
 */

import KnxReadDeviceResource from '../__KnxReadOperations/KnxReadDeviceResource'
import KnxConstants from '../../KnxConstants'
import KnxWriteDeviceResource from '../__KnxWriteOperations/KnxWriteDeviceResource'
import _ from 'lodash'

/*
 * Returns the RSM state of the given device
 * when retval.error is not set:
 *  retval.data will contain the raw-data returned from the device
 *  retval.runstate will contain the state of the RSM
 * if it is:
 *  retval.data will be unset
 *  retval.runstate will be undefined
 */
const getRSMState = async (target, source, maskVersion, recvTimeout, conContext, errContext, preferredReadType = KnxConstants.RESOURCE_ACCESS_TYPES.ALL) => {
  // Read it
  const retval = await KnxReadDeviceResource.readDeviceResource(target, source, maskVersion, 'ApplicationRunStatus',
    preferredReadType, recvTimeout, conContext, errContext)

  // Check if data was returned - if so, copy the runstate into a separate field
  if (retval.data && retval.data.length > 0) {
    retval.runstate = _.last(retval.data)
  }

  return retval
}

/*
 * Send a command to the LSM of the given device
 * command => One of KnxConstants.KNX_RSM_CMDS
 */
const sendRSMCMD = (target, source, maskVersion, recvTimeout, command, conContext, errContext, preferredWriteType = KnxConstants.RESOURCE_ACCESS_TYPES.ALL) => {
  const wval = Buffer.from([command])

  // Write it and pass the result trough
  return KnxWriteDeviceResource.writeDeviceResource(target, source, maskVersion, 'ApplicationRunStatus',
    preferredWriteType, wval, recvTimeout, conContext, errContext)
}

export default {
  getRSMState: getRSMState,
  sendRSMCMD: sendRSMCMD
}
