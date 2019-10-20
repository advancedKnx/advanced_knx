import Errors from './Errors'
import KnxMessageTemplates from './KnxMessageTemplates'
import KnxNetProtocol from './KnxNetProtocol'
import KnxNetProtocolExtra from './KnxNetProtocolExtra'
import KnxAddress from './KnxAddress'
import KnxNetRebuildMessageBytes from './KnxNetRebuildMessageBytes'
import Handlers from './Handlers'
import ErrorHandler from './ErrorHandler'
import KnxConstants from '../KnxConstants'
import KnxReadDevMem from './__KnxReadOperations/KnxReadDevMem'
import KnxWriteDevMem from './__KnxWriteOperations/KnxWriteDevMem'
import KnxReadPropertyValue from './__KnxReadOperations/KnxReadPropertyValue'
import KnxWritePropertyValue from './__KnxWriteOperations/KnxWritePropertyValue'
import KnxGetDeviceAddress from './__KnxReadOperations/KnxReadDeviceAddress'
import KnxSetDeviceAddress from './__KnxWriteOperations/KnxSetDeviceAddress'
import KnxGetProgmodeStatus from './__KnxReadOperations/KnxReadProgmodeStatus'
import KnxSetProgmodeStatus from './__KnxWriteOperations/KnxSetProgmodeStatus'
import KnxReadSerialNumber from './__KnxReadOperations/KnxReadSerialNumber'
import KnxReadOrderNumber from './__KnxReadOperations/KnxReadOrderNumber'
import KnxReadApplicationID from './__KnxReadOperations/KnxReadApplicationID'
import KnxReadGroupAddrTblLoadstate from './__KnxReadOperations/KnxReadGroupAddrTblLoadstate'
import KnxReadGroupAssociationTblLoadstate from './__KnxReadOperations/KnxReadGroupAssociationTblLoadstate'
import KnxReadManufacturerID from './__KnxReadOperations/KnxReadManufacturerID'
import KnxReadDeviceADC from './__KnxReadOperations/KnxReadDeviceADC'
import KnxReadMaskversion from './__KnxReadOperations/KnxReadMaskversion'
import KnxReadDeviceResource from './__KnxReadOperations/KnxReadDeviceResource'
import KnxWriteDeviceResource from './__KnxWriteOperations/KnxWriteDeviceResource'
import KnxRestartDevice from './KnxOperations/RestartDevice'
import KnxLoadStateMachine from './KnxOperations/LoadStateMachine'
import KnxRunStateMachine from './KnxOperations/RunStateMachine'
import CustomMessageHandlers from './CustomMsgHandlers'
import CustomMessageHandlerTemplates from './CustomMessageHandlerTemplates'

// The RawMod class - providing useful definitions and functions
export default class RawMod {
  constructor () {
    // Get values regarding the KNX protocol
    this.KNX_KNXNET_CONSTANTS = KnxConstants

    // Get standard RawMod error definition
    this.ERRORS = Errors

    // Get some message templates
    this.KNX_MESSAGE_TEMPLATES = KnxMessageTemplates

    // The RawMod error handler (+ provide function to create new handler)
    this.errorHandler = new ErrorHandler()
    this.newErrorHandler = ErrorHandler

    // RawMod custom message handler class
    this.CustomMessageHandler = CustomMessageHandlers
    this.CustomMessageHandlerTemplates = CustomMessageHandlerTemplates

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
