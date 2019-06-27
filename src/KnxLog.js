/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
const util = require('util')
let logger

/*
 * Logger-Level importance levels:
 *  trace < info < warn < error
 */

const determineLogLevel = options => {
  let level

  if (options) {
    if (options.logLevel) {
      level = options.logLevel
    } else {
      options.debug ? level = 'debug' : level = 'info'
    }
  } else {
    level = 'info'
  }

  return level
}

module.exports = {
  get: function (options) {
    if (!logger) {
      // console.trace('new logger, level='+lvl);
      logger = require('log-driver')({
        level: determineLogLevel(options),
        format: function () {
          // arguments[0] is the log level ie 'debug'
          const a = Array.from(arguments)
          const ts = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '')

          if (a.length > 2) {
            // if more than one item to log, assume a fmt string is given
            const fmtargs = ['[%s] %s ' + a[1], a[0], ts].concat(a.slice(2))
            return util.format.apply(util, fmtargs)
          } else {
            // arguments[1] is a plain string
            return util.format('[%s] %s %s', a[0], ts, a[1])
          }
        }
      })
    }
    return (logger)
  }
}
