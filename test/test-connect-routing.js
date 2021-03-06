/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

Error.stackTraceLimit = Infinity

const knx = require('../src/index')
const test = require('tape')

test('KNX connect routing', function (t) {
  knx.Connection({
    loglevel: 'trace',
    ipAddr: '224.0.23.12',
    ipPort: 3671,
    handlers: {
      connected: function () {
        console.log('----------')
        console.log('Connected!')
        console.log('----------')
        t.pass('connected in routing mode')
        t.end()
        process.exit(0)
      },
      error: function () {
        t.fail('error connecting')
        t.end()
        process.exit(1)
      }
    }
  })
})

setTimeout(function () {
  console.log('Exiting with timeout...')
  process.exit(2)
}, 4000)
