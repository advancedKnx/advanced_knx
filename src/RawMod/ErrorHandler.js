/*****************************************************************************
 * This file contains things to handle errors that occurred inside of RawMod *
 *****************************************************************************/

import callerID from 'caller-id'

export class RawModError {
  constructor (filePath, functionName, time, errorObject, referenceID) {
    this.filePath = filePath // The file the error occurred in
    this.functionName = functionName // The function the error occurred in
    this.time = time // The time of the occurrence
    this.errorObject = errorObject // The new Error() object describing the error
    this.referenceID = referenceID // A error code identifying the error (RawModErrors.ERR_*.errorID)
  }
}

export default class RawModErrorHandler {
  constructor () {
    // A array of RawModError objects
    this.errorStack = []
  }

  /*
   * Function:  RawModError.getLastError()
   *
   *      Returns the last (most recent) error from this.errorStack
   */
  getLastError () {
    return (this.getErrorStack()[this.getErrorStack().length - 1])
  }

  /*
   * Function:  RawModError.getErrorStack()
   *
   *      Returns the whole this.errorStack
   */
  getErrorStack () {
    return this.errorStack
  }

  /*
   * Function:  RawModError.delLastError()
   *
   *      Deletes the last (most recent) error from this.errorStack
   */
  delLastError () {
    this.errorStack.pop()
  }

  /*
   * Function:  RawModError.delErrorStack()
   *
   *      Clears the whole this.errorStack
   */
  delErrorStack () {
    this.errorStack = []
  }

  /*
   * Function:  RawModError.addNewError()
   *
   *      Adds a new error to this.errorStack
   *
   * Arguments:
   *      rawModErrorObject   A RawModErrorHandler.RawModError object which will be pushed onto this.errorStack
   */
  addNewError (rawModErrorObject) {
    this.errorStack.push(rawModErrorObject)
  }

  /*
   * Function:  RawModError.createNewError()
   *
   *      Creates and returns a RawModError object
   *
   * Arguments:
   *      filePath      The name of the file the error occurred in
   *      functionName  The name of the function the error occurred in
   *      time          The time the error occurred
   *      errorObject   A new Error() object describing the error
   *      referenceID   The reference ID of the error
   *
   *      (See RawModError above)
   */
  createNewError (errorObject, referenceID) {
    // Get information about the caller
    const callerInfo = callerID.getData(this.createNewError)

    // Return the new RarModError
    return new RawModError(callerInfo.filePath, callerInfo.functionName, new Date(), errorObject, referenceID)
  }
}
