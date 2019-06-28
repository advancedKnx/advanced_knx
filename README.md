## ATTENTION: THIS VERSION OF ADVANCED_KNX HAS NO DOCUMENTATION
* Please note that this is NOT the original knx.js repository!
* It is a fork for another project adding some features like the base for an BusMonitor
  or the ability to send self constructed messages. (...)
* The original knx repository can be found at: https://bitbucket.org/ekarak/knx.js

## KNXnet/IP for Node.JS

A feature-complete [KNXnet/IP protocol stack](https://www.knx.org/en-us/knx/technology/developing/devices/ip-devices/index.php) in pure Javascript, capable of talking multicast (routing) and unicast (tunneling). Adding KNX to your Node.JS applications is now finally easy as pie.

* Wide DPT (datapoint type) support (DPT1 - DPT20 supported)
* Extensible Device support (binary lights, dimmers, ...)
* If you got an IP router and a network that supports IP multicast, you can start talking to KNX within seconds!

## Installation

Make sure your machine has Node.JS (version 4.x or greater, and supports ECMA Script 6) and do:

`npm install advanced_knx`

## Baisc Usage

Here is a quick example showing how to set up a KNXNet connection.
This should be used for **TESTING** only.

```js
import Knx from '../advanced_knx' // Import the KNX module

const connection = Knx.Connection({
  ipAddr: '192.168.1.102', // The IP-Address of the KNX-IP interface
  ipPort: 3671, // The port the KNX-IP is listening on
  interface: 'enp0s8', // Local network interface to use for the connection (optional)
  logLevel: 'info', // Sets which information to print
  manualConnect: true, // If set to true, connection.Connect() has to be called - will be done automatically otherwise
  minimumDelay: 80, // Minimum time to pass between sending messages in milliseconds (Default: 0)
  debug: false, // Enables/Disables debugging output (Default: false)
  autoReconnect: true, // Enables/Disables automatic reconnecting (Default: true)
  reconnectDelayMs: 2500,
  receiveAckTimeout: 1000,
  handlers: {
    // This is going to be called when the connection was established
    connected: function() {
      console.log('Connected!')
    },
    
    // This is going to be called on every incoming messages (if it is relevant)
    event: function (knxEvt, knxSrc, knxDest, knxValue) {
      console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
        new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), knxEvt, knxSrc, knxDest, knxValue)
    },
    
    // This is going to be called on general errors
    error: function (stat) {
      console.log('err: %j', stat)
    },
    
    // This will be called on every incoming message
    rawMsgCb: function (rawKnxMsg, rawMsgJson) {
      console.log('The KNXNet message (JSON): %j', rawMsgJson)
      console.log('The KNX message (RAW): %j', rawKnxMsg)
    },

    // This will be called when the connection to the KNX interface failed
    connFailCb: function () {
      console.log('[Cool callback function] Connection to the KNX-IP Interface failed!')
    },

    // This will be called when the connection to the KNX interface failed because it ran out of connections
    outOfConnectionsCb: function () {
      console.log('[Even cooler callback function] The KNX-IP Interface reached its connection limit!')
    },

    // This will be called when the KNX interface failed to acknowledge a message in time
    waitAckTimeoutCb: function () {
      console.log('[Wait Acknowledge Timeout Callback] Timeout reached when waiting for acknowledge message')
    },

    // This will be called when sending of a message failed
    sendFailCb: function (err) {
      console.log('[Send Fail Callback] Error while sending a message: %j', err)
    },
    
    // This is a array of custom handlers, read below (See "Custom Message Handlers")
    customMsgHandlers: [
      {
        template: {
          cemi: {
            ctrl: {
              hopCount: 6
            },
            src_addr: '1.1.3'
          }
        },
        callback: function (rawMsgJson) {
          console.log('[MSG] Got a message with hopCount = 6 and src_addr = 1.1.3')
          console.log('Message that triggered this handler: %j', rawMsgJson)
        }
      }
    ]
  }
})
```

## Development documentation

- [Basic API usage](../master/README-API.md)
- [List of supported datapoints](../master/README-datapoints.md)
- [List of supported events](../master/README-events.md)
- [eibd/knxd compatibility](../master/README-knxd.md)
- [On resilience](../master/README-resilience.md)
