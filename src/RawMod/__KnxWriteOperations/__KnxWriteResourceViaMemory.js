/** THE FUNCTION CONTAINED IN THIS FILE SHOULDN'T BE ACCESSED DIRECTLY - USE KnxWriteDeviceResource.js INSTEAD **/

import KnxWriteDevMem from './KnxWriteDevMem'

export default async (target, source, deviceResourceInformation, value, recvTimeout, conContext, errContext) => {
  // Get the correct address
  const address = deviceResourceInformation.startAddress

  // Send the request and return the result
  return KnxWriteDevMem.writeDevMem(target, source, [address >> 8, address & 0b11111111], value, recvTimeout, conContext, errContext)
}
