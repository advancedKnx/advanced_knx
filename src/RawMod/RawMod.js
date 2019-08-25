import Errors from './Errors'
import KnxMessageTemplates from './KnxMessageTemplates'
import KnxNetProtocol from './KnxNetProtocol'
import KnxNetProtocolExtra from './KnxNetProtocolExtra'
import KnxAddress from './KnxAddress'
import KnxNetRebuildMessageBytes from './KnxNetRebuildMessageBytes'
import Handlers from './Handlers'
import ErrorHandler from './ErrorHandler'
import KnxConstants from '../KnxConstants'
import KnxReadDevMem from './KnxReadOperations/KnxReadDevMem'
import KnxWriteDevMem from './KnxWriteOperations/KnxWriteDevMem'
import KnxReadPropertyValue from './KnxReadOperations/KnxReadPropertyValue'
import KnxWritePropertyValue from './KnxWriteOperations/KnxWritePropertyValue'
import KnxGetDeviceAddress from './KnxReadOperations/KnxReadDeviceAddress'
import KnxSetDeviceAddress from './KnxWriteOperations/KnxSetDeviceAddress'
import KnxGetProgmodeStatus from './KnxReadOperations/KnxReadProgmodeStatus'
import KnxSetProgmodeStatus from './KnxWriteOperations/KnxSetProgmodeStatus'
import KnxSetApplicationRunstate from './KnxWriteOperations/KnxSetApplicationRunstate'
import KnxReadSerialNumber from './KnxReadOperations/KnxReadSerialNumber'
import KnxReadOrderNumber from './KnxReadOperations/KnxReadOrderNumber'
import KnxReadApplicationID from './KnxReadOperations/KnxReadApplicationID'
import KnxReadGroupAddrTblLoadstate from './KnxReadOperations/KnxReadGroupAddrTblLoadstate'
import KnxReadGroupAssociationTblLoadstate from './KnxReadOperations/KnxReadGroupAssociationTblLoadstate'
import KnxReadManufacturerID from './KnxReadOperations/KnxReadManufacturerID'
import KnxReadDeviceADC from './KnxReadOperations/KnxReadDeviceADC'
import KnxReadMaskversion from './KnxReadOperations/KnxReadMaskversion'
import KnxReadDeviceResource from './KnxReadOperations/KnxReadDeviceResource'
import KnxWriteDeviceResource from './KnxWriteOperations/KnxWriteDeviceResource'
import KnxRestartDevice from './KnxSpecialOperations/KnxRestartDevice'
import KnxLoadStateMachine from './KnxSpecialOperations/LoadStateMachine'
import KnxRunStateMachine from './KnxSpecialOperations/RunStateMachine'

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
    this.KnxReadDevMem = KnxReadDevMem
    this.KnxWriteDevMem = KnxWriteDevMem
    this.KnxReadPropertyValue = KnxReadPropertyValue
    this.KnxWritePropertyValue = KnxWritePropertyValue

    // These are top-level function that should be used normally
    this.KnxGetProgmodeStatus = KnxGetProgmodeStatus
    this.KnxSetProgmodeStatus = KnxSetProgmodeStatus
    this.KnxSetDeviceAddress = KnxSetDeviceAddress
    this.KnxSetApplicationRunstate = KnxSetApplicationRunstate
    this.KnxGetDeviceAddress = KnxGetDeviceAddress
    this.KnxReadSerialNumber = KnxReadSerialNumber
    this.KnxReadOrderNumber = KnxReadOrderNumber
    this.KnxReadApplicationID = KnxReadApplicationID
    this.KnxReadGroupAddrTblLoadState = KnxReadGroupAddrTblLoadstate
    this.KnxReadGroupAssociationTblLoadState = KnxReadGroupAssociationTblLoadstate
    this.KnxReadManufacturerID = KnxReadManufacturerID
    this.KnxReadDeviceADC = KnxReadDeviceADC
    this.KnxReadMaskversion = KnxReadMaskversion
    this.KnxReadDeviceResource = KnxReadDeviceResource
    this.KnxWriteDeviceResource = KnxWriteDeviceResource
    this.KnxRestartDevice = KnxRestartDevice
    this.KnxLoadStateMachine = KnxLoadStateMachine
    this.KnxRunStateMachine = KnxRunStateMachine
  }
}
