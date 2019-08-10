/** THE FUNCTION CONTAINED IN THIS FILE SHOULDN'T BE ACCESSED DIRECTLY - USE KnxReadDeviceResource.js INSTEAD **/

import KnxReadDevMem from './KnxReadDevMem'

export default async (target, source, deviceResourceInformation, recvTimeout, conContext, errContext) => {
  // TODO remove debugging logs
  // Get the correct address and length
  const address = deviceResourceInformation.startAddress
  const length = deviceResourceInformation.length

  console.log('[DEBUG] Reading %d bytes from %d', length, address)

  // Send the request and return the result
  return KnxReadDevMem.readDevMem(target, source, [address >> 8, address & 0b11111111], length, recvTimeout, conContext, errContext)
}
