/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const log = require('log-driver').logger

//
// DPT10.*: time (3 bytes)
//
const util = require('util')
let timeRegexp = /(\d{1,2}):(\d{1,2}):(\d{1,2})/

// DPTFrame to parse a DPT10 frame.
// Always 8-bit aligned.

exports.formatAPDU = function (value) {
  let apduData = Buffer.alloc(3)
  switch (typeof value) {
    case 'string':
      // try to parse
      let match = timeRegexp.exec(value)
      if (match) {
        apduData[0] = parseInt(match[1])
        apduData[1] = parseInt(match[2])
        apduData[2] = parseInt(match[3])
      } else {
        log.warn('DPT10: invalid time format (%s)', value)
      }
      break
    case 'object':
      if (value.constructor.name !== 'Date') {
        log.warn('Must supply a Date or String for DPT10 time')
        break
      }
    // eslint-disable-next-line no-fallthrough
    case 'number':
      value = new Date(value)
    // eslint-disable-next-line no-fallthrough
    default:
      apduData[0] = value.getHours()
      apduData[1] = value.getMinutes()
      apduData[2] = value.getSeconds()
  }
  return apduData
}

// Javascript contains no notion of "time of day", hence this function
// returns a string representation of the time. Beware, no timezone!
exports.fromBuffer = function (buf) {
  if (buf.length !== 3) log.warn('DPT10: Buffer should be 3 bytes long')
  else {
    let d = new Date()
    // FIXME: no ability to setDay() without week context
    let hours = buf[0] & 0b00011111
    let minutes = buf[1]
    let seconds = buf[2]
    if (hours >= 0 && hours <= 23 &&
      minutes >= 0 && minutes <= 59 &&
      seconds >= 0 && seconds <= 59) {
      return util.format('%d:%d:%d', hours, minutes, seconds)
    } else {
      log.warn(
        'DPT10: buffer %j (decoded as %d:%d:%d) is not a valid time',
        buf, hours, minutes, seconds)
    }
    return d
  }
}

// DPT10 base type info
exports.basetype = {
  'bitlength': 24,
  'valuetype': 'composite',
  'desc': 'day of week + time of day'
}

// DPT10 subtypes info
exports.subtypes = {
  // 10.001 time of day
  '001': {
    'name': 'DPT_TimeOfDay', 'desc': 'time of day'
  }
}
