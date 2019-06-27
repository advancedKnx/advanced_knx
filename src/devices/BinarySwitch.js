/**
* knx.js - a pure Javascript library for KNX
* (C) 2016 Elias Karakoulakis
*/

const knx = require('../index')

function BinarySwitch (options, conn) {
  if (options == null || options.ga == null) {
    throw Error('must supply at least { ga }!')
  }
  this.control_ga = options.ga
  this.status_ga = options.status_ga
  if (conn) this.bind(conn)
  this.log = knx.Log.get()
}

BinarySwitch.prototype.bind = function (conn) {
  if (!conn) this.log.warn('must supply a valid KNX connection to bind to')
  this.conn = conn
  this.control = new knx.Datapoint({ ga: this.control_ga }, conn)
  if (this.status_ga) {
    this.status = new knx.Datapoint({ ga: this.status_ga }, conn)
  }
}

// EventEmitter proxy for status ga (if its set), otherwise proxy control ga
BinarySwitch.prototype.on = function () {
  let argsArray = Array.prototype.slice.call(arguments)
  let tgt = (this.status_ga ? this.status : this.control)
  try {
    tgt.on.apply(tgt, argsArray)
  } catch (err) {
    this.log.error(err)
  }
}

BinarySwitch.prototype.switchOn = function () {
  if (!this.conn) this.log.warn('must supply a valid KNX connection to bind to')
  this.control.write(1)
}

BinarySwitch.prototype.switchOff = function () {
  if (!this.conn) this.log.warn('must supply a valid KNX connection to bind to')
  this.control.write(0)
}

BinarySwitch.prototype.write = function (v) {
  if (!this.conn) this.log.warn('must supply a valid KNX connection to bind to')
  this.control.write(v)
}

module.exports = BinarySwitch
