/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const address = require('../src/Address.js')
const test = require('tape')
const KnxConstants = require('../src/KnxConstants')

//
test('KNX physical address test', function (t) {
  var tests = {
    '0.0.0': new Buffer([0, 0]),
    '0.0.10': new Buffer([0, 10]),
    '0.0.255': new Buffer([0, 255]),
    '0.1.0': new Buffer([1, 0]),
    '1.0.0': new Buffer([16, 0]),
    '15.14.0': new Buffer([254, 0]),
    '15.15.0': new Buffer([255, 0])
  }
  Object.keys(tests).forEach((key, idx) => {
    var buf = tests[key]
    var encoded = address.parse(key, KnxConstants.KNX_ADDR_TYPES.DEVICE)
    t.ok(Buffer.compare(encoded, buf) == 0, `Marshaled KNX physical address ${key}: encoded=${encoded.toString()} buf=${buf.toString()}`)
    var decoded = address.toString(encoded, KnxConstants.KNX_ADDR_TYPES.DEVICE)
    t.ok(decoded == key, `${key}: unmarshaled KNX physical address`)
  })
  // test invalid physical addresses
  var invalid = ['0.0.', '0.0.256', '123122312312312', '16.0.0', '15.17.13']
  for (var i in invalid) {
    var key = invalid[i]
    t.throws(() => {
      address.parse(key)
    }, null, `invalid KNX physical address ${key}`)
  }
  t.end()
})

//
test('KNX group address test', function (t) {
  var tests = {
    '0/0/0': new Buffer([0, 0]),
    '0/0/10': new Buffer([0, 10]),
    '0/0/255': new Buffer([0, 255]),
    '0/1/0': new Buffer([1, 0]),
    '1/0/0': new Buffer([8, 0]),
    '1/7/0': new Buffer([15, 0]),
    '31/6/0': new Buffer([254, 0]),
    '31/7/0': new Buffer([255, 0])
  }
  Object.keys(tests).forEach((key, idx) => {
    var buf = tests[key]
    var encoded = address.parse(key, KnxConstants.KNX_ADDR_TYPES.GROUP)
    t.ok(Buffer.compare(encoded, buf) == 0, `Marshaled KNX group address ${key}: encoded=${encoded.toString('hex')} buf=${buf.toString('hex')}`)
    var decoded = address.toString(encoded, KnxConstants.KNX_ADDR_TYPES.GROUP)
    t.ok(decoded == key, `${key}: unmarshaled KNX group address`)
  })

  var invalid = ['0/0/', '0/0/256', '123122312312312', '16/0/0', '15/17/13']
  for (var i in invalid) {
    var key = invalid[i]
    t.throws(() => {
      address.parse(key)
    }, null, `invalid KNX group address ${key}`)
  }
  t.end()
})
