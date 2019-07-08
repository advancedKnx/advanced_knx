import KnxConstants from '../../../src/KnxConstants'

export default {
  // Inputs and outputs for KnxAddress.getAddrType()
  KnxAddressGetAddrTypeInOuts: [
    {
      inputs: ['1.1.2'],
      expected: KnxConstants.KNX_ADDR_TYPES.DEVICE
    },
    {
      inputs: ['1/1/2'],
      expected: KnxConstants.KNX_ADDR_TYPES.GROUP
    },
    {
      inputs: ['blabla'],
      expected: -1
    }
  ],

  // Inputs and outputs for KnxAddress.grpAddrStrGetL()
  KnxAddressGetGrpAddrLvlInOuts: [
    {
      inputs: ['1/1/2'],
      expected: 3
    },
    {
      inputs: ['11/2'],
      expected: 2
    },
    {
      inputs: ['112'],
      expected: 1
    }
  ],

  // Inputs and outputs for KnxAddress.validateAddrStr()
  KnxAddressValidateAddrStr: [
    {
      inputs: ['1/1/2'],
      expected: 0
    },
    {
      inputs: ['1/2'],
      expected: 0
    },
    {
      inputs: ['1.1.2'],
      expected: 0
    },
    {
      inputs: ['1/1.2'],
      expected: -1
    },
    {
      inputs: ['111'],
      expected: -1
    },
    {
      inputs: ['1.1/2'],
      expected: -1
    },
    {
      inputs: ['/2'],
      expected: -1
    },
    {
      inputs: ['1.1'],
      expected: -1
    }
  ],

  // Input and Outputs for the KnxAddress.strToBin() function
  KnxAddressStrToBinInOuts: [
    // Individual addresses
    {
      inputs: ['1.1.2'],
      expected: 0x1102
    },
    {
      inputs: ['2.2.2'],
      expected: 0x2202
    },
    {
      inputs: ['1.10.255'],
      expected: 0x1aff
    },
    {
      inputs: ['15.15.0'],
      expected: 0xff00
    },
    {
      inputs: ['10.5.10'],
      expected: 0xa50a
    },
    {
      inputs: ['1.1.2'],
      expected: 0x1102
    },
    {
      inputs: ['15.15.255'],
      expected: 0xffff
    },
    // Test some invalid ranges for individual addresses
    {
      inputs: ['16.16.256'], // 0.0.0
      expected: 0x0000
    },
    {
      inputs: ['17.17.257'], // 1.1.1
      expected: 0x1101
    },
    {
      inputs: ['33.33.513'], // 1.1.1
      expected: 0x1101
    },
    // Group addresses (Level 3)
    {
      inputs: ['1/7/255'],
      expected: 0x0fff
    },
    {
      inputs: ['20/0/0'],
      expected: 0xa000
    },
    {
      inputs: ['0/7/0'],
      expected: 0x0700
    },
    {
      inputs: ['31/7/255'],
      expected: 0xffff
    },
    // Test some invalid ranges for group (Level 3) addresses
    {
      inputs: ['32/8/256'], // 0/0/0
      expected: 0x0000
    },
    {
      inputs: ['33/9/257'], // 1/1/1
      expected: 0x0901
    },
    {
      inputs: ['65/17/513'], // 1/1/1
      expected: 0x0901
    },
    // Group addresses (Level 2)
    {
      inputs: ['3/1000'],
      expected: 0x1be8
    },
    {
      inputs: ['0/0'],
      expected: 0x0000
    },
    {
      inputs: ['31/2047'],
      expected: 0xffff
    },
    // Test some invalid ranges for group (Level 2) addresses
    {
      inputs: ['32/2048'], // 0/0
      expected: 0x0000
    },
    {
      inputs: ['33/2049'], // 1/1
      expected: 0x0801
    },
    {
      inputs: ['65/4097'], // 1/1
      expected: 0x0801
    },
    // Some completely invalid inputs
    {
      inputs: [null],
      expected: null
    },
    {
      inputs: [1],
      expected: null
    },
    {
      inputs: ['1000'],
      expected: null
    },
    {
      inputs: ['HALLO'],
      expected: null
    },
    {
      inputs: ['1/2/3/4'],
      expected: null
    },
    {
      inputs: [],
      expected: null
    },
    {
      inputs: ['31/2047'],
      expected: 0xffff
    }
  ],

  /*
   * Input and Outputs for the KnxAddress.binToStrGrpL2() function
   */
  KnxAddressBinToStrGrpL2InOuts: [
    {
      inputs: [Uint16Array.from([0x8802])],
      expected: '17/2'
    },
    {
      inputs: [Uint16Array.from([0xf7d0])],
      expected: '30/2000'
    },
    {
      inputs: [Uint16Array.from([0x3b09])],
      expected: '7/777'
    },
    {
      inputs: [Uint16Array.from([0x04d2])],
      expected: '0/1234'
    },
    {
      inputs: [Uint16Array.from([0x0865])],
      expected: '1/101'
    },
    {
      inputs: [Uint16Array.from([0x10ae])],
      expected: '2/174'
    },
    {
      inputs: [Uint16Array.from([0x0000])],
      expected: '0/0'
    },
    {
      inputs: [Uint16Array.from([0xffff])],
      expected: '31/2047'
    },
    // Some completely invalid inputs
    {
      inputs: [null],
      expected: null
    },
    {
      inputs: [[0xfffff]],
      expected: null
    }
  ],

  /*
   * Input and Outputs for the KnxAddress.binToStrGrpL3() function
   */
  KnxAddressBinToStrGrpL3InOuts: [
    {
      inputs: [Uint16Array.from([0x8802])],
      expected: '17/0/2'
    },
    {
      inputs: [Uint16Array.from([0xf7d0])],
      expected: '30/7/208'
    },
    {
      inputs: [Uint16Array.from([0x3b09])],
      expected: '7/3/9'
    },
    {
      inputs: [Uint16Array.from([0x04d2])],
      expected: '0/4/210'
    },
    {
      inputs: [Uint16Array.from([0x0865])],
      expected: '1/0/101'
    },
    {
      inputs: [Uint16Array.from([0x10ae])],
      expected: '2/0/174'
    },
    {
      inputs: [Uint16Array.from([0x0000])],
      expected: '0/0/0'
    },
    {
      inputs: [Uint16Array.from([0xffff])],
      expected: '31/7/255'
    },
    // Some completely invalid inputs
    {
      inputs: [null],
      expected: null
    },
    {
      inputs: [[0xfffff]],
      expected: null
    }
  ],

  /*
   * Input and Outputs for the KnxAddress.binToInd() function
   */
  KnxAddressBinToIndInOuts: [
    {
      inputs: [Uint16Array.from([0x8802])],
      expected: '8.8.2'
    },
    {
      inputs: [Uint16Array.from([0xf7d0])],
      expected: '15.7.208'
    },
    {
      inputs: [Uint16Array.from([0x3b09])],
      expected: '3.11.9'
    },
    {
      inputs: [Uint16Array.from([0x04d2])],
      expected: '0.4.210'
    },
    {
      inputs: [Uint16Array.from([0x0865])],
      expected: '0.8.101'
    },
    {
      inputs: [Uint16Array.from([0x10ae])],
      expected: '1.0.174'
    },
    {
      inputs: [Uint16Array.from([0x0000])],
      expected: '0.0.0'
    },
    {
      inputs: [Uint16Array.from([0xffff])],
      expected: '15.15.255'
    },
    // Some completely invalid inputs
    {
      inputs: [null],
      expected: null
    },
    {
      inputs: [[0xfffff]],
      expected: null
    }
  ],

  /*
   * Inputs and Outputs for the KnxAddress.Uint16AddrToUint8Arr() function
   */
  Uint16AddrToUint8ArrInOuts: [
    {
      inputs: [Uint16Array.from([0x8802])],
      expected: Uint8Array.from([0x88, 0x02])
    },
    {
      inputs: [Uint16Array.from([0x0000])],
      expected: Uint8Array.from([0x00, 0x00])
    },
    {
      inputs: [Uint16Array.from([0xffff])],
      expected: Uint8Array.from([0xff, 0xff])
    },
    {
      inputs: [Uint16Array.from([0x1001])],
      expected: Uint8Array.from([0x10, 0x01])
    },
    {
      inputs: [Uint16Array.from([0x0110])],
      expected: Uint8Array.from([0x01, 0x10])
    },
    {
      inputs: [Uint16Array.from([0x1234])],
      expected: Uint8Array.from([0x12, 0x34])
    },
    {
      inputs: [Uint16Array.from([0x5678])],
      expected: Uint8Array.from([0x56, 0x78])
    }
  ],

  /*
   * Inputs and outputs for the KnxAddress.Uint8ArrToUint16Addr() function
   */
  Uint8ArrToUint16AddrInOuts: [
    {
      inputs: [Uint8Array.from([0x88, 0x02])],
      expected: Uint16Array.from([0x8802])
    },
    {
      inputs: [Uint8Array.from([0x00, 0x00])],
      expected: Uint16Array.from([0x0000])
    },
    {
      inputs: [Uint8Array.from([0xff, 0xff])],
      expected: Uint16Array.from([0xffff])
    },
    {
      inputs: [Uint8Array.from([0x10, 0x01])],
      expected: Uint16Array.from([0x1001])
    },
    {
      inputs: [Uint8Array.from([0x01, 0x10])],
      expected: Uint16Array.from([0x0110])
    },
    {
      inputs: [Uint8Array.from([0x12, 0x34])],
      expected: Uint16Array.from([0x1234])
    },
    {
      inputs: [Uint8Array.from([0x56, 0x78])],
      expected: Uint16Array.from([0x5678])
    }
  ]
}
