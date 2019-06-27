/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const log = require('log-driver').logger

// TODO: implement fromBuffer, formatAPDU

//
// DPT19: 8-byte Date and Time
//

exports.formatAPDU = function (value) {
  if (typeof value !== 'object' || value.constructor.name !== 'Date') {
    log.error('DPT19: Must supply a Date object')
  } else {
    // Sunday is 0 in Javascript, but 7 in KNX.
    let day = (value.getDay() === 0) ? 7 : value.getDay()
    let apduData = Buffer.alloc(8)
    apduData[0] = value.getFullYear() - 1900
    apduData[1] = value.getMonth() + 1
    apduData[2] = value.getDate()
    apduData[3] = (day << 5) + value.getHours()
    apduData[4] = value.getMinutes()
    apduData[5] = value.getSeconds()
    apduData[6] = 0
    apduData[7] = 0
    return apduData
  }
}

exports.fromBuffer = function (buf) {
  if (buf.length !== 8) log.warn('DPT19: Buffer should be 8 bytes long')
  else {
    var d = new Date(buf[0] + 1900, buf[1] - 1, buf[2], buf[3] & 0b00011111, buf[4], buf[5])
    return d
  }
}

exports.basetype = {
  'bitlength': 64,
  'valuetype': 'composite',
  'desc': '8-byte Date+Time'
}

exports.subtypes = {
  // 19.001
  '001': {
    'name': 'DPT_DateTime', 'desc': 'datetime'
  }
}
