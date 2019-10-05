# Connection setup
- This file contains information about how a KNXNet connection can be set up and about the used parameters
- First, the `advanced_knx` module has to be imported
    ```js
    knx = require('advanced_knx')
    ``` 
- Then, the connection object has to be initialised
    ```js
    knxCon = knx.Connection({...})
    ```
    - The argument for the `Connection` function is explained below - `Connection Config`
- If `manualConnect` is set to `true`, the connection has to be started manually
    ```js
    ret = knxCon.Connect()
    ```
    - Success can be checked like this (`ret` is only needed for this)
        ```js   
        if (ret && ret.constructor === Error) {
          console.log(ret)
        }
        ```
- To check if the connection is established, this may be used
    ```js
    if (knxCon.isConnected) {
      console.log('Connected ...')
    }
    ```
- The connection can be closed like this
    ```js
    knxCon.Disconnect()
    ```
# Connection Config
- The `Connection` takes a JSON object as config
    ```js
    connectionConfig = {
        ipAddr: '127.0.0.1',
        ipPort: 3671,
        interface: 'eth0',
        loglevel: 'info',
        manualConnect: true,
        forceTunneling: false,
        minimumDelay: 20,
        suppress_ack_ldatareq: false,
        autoReconnect: true,
        reconnectDelayMs: 3000,
        receiveAckTimeout: 1500,
        handlers: {
            connected: function() {},
            event: function(evt, src, dest, value) {},
            error: function(connstatus) {},
            rawMsgCb: function(rawKnxMsg, rawMsgJson) {},
            connFailCb: function() {},
            outOfConnectionsCb: function() {},
            waitAckTimeoutCb: function() {},
            sendFailCb: function (err) {},
            customMsgHandlers: []
        }
    }
    ```
# `ipAddr`
- is the IP address of the KNX-IP interface to connect to. Examples
    ```
    '192.168.1.123', '10.6.12.9', ...
    ```
# `ipPort`
- is the IP port the KNX-IP listens on for new connections. Examples
    ```
    3671 // the port normally used
    2000, 1234, ...
    ```
# `interface`
- the network interface to be used - automatic when not set. Examples
    ```
    'eth0', 'enp0s8', 'wlan0', undefined
    ```
# `loglevel`
- the level passed to the logger. Possible values
    ```
    'error',
    'warn',
    'info', // default
    'debug',
    'trace'
    ```
# `manualConnect`
- enables/disables auto-connect. Possible values
    ```
    true, // auto-connect off - manual connect via knxCon.Connect()
    false // auto-connect on - connection will be established directly
    ```
# `forceTunneling`
- TODO - not documented (here) yet
# `minimumDelay`
- the minimal amount of milliseconds between sending two messages. Examples
    ```
    0, // effectively disables this option
    20, 100, 30, ...
    ```
# `suppress_ack_ldatareq`
- TODO - not documented (here) yet
# `autoReconnect`
- enabled/disables auto-reconnect after connection loss. Possible values
    ```
    true, // automatically reconnect after connection loss
    false // reconnecting has to be done manually
    ```
# `reconnectDelayMs`
- will be ignored if `autoReconnect` is not set to `true`
- how long to wait between automatic reconnect attempts in milliseconds
    ```
    2000, 3000, ...
    ```
# `receiveAckTimeout`
- how long to wait for the KNX-IP interface to acknowledge a message in milliseconds
- if the timeout is exceeded, the connection will be declared lost
    ```
    1000, 2000, ...
    ```
# `handlers`
- handlers - functions - for possible events
  ### `connected`
  - will be called every time the connection is established
  - this can happen multiple times due to reconnects
      ```
      connected: function () {/* code */}
      ```
  ### `event` 
  - will be called on every message on the KNX bus
      ```
      event: function (knxEvt, knxSrc, knxDest, knxValue) {/* do something with the arguments */}
      ```
      - `knxEvt` - the name of the event (`String`)
      - `knxSrc` - source/sender address (`String`)
      - `knxDest` - destination/receiver address (`String`)
      - `knxValue` - data sent with the message (`Buffer`/non-fixed)
  ### `error`
  - will be called on general connection errors
    ```
    error: function (connstatus) {/* do something with connstatus */}
    ```
    - `connstatus` - the status of the connection
  ### `rawMsgCb`
  - will be called on every message on the KNX bus
    ```
    rawMsgCb: function (rawKnxMsg, rawMsgJson) {}
    ```
    - `rawKnxMsg` - The raw message taken from the bus (`Buffer`)
        - this data is actually calculated from the message received from the KNX-IP interface which slightly modifies the KNX message/stores it in another format
        - the raw message will have the correct format according to official KNX specifications
    - `rawMsgJson` - The raw message represented as Json (`JsonObject`)
        - the format of the JsonObject is described in another README file - not here
  ### `connFailCb`
  - will be called when the connection to the KNX-IP interface failed
    ```
    connFailCb: function () {/* code */}
    ```
  ### `outOfConnectionsCb`
  - will be called when the KNX interface ran out of connections
    ```
    outOfConnectionsCb: function () {/* code */}
    ```
  ### `waitAckTimeoutCb`
  - will be called when `receiveAckTimeout` was exceeded while waiting for an acknowledge from the KNX-IP interface
    ```
    waitAckTimeoutCb: function () {/* code */}
    ```
  ### `sendFailCb`
  - will be called when sending a message failed
    ```
    sendFailCb: function (err) {/* do something with err */}
    ```
    - `err` - an error message
  ### `customMsgHandlers`
  - handlers that will be called on specific messages, see the specific README