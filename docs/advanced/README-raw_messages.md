# Raw Messages
- This file contains information about RawKnx messages and how they can be used
- This library handles Raw Messages in two ways:
    - as `Buffer`
    - as `JsonObject`
## Raw Message Json
- Most fields have their possible values defined in `src/KnxConstants.js`
- Here is an example message
    ```
    {
        msgCode: KnxConstants.MESSAGECODES["L_Data.req"],
        ctrl: {
            frameType: 1,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            hopCount: 6,
            extendedFrame: 0,
            destAddrType: 0
        },
  
        src_addr: 15.15.250,
        dest_addr: 0.0.0,
  
        apdu: {
            tpci: 0,
            apci: 'GroupValue_Write',
            data: Buffer([0]),
            bitlength: 0,
            tpciUcdType: 1,
            tpciNcdType: 2,
            inApciData: 0
        }
    }
    ```
### `msgCode`
- the KNXNet message type, one of the listed value
    ```
    KnxConstants.MESSAGECODES = {
      'L_Raw.req': 0x10,
      'L_Data.req': 0x11, // used to send/read messages
      'L_Poll_Data.req': 0x13,
      'L_Poll_Data.con': 0x25,
      'L_Data.ind': 0x29,
      'L_Busmon.ind': 0x2B,
      'L_Raw.ind': 0x2D,
      'L_Data.con': 0x2E,
      'L_Raw.con': 0x2F
    }
    ```
### `ctrl`
contains control information about the message

#### `ctrl.frameType`
- type of the message
    ```
    EXTENDED: 0x00, // extended message
    STANDARD: 0x01 // normal message
    ```
#### `ctrl.repeat`
- controls if the message will be resent on failure
    ```
    0x00, // the KNX-IP interface won't resend on error
    0x01 // it will resend on error
    ```
#### `ctrl.broadcast`
- the broadcast flag

#### `ctrl.priority`
- controls the priority of the frame
    ```
    KnxConstants.KNX_MSG_PRIORITY = {
      LOW: 0b11,
      HIGH: 0b01,
      ALARM: 0b10,
      SYSTEM: 0b00
    }
    ```
#### `ctrl.acknowledge`
- the acknowledge flag

#### `ctrl.confirm`
- the confirm flag

#### `ctrl.hopCount`
- max. hops counter
    ```
    Every router the message passes trough will decrease this, if it reaches 
    zero before arriving at the target, the message will be dropped.
    
    Setting it to seven will disable it.
    ```
#### `ctrl.extendedFrame`
- extended frame flag

#### `ctrl.destAddrType`
- DAF - destination address flag
    ```
    0x00, // device/individual address
    0x01 // group address
    ```
### `src_addr`
- device/individual address of the sender
    ```
    '1.1.0', '15.15.200', ...
    ```
### `dest_addr`
- device/individual or group address of the receiver (see `ctrl.destAddrType`)
    ```
    // If the DAF is set to 0x00
    '15.15.13', '1.3.5', ...
    
    // If it is set to 0x01
    '0/1/0', '3/4/17', ...
    ```
### `apdu`
- contains application program data
#### `apdu.tpci`
- **NOTE** this field only has six bits - only use the lower six bits
- The bit-layout looks like this
    ```
       n  |     desc      |                  code
    ------+---------------+--------------------------------------
     0x00 |   SEQ. NUM.   | apdu.tpci |= seqnum & 0b1111 ........
     0x01 |   SEQ. NUM.   | .....................................
     0x02 |   SEQ. NUM.   | .....................................
     0x03 |   SEQ. NUM.   | .....................................
     0x04 |   TPCI TYPE   | apdu.tpci |= (tpci_t >> 2) & 0b111111
     0x05 |   TPCI TYPE   | .....................................
    ```
    - `TPCI TYPE` (`tpci_t`) type can be one of the following
        ```
        KnxConstants.KNX_TPCI_TYPES = {
          TPCI_UDP: 0b00000000, // Unnumbered Data Packet
          TPCI_NDP: 0b01000000, // Numbered Data Packet
          TPCI_UCD: 0b10000000, // Unnumbered Control Data
          TPCI_NCD: 0b11000000 // Numbered Control Data
        }
        ```
        - `TPCI_UCD` messages can be used du establish or close Unnumbered/Numbered Data Connections
        - `TPCI_NCD` to acknowledge/not-acknowledge data packets (`TPCI_NDP`, `TPCI_UDP`)
        - `TPCI_UDP` and `TPCI_NDP` messages can be used to communicate with the device
    - `SEQ. NUM.` (`seqnum`) is the sequence number if `TPCI TYPE` is one of
        ```
          TPCI_NDP: 0b01000000, // Numbered Data Packet
          TPCI_NCD: 0b11000000 // Numbered Control Data
        ```
        - ... otherwise, it will be ignored
