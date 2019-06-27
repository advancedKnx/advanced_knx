import RawMod from '../../src/RawMod/RawMod'
import functionTester from './functionTester'
import KnxAddressInOuts from './sampleInOutputs/KnxAddressInOuts'

export default class KnxAddressTest {
  static getAddrTypeTest () {
    const testTargetInformation = {
      targetStr: 'Knx address type getter',
      targetFunctionStr: 'RawMod.KnxAddress.getAddrType()',
      targetFunction: new RawMod().KnxAddress.getAddrType
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressGetAddrTypeInOuts)
  }

  static getGrpAddrLTest () {
    const testTargetInformation = {
      targetStr: 'Knx group address level getter',
      targetFunctionStr: 'RawMod.KnxAddress.getGrpAddrL()',
      targetFunction: new RawMod().KnxAddress.grpAddrStrGetL
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressGetGrpAddrLvlInOuts)
  }

  static validateAddrStrTest () {
    const testTargetInformation = {
      targetStr: 'Knx address validator',
      targetFunctionStr: 'RawMod.KnxAddress.validateAddrStr()',
      targetFunction: new RawMod().KnxAddress.validateAddrStr
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressValidateAddrStr)
  }

  static strToBinTest () {
    const testTargetInformation = {
      targetStr: 'Knx StrAddress to BinAddress converter',
      targetFunctionStr: 'RawMod.KnxAddress.strToBin()',
      targetFunction: new RawMod().KnxAddress.strToBin
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressStrToBinInOuts)
  }

  static binToStrGrpL2Test () {
    const testTargetInformation = {
      targetStr: 'Knx BinAddress to Group L2 StrAddress converter',
      targetFunctionStr: 'RawMod.KnxAddress.binToStrGrpL2()',
      targetFunction: new RawMod().KnxAddress.binToStrGrpL2
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressBinToStrGrpL2InOuts)
  }

  static binToStrGrpL3Test () {
    const testTargetInformation = {
      targetStr: 'Knx BinAddress to Group L3 StrAddress converter',
      targetFunctionStr: 'RawMod.KnxAddress.binToStrGrpL3()',
      targetFunction: new RawMod().KnxAddress.binToStrGrpL3
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressBinToStrGrpL3InOuts)
  }

  static binToIndTest () {
    const testTargetInformation = {
      targetStr: 'Knx BinAddress to IndAddress converter',
      targetFunctionStr: 'RawMod.KnxAddress.binToInd()',
      targetFunction: new RawMod().KnxAddress.binToInd
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.KnxAddressBinToIndInOuts)
  }

  static Uint16AddrToUint8ArrTest () {
    const testTargetInformation = {
      targetStr: 'Knx Uint16 address to Uint8 array converter',
      targetFunctionStr: 'RawMod.KnxAddress.Uint16AddrToUint8Arr()',
      targetFunction: new RawMod().KnxAddress.Uint16AddrToUint8Arr
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.Uint16AddrToUint8ArrInOuts)
  }

  static Uint8ArrToUint16AddrTest () {
    const testTargetInformation = {
      targetStr: 'Knx Uint8 array to Uint16 address converter',
      targetFunctionStr: 'RawMod.KnxAddress.Uint8ArrToUint16Addr()',
      targetFunction: new RawMod().KnxAddress.Uint8ArrToUint16Addr
    }

    return functionTester(testTargetInformation, KnxAddressInOuts.Uint8ArrToUint16AddrInOuts)
  }
}
