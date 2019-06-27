## Connect to your KNX IP router

* To connect to the KNX-IP interface, the `knx.Connect()` function may be used.
* It takes one argument, which is the connection config.
* Most/Some values have defaults and the user doesn't have to specify them.
    * However, specifying the value is recommended. 

```js
var connection = new knx.Connection({
    // ip address and port of the KNX router or interface
    ipAddr: '127.0.0.1', ipPort: 3671,
  
    // in case you need to specify the multicast interface (say if you have more than one)
    interface: 'eth0',
  
    // the KNX physical address we'd like to use
    // physAddr: '15.15.15',
    /*
     * The KNX-IP interface will assign a bus-address when connection
     * If set, this option will be overwritten by the actual address
     */
  
    // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
    loglevel: 'info',
  
    // do not automatically connect, but use connection.Connect() to establish connection
    manualConnect: true,
    
    // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
    forceTunneling: false,
  
    // wait at least 20 millisec between each datagram
    minimumDelay: 20,
  
    // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
    suppress_ack_ldatareq: false,
  
    /**************************************/
    /* Things below are added by the fork */
    /**************************************/
  
    /*
     * Enable/disable auto reconnect when the connection failed
     * Default: true
     */
    autoReconnect: true,
  
    /*
     * Delay between auto reconnect attempts in milliseconds
     * Default: 2500
     */
    reconnectDelayMs: 3000,
  
    /*
     * How long to wait for acknowledge messages from the KNX-IP interface in milliseconds
     * (Acknowledge messages follow every message sent from/to the interface)
     * Default: 2000
     */
    receiveAckTimeout: 1500,
  
    /**************************************/
    /**************************************/
  
    // define your event handlers here:
    handlers: {
        // wait for connection establishment before sending anything!
        connected: function() {
            console.log('Hurray, I can talk KNX!');
            // WRITE an arbitrary boolean request to a DPT1 group address
            connection.write("1/0/0", 1);
            // you also WRITE to an explicit datapoint type, eg. DPT9.001 is temperature Celcius
            connection.write("2/1/0", 22.5, "DPT9.001");  
            // you can also issue a READ request and pass a callback to capture the response
            connection.read("1/0/1", (src, responsevalue) => { ... });
        },
    
        // get notified for all KNX events:
        event: function(evt, src, dest, value) {
            console.log("event: %s, src: %j, dest: %j, value: %j",
                evt, src, dest, value
            );
        },
    
        // get notified on connection errors
        error: function(connstatus) {
            console.log("**** ERROR: %j", connstatus);
        },

        /**************************************/
        /* Things below are added by the fork */
        /**************************************/
  
        /*
         * This callback will be called everytime a KNX message arrives
         * rawKnxMsg will be a buffer matching the original KNX message
         * rawMsgJson¹ will be a JSON object representing the KNX message
         *
         * It can be used for bus monitoring etc.
         *
         * ¹The structure of this JSON object will be described below
         * (See 'Write handcrafted KNX-Datagrams')
         *
         */
        rawMsgCb: function(rawKnxMsg, rawMsgJson) {
            console.log("RawMessage: %j", rawKnxMsg)
        },
    
        /*
         * This callback will be called if the connection failed
         */
        connFailCb: function() {
            console.log("Connection to the KNX-IP Interface failed!")
        },
    
        /*
         * This callback will be called when a unparsable message arrived
         * rawKnxNetMsg will be a buffer containing the raw KNXNet message
         */
        brokenMsgCb: function(rawKnxNetMsg) {
           console.log("A broken message arrived: %j", rawKnxNetMsg)
        },
    
        /*
         * This callback will be called if the KNX-IP Interface reported that it ran out of connections
         * The connection will be closed in this case, auto reconnect will be disabled in this case
         * The user can retry by calling connection.Connect() again
         */
        outOfConnectionsCb: function() {
            console.log("The KNX-IP Interface reached its connection limit!")
        }

        /*
         * This callback will be called when a timeout was reached while waiting for an acknowledge message
         * from the KNX-IP interface
         * Normally, the connection should remain in a working state
         * If not set by receiveAckTimeout (see above), the timeout defaults to 2000 milliseconds
         */
        waitAckTimeoutCb: function() {
            console.log("Timeout reached when waiting for acknowledge message")
        },
    
        /*
         * This callback will be called when a message couldn't be sent to the KNX-IP interface
         * err is a error object that comes directly from the socket.send() function
         */
        sendFailCb: function (err) {
            console.log("Error while sending a message: %j", err)
        },
    
        /*
         * This is a array of custom message handlers
         * See 'Custom Message Handlers' below 
         */
        customMsgHandlers: [
            {
                template: {
                    ctrl: {
                        hopCount: 6
                    },
                    dest_addr: "0.0.0"
                },
                callback: function (rawMsgJson) {
                    //console.log("Got a message with hopCount = 6 and dest_addr = 0.0.0")
                }
            }
        ]

        /**************************************/
        /**************************************/
    }
});
```

**Important**: connection.write() will only accept *raw APDU payloads* and a DPT.
This practically means that for *reading and writing to anything other than a binary
switch* (eg. for dimmer controls) you'll need to declare one or more *datapoints*.

### KNXNet Cemi structure (JSON)
* The 'cemi' structure is needed when working with `custom message handlers` and when trying to
send `handcrafted messages`.
* This structure will be referred to as `cemi`.
```
{
    /*
     * The message type code
     * Default: KnxConstants.MESSAGECODES["L_Data.req"] (0x11)
     */
    msgCode: KnxConstants.MESSAGECODES["L_Data.req"],
  
    /*
     * Control data of the KNX message
     */
    ctrl: {
        frameType: 1,       // The type of the frame
        repeat: 1,          // Repeat flag - 1:Interface will send again on error, 0:It won't
        broadcast: 1,       // Broadcast flag
        priority: 3,        // The priority of the message - 0: System, 1: High, 2: Alarm , 3: System
        acknowledge: 0,     // Acknowledge flag
        confirm: 0,         // Conifrm flag
        hopCount: 6,        // Maximal hop counter - setting it to 7 disables the counter!
        extendedFrame: 0,   // Extended frame flag - 0:Normal, 1:Extended
        destAddrType: 0     // Destination address flag - 0:Device address, 1:Group address
    },
  
    src_addr: 15.15.250     // Source device address
    dest_addr: 0.0.0        // Destination address (Depends on destAddrType: e.g.: 0.0.0 - 0/0/0)
  
    // apdu information
    apdu: {
        tpci: 0,                    // The tpci field - 6-Bit value
        apci: 'GroupValue_Write',   // Apci type
        data: Buffer([0]),          // Data buffer
        bitlength: 0,               // Bitlength of data - not needed
        tpciUcdType: 1,             // |*| TPCI UCD type - 0: connect, 1: disconnect - only neeeded for TPCI UCD messages
        tpciNcdType: 2,             // |*| TPCI NCD type - 2: ack, 3: not-ack - only needed for TPCI NCD messages
        
        /*
         * This field can be used to force data into the APCI field
         * It should only be used for unicast messages
         * Its role depends on the apci field |*|
         */
        inApciData: 0
    }
  }
```
**NOTE**: That not using the same data types as described above will probably lead to problems
**NOTE**: Field marked with `|*|` are only usable when sending messages, not when used for a `custom message handler` 
### Custom Message Handlers
**NOTE**: This feature was added by the fork
* A custom message handler consists of two parts:
```
    1) A cemi template
       This template will be compared message
       If it matches, the
    2) callback will be called   
       It should accept one argument, the message that matched the template
       The message will be stored as JSON object    
```
This enables the user to filter for KNX messages with specified criteria.
##### Such a handler can be registered in two ways:

* I: Add it to the connection configuration like above
* II: Use the `Connection.registerCustomMsgHandler(template, callback)` function.
    * It adds a new handler using `template` and `callback` to the `customMsgHandlers` array.
    * It will also initialize the array if it wasn't initialized before.
    * It will `return -1` if it fails.
        * This can be the case when one of the two arguments isn't defined.

**NOTE** that is is possible to register multiple handler with the same template.

##### It is also possible to delete registered handlers:

* `Connection.removeCustomMsgHandler(template)` should be used for this.
* It removes all handlers matching the template.
* It will `return -1` on error.
* The amount of handlers deleted can be checked by comparing the length of the `customMsgHandlers`
array before and after calling this function.
***


