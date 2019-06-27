/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2017 Elias Karakoulakis
*/

import RawMod from './RawMod/RawMod'
import Connection from './Connection'
import Datapoint from './Datapoint'

const fs = require('fs')
const path = require('path')
const util = require('util')
const log = require('log-driver').logger

const knxPath = path.join(__dirname, '../package.json')
const pkginfo = JSON.parse(fs.readFileSync(knxPath).toString())

log.info(util.format('Loading %s, version: %s',
  pkginfo.name, pkginfo.version))

exports.Connection = Connection
exports.Datapoint = Datapoint // require('./Datapoint.js')
exports.Devices = require('./devices')
exports.Log = require('./KnxLog.js')
exports.RawMod = new RawMod()

export default exports
