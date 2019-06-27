import RawMod from '../../src/RawMod/RawMod'
import functionTester from './functionTester'
import exampleInOuts from './sampleInOutputs/KnxNetMsgGetSeqnumInOuts'

const testTargetInformation = {
  targetStr: 'KnxNet Seqnum-Getter',
  targetFunctionStr: 'RawMod.KnxNetProtocolExtra.msgGetSeqnum()',
  targetFunction: new RawMod().KnxNetProtocolExtra.msgGetSeqnum
}

// This function tests the RawMod.KnxNetProtocolExtra.msgGetSeqnum() function
const knxNetMsgGetSeqnumTest = () => {
  return functionTester(testTargetInformation, exampleInOuts)
}

export default knxNetMsgGetSeqnumTest
