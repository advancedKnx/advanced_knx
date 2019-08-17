/*
 * This file contains code to check if a resource is avaible on a device given its maskversion
 */

import KnxDeviceResourceInformation from './KnxDeviceResourceInformation'

export default (maskVersion, resourceName) => {
  return !!KnxDeviceResourceInformation.getResourceInfoByMaskVersionAndName(maskVersion, resourceName)
}
