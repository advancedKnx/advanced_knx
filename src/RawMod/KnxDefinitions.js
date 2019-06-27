/**************************************************
 * This file contains some static definitions for *
 *                    RawMod.js                   *
 **************************************************/

const KnxDefinitions = {
  // Bitmasks
  KNX_BITMASKS: {
    MSGTYPE_BITMASK: 0b11010000, // To get the message type
    TPCI_TYPE_BITMASK: 0b11000000, // To get the TPCI type
    TPCI_SEQNUM_BITMASK: 0b00111100, // To get the TPCI seqnum
    TPCI_UCD_TYPE_BITMASK: 0b00000011, // To get the TPCI.UCD type
    TPCI_NCD_TYPE_BITMASK: 0b00000011 // To get the TPCI.NCD type
  },

  // Knx Message Type Values
  KNX_MSG_TYPES: {
    MSG_NORMAL: 0b10010000, // A normal KNX message
    MSG_EXTENDED: 0b00010000, // A extended KNX message
    MSG_POLL: 0b11110000 // A poll KNX message
  },

  // Knx Message Lenghts
  KNX_MSG_LENS: {
    NORMAL_MAXLEN: 0x17, // Maxlen for normal messages
    NORMAL_MINLEN: 0x8, // Minlen for normal messages
    KNX_EXTENDED_MAXLEN: 0x107, // Maxlen for extended messages
    KNX_EXTENDED_MINLEN: 0x9, // Minlen for extended messages
    KNX_POLL_LEN: 0x7 // Len for poll message
  },

  // Knx TPCI Type Values
  KNX_TPCI_TYPES: {
    TPCI_UDP: 0b00000000, // Unnumbered Data Packet
    TPCI_NDP: 0b01000000, // Numbered Data Packet
    TPCI_UCD: 0b10000000, // Unnumbered Control Data
    TPCI_NCD: 0b11000000 // Numbered Control Data
  },

  // Knx TPCI SubType Values
  KNX_TPCI_SUBTYPES: {
    TPCI_UCD_CON: 0b00000000, // UCD connect request
    TPCI_UCD_DCON: 0b00000001, // UCD disconnect request
    TPCI_NCD_ACK: 0b00000010, // NCD acknowledge message
    TPCI_NCD_NACK: 0b00000011 // NCD not-acknowledge message
  },

  // Some values to construct KnxNet messages
  KNXNET: {
    HPAI_PROTOCOL_TYPE_UDP: 1
  },

  // Knx memoray addresses
  KNX_MEMORY_ADDRS: {
    MEMORY_PROGMODE_ADDR: [0x00, 0x60] // Address of the progmode flag
  },

  // Knx group and device address definitions
  KNX_ADDR_TYPES: {
    GROUP: 1, // It is a group address
    DEVICE: 0 // It is a device address
  },

  // Definitions that do not need own categories
  KNX_BROADCAST_ADDR: '0/0/0' // The broadcast address on the bus
}

export default KnxDefinitions