### Handcrafted KNX-Datagrams
**NOTE**: This feature was added by the fork
* Completely `handcrafted` messages can be sent using
`con.sendTunnRequest(sendTunnRequestArg, seqnum, callback)`. 
    * The `callback` argument will be passed to the library intern send function and will be called when errors occur during the send process.
    * `seqnum` should be `null`.
        * The library will use the correct sequence number automatically
    * `callback` will be called when sending is done
* This enables the ability for device programming etc.
* Here is a simple example message two switch on a light:

```
{
    msgCode: KnxConstants.MESSAGECODES['L_Data.req'],

    dest_addr: "0/1/0"

    apdu: {
        apci: 'GroupValue_Write',
        data: Buffer([0x1]),
        bitlength: 1
    }
}
```
#### For more information on this and also device programming, see  
### Declare datapoints based on their DPT

Datapoints correlate an *endpoint* (identifed by a group address such as '1/2/3')
with a *DPT* (DataPoint Type), so that *serialization* of values to and from KNX
works correctly (eg. temperatures as 16bit floats), and values are being translated
to Javascript objects and back.

```js
// declare a simple binary control datapoint
var binary_control = new knx.Datapoint({ga: '1/0/1', dpt: 'DPT1.001'});
// bind it to the active connection
binary_control.bind(connection);
// write a new value to the bus
binary_control.write(true); // or false!
// send a read request, and fire the callback upon response
binary_control.read( function (response) {
    console.log("KNX response: %j", response);
  };
// or declare a dimmer control
var dimmer_control = new knx.Datapoint({ga: '1/2/33', dpt: 'DPT3.007'});
// declare a binary STATUS datapoint, which will automatically read off its value
var binary_status = new knx.Datapoint({ga: '1/0/1', dpt: 'DPT1.001', autoread: true});
```

Datapoints need to be bound to a connection. This can be done either at their
creation, *or* using their `bind()` call. Its important to highlight that before
you start defining datapoints (and devices as we'll see later), your code
*needs to ensure that the connection has been established*, usually by declaring them in the 'connected' handler:

```js
var connection = knx.Connection({
  handlers: {
    connected: function() {
      console.log('----------');
      console.log('Connected!');
      console.log('----------');
      var dp = new knx.Datapoint({ga: '1/1/1'}, connection);
      // Now send off a couple of requests:
      dp.read((src, value) => {
        console.log("**** RESPONSE %j reports current value: %j", src, value);
      });
      dp.write(1);
    }
  }
});
```

### Declare your devices

You can define a device (basically a set of GA's that are related to a
physical KNX device eg. a binary switch) so that you have higher level of control:

```js
var light = new knx.Devices.BinarySwitch({ga: '1/1/8', status_ga: '1/1/108'}, connection);
console.log("The current light status is %j", light.status.current_value);
light.control.on('change', function(oldvalue, newvalue) {
  console.log("**** LIGHT control changed from: %j to: %j", oldvalue, newvalue);
});
light.status.on('change', function(oldvalue, newvalue) {
  console.log("**** LIGHT status changed from: %j to: %j", oldvalue, newvalue);
});
light.switchOn(); // or switchOff();
```

This effectively creates a pair of datapoints typically associated with a binary
switch, one for controlling it and another for getting a status feedback (eg via
manual operation)

### Write raw buffers

If you encode the values by yourself, you can write raw buffers with `writeRaw(groupaddress: string, buffer: Buffer, bitlength?: Number, callback?: () => void)`.

The third (optional) parameter `bitlength` is necessary for datapoint types
where the bitlength does not equal the buffers bytelength * 8.
This is the case for dpt 1 (bitlength 1), 2 (bitlength 2) and 3 (bitlength 4).
For other dpts the paramter can be omitted.

```js
// Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
connection.writeRaw('1/0/0', Buffer.from('01', 'hex'), 1)
// Write raw buffer to a groupaddress with dpt 9 (e.g temperature 18.4 °C = Buffer<0730>) without bitlength
connection.writeRaw('1/0/0', Buffer.from('0730', 'hex'))
```
