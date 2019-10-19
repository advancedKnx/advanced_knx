# Operational information
- This file contains unsorted information about how to operate on a running KNX bus/how things work.
- Most information is taken from the freely available KNX STANDARD Version 2.1 - available at:
    - https://my.knx.org/en/shop/knx-specifications
- Most information is only relevant for administrative tasks on the KNX bus
    - (managing devices, disabling devices, reading/writing certain attributes like the device address, ...)
### The Run State Machine - Control the application runstate (+ loadstate)
- All of this can be applied to the PeiProg (secondary application)
- Information in this section are taken from:
    ```
    The KNX STANDARD v2.1 Volume 03 - System Specification -> Resources
        Sections 4.17 (Load State Machine) and 4.18 (Run State Machine)
    ```
    - For a more complete explanation of things, look there 

- This section also describes how to control the runstate of the secondary application, if available 
- The application runstate controls if the device application is running or not
###### The theory
- The Load State Machine can have 4( + 2) different states
    ```
    Name            Value   Description
    ---------------------------------------------------
    Unloaded        0x00    Application not loaded
    Loaded          0x01    Application loaded
    Loading         0x02    Application loading
    Error           0x03    Application failed to load
    (Unloading      0x04    Application unloading)
    (LoadCompleting 0x05    Checking application validity)
    ```
- The Load State Machine accepts five different commands from remote
    ```
    Name            Value   Description
    ----------------------------------------------------------------------------------
    NOP             0x00    NOP
    Load            0x01    Starts the application-load process
    Complete Load   0x02    Declares the application as loaded (when in 'Loading' state)
    Special Load    0x03    Transfers some data to the device - debugging/development
    Unload          0x04    Starts the application-unload process
    ```
    - Unloading the application may force the RSM into 'Ready'
- The Run State Machine can have 5( + 1) different states
    ```
    Name            Value   Description
    -----------------------------------------------------------------------------------------------
    Halted          0x00    Application halted. Will switch to ready when the application is loaded
    Running         0x01    Application running
    Ready           0x02    Application ready
    (Terminated     0x03    Application terminated)
    Starting        0x04    Application starting
    Halting         0x05    Application halting
    ``` 
- The Run State Machine accepts three commands from remote
    ```
    Name            Value   Description
    -----------------------------------------------
    NOP             0x00    NOP
    Restart         0x01    Restart the application
    Halt            0x02    Halt the application
    ```
    - To successfully restart the application, the LSM has to be 'Loaded'
        - If it isn't, the RSM will change to 'Ready'
        - If 'Ready', it will automatically change to 'Running' as soon as the LSM is 'Loaded'
- Note that, when a application is terminated and then started again, it may process inputs that occurred while the application was offline
    - For example a light switch may report that it was pressed after restarting if it was pressed while offline
    - To eliminate this effect, restarting the whole device is a solution
###### Examples
- All examples assume that
    - ```con``` is a connection object returned from ```Knx.Connection()```
    - ```Knx``` is eq. ```import Knx from '../../src'```
    - ```1.1.1``` is an address of an existing KNX device on the bus
    - ```mv``` stores the maskversion of the target device
- To stop the application running on a device
    ```
    await Knx.RawMod.KnxRunStateMachine.sendRSMCMD("1.1.1", null, mv, 2000, Knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_RSM_CMDS.HaltApplication, con, Knx.RawMod.errorHandler)
    ```
- To restart the application
    ```
    await Knx.RawMod.KnxRunStateMachine.sendRSMCMD("1.1.1", null, mv, 2000, Knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_RSM_CMDS.RestartApplication, con, Knx.RawMod.errorHandler)
    await Knx.RawMod.KnxLoadStateMachine.sendLSMCMD("1.1.1", null, mv, 2000, Knx.RawMod.KNX_KNXNET_CONSTANTS.KNX_LSM_CMDS.LoadApplication, con, Knx.RawMod.errorHandler)
    
    // Read the runstate to check for success
    await Knx.RawMod.KnxRunStateMachine.getRSMState("1.1.1", null, mv, 2000, con, Knx.RawMod.errorHandler)
    ```