/*
 * It contains templates and expected output values for the RawMod.KnxNetProtocolExtra.messageMatchesTemplate() function
 */
const exampleJsonMessageAndTemplates = [
  {
    inputs: [
      {
        // First input: Template
        header_length: 4,
        service_type: 1056,
        tunnstate: { header_length: 4, channel_id: 3 },
        cemi: {
          addinfo_length: 41,
          ctrl: {
            frameType: 1,
            extendedFrame: 0
          },
          dest_addr: '15.15.251',
          apdu: {
            apdu_length: 4
          }
        }
      },
      {
        // Second input: The message
        header_length: 4,
        protocol_version: 16,
        service_type: 1056,
        total_length: 24,
        tunnstate: { header_length: 4, channel_id: 3, seqnum: 6, rsvd: 0 },
        cemi: {
          msgcode: 41,
          addinfo_length: 41,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 0,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '1.1.4',
          dest_addr: '15.15.251',
          apdu: {
            apdu_length: 4,
            apdu_raw: Buffer.from([0x42, 0x41, 0x00, 0x60, 0x00]),
            tpci: 16,
            apci: 'Memory_Response',
            data: Buffer.from([0x00, 0x60, 0x00])
          }
        }
      }
    ],
    expected: 0
  },
  {
    inputs: [
      {
        // First input: Template
        header_length: 6,
        service_type: 1056,
        tunnstate: { header_length: 4 },
        cemi: {
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            extendedFrame: 0
          },
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4
          }
        }
      },
      {
        // Second input: The message
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 24,
        tunnstate: { header_length: 4, channel_id: 5, seqnum: 6, rsvd: 0 },
        cemi: {
          msgcode: 41,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 0,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '1.1.4',
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4,
            apdu_raw: Buffer.from([0x42, 0x41, 0x00, 0x60, 0x00]),
            tpci: 16,
            apci: 'Memory_Response',
            data: Buffer.from([0x00, 0x60, 0x00])
          }
        }
      }
    ],
    expected: 0
  },
  {
    inputs: [
      {
        // First input: Template
        header_length: 6,
        service_type: 1057,
        tunnstate: { header_length: 4 },
        cemi: {
          addinfo_length: 41,
          ctrl: {
            frameType: 1,
            extendedFrame: 0
          },
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4
          }
        }
      },
      {
        // Second input: The message
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 24,
        tunnstate: { header_length: 4, channel_id: 5, seqnum: 6, rsvd: 0 },
        cemi: {
          msgcode: 41,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 0,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '1.1.4',
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4,
            apdu_raw: Buffer.from([0x42, 0x41, 0x00, 0x60, 0x00]),
            tpci: 16,
            apci: 'Memory_Response',
            data: Buffer.from([0x00, 0x60, 0x00])
          }
        }
      }
    ],
    expected: -1
  },
  {
    inputs: [
      {
        // First input: Template
        header_length: 6,
        service_type: 1056,
        tunnstate: { header_length: 4 },
        cemi: {
          addinfo_length: 41,
          ctrl: {
            frameType: 1,
            extendedFrame: 0
          },
          dest_addr: '15.15.251',
          apdu: {
            apdu_length: 4
          }
        }
      },
      {
        // Second input: The message
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 24,
        tunnstate: { header_length: 4, channel_id: 5, seqnum: 6, rsvd: 0 },
        cemi: {
          msgcode: 41,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 0,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '1.1.4',
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4,
            apdu_raw: Buffer.from([0x42, 0x41, 0x00, 0x60, 0x00]),
            tpci: 16,
            apci: 'Memory_Response',
            data: Buffer.from([0x00, 0x60, 0x00])
          }
        }
      }
    ],
    expected: -1
  },
  {
    inputs: [
      {
        // First input: Template
        TRASHELEMENTTHATSHOULDMAKEITFAIL: 42,
        header_length: 6,
        service_type: 1056,
        tunnstate: { header_length: 4 },
        cemi: {
          addinfo_length: 41,
          ctrl: {
            frameType: 1,
            extendedFrame: 0
          },
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4
          }
        }
      },
      {
        // Second input: The message
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 24,
        tunnstate: { header_length: 4, channel_id: 5, seqnum: 6, rsvd: 0 },
        cemi: {
          msgcode: 41,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 0,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '1.1.4',
          dest_addr: '15.15.250',
          apdu: {
            apdu_length: 4,
            apdu_raw: Buffer.from([0x42, 0x41, 0x00, 0x60, 0x00]),
            tpci: 16,
            apci: 'Memory_Response',
            data: Buffer.from([0x00, 0x60, 0x00])
          }
        }
      }
    ],
    expected: -1
  }
]

export default exampleJsonMessageAndTemplates
