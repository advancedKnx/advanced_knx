/*
 * The array below contains nulled messages with a set sequence number
 * The seqnum is represented by the second of the three tunstate bytes
 */
const exampleInOuts = [
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x00, 0x00, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x00, // tunnstate.header_length [KnxNet]
      0x00, 0x00, 0x00, // tunstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      0x00, // control byte [Knx]
      0x00, // higher four bits from npci + ext ctrl bits [Knx]
      0x00, 0x00, // source address (1.1.1) [Knx]
      0x00, 0x00, // dest. address (1.2.3) [Knx]
      0x00, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    expected: 0x00
  },
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x00, 0x00, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x00, // tunnstate.header_length [KnxNet]
      0x00, 0x48, 0x00, // tunstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      0x00, // control byte [Knx]
      0x00, // higher four bits from npci + ext ctrl bits [Knx]
      0x00, 0x00, // source address (1.1.1) [Knx]
      0x00, 0x00, // dest. address (1.2.3) [Knx]
      0x00, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    expected: 0x48
  },
  {
    inputs: [Buffer.from([
      0x06, // header_length [KnxNet]
      0x00, // protocol_version [KnxNet]
      0x00, 0x00, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x00, // tunnstate.header_length [KnxNet]
      0x00, 0x49, 0x00, // tunstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      0x00, // control byte [Knx]
      0x00, // higher four bits from npci + ext ctrl bits [Knx]
      0x00, 0x00, // source address (1.1.1) [Knx]
      0x00, 0x00, // dest. address (1.2.3) [Knx]
      0x00, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    expected: 0x49
  },
  {
    // Test if the function still work with not-normal header_lengths
    inputs: [Buffer.from([
      0x05, // header_length [KnxNet]
      0x00, 0x00, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x00, // tunnstate.header_length [KnxNet]
      0x00, 0x3a, 0x00, // tunstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      0x00, // control byte [Knx]
      0x00, // higher four bits from npci + ext ctrl bits [Knx]
      0x00, 0x00, // source address (1.1.1) [Knx]
      0x00, 0x00, // dest. address (1.2.3) [Knx]
      0x00, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    expected: 0x3a
  },
  {
    inputs: [Buffer.from([
      0x07, // header_length [KnxNet]
      0x00, // Trash byte for testing [Trash]
      0x00, // protocol_version [KnxNet]
      0x00, 0x00, // service_type [KnxNet]
      0x00, 0x00, // total_length [KnxNet]
      0x00, // tunnstate.header_length [KnxNet]
      0x00, 0x44, 0x00, // tunstate [KnxNet]
      0x00, // msgcode [KnxNet]
      0x00, // addinfo_length [KnxNet]
      0x00, // control byte [Knx]
      0x00, // higher four bits from npci + ext ctrl bits [Knx]
      0x00, 0x00, // source address (1.1.1) [Knx]
      0x00, 0x00, // dest. address (1.2.3) [Knx]
      0x00, // lower four bits from npci [Knx]
      0x00, // tpci/apci [Knx]
      0x00 // apci [Knx]
    ])],
    expected: 0x44
  }
]

export default exampleInOuts
