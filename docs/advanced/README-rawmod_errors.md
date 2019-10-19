# Rawmod Errors
- This file contains information about the `RawModErrorHandler`, `RawModError` objects, error messages and reference IDs
### Errors
- Error definitions consisting of referenceIDs and error messages defined
    ```js
    knx.RawMod.ERRORS[Name]
    ```
| knx.RawMod.ERRORS\[Name\] | .errorID | .errorMsg
|---|---|---|
| UNKNOWN_ERROR | 65536 | Unknown error! |
| UNDEF_ARGS | 65537 | There are undefined arguments! |
| INVALID_ARGTYPES | 65538 | Some arguments have an invalid type! |
| INVALID_ARGVAL | 65539 | Some arguments have an invalid value! |
| INVALID_DATALEN | 65540 | Rge das argument has an invalid length! |
| INVALID_TARGET | 65541 | The target KNX address is invalid! |
| INVALID_SOURCE | 65542 | The source KNX address is invalid |
| INVALID_READLEN | 65542 | The length argument is invalid! |
| INVALID_NEWADDRESS | 65544 | The new address is invalid! |
| TARGET_NOTACK | 65545 | The target actively didn't acknowledge the request! |
| TIMEOUT_REACHED | 65546 | The target failed to respond! |
| INVALID_MV_RN | 65547 | The maskversion or request name is invalid! |
| NO_WRITE_WAY_FOUND | 65548 | No way to write the resource value found! |
| NO_WRITE_WAY_MATCHED | 65549 | No way to write the resource value matches the criteria! |
| NO_READ_WAY_FOUND | 65550 | No way to read the resource found! |
| NO_READ_WAY_MATCHED | 65551 | No way to read the resource matches the criteria! |

### The `RawModError` object
- This object represents a single rawmod error
- The object has the same items as its constructor takes
    ```
    .filePath = ""
    .functionName = ""
    .time = new Date()
    .errorObject = new Error()
    .referenceID = 0
    .errorNumber = 0
    ```
    - `.filePath`: The path of the file the error occurred in
    - `.functionName`: The name of the function the error occurred in
    - `.time`: The time the error occurred at
    - `.errorObject`: A generic `Error()` object (see `RawModErrorHandler`.`createNewError()` below)
    - `.referenceID`: The referenceID to the specific error (see `Errors`)
    - `.errorNumber`: The number this error can be identified with (unique)
- **USE `RawModErrorHandler`.`createNewError()` to create these objects**
### The `RawModErrorHandler`
- A `RawModErrorHandler` is used to store errors
- Some/Many RawMod functions have an argument called `errorContext` - meaning a `RawModErrorHandler` 
- When loading the Knx `advanced_knx` module, a `RawModErrorHandler` object will be initialised
    ```js
    knx = require('advanced_knx')
    ```
    - The `RawModErrorHandler` object will be at `knx.RawMod.errorHandler`
    - A `RawModErrorHandler` object can be created like this
        ```js
        errorHandler = new knx.RawMod.newErrorHandler()
        ```
- The created `RawModErrorHandler` contains the following items
    ```
    .errorCounter = 0
    .errorStack = []
    .getLastError () {}
    .getErrorByNumber (number) {}
    .getErrorStack () {}
    .delLastError () {}
    .delErrorStack () {}
    .addNewError (rawModErrorObject) {}
    .createNewError (errorObject, referenceID) {}
    ```
- `.errorCounter`: The total number of errors ever added
    - Every added error can be identified by it's number (`RawModError`.`errorNumber`) starting from one
    - This counter won't be decreased when removing errors (`.del*` functions)
- `.errorStack`: A stack of errors added to this handler
    - Newest error on top, oldest at the bottom
- `.getLastError () {}`: Returns the latest error from `.errorStack`
- `.getErrorByNumber (number) {}`: Gets an error by its number
    - It will return the error from `.errorStack` with `RawModError`.`errorNumber` eq. `number`
    - If no matching error was found, `undefined` will be returned
- `.getErrorStack () {}`: Returns `.errorStack`
- `.delLastError () {}`: Deletes the latest error from `.errorStack`
- `.delErrorStack () {}`: Deletes/Clears `.errorStack`
- `.addNewError (rawModErrorObject) {}`: Adds `rawModErrorObject` to `.errorStack` and returns its `RawModError`.`errorNumber`
- `.createNewError (errorObject, referenceID)`: Creates a new `RawModError` object (recommended way)
    - `errorObject` should be a `new Error()` object looking like this
        ```js
        err = new Error(knx.RawMod.ERRORS.UNDEF_ARGS.errorMsg)
        rawModErr = knx.RawMod.errorHandler.createNewError(err, knx.RawMod.ERRORS.UNDEF_ARGS.errorID)
        ```
        - (example taken from `/Data/KNXJS/KNXENV/advanced_knx/src/RawMod/RawMod.js`)
    - `referenceID`: One of `.errorID` (see `Errors`)
    - All other information needed for creating a `RawModError` object are gathered by this function