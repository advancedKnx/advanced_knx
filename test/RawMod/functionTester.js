import util from 'util'

/************************************************************************************************************
 * This file can be used to test a target described by testTargetInformation using material from testSample *
 ************************************************************************************************************/

// This function tests the RawMod.KnxNetRebuildMessageBytes() function
const runTest = async (testTargetInformation, testSamples) => {
  console.log('####################### Starting to test: %s #######################', testTargetInformation.targetStr)
  console.log('Function.........: %s', testTargetInformation.targetFunctionStr)
  console.log('Number.of.samples: %d', testSamples.length)

  // This is a temporary variable needed for better code
  let tempTestSucceeded = false

  let results = {
    testsRun: 0,
    succeededTests: 0,
    failedTests: 0,
    targetFunctionStr: testTargetInformation.targetFunctionStr,

    // When a test fails, a Json structure containing of the input, the output and the expected output will be pushed onto this
    failPairs: []
  }

  // Functions to change values in the results structure
  const testSucceeded = () => {
    results.succeededTests++
  }

  const testFailed = (failPair) => {
    results.failPairs.push(failPair)
    results.failedTests++
  }

  const testRun = () => {
    results.testsRun++
  }

  // Run tests
  for (let testSample of testSamples) {
    // Test the function against the current example
    let output = testTargetInformation.targetFunction(...testSample.inputs)

    // Check the result
    if (JSON.stringify(output) === JSON.stringify(testSample.expected)) {
      tempTestSucceeded = true
    } else {
      // Standard check didn't work - check for special types requiring special checking methods
      if (typeof output === 'object') {
        if (typeof output.equals === 'function') {
          output.equals(testSample.expected) ? tempTestSucceeded = true : tempTestSucceeded = false
        } else {
          tempTestSucceeded = false
        }
      } else {
        tempTestSucceeded = false
      }
    }

    // Check if the test failed or succeeded and call the appropriate function
    if (tempTestSucceeded) {
      testSucceeded()
    } else {
      testFailed({ input: testSample.inputs, expected: testSample.expected, output: output })
    }

    // Print out how many example messages have been processed and increase it
    testRun()
    process.stdout.write(util.format('Tests.run........: %d/%d\r', results.testsRun, testSamples.length))
  }

  // Print out results
  console.log('\nTests.succeeded..: %d (~ %d%)', results.succeededTests, ((results.succeededTests / results.testsRun) * 100).toPrecision(4))
  console.log('Tests.failed.....: %d (~ %d%)', results.failedTests, ((results.failedTests / results.testsRun) * 100).toPrecision(4))
  if (testSamples.length - results.succeededTests > 0) {
    console.log('Status...........: \x1b[1;31;5mERROR\x1b[0;0;0m\n')
  } else {
    console.log('Status...........: \x1b[1;32mGOOD\x1b[0;0;0m\n')
  }

  // Return the number of failed runs along the failPairs
  return results
}

export default runTest
