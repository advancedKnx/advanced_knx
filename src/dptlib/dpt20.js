/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const log = require('log-driver').logger

//
// DPT20: 1-byte HVAC
//
// FIXME: help needed
exports.formatAPDU = function (value) {
  let apduData = Buffer.alloc(1)
  apduData[0] = value
  log.debug('./knx/src/dpt20.js : input value = ' + value + '   apdu_data = ' + apduData)
  return apduData
}

exports.fromBuffer = function (buf) {
  if (buf.length !== 1) throw Error('Buffer should be 1 bytes long')
  let ret = buf.readUInt8(0)
  log.debug('               dpt20.js   fromBuffer : ' + ret)
  return ret
}

exports.basetype = {
  'bitlength': 8,
  'range': [],
  'valuetype': 'basic',
  'desc': '1-byte'
}

exports.subtypes = {
  // 20.102 HVAC mode
  '102': {
    'name': 'HVAC_Mode',
    'desc': '',
    'unit': '',
    'scalar_range': [],
    'range': []
  }
}
