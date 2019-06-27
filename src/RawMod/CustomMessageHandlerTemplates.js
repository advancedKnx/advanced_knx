/**************************************************
 * This file contains some custom message handler *
 **************************************************/

import KnxConstants from '../KnxConstants'

/*
 * 'CustomMessageHandlerTemplates' contains custom message handler templates for different types of messages
 * Every template consists of a register template (used to register the handler)
 */

const CustomMessageHandlerTemplates = {
  ncdNackHandlerTemplate: {
    cemi: {
      src_addr: '0.0.0',
      dest_addr: '0.0.0',
      apdu: {
        tpci: KnxConstants.KNX_TPCI_TYPES.TPCI_NCD | KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_NACK
      }
    }
  },
  ncdAckHandlerTemplate: {
    cemi: {
      src_addr: '0.0.0',
      dest_addr: '0.0.0',
      apdu: {
        tpci: KnxConstants.KNX_TPCI_TYPES.TPCI_NCD | KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_ACK
      }
    }
  },
  memoryResponseTemplate: {
    cemi: {
      src_addr: '0.0.0',
      dest_addr: '0.0.0',
      apdu: {
        apci: 'Memory_Response'
      }
    }
  },
  propertyValueResponseTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          apci: 'PropertyValue_Response',
          tpci: KnxConstants.KNX_TPCI_TYPES.TPCI_NDP
        }
      }
    }
  }
}

export default CustomMessageHandlerTemplates