#### `apdu.tpciUcdType`
- **NOTE** must NOT be set if the `TPCI TYPE` of `apdu.tpci` is not set to
    ```
    TPCI_UCD: 0b10000000 // Unnumbered Control Data
    ```
- possible values
    ```
    KnxConstants.KNX_TPCI_SUBTYPES = {
        TPCI_UCD_CON: 0b00000000, // UCD connect request
        TPCI_UCD_DCON: 0b00000001, // UCD disconnect request
        ...
    }
    ```
#### `apdu.tpciNcdType`
- **NOTE** must NOT be set if the `TPCI_TYPE` of `apdu.tpci` is not set to
    ```
    TPCI_NCD: 0b11000000 // Numbered Control Data
    ```
- possible values
    ```
    KnxConstants.KNX_TPCI_SUBTYPES = {
        ...
        TPCI_NCD_ACK: 0b00000010, // NCD acknowledge message
        TPCI_NCD_NACK: 0b00000011 // NCD not-acknowledge message
    }
    ```
#### `apdu.apci`
- the message type on application level
- possible values
    ```
    KnxConstants.APCICODES = {
      GroupValue_Read: 0b0000000000, // Multicast (Value: 0)
      GroupValue_Response: 0b0001000000, // Multicast (Value: 64)
      GroupValue_Write: 0b0010000000, // Multicast (Value: 128)
      PhysicalAddress_Write: 0b0011000000, // Broadcast (Value: 192)
      PhysicalAddress_Read: 0b0100000000, // Broadcast (Value: 256)
      PhysicalAddress_Response: 0b0101000000, // Broadcast (Value: 320)
      ADC_Read: 0b0110000000, // Unicast (Value: 384)
      ADC_Response: 0b0111000000, // Unicast (Value: 448)
      Memory_Read: 0b1000000000, // Unicast (Value: 512)
      Memory_Response: 0b1001000000, // Unicast (Value: 576)
      Memory_Write: 0b1010000000, // Unicast (Value: 640)
      UserMemory_Read: 0b1011000000, // Unicast (Value: 704)
      UserMemory_Respond: 0b1011000001, // Unicast (Value: 705)
      UserMemory_11_Write: 0b1011000010, // Unicast (Value: 706)
      UserMemory_5_Write: 0b1011000011, // Unicast (Value: 707)
      ManufacturerInformation_Read: 0b1011000101, // Unicast (709)
      ManufacturerInformation_Response: 0b1011000110, // Unicast (710)
      ManufacturerSpecificCommand: 0b1011111000, // Unicast (760 - 767) [Manufacturer Specific Area]
      DeviceDescriptor_Read: 0b1100000000, // Unicast (Value: 768)
      DeviceDescriptor_Response: 0b1101000000, // Unicast (Value: 832)
      Restart: 0b1110000000, // Unicast (Value: 896)
      AccessRights_Read: 0b1111010001, // Unicast (Value: 977)
      AccessRights_Response: 0b1111010010, // Unicast (Value: 978)
      AccessRightsKey_Write: 0b1111010011, // Unicast (Value: 979)
      AccessRights_Write: 0b1111010100, // Unicast (Value: 980)
      PropertyValue_Read: 0b1111010101, // Unicast (Value: 981)
      PropertyValue_Response: 0b1111010110, // Unicast (Value: 982)
      PropertyValue_Write: 0b1111010111, // Unicast (Value: 983)
      PropertyDescription_Read: 0b1111011000, // Unicast (Value: 984)
      PropertyDescription_Response: 0b1111011001, // Unicast (Value: 985)
      SystemID_Write: 0b1111100000, // Broadcast (Value: 992)
      SystemID_Read: 0b1111100001, // Broadcast (Value: 993)
      SystemID_Response: 0b1111100010 // Broadcast (Value: 994)
    }
    ```
    - **DO NOT USE THE ACTUAL VALUES - USE THE KEYS** example:
        ```
        apdu.apci = "GroupValue_Read"
        ```
#### `apdu.data`
- application data as a `Buffer`
- not all APCIs have data in a separate fields
- some APCIs carrie data <= 6 bit inside the APCI field, this will be handled automatically
#### `apdu.inApciData`
- there are some APCIs which require data inside the APCI field + data inside a separate field
    ```
    apdu.inApciData = 3
    ``` 
    - would force the value 3 to be packed into `apdu.apci`
#### `adpu.bitlength` (optional)
- the bitlength of `apdu.data`
## Raw Message Buffer
- the message stored according to the KNX standard
- not explained in this documentation
