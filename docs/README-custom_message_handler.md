# Custom Message Handlers
- Custom message handlers can be used to catch messages matching a given template
- Functions to work with the can be found in the `RawModCustomMsgHandlers` class
    ```js
    knx.RawMod.CustomMessageHandler = class RawModCustomMsgHandlers {
        static checkCallCustomMsgHandler (rawMsgJson, conContext) {}
        static registerCustomMsgHandler (template, callback, conContext) {}
        static removeCustomMsgHandler (template, conContext) {}
    }
    ```
##### static checkCallCustomMsgHandler (rawMsgJson, conContext) {}
- **This function is used internally to check if a incoming message matches any registered handler**
- If a matching handler was found, its callback function will be called
- `rawMsgJson`: The message that should be tested against all registered handlers
    - It is stored in Json - see [advanced/README-raw_messages.md]
- `conContext`: The KNX connection context 
    - See [README-connection_setup.md]
##### static registerCustomMsgHandler (template, callback, conContext) {}
- This function is used to register a custom message handler
- When registered, every incoming message will be matched against the registered handler (`checkCallCustomMsgHandler`)
- Registered handlers are stored here
    ```
    conContext.handlers.customMsgHandlers = []
    ```
- `template`: A json object the message will be matched against
    - Some examples can be found in `src/RawMod/CustomMessageHandlerTemplates.js`
    - A standard template looks like this
        ```
        template = {
            cemi: {
                // see [advanced/README-raw_messages.md]
            }
        }
        ```
            - The contents of `cemi` is eq. the `Raw Message Json` see [advacned/README-raw_messages.md]
    - **The APDU field is a special case**
        ```
        {
            apdu_length: 0,
            apdu_raw: Buffer.from([]),
            tpci: 0,
            apci: '',
            data: Buffer.from([])
        }
        ```
        - **Note** that the `apci` field will contain a describing string of the `tpci` field if the message is a non-apci message
- `callback`: The function that will be called when a message matched
- `conContext`: The connection context see [README-connection_setup.md]
    - It should take one argument: rawMsgJson - The message represented as JSON object see [advanced/README-raw_messages.md]
- A example registration could look like this
    ```js
    knx.RawMod.CustomMessageHandler.registerCustomMsgHandler({
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          apci: 'Memory_Response'
        }
      }
    }, rawMsgJson => {
      console.log("Got a matching message: %j", rawMsgJson)
    }, conContext)
    ```
- It will return something neq. `-1` on success and `-1` on error
##### static removeCustomMsgHandler (template, conContext) {}
- This function is used to remove un-register custom message handlers by their template
- **ALL** matching handlers will be deleted (e.g.: if two handlers have the same `template`)
- `template`: The template the handler was registered with
- `conContext`: The connection context see [README-connection_setup.md]
- It will return the number of deleted handlers on success and `-1` on error
    - (`0` will be returned if no matching handler was found)