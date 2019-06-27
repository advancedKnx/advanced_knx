import KnxNetRebuildMessageBytesTest from './KnxNetRebuildMessageBytesTest'
import KnxParseTpciTest from './KnxParseTpciTest'
import KnxNetMsgGetSeqnumTest from './KnxNetMsgGetSeqnumTest'
import KnxNetMessageMatchesTemplateTest from './KnxNetMessageMacthesTemplateTest'
import KnxAddressTest from './KnxAddressTest'
import util from 'util'
import fs from 'fs'

const LOGFILE = './functionTestsError.log'

// This function call all testing functions
const runTests = async () => {
  let totalFailedTests = 0
  let totalGoodTests = 0
  let totalTestsRun = 0
  let fd

  // This opens the logfile
  console.log('Opening logfile to log errors to: %s/%s', __dirname, LOGFILE)
  fd = fs.openSync(LOGFILE, 'w')

  // This function adds the results returned by functions to the total values (above)
  const handleResults = (results) => {
    // Increase total values
    totalGoodTests += results.succeededTests
    totalFailedTests += results.failedTests
    totalTestsRun += results.testsRun

    // Check if there are errors that need to be logged
    if (results.failedTests > 0) {
      // Prepare the text to be written into the file
      let bufStr = ''
      bufStr += '====================\n'
      bufStr += util.format('Function: %s\n\n', results.targetFunctionStr)
      bufStr += '--------------------\n'
      for (let failPair of results.failPairs) {
        for (let i = 0, len = failPair.input.length; i < len; i++) {
          bufStr += util.format('Input[%d]: %j\n', i, failPair.input[i])
        }
        bufStr += util.format('Output: %j\n', failPair.output)
        bufStr += util.format('Expected: %j\n', failPair.expected)
        bufStr += '--------------------\n'
      }
      bufStr += '====================\n\n'

      // Initialize the buffer
      const buf = Buffer.from(bufStr)

      // Write it
      fs.write(fd, buf, 0, buf.length, null, err => {
        if (err) {
          throw util.format('Error writing errors to file! (%s) ', LOGFILE)
        }
      })
    }
  }

  // Run tests
  await handleResults(await KnxNetRebuildMessageBytesTest())
  await handleResults(await KnxParseTpciTest())
  await handleResults(await KnxNetMsgGetSeqnumTest())
  await handleResults(await KnxNetMessageMatchesTemplateTest())
  await handleResults(await KnxAddressTest.getAddrTypeTest())
  await handleResults(await KnxAddressTest.getGrpAddrLTest())
  await handleResults(await KnxAddressTest.validateAddrStrTest())
  await handleResults(await KnxAddressTest.strToBinTest())
  await handleResults(await KnxAddressTest.binToStrGrpL2Test())
  await handleResults(await KnxAddressTest.binToStrGrpL3Test())
  await handleResults(await KnxAddressTest.binToIndTest())
  await handleResults(await KnxAddressTest.Uint16AddrToUint8ArrTest())
  await handleResults(await KnxAddressTest.Uint8ArrToUint16AddrTest())

  // Print final result
  console.log('--------------------------------------------------------------------------------')
  console.log('############################### Final -- Results ###############################')
  console.log('Tests.run...: %d', totalTestsRun)
  console.log('Good.tests..: %d (~ %d%)', totalGoodTests, ((totalGoodTests / totalTestsRun) * 100).toPrecision(4))
  console.log('Failed.tests: %d (~ %d%)', totalFailedTests, ((totalFailedTests / totalTestsRun) * 100).toPrecision(4))
  if (totalFailedTests > 0) {
    console.log('Status......: \x1b[1;31;5mERROR\x1b[0;0;0m')
    console.log('Detailed error information were written into: \x1b[0;31m%s\x1b[0;0m', LOGFILE)
  } else {
    console.log('Status......: \x1b[1;32mGOOD\x1b[0;0;0m')
  }
  console.log('################################################################################')
  console.log('--------------------------------------------------------------------------------')

  // Close the logfile
  fs.closeSync(fd)
}

runTests()
