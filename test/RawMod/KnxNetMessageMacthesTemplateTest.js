import RawMod from '../../src/RawMod/RawMod'
import functionTester from './functionTester'
import exampleJsonMessageAndTemplates from './sampleInOutputs/KnxNetMessageMatchesTemplateInOuts'

const testTargetInformation = {
  targetStr: 'KnxNet Message-Template-Match checker',
  targetFunctionStr: 'new RawMod().KnxNetProtocolExtra.messageMatchesTemplate',
  // The function has to be bound to the KnxNetProtocol class since it references 'this'
  targetFunction: new RawMod().KnxNetProtocolExtra.messageMatchesTemplate.bind(new RawMod().KnxNetProtocolExtra)
}

const knxNetMessageMatchesTemplateTest = () => {
  return functionTester(testTargetInformation, exampleJsonMessageAndTemplates)
}

export default knxNetMessageMatchesTemplateTest
