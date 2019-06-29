/*************************************************
 * This file contains some error definitions for *
 *                    RawMod.js                  *
 *************************************************/

const ErrorMessages = {
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
  // Errors for KnxWriteDevMem.writeDevMem()
  ERR_WriteDevMem: {
    UNDEF_ARGS: {
      errorID: 0x1 + (0x1 << 16), // 65537
      errorMsg: ErrorMessages.UNDEF_ARGS
    },
    INVALID_ARGTYPES: {
      errorID: 0x2 + (0x1 << 16), // 65538
      errorMsg: ErrorMessages.INVALID_ARGTYPES
    },
    INVALID_DATALEN: {
      errorID: 0x3 + (0x1 << 16), // 65539
      errorMsg: ErrorMessages.INVALID_DATALEN
    },
    TARGET_NOTACK: {
      errorID: 0x4 + (0x1 << 16), // 65540
      errorMsg: ErrorMessages.TARGET_NOTACK
    },
    TIMEOUT_REACHED: {
      errorID: 0x5 + (0x1 << 16), // 65541
      errorMsg: ErrorMessages.TIMEOUT_REACHED
    },
    INVALID_TARGET: {
      errorID: 0x6 + (0x1 << 16), // 65542
      errorMsg: ErrorMessages.INVALID_TARGET
    },
    INVALID_SOURCE: {
      errorID: 0x7 + (0x1 << 16), // 65543
      errorMsg: ErrorMessages.INVALID_SOURCE
    }
  },

  // Errors for KnxReadDevMem.readDevMem()
  ERR_ReadDevMem: {
    UNDEF_ARGS: {
      errorID: 0x10 + (0x1 << 16), // 65552
      errorMsg: ErrorMessages.UNDEF_ARGS
    },
    INVALID_ARGTYPES: {
      errorID: 0x11 + (0x1 << 16), // 65553
      errorMsg: ErrorMessages.INVALID_ARGTYPES
    },
    INVALID_READLEN: {
      errorID: 0x12 + (0x1 << 16), // 65554
      errorMsg: ErrorMessages.INVALID_READLEN
    },
    TIMEOUT_REACHED: {
      errorID: 0x13 + (0x1 << 16), // 65555
      errorMsg: ErrorMessages.TIMEOUT_REACHED
    },
    INVALID_TARGET: {
      errorID: 0x14 + (0x1 << 16), // 65542
      errorMsg: ErrorMessages.INVALID_TARGET
    },
    INVALID_SOURCE: {
      errorID: 0x15 + (0x1 << 16), // 65543
      errorMsg: ErrorMessages.INVALID_SOURCE
    }
  },

  // Errors for KnxGetDeviceAddress.getDeviceAddress()
  ERR_ReadPhysicalAddress: {
    UNDEF_ARGS: {
      errorID: 0x20 + (0x1 << 16), // 65568
      errorMsg: ErrorMessages.UNDEF_ARGS
    },
    INVALID_ARGTYPES: {
      errorID: 0x21 + (0x1 << 16), // 65569
      errorMsg: ErrorMessages.INVALID_ARGTYPES
    },
    TIMEOUT_REACHED: {
      errorID: 0x22 + (0x1 << 16), // 65570
      errorMsg: ErrorMessages.TIMEOUT_REACHED
    }
  },

  // Errors for KnxSetDeviceAddress.setDeviceAddress()
  ERR_WritePhysicalAddress: {
    UNDEF_ARGS: {
      errorID: 0x30 + (0x1 << 16), // 65584
      errorMsg: ErrorMessages.UNDEF_ARGS
    },
    INVALID_ARGTYPES: {
      errorID: 0x31 + (0x1 << 16), // 65585
      errorMsg: ErrorMessages.INVALID_ARGTYPES
    },
    INVALID_NEWADDRESS: {
      errorID: 0x32 + (0x1 << 16), // 65586
      errorMsg: ErrorMessages.INVALID_NEWADDRESS
    }
  },

  // Errors for KnxReadPropertyValue.readPropertyValue()
  ERR_ReadPropertyValue: {
    UNDEF_ARGS: {
      errorID: 0x40 + (0x1 << 16), // 65600
      errorMsg: ErrorMessages.UNDEF_ARGS
    },
    INVALID_ARGTYPES: {
      errorID: 0x41 + (0x1 << 16), // 65601
      errorMsg: ErrorMessages.INVALID_ARGTYPES
    },
    TIMEOUT_REACHED: {
      errorID: 0x42 + (0x1 << 16), // 65602
      errorMsg: ErrorMessages.TIMEOUT_REACHED
    },
    INVALID_ARGVAL: {
      errorID: 0x43 + (0x1 << 16), // 65603
      errorMsg: ErrorMessages.INVALID_ARGVAL
    },
    INVALID_TARGET: {
      errorID: 0x44 + (0x1 << 16), // 65604
      errorMsg: ErrorMessages.INVALID_TARGET
    },
    INVALID_SOURCE: {
      errorID: 0x45 + (0x1 << 16), // 65605
      errorMsg: ErrorMessages.INVALID_SOURCE
    }
  },

  // Errors for KnxWritePropertyValue.writePropertyValue()
  ERR_WritePropertyValue: {
    UNDEF_ARGS: {
      errorID: 0x50 + (0x1 << 16), // 65616
      errorMsg: ErrorMessages.UNDEF_ARGS
    },
    INVALID_ARGTYPES: {
      errorID: 0x51 + (0x1 << 16), // 65617
      errorMsg: ErrorMessages.INVALID_ARGTYPES
    },
    INVALID_DATALEN: {
      errorID: 0x52 + (0x1 << 16), // 65618
      errorMsg: ErrorMessages.INVALID_DATALEN
    },
    TARGET_NOTACK: {
      errorID: 0x53 + (0x1 << 16), // 65619
      errorMsg: ErrorMessages.TARGET_NOTACK
    },
    TIMEOUT_REACHED: {
      errorID: 0x54 + (0x1 << 16), // 65620
      errorMsg: ErrorMessages.TIMEOUT_REACHED
    },
    INVALID_TARGET: {
      errorID: 0x55 + (0x1 << 16), // 65621
      errorMsg: ErrorMessages.INVALID_TARGET
    },
    INVALID_SOURCE: {
      errorID: 0x56 + (0x1 << 16), // 65622
      errorMsg: ErrorMessages.INVALID_SOURCE
    }
  }
}

export default RawModErrors
