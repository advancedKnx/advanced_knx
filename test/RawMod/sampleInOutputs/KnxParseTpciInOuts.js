import _RawMod from '../../../src/RawMod/RawMod'

/**********************************************************************************************************
 * This file contains example messages needed to test the RawMod.KnxNetProtocolExtra.parseTpci() function *
 **********************************************************************************************************/

const RawMod = new _RawMod()

/*
 * Following are some sample in- and outputs for the RawMod.KnxNetProtocolExtra.parseTpci() function
 */
const exampleParseTpciInOut = [
  {
    inputs: [null],
    expected: null
  },
  {
    inputs: [[null]],
    expected: null
  },
  {
    inputs: [Buffer.from([null])],
    expected: 'UDP_APCI' // Because Buffer.from([null]) is eq. to Buffer.from([0])
  },
  {
    inputs: [RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_UDP],
    expected: 'UDP_APCI'
  },
  {
    inputs: [[RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_UDP]],
    expected: 'UDP_APCI'
  },
  {
    inputs: [Buffer.from([RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_UDP])],
    expected: 'UDP_APCI'
  },
  {
    inputs: [RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_NCD | 0b1010 << 2 | RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_SUBTYPES.TPCI_NCD_ACK],
    expected: 'NCD_ACK Seqnum: 10'
  },
  {
    inputs: [RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_UCD | RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_SUBTYPES.TPCI_UCD_DCON],
    expected: 'UCD_DCON'
  },
  {
    inputs: [RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_NDP | 0b0101 << 2],
    expected: 'NDP_APCI Seqnum: 5'
  },
  {
    inputs: [RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_UCD | RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_SUBTYPES.TPCI_NCD_ACK],
    expected: 'UCD_UNKNOWN'
  },
  {
    inputs: [RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_TYPES.TPCI_NCD | 0b1100 << 2 | RawMod.KNX_KNXNET_CONSTANTS.KNX_TPCI_SUBTYPES.TPCI_UCD_DCON],
    expected: 'NCD_UNKNOWN Seqnum: 12'
  }
]

export default exampleParseTpciInOut
