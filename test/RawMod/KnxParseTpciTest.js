import RawMod from '../../src/RawMod/RawMod'
import functionTester from './functionTester'
import exampleParseTpciInOuts from './sampleInOutputs/KnxParseTpciInOuts'

const testTargetInformation = {
  targetStr: 'Knx TPCI parser',
  targetFunctionStr: 'RawMod.KnxNetProtocolExtra.parseTpci()',
  targetFunction: new RawMod().KnxNetProtocolExtra.parseTpci
}

const knxParseTpciTest = () => {
  return functionTester(testTargetInformation, exampleParseTpciInOuts)
}

export default knxParseTpciTest
