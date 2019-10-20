# Set device address
- This file is about reading and writing a physical KNX device addresses using this library
- The following functions will be used for this
    ```js
    knx.RawMod.KnxGetDeviceAddress.readDeviceAddress = async (recvTimeout, conContext, errContext) => {}
    knx.RawMod.KnxSetDeviceAddress.setDeviceAddress = async (newAddr, conContext, errContext) => {}
    ```
- **The target device has to be in programming mode!** ([README-set_progmode_status.md])
- **Only the target device should be in programming mode!**
##### knx.RawMod.KnxGetDeviceAddress.readDeviceAddress(recvTimeout, conContext, errContext)
- This function is used to read device addresses from devices
- `recvTimeout` (`number`): number of milliseconds to wait for responses from the device
    - A device may need more than one second to respond
    - In general: The more device attached to the bus and the bigger the bus, the more time needed for a response
    - Recommended minimum is at about `2000`ms
- `conContext`: The KNX connection context see [../README-connection_setup.md]
- `errContext`: The RawMod error context see [README-rawmod_errors.md]
- **Errors**
    ```
    RawModErrors.UNDEF_ARGS
    RawModErrors.INVALID_ARGTYPES
    RawModErrors.TIMEOUT_REACHED
    ```
    - see [README-rawmod_errors.md]
- **Return value**
    ```
    {
        data: [AddressByteOne, AddressByteTwo],
        error: 0
    } ... on success ...
    {
        data: null,
        error: ERRNUM
    } ... on error ...
    ```
    - on error `ERRNUM` can be used to get the occurred error see [README-rawmod_errors.md]
##### knx.RawMod.KnxSetDeviceAddress.setDeviceAddress(newAddr, conContext, errContext)
- This function is used to write a device addresses to devices
- `newAddr` (`string`): The address that should be written to the device
    - It must be a valid individual address stores as string- see [README-knx_address.md]
- `conContext`: The KNX connection context see [../README-connection_setup.md]
- `errContext`: The RawMod error context see [README-rawmod_errors.md]
- **Errors**
    ```
    RawModErrors.UNDEF_ARGS
    RawModErrors.INVALID_ARGTYPES
    RawModErrors.INVALID_MEWADDRESS
    ```
    - see [README-rawmod_errors.md]
- **Return value**
    ```
    0 => Success
    n > 0 => Failure - n is the error number of the error added to errContext
    ```
- After setting the address, reading it is recommended to check if setting was successful