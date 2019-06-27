import Errors from './Errors'
import KnxMessageTemplates from './KnxMessageTemplates'
import KnxNetProtocol from './KnxNetProtocol'
import KnxNetProtocolExtra from './KnxNetProtocolExtra'
import KnxAddress from './KnxAddress'
import KnxNetRebuildMessageBytes from './KnxNetRebuildMessageBytes'
import Handlers from './Handlers'
import ErrorHandler from './ErrorHandler'
import KnxConstants from '../KnxConstants'
import KnxReadDevMem from './KnxReadDevMem'
import KnxWriteDevMem from './KnxWriteDevMem'
import KnxReadPropertyValue from './KnxReadPropertyValue'
import KnxGetDeviceAddress from './KnxGetDeviceAddress'
import KnxSetDeviceAddress from './KnxSetDeviceAddress'
import KnxGetProgmodeStatus from './KnxGetProgmodeStatus'
import KnxSetProgmodeStatus from './KnxSetProgmodeStatus'
import KnxReadSerialNumber from './KnxReadSerialNumber'
import KnxReadOrderNumber from './KnxReadOrderNumber'
import KnxReadApplicationID from './KnxReadApplicationID'
import KnxReadApplicationRunstate from './KnxReadApplicationRunstate'
import KnxReadApplicationLoadstate from './KnxReadApplicationLoadstate'
import KnxReadGroupAddrTblLoadstate from './KnxReadGroupAddrTblLoadstate'
import KnxReadGroupAssociationTblLoadstate from './KnxReadGroupAssociationTblLoadstate'

// The RawMod class - providing useful definitions and functions
export default class RawMod {
  constructor () {
    // Get values regarding the KNX protocol
    this.KNX_KNXNET_CONSTANTS = KnxConstants

    // Get standard RawMod error definition
    this.ERRORS = Errors

    // Get some message templates
    this.KNX_MESSAGE_TEMPLATES = KnxMessageTemplates

    // The RawMod error handler
    this.errorHandler = new ErrorHandler()

    // Get functions to work with the KnxNet protocol
    this.KnxNetProtocol = KnxNetProtocol
    this.KnxNetProtocolExtra = new KnxNetProtocolExtra()
    this.KnxNetRebuildMessageBytes = KnxNetRebuildMessageBytes.rebuildMessageBytes
    this.RawModHandlers = Handlers

    // Functions to work with KNX addresses
    this.KnxAddress = KnxAddress

    // More advanced KNX functions
    this.KnxReadDevMem = new KnxReadDevMem()
    this.KnxWriteDevMem = new KnxWriteDevMem()
    this.KnxReadPropertyValue = KnxReadPropertyValue

    // These are top-level function that should be used normally
    this.KnxGetProgmodeStatus = KnxGetProgmodeStatus
    this.KnxSetProgmodeStatus = KnxSetProgmodeStatus
    this.KnxGetDeviceAddress = KnxGetDeviceAddress
    this.KnxSetDeviceAddress = KnxSetDeviceAddress
    this.KnxReadSerialNumber = KnxReadSerialNumber
    this.KnxReadOrderNumber = KnxReadOrderNumber
    this.KnxReadApplicationID = KnxReadApplicationID
    this.KnxReadApplicationRunstate = KnxReadApplicationRunstate
    this.KnxReadApplicationLoadstate = KnxReadApplicationLoadstate
    this.KnxReadGroupAddrTblLoadState = KnxReadGroupAddrTblLoadstate
    this.KnxReadGroupAssociationTblLoadState = KnxReadGroupAssociationTblLoadstate
  }
}
