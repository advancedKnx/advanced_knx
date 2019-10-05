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
