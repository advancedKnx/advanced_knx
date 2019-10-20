# Knx Addresses
- This file contains information on how to work with KNX addresses
- For this, the following class and its functions may be used
    ```js
    knx.RawMod.KnxAddress = class KnxAddress {
      static getAddrType (addrStr) {}
      static grpAddrStrGetL (grpAddrStr) {}
      static validateAddrStr (addrStr) {}
      static strToBin (addressStr) {}
      static binToStrGrpL2 (addressBin) {}
      static binToStrGrpL3 (addressBin) {}
      static binToInd (addressBin) {}
      static Uint16AddrToUint8Arr (addressUInt16) {}
      static Uint8ArrToUint16Addr (addressBinUint8Arr) {}
    }
    ```
- `getAddrType (addrStr) {}`: Gets the address type of an address string
    - **INPUTS MUST BE CHECKED WITH `validateAddrStr` before**
    - Example inputs - any valid knx address string
        ```
        '1.1.1', '0/2/4', '10/100', `15.15.255`, ...
        ```
    - Possible return values
        ```js
        knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_ADDR_TYPES.GROUP = 1
        knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_ADDR_TYPES.DEVICE = 0
        // ... or -1 if no type could be identified
        ```
- `grpAddrStrGetL (grpAddrStr) {}`: Gets the level `grpAddrStr`
    - **INPUTS MUST BE CHECKED WITH `validateAddrStr` before**
    - Example input - group valid address string
        ```
        '31/2047', '31/7/255', ...
        ```
    - Possible return values
        ```
        2 or three - other return values mean that the input is invalid
        ```
- `validateAddrStr (addrStr) {}`: Validates `addrStr`
    - Example input - any knx address string
        ```
        '16372', '10.19', '1.1.1', '31/7/255', ...
        ```
    - Possible return values
        ```
        zero - addrStr is valid
        minus one - addrStr is invalid
        ```
- `strToBin (addressStr) {}`: Converts `addressStr` into a binary KNX address
    - **INPUTS MUST BE CHECKED WITH `validateAddrStr` before**
    - Example inputs - any kind of KNX address string
        ```
        '1.1.1', '10/25', '1/2/3', ...
        ```
    - Possible return values
        ```
        0x8202, ... - any 2-Byte number
        null - addressStr can't be converted (invalid)
        ```
- `binToStrGrpL2 (addressBin) {}`: Converts `addressBin` into a level 2 group address string
    - Example inputs - any valid KNX address
        ```
        0x1802, 0x1101, ...
        ```
    - Possible return values
        ```
        '31/2047', '1/1000', ...
        null - addressBin can't be converted (invalid)
        ```
- `binToStrGrpL3 (addressBin) {}`: Converts `addressBin` into a level 3 group address string
    - Example inputs - any valid KNX address
        ```
        0x1203, 0x5555, ...
        ```
    - Possible return values
        ```
        '0/1/2', '7/5/100', ...
        null - addressBin can't be converted (invalid)
        ```
- `binToInd (addressBin) {}`: Converts `addressBin` into a individual address string
    - Example inputs - any valid KNX address
        ```
        0x1429, 0x4301, ...
        ```
    - Possible return values
        ```
        '15.15.255', '1.1.17', ...
        null - addressBin can't be converted (invalid)
        ```
- `Uint16AddrToUint8Arr (addressBinUint16) {}`: Converts `addressBinUInt16` into a Uint8Array
    - Example inputs - any valid Uint16 KNX address
        ```
        Uint16Array.from([0x1102]), ...
        ```
    - Possible return values
        ```
        Uint8Array.from([0x11, 0x02]), ...
        ```
- `Uint8ArrToUint16Addr (addressBinUint8Arr) {}`: Converts `addressBinUint8Arr` into a Uint16 value
    - Example inputs - any valid Uint8 array KNX address
        ```
        Uint8Array.from([0xf7, 0x3b]), ...
        ```
    - Possible return values
        ```
        Uint16Array.from([0xf7, 0x3b]), ...
        ```