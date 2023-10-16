///====================================================////
///=================== NPM WRAPPER ====================////
///====================================================////
// Import, or directly use this code in your program
// The api methods require a developer token, please register an account


// metaxploit: MetaxploitLib
// clientVersion: string | null
getAPI = function(metaxploit, clientVersion = "1.0.3")// : Map | null
    if typeof(metaxploit) != "MetaxploitLib" then return print("metaxploit required for api to work.")
    netSession = metaxploit.net_use("71.204.103.26", 80)
    if not netSession then return 501
    metaLib = netSession.dump_lib
    if not metaLib then return 500
    remoteShell = metaLib.overflow("0x28BF967B", "parame")
    if typeof(remoteShell) != "shell" then return 503
    interface = get_custom_object
    api = {}
    api.classID = "NPM api"
    api.connection = remoteShell
    api.clientVersion = "1.0.3" // WIP cargo-system
    // ----------------------------------------------------------------------
    // GAIN A DEVELOPER TOKEN BY REGISTERING ON THE NPM CLIENT
    api.api_token = "get access to more features by registering an account!"
    // ----------------------------------------------------------------------

    recursiveCheck = function(anyObject, maxDepth = -1)
        if maxDepth == 0 then return true
        if @anyObject isa map or @anyObject isa list then
            for key in indexes(@anyObject)
                if not recursiveCheck(@key, maxDepth - 1) then return false
            end for
            for val in values(@anyObject)
                if not recursiveCheck(@val, maxDepth - 1) then return false
            end for
        end if
        if @anyObject isa funcRef then return false
        return true
    end function
    // ================--------================
    // ===============| NPM |===============
    // ================--------================
    //service connection test
    api.testConnection = function // : boolean
        interface.args = ["testConnection"]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return false
        if @interface.ret isa funcRef or @interface.ret isa map then return false
        return true
    end function
    //api check
    api.apiCheck = function // : boolean
        interface.args = ["apiCheck", self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return false
        if @interface.ret isa funcRef or @interface.ret isa map then return false
        return @interface.ret
    end function
    //client version check
    api.versionCheck = function // : string
        interface.args = ["versionCheck", self.clientVersion, self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return false
        if not recursiveCheck(@interface.ret) then return null
        if @interface.ret[0] == self.clientVersion then return null
        return @interface.ret
    end function

    // ================--------================
    // ==============| EXPLOITS |==============
    // ================--------================
    //load exploit cache into memory ** requires a token **
    api.loadExploits = function // : file | null
        interface.args = ["loadExploits", self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        return @interface.ret
    end function
    //load exploit cache into memory ** requires a token **
    api.loadHashes = function // : file | null
        interface.args = ["loadHashes", self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        return @interface.ret
    end function
    // libName: string
    // libVersion: string
    // libPrint: boolean
    // return exploit lookup
    api.getExploits = function(libName, libVersion, libPrint = 0) // : Map | string
        interface.args = ["getExploits", libName, libVersion, libPrint, self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        if not recursiveCheck(@interface.ret) then return null
        return @interface.ret
    end function
    // metaLib: MetaLib
    // return formatted map
    api.scanMetaLib = function(metaLib)
        interface.args = ["scanLib", metaLib, self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        if not recursiveCheck(@interface.ret) then return null
        return @interface.ret
    end function
    // rawHash: string
    // simple search and print password
    api.checkHash = function(rawHash)
        interface.args = ["checkHash", rawHash, self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        if not recursiveCheck(@interface.ret) then return null
        return @interface.ret
    end function
    // mailHash: string
    // simple search and print password
    api.mailHash = function(rawMail)
        interface.args = ["mailHash", rawMail, self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        if not recursiveCheck(@interface.ret) then return null
        return @interface.ret
    end function
    // ip: string
    // user: string | null
    // port: number | null
    // protocol: string | null
    // return result of dictionary attack
    api.getHashConnection = function(ip, user = "root", port = 22, protocol = "ssh")
        interface.args = ["getHashConnection", ip, user, port, protocol, self.api_token]
        self.connection.launch("/root/routes/interface")
        if not hasIndex(interface, "ret") then return null
        if not recursiveCheck(@interface.ret) then return null
        return @interface.ret
    end function


    //all api method end

    return api
end function
///====================================================////
///=================== NPM WRAPPER ====================////
///====================================================////
