/*************************************************
 * This file contains some error definitions for *
 *                    RawMod.js                  *
 *************************************************/

const ErrorMessages = {
  UNKNWON_ERROR: 'Unknown error!',
  UNDEF_ARGS: 'There are undefined arguments!',
  INVALID_ARGTYPES: 'Some arguments have an invalid type!',
  INVALID_ARGVAL: 'Some arguments have have an invalid value!',
  INVALID_DATALEN: 'The data argument has an invalid length!',
  INVALID_READLEN: 'The length argument is invalid!',
  INVALID_TARGET: 'The target KNX address is invalid!',
  INVALID_SOURCE: 'The source KNX address is invalid!',
  INVALID_NEWADDR: 'The new address is invalid!',
  TARGET_NOTACK: 'The target actively didn\'t acknowledge the request!',
  TIMEOUT_REACHED: 'The target failed to respond!',
  INVALID_NEWADDRESS: 'The new KNX address is invalid!'
}

const RawModErrors = {
  UNKNWON_ERROR: {
    errorID: (0x1 << 16), // 65536
    errorMsg: ErrorMessages.UNKNWON_ERROR
  },
  UNDEF_ARGS: {
    errorID: 0x1 + (0x1 << 16), // 65537
    errorMsg: ErrorMessages.UNDEF_ARGS
  },
  INVALID_ARGTYPES: {
    errorID: 0x2 + (0x1 << 16), // 65538
    errorMsg: ErrorMessages.INVALID_ARGTYPES
  },
  INVALID_ARGVAL: {
    errorID: 0x3 + (0x1 << 16), // 65539
    errorMsg: ErrorMessages.INVALID_ARGVAL
  },
  INVALID_DATALEN: {
    errorID: 0x3 + (0x1 << 16), // 65540
    errorMsg: ErrorMessages.INVALID_DATALEN
  },
  INVALID_TARGET: {
    errorID: 0x5 + (0x1 << 16), // 65541
    errorMsg: ErrorMessages.INVALID_TARGET
  },
  INVALID_SOURCE: {
    errorID: 0x6 + (0x1 << 16), // 65542
    errorMsg: ErrorMessages.INVALID_SOURCE
  },
  INVALID_READLEN: {
    errorID: 0x7 + (0x1 << 16), // 65543
    errorMsg: ErrorMessages.INVALID_READLEN
  },
  INVALID_NEWADDRESS: {
    errorID: 0x8 + (0x1 << 16), // 65544
    errorMsg: ErrorMessages.INVALID_NEWADDRESS
  },
  TARGET_NOTACK: {
    errorID: 0x9 + (0x1 << 16), // 65545
    errorMsg: ErrorMessages.TARGET_NOTACK
  },
  TIMEOUT_REACHED: {
    errorID: 0xa + (0x1 << 16), // 65546
    errorMsg: ErrorMessages.TIMEOUT_REACHED
  }
}

export default RawModErrors
