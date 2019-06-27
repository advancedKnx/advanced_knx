import RawMod from '../../src/RawMod/RawMod'
import functionTester from './functionTester'
import exampleMessages from './sampleInOutputs/KnxNetRebuildMessageBytesTestInOuts'

const testTargetInformation = {
  targetStr: 'KnxNet message rebuilder',
  targetFunctionStr: 'RawMod.KnxNetRebuildMessageBytes()',
  targetFunction: new RawMod().KnxNetRebuildMessageBytes
}

const knxNetRebuildMessageBytesTest = () => {
  return functionTester(testTargetInformation, exampleMessages)
}

export default knxNetRebuildMessageBytesTest
