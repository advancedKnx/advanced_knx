# Read/Write device memory
- **THIS IS A LOW-LEVEL INTERFACE -- USE THE DEVICE RESOURCE INTERFACE INSTEAD**
- This file contains information on how to read from/write to KNX device memory
- All KNX address strings mentioned below must be valid. See [README-knx_address.md]
### Read device memory
- To read device memory, the following function will be used
    ```
    knx.RawMod.KnxReadDevMem.readDevMem(target, source, address, length, recvTimeout, conContext, errContext)
    ```
    - `target` (`string`): KNX target address string
        - Stores the device address of the target of the read operation. Examples:
            ```
            '1.1.2', '15.15.255', ... 
            ```
    - `source` (`string`/undefined): KNX source address string
        - Should normally be `undefined` - will us the address of the connected KNX-IP interface by default
        - Examples
            ```
            '10.10.12', '3.4.5', undefined, ...
            ```
    - `address` (`new Uint8Array(2)`): 2-Bytes memory address to read from
        - The memory address to read data from on the target device. Examples:
            ```
            Uint8Array.from([0x00, 0x60]), ...
            ```
    - `length` (`number`): number of bytes to read
        - The number of bytes to read from the device - **One at least and twelve at most**
    - `recvTimeout` (`number`): number of milliseconds to wait for responses from the device
        - A device may need more than one second to respond
        - In general: The more device attached to the bus and the bigger the bus, the more time needed for a response
        - Recommended minimum is at about `2000`ms
    - `conContext` (`Knx.Connection()`): a connected KNX connection context
        - See [../README-connection_setup.md]
    - `errContext` (`new RawModErrorHandler()`): a RawModErrorHandler
        - See [README-rawmod_errors.md] -> RawModErrorHandler
    - **Errors**
        - The following RawMod errors can occur
            ```
            UNDEF_ARGS
            INVALID_ARGTYPES
            INVALID_READLEN
            TIMEOUT_REACHED
            INVALID_TARGET
            INVALID_SOURCE
            ```
            - See [README-rawmod_errors.md] -> Errors
    - **Return Value**
        - It returns a JSON object
            ```
            retval = {
              data: 0,
              error: 0
            }
            ```
            - On error, `retval.error` will stores the error number of the RawModError ([README-rawmod_errors.md]) and `retval.data` will be null
                - The error can be received like this
                    ```js
                    err = errContext.getErrorByNumber(retval.error)
                    ```
            - On success, `retval.error` will be `0` and `retval.data` will look like this
                ```
                retval = {
                    data: Buffer.from([0x01, 0x00, 0x60, 0x01]),
                    error: 0
                }
                ```
                | n | `retval.data[n]` - content |
                |---|---|
                | 0 | `0x01` - Number of bytes read |
                | 1 | `0x00` - Byte 0 of the read-address |
                | 2 | `0x60` - Byte 1 of the read-address |
                | 3 | `0x01` - Data read |
                - This example represents the response to a read-request on the programming-mode-flag address `0x0060` when the device is **not** in programming mode
