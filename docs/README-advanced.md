## Information on advanced functionality
**NOTE**: Reading `src/RawMod.js` might provide a better understanding of the things below
### Content
* This file contains information on:
    * Reading/Writing device memory
        * Enabling/Disabling the programming mode of KNX devices
***
### Reading/Writing device memory
#### Reading device memory
 * `Connection.readDevMem(target, source, address, length, sendTimeout, recvTimeout, callback)`
    * This function reads a specified number of bytes from a specified memory address of an KNX-device
    * It does the following steps to read and receive the data:
        ```
        1) Send a UCD connection request to the target device
        2) Send a memory read request to read length bytes from the targets memory@address
        3) The device should send the requested data, wait for it
            3.1) A custom message handler must have been registered before to catch the MemoryResponse message
            3.2) Delete the handler after the message was received, to prevent it from being called twice
        4) Send a NCD acknowledge message back to the device
        5) Send a UCD disconnect request
        6) Call the callback
        ```
#### Arguments
###### target
* The target device address
* E.g.: `1.2.3` or `10.12.25`, ...
* Type: `String`
    
###### source
* Source address to use. When set to null, the device address of the KNX-Interface will be used
* It can, and should, be set to null - the library will handle it
* E.g.: `2.3.4`, `11.13.26` or `null`, ...
* Type: `String`

###### address        
* The memory address to read data from
* Note that not all memory addresses are readable.
* E.g.: `[0x00, 0x60]`, ...
* Type: `Array` of two bytes

###### length 
* Number of bytes to read from memory
* Type: `Integer` (4-Bit)

###### sendTimeout 
* How long to timeout after sending a message (in milliseconds)
    * Messages can't just be sent without any delay between them
    * They would be dropped by the KNX-IP interface
* Recommended to be greater than 70.
    * If it doesn't work, incrementing this value might help
    * The sendTimeout being to low will result in the target no sending an acknowledge message
    * A indicator for this value being to low can be the following error message: `"Failed to receive NCD_ACK from ..."`.
    See `Errors`, below
* Type: `Integer`
    
###### recvTimeout 
* How long to wait for an acknowledge from the KNX device (in milliseconds)
*  Recommended to be around 2000
    * The KNX system may run out of bandwidth for a short time, causing lags
    * If no acknowledge was received within the timeout, the following error message will be passed to the callback:
    `"Failed to receive NCD_ACK from ..."`. See `Errors` below
* Type: `Integer`

###### callback
* A callback function which will be called when the function finished
* It should look like this:
`function (data, err) {...}`
* The arguments of the callback function are described below (see `Return data` for `data` and `Errors` for `err`)
* **NOTE** that `err` will be `null` if `data` is set and that `data` will be null if `err` is set
* Type: `function`

#### Return data
* The returned data will be contained in the `data` argument of the `callback` function 
* `data` is a `Buffer` that looks like this:
```
 Byte |    Content
-----------------------
   0  | MemoryAddress
   1  | MemoryAddress
  2-n | Data 
```
* The length of `data` can be simply checked using `data.length`
* No data following the memory address can be caused by an invalid request
#### Errors
* There are two ways errors can be returned by this function
###### via return     
* There is only one error passed back using the `return`
`"callback must be a valid function!"`
* This error message 
   *                      It will cause the function to stop and return
   *                      It will be triggered when callback is not a function
   *                      Type: new Error()
   *
   *      via callback    There are a two of errors passed back using the callback
   *
   *                          "There are undefined arguments!"
   *                          "Failed to receive NCD_ACK from ..."
   *                          "Some parameters have a wrong type!"
   *
   *                      The first one will be triggered when one or more of the arguments described above is not defined (null)
   *                      The second one will be triggered if there was no acknowledge from the target device in given time
   *                          See recvTimeout in the Arguments section
   *                      The third one will be triggered if one ore more arguments are of a wrong type
   *                      Type: new Error()
   */