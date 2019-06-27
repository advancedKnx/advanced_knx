import _RawMod from '../../../src/RawMod/RawMod'

const RawMod = new _RawMod()

/*
 * Following is a array of example KnxNet message, stored as buffers ('inputRaw')
 * The RawMod.rebuildMessageBytes() function should return 'expectedOutput', which is the Knx message how it is sent
 * over the bus. The last byte of 'expectedOutput' is the checksum of all the other bytes. NOT(XOR(BYTE[0]...BYTE[N]))
 */
const exampleMessages = [
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x04, 0x20, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x04, // tunnstate.header_length [KnxNet]
      0x00, 0x00, 0x00, // tunstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      RawMod.KNX_KNXNET_CONSTANTS.KNX_MSG_TYPES.MSG_NORMAL, // control byte [Knx]
      0xe0, // higher four bits from npci + ext ctrl bits [Knx]
      0x11, 0x01, // source address (1.1.1) [Knx]
      0x12, 0x03, // dest. address (1.2.3) [Knx]
      0x01, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    expected: Buffer.from([0x90, 0x11, 0x01, 0x12, 0x03, 0xe1, 0x00, 0x00, 0x8f])
  },
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x04, 0x20, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x04, // tunnstate.header_length [KnxNet]
      0x00, 0xff, 0x00, // tunnstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x03, // addinfo_length [KnxNet]
      0x00, 0x00, 0x00, // addinfo data [KnxNet]
      RawMod.KNX_KNXNET_CONSTANTS.KNX_MSG_TYPES.MSG_NORMAL, // control byte [Knx]
      0xe0, // higher four bits from npci + ext ctrl bits [Knx]
      0x11, 0x01, // source address (1.1.1) [Knx]
      0x12, 0x03, // dest. address (1.2.3) [Knx]
      0x01, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    // the last byte is the checksum
    expected: Buffer.from([0x90, 0x11, 0x01, 0x12, 0x03, 0xe1, 0x00, 0x00, 0x8f])
  },
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x04, 0x20, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x04, // tunnstate.header_length [KnxNet]
      0x00, 0x10, 0x00, // tunnstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      RawMod.KNX_KNXNET_CONSTANTS.KNX_MSG_TYPES.MSG_EXTENDED, // control byte [Knx]
      0xe3, // higher four bits from npci + ext ctrl bits [Knx]
      0x11, 0x01, // source address (1.1.1 [Knx])
      0x12, 0x03, // dest. address (1.2.3) [Knx]
      0x03, // data length [Knx]
      0x00, // tpci/apci [Knx]
      0x40, // apci [Knx]
      0x21, 0x20 // data [Knx]
    ])],
    expected: Buffer.from([0x10, 0xe3, 0x11, 0x01, 0x12, 0x03, 0x03, 0x00, 0x40, 0x21, 0x20, 0x4f])
  },
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x04, 0x20, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x04, // tunnstate.header_length [KnxNet]
      0x00, 0x05, 0x00, // tunnstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x05, // addinfo_length [KnxNet]
      0x00, 0x00, 0x00, 0x00, 0x00, // addinfo data [KnxNet]
      RawMod.KNX_KNXNET_CONSTANTS.KNX_MSG_TYPES.MSG_EXTENDED, // control byte [Knx]
      0xe3, // higher four bits from npci + ext ctrl bits [Knx]
      0x11, 0x01, // source address (1.1.1) [Knx]
      0x12, 0x03, // dest. address (1.2.3) [Knx]
      0x03, // data length [Knx]
      0x00, // tpci/apci [Knx]
      0x40, // apci [Knx]
      0x21, 0x20 // data [Knx]
    ])],
    expected: Buffer.from([0x10, 0xe3, 0x11, 0x01, 0x12, 0x03, 0x03, 0x00, 0x40, 0x21, 0x20, 0x4f])
  },
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x04, 0x20, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x04, // tunnstate.header_length [KnxNet]
      0x00, 0x30, 0x00, // tunnstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x05, // addinfo_length [KnxNet]
      0x00, 0x00, 0x00, 0x00, 0x00, // addinfo data [KnxNet]
      RawMod.KNX_KNXNET_CONSTANTS.KNX_MSG_TYPES.MSG_POLL, // control byte [Knx]
      0xe3, // higher four bits from npci + ext ctrl bits [Knx]
      0x11, 0x01, // source address (1.1.1) [Knx]
      0x12, 0x03, // dest. address (1.2.3) [Knx]
      0x03, // data length [Knx]
      0x00, // tpci/apci [Knx]
      0x40, // apci [Knx]
      0x21, 0x20 // data [Knx]
    ])],
    expected: null
  }
]

export default exampleMessages
