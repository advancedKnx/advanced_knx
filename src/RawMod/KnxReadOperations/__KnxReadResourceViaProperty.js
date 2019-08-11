/** THE FUNCTION CONTAINED IN THIS FILE SHOULDN'T BE ACCESSED DIRECTLY - USE KnxReadDeviceResource.js INSTEAD **/

import KnxReadPropertyValue from './KnxReadPropertyValue'

export default async (target, source, deviceResourceInformation, recvTimeout, conContext, errContext) => {
  // Get the correct address and length
  const objectIndex = deviceResourceInformation.interfaceObjectRef || 0
  const startIndex = 1 // by default
  const propertyID = deviceResourceInformation.propertyID
  const elementCount = deviceResourceInformation.length // elementCount = Bytes = Length

  // Send the request and return the result
  return KnxReadPropertyValue.readPropertyValue(target, source, objectIndex, startIndex,
    propertyID, elementCount, recvTimeout, conContext, errContext)
}
