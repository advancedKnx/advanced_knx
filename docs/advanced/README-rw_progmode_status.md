# Read/Write Programming Mode Status
- This file contains information about reading and writing the progmode status of a KNX device
- **Note** most devices have an indicator (like a LED or some text showing on a screen) that indicates the current progmode status
- The following functions will be used
    ```js
    knx.RawMod.KnxGetProgmodeStatus.readProgmodeStatus = async (target, recvTimeout, maskVersion, conContext, errContext) => {}
    knx.RawMod.KnxSetProgmodeStatus.setProgmodeStatus = async (target, status, recvTimeout, maskVersion, conContext, errContext) => {}
    ```
##### knx.RawMod.KnxGetProgmodeStatus.readProgmodeStatus = async (target, recvTimeout, maskVersion, conContext, errContext) => {}
- This function is used to get the current progmode status of a KNX device
- `target` (`string`): A valid KNX individual address string (see [README-knx_address.md])
- `recvTimeout` (`number`): How long to wait for a response from the device in milliseconds
    - Response time will grow with the complexity of the bus
    - For small installations, 2000-4000ms should work
- `maskVersion` (`number`/`string`): The maskversion of the device
    - see [README-device_maskversion.md]
- `conContext`: The KNX connection context ([../README-connection_setup.md])
- `errContext`: The RawMod error context ([README-rawmod_errors.md])
- **Errors**
    ```
    RawModErrors.UNDEF_ARGS
    RawModErrors.INVALID_ARGTYPES
    RawModErrors.INVALID_READLEN
    RawModErrors.TIMEOUT_REACHED
    RawModErrors.INVALID_TARGET
    RawModErrors.INVALID_SOURCE
    RawModErrors.INVALID_MV_RN
    RawModErrors.NO_WRITE_WAY_FOUND
    RawModErrors.NO_WRITE_WAY_MATCHED
    RawModErrors.NO_READ_WAY_FOUND
    RawModErrors.NO_READ_WAY_MATCHED
    ```
    - see [README-rawmod_errors.md]
- **Return value**
    - on success
        ```
        {
            data: Buffer.from([progmodeStatus]),
            error: 0
        }
        ```
        - `data` contains the progmodeStatus
        - `error` will be set to `0`
    - on error
        ```
        {
            data: null,
            error: ERRNUM
        }
        ```
        - `data` will be `null`
        - `error` will be the error number of - the error - can be received with
            ```
            err = errContext.getErrorByNumber(ERRORNUMBER)
            ```
##### knx.RawMod.KnxSetProgmodeStatus.setProgmodeStatus = async (target, status, recvTimeout, maskVersion, conContext, errContext) => {}
- This function is used to set the progmode status of a KNX device
- `target` (`string`): A valid KNX individual address string (see [README-knx_address.md])
- `status` (`number`): The new status that should be written to the device
    - `0` will disable and `1` will enable progmode
- `recvTimeout` (`number`): How long to wait for a response from the device in milliseconds
    - Response time will grow with the complexity of the bus
    - For small installations, 2000-4000ms should work
- `maskVersion` (`number`/`string`): The maskversion of the device
    - see [README-device_maskversion.md]
- `conContext`: The KNX connection context ([../README-connection_setup.md])
- `errContext`: The RawMod error context ([README-rawmod_errors.md])
- **Errors**
    ```
    RawModErrors.UNDEF_ARGS
    RawModErrors.INVALID_ARGTYPES
    RawModErrors.INVALID_DATALEN
    RawModErrors.TARGET_NOTACK
    RawModErrors.TIMEOUT_REACHED
    RawModErrors.INVALID_TARGET
    RawModErrors.INVALID_SOURCE
    RawModErrors.INVALID_MV_RN
    RawModErrors.NO_WRITE_WAY_FOUND
    RawModErrors.NO_WRITE_WAY_MATCHED
    ```
- Return value
    - `0` means success and `n` on error - where n is the ERRNUM of the error which can be received like this
        ```
        err = errContext.getErrorByNumber(n)
        ```