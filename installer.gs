//////////////////////////////////////////////////////////////  
///====================== INSTALL ========================///
////////////////////////////////////////////////////////////
SS = get_custom_object// SEASHELL INSTALLER CUSTOM OBJECT
SS.cb = false
SS.version = "2.0.4c"//SEASHELL INSTALLER
LOG = @print
INPUT = @user_input
T = @typeof
NL = char(10)
COLUMNS = @format_columns
EXIT = function(s=null);if not s then s = "Exiting...".sys return exit(s); end function;
CLEAR = function; return clear_screen; end function;
S = get_shell 
C = S.host_computer
R = C.File("/")
HOME = home_dir
USER = active_user 
SS.mutate = function
    string.size = function(self, s)
        if T(s) == "number" then s = str(s)
        return "<size="+s+">"+self+"</size>"
    end function
    string.b = function(self)
        return "<b>"+self+"</b>"
    end function
    string.i = function(self)
        return "<i>"+self+"</i>"
    end function
    string.angle = function(n)
        if T(n)!= "number" then n = n.to_int 
        return "<rotate="+str(n)+">"+self+"</rotate>"
    end function
    string.voffset = function(n)
        if T(n)!= "number" then n = n.to_int 
        return "<voffset="+str(n)+">"+self+"</voffset>"
    end function
    string.pos = function(n)
        if T(n)!= "number" then n = n.to_int 
        return "<pos="+str(n)+">"+self+"</pos>"
    end function
    string.s = function(self)
        return self+" "
    end function
    string.white = function(self)
        return "<#FFFFFF>" + self + "</color>"
    end function
    string.grey = function(self)
        return "<#A5A5A5>" + self + "</color>"
    end function
    string.black = function(self)
        return "<#000000>"+self+"</color>"
    end function
    string.red = function(self)
        return "<#AA0000>" + self + "</color>"
    end function
    string.orange = function(self)
        return "<#FF6E00>" + self + "</color>"
    end function
    string.yellow = function(self)
        return "<#FBFF00>" + self + "</color>"
    end function
    string.green = function(self)
        return "<#00ED03>" + self + "</color>"
    end function
    string.lgreen = function(self)
        return "<#35fca6>"+self+"</color>"
    end function
    string.lblue = function(self)
        return "<#00BDFF>" + self + "</color>"
    end function
    string.blue = function(self)
        return "<#003AFF>" + self + "</color>"
    end function
    string.purple = function(self)
        return "<#D700FF>" + self + "</color>"
    end function
    string.cyan = function(self)
        return "<#00FFE7>" + self + "</color>"
    end function
    string.sys = function(self)
        return "[<#00FFE7>SeaShell</color>] <i>" + self.white
    end function
    string.debug = function(self)
        return "[<#00FFE7>debug</color>] <i>" +self.white
    end function
    string.ok = function(self)
        return "[<#00ED03><b>success</b></color>] " + self.white
    end function
    string.warning = function(self)
        return "[<#FBFF00><b>warning</b></color>] <i>" + self.grey
    end function
    string.error = function(self)
        return "[<#AA0000><b>error</b></color>] " + self.yellow
    end function
    string.prompt = function(self)
        return "["+"action required".yellow.b+"]"+"-- ".white+self.grey+" --> ".white
    end function
    string.fill = function(self)
        return "><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><>".blue + self //+ NL
    end function
    string.NL = function(self)
        return self+globals.NL
    end function
    string.strip = function(self)// forgot what this was going to be used for
        if self.len < 15 then return null
        self = self[:15]
        return self[:self.len-8]
    end function
    string.bitToByte = function(self)
        b = to_int(self);s=["B","KB","MB","GB"];i=0;
        while b>1024
            b=b/1024
            i=i+1
        end while
        return round(b,2)+s[i]
    end function
    string.isRoot = function(self, u, hex = "FFFFFF")
        if self == u then return self.green
        //if (self == u) or (u == "root") then return self.green
        if self == "root" or self == "unknown" then return self.red
        if self == "guest" then return self.orange
        return "<#"+hex+">"+self+"</color>"
    end function
    string.isSlash = function
        if self == "/" then return "root".green
        return self.grey
    end function
    string.isPc = function(self)
        if get_router(self).local_ip != self then return true
        return false
    end function
    string.isProc = function(self)
        if ["Xorg","kernel_task", "dsession"].indexOf(self) != null then return self.red
        if ["Terminal", "CodeEditor", "Browser", "Mail", "Settings","FileExplorer", "Notepad", "Chat", "ConfigLan", "AdminMonitor"].indexOf(self) != null then return self.green
        return self.yellow
    end function
    string.isIp = function(self)
        if not is_valid_ip(self) and not is_lan_ip(self) then return nslookup(self)
        return self
    end function
    string.isLan = function 
        if is_lan_ip(self) then return self
    end function
    string.getGw = function(self)
        if is_lan_ip(self) then return get_router.public_ip
        if is_valid_ip(self) then return self
        return "!Invalid!".error
    end function
    string.isUnknown = function(self, hex = "FFFFFF")
        if self.lower == "unknown" then return self.grey
        return "<#"+hex+">"+self+"</color>"
    end function
    string.rule = function(self, s = null)
        if self == "DENY" or s == "DENY" then return self.red
        if self == "ALLOW" or s == "ALLOW" then return self.green
        return self.grey;
    end function
    string.month_int = function(self)
        return to_int((["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",].indexOf(self))+1)
    end function
    string.wrap = function(self, hex = "FFFFFF", n = 20)
        sl = "["+self+"]"; sl = sl.len;
        if hex then s_t = "[<#"+hex+">"+self+"</color>]"
        if not hex then s_t = "["+self+"]"
        if sl >= n then return s_t
        for i in range(1, (n-sl)); s_t = s_t+"—"; end for;
        //for i in range(1, (n-sl)); s_t = s_t+"-"; end for;
        return s_t
    end function
    string.cap = function(self, cap, hex = "FFFFFF", ih = null)
        if hex and ih then return self+"[<#"+hex+">"+cap+"</color>]"
        if ih then return self+"["+cap+"]"
        return self+"[<#"+hex+">"+cap+"</color>]"
    end function
    string.title = function(self, hex = "FFFFFF", si = 40)
        sl = "["+self+"]"; sl = sl.len;
        s_t = "[<#"+hex+">"+self+"</color>]"
        if sl >= si then return s_t
        for i in range(1, (si-sl)/2); s_t = "-"+s_t+"-"; end for;
        return s_t
    end function
    // TODO: update bam string
    string.fromMd5 = function(self);
        if SS.debug then LOG("from md5 --> ".debug.s+self);
        if T(SS.dbh) != "file" then return self;
        find = SS.MD5.find(self);
        if find != null then return find;
        return self;
    end function;
    string.isOp = function(self, v)
        if self == v then return self.red
        return self.white
    end function
    // ======== Art from earlier versions of seashell
    string.ogconnect = function(self)
        if SS.og == null then return self
        out = ""
        out = out+"   _______________                        |".white+"*".red+"\_/".white+"*".red+"|________".white+NL
        out = out+"  |  ___________  |     ".white+".-.     .-.".red+"      ||_/-\_|______  |".white+NL
        out = out+"  | |           | |    ".white+".****. .****.".red+"     | |           | |".white+NL
        out = out+"  | |   ".white+"0   0".green+"   | |    ".white+".*****.*****.".red+"     | |   ".white+"0   0".red+"   | |".white+NL
        out = out+"  | |     -     | |     ".white+".*********.".red+"      | |     -     | |".white+NL
        out = out+"  | |   \___/   | |      ".white+".*******.".red+"       | |   \___/   | |".white+NL
        out = out+"  | |___     ___| |       ".white+".*****.".red+"        | |___________| |".white+NL
        out = out+"  |_____|\_/|_____|        ".white+".***.".red+"         |_______________|".white+NL
        out = out+"    _|__|/ \|_|_".white+"............".red+".*..............".red+"_|________|_".white+NL
        out = out+"   / ********** \                          / ********** \".white+NL
        out = out+" /  ************  \                      /  ************  \".white+NL
        out = out+"--------------------                    --------------------".white+NL
        out = out+self
        self = out
        return self
    end function
    string.ogsniff = function(self)
        o=""
        o = o+"                                   __".blue+NL
        o = o+"                                  |::|".blue+NL
        o = o+"                                  |::|".blue+NL
        o = o+"                 _..---.._        |::|".blue+NL
        o = o+"               .' /     \ `.      |::|".blue+NL
        o = o+"              /  /       \  \     |::|".blue+NL
        o = o+"             /  /         \  \    |  |".blue+NL
        o = o+"            /   |         |   \   |  |".blue+NL
        o = o+"           |    |   ___   |    |  |  |".blue+NL
        o = o+"  _`'..._-.|____|__|\\/|__|____|..|  | ___".blue+NL
        o = o+"  ____...  | .- - - - - - - -. | .|  |_   `'".blue+NL
        o = o+"    ____.  /.-----------------.\ .|  | ```..".blue+NL
        o = o+"``..      //'  `-._     _.-`  '\\ |  | ..".blue+NL
        o = o+"    ...-' ||'  /.-.\   /.-.\  '|| `..\...`'`".blue+NL
        o = o+"   ---._` \\:_ \(".blue+"o".red+")/...\(".blue+"o".red+")/._:// .----..---".blue+NL
        o = o+"    ___.._  __....   ._....._.....___".blue+NL
        o = o+"'' ___.._  __....   ._....._.....___".blue+NL
        o = o+self 
        return o
    end function
    string.oggotroot = function(self)
        o="" 
        o=o+"                                   ____".green+NL
        o=o+"                               /\|    ~~\".green+NL
        o=o+"                             /'  |   ,-. `\".green+NL
        o=o+"                            |       | X |  |".green+NL
        o=o+"                           _|________`-'   |X".green+NL
        o=o+"                         /'          ~~~~~~~~~,".green+NL
        o=o+"                       /'             ,_____,/_".green+NL
        o=o+"                    ,/'        ___,'~~         ;".green+NL
        o=o+"~~~~~~~~|~~~~~~~|---          /  X,~~~~~~~~~~~~,".green+NL
        o=o+"        |       |            |  XX'____________'".green+NL
        o=o+"        |       |           /' XXX|            ;".green+NL
        o=o+"        |       |        --x|  XXX,~~~~~~~~~~~~,".green+NL
        o=o+"        |       |          X|     '____________'".green+NL
        o=o+"        |   o   |---~~~~\__XX\             |XX".green+NL
        o=o+"        |       |          XXX`\          /XXXX".green+NL
        o=o+"~~~~~~~~'~~~~~~~'               `\xXXXXx/' \XXX".green+NL
        o=o+"                                 /XXXXXX\".green+NL
        o=o+"                               /XXXXXXXXXX\".green+NL
        o=o+"                             /XXXXXX/^\X2NAXX\".green+NL
        o=o+"                            ~~~~~~~~   ~~~~~~~".green+NL
        o = o+self
        return o
    end function
    string.ogfishtank = function(self)
        o=o+"|  \|/  *    .  .    . .. .      |".blue+NL
        o=o+"|   \|*/*     ..     _ . .       |".blue+NL
        o=o+"|   *|| |     ..   ><_> . _      |".blue+NL
        o=o+"|   |`|/     _ .         <_><    |".blue+NL
        o=o+"|    \|    ><_>              _   |".blue+NL
        o=o+"`-----!---------!!!---!!!---/ \--'".blue+NL
        o = o+self
        return o
    end function
    string.a = function(self)
        if SS.anon == true then return "HIDDEN".grey.size(14)
        return self
    end function
    string.oc = function(self)
        return "<mark=#00BDFF>"+self.b+"</font></mark>"
    end function
    string.crab = function(self)
        return ("C".red.b+".".white+"R".red.b+".".white+"A".red.b+".".white+"B".red.b).s+(self.white.i)
    end function
    string.raft = function(self)
        return ("R".red.b+".".white+"A".red.b+".".white+"F".red.b+".".white+"T".red.b).s+(self.white.i)
    end function

    // ======== LISTS
    list.table = function(title)
        return self
    end function
    list.select = function(l=null)
        if l then ret = l
        if l == null then ret = "[ "+"SELECT".grey+" ] "+NL
        c = 1
    for s in self
            if c == self.len then 
                ret = ret + str(c).white + "."+") ".white+s
            else
                ret = ret + str(c).white + "."+") ".white+s+NL
            end if
            c = c+1
    end for
        ret = ret//+"-- Press 0 to return --> ".grey
        return ret
    end function
    list.select_w_count = function(self, l)
        ret = "[ "+"SELECT".grey+" ] "+NL
        c = 1
        for i in range(0, l.len-1)
            ret = ret + str(c).white + "."+") ".white+self[i]+" "+l[i] +NL
        end for
    end function
    list.select2 = function()
        ret = "";c=1
        for s in self
        ret = ret + str(c).white + "."+") ".white+s+NL
        c = c+1
        end for
        ret = ret + "0".white+"."+") ".white+"Exploit the router".orange.b+NL
        ret = ret+NL+"Select".prompt
        return ret
    end function
    list.compileThese = function(f)
        LOG("ACTION REQUIRED, OPEN A SECOND TERMINAL".green.NL) 
        c = 1
        out = []
        for s in self
            if s == "main.src" then continue 
            out.push(c+".) CodeEditor.exe "+HOME+"/src/"+s)
            c=c+1
        end for
        return out.join(NL)
    end function
// end of mutation
end function
SS.mutate// to be reused in sf
// 
SRC = ["utils.src", "core.src", "modules.src", "main.src"]
CACHEDIRS = ["ss.logs", "ss.libs", "ss.libs/weak", "ss.libs/strong"]
CACHEITEMS = ["ss.dat", "ss.macros", "ss.aliases"]
CACHEFILE = null
CACHENAME = null

setUserConfig = function(act, fi)
	item = null 
	s = null
	run = null 
	if act == "-u" then// userconfig
		s = "User Config"
		f = C.File(fi.path+"/ss.dat")
        p = "ss.dat"
        d = "anonymousMode=0"+NL+"debugMode=0"+NL+"oldArtMode=1"+NL+"tutorialMode=0"+NL+"hackShopIp=214.85.237.165"+NL+"weakMemZone=null"+NL+"weakMemAddr=null"+NL+"hackRepoIp=214.85.237.165"+NL+"hackRepoWeakLib=null"+NL+"apiIp=150.74.29.50"+NL+"apiMemZone=0xF8E54A6"+NL+"apiMemVal=becolo"+NL+"apiPort=22"+NL+"apiAuth=2008TLCNoScrubs"+NL+"apiToken=null"
    else if act == "-m" then // usermacros
		s = "User Macros"
		f = C.File(fi.path+"/ss.macros")
		p = "ss.macros"
		d = "[MACRO NAME] [SS.CMD NAME] [ARGUMENTS] ; [SS.CMD NAME] [ARGUMENTS]"+NL+"EXAMPLE ls ; cd /"
    else if act == "-a" then // usermacros
		s = "User Aliases"
		f = C.File(fi.path+"/ss.macros")
		p = "ss.aliases"
		d = "aliasExampleName=cache"
    else 
		return LOG("Invalid arguments".warning)
	end if
	dat = null
	if f == null then 
		r = C.touch(fi.path, p)
		if T(r) == "string" then return LOG(r.warning+" "+p)
		f = C.File(fi.path+"/"+p)
		if f == null then return LOG("System file error".warning)
		r = f.set_content(d)
		wait(0.1)
		if T(r) == "string" then return LOG(r.warning)
		LOG("System file created: ".ok+p)
	end if
	dat = f.get_content	
end function
hasFolder = function(n, all = false, clean = false)
    o = get_shell
    if not clean then LOG("Searching for directory: ".sys+n)
        r = null
    ret = []
    if T(o) != "file" then
        if T(o) != "computer" then 
            r = o.host_computer.File("/")
        else 
            r = o.File("/")   
        end if
    else 
        r = rootFromFile(o)
    end if
    fs = r.get_folders+r.get_files
    while fs.len
        c = fs.pull
        if c.is_folder then fs = fs+c.get_folders+c.get_files
        if n == c.name and c.is_folder then ret.push(c)
        if not all and ret.len > 0 then break
    end while
    if not all and ret.len > 0 then return ret[0]
    if ret.len == 0 then return null
    return ret
end function
hasFile = function(n, all = false, clean = false)
    if not clean then LOG("Searching for file: ".sys+n)
    o = get_shell
    r = null
    if T(o) != "file" then
        if T(o) != "computer" then 
            r = o.host_computer.File("/")
        else 
            r = o.File("/")    
        end if 
    else 
        r = rootFromFile(o)
    end if
    if not r then return LOG("Unable to find root".error)
    fs = r.get_folders+r.get_files
    f = []
    while fs.len
        c = fs.pull
        if c.is_folder then fs = fs+c.get_folders+c.get_files
        if n == c.name and (c.is_folder == false) then f.push(c)
        if not all and f.len > 0 then break
    end while
    if not all and f.len > 0 then return f[0]
    if all then return f
    return null
end function
rootFromFile = function(o)
    if T(o) != "file" then return LOG("This is only intended for files".error)
    while o.parent != null
        if o.parent != null then o = o.parent
    end while
    return o
end function
fileFromPath = function(o, p)
    if T(o) != "file" then o = SS.Utils.ds(o, "file"); if o == null then return null
    cf = SS.Utils.rootFromFile(o)
    if p[0] != "/" then p = SS.Utils.path(p)
    if SS.debug then LOG("Entrance path: ".debug+p)
    if p == "/" then return cf
    file = null
    for pathIndex in p.split("/")// loop the path
        if pathIndex == "" then continue
        if cf.is_folder then cf = cf.get_folders+cf.get_files
        file = null
        for f in cf // loop the dir
            if f.name == pathIndex then
                cf = f
                file = f
                break
            end if 
        end for 
        if file == null then return null
    end for
    return file
end function
goHome = function(o, u)
    o = get_shell
    if SS.debug then LOG("go home --> ".debug+u)
    p = "/home/"+u
    if u == "root" then p = "/root"        
    frp = fileFromPath(o, p)
    if frp == null then LOG("GOHOME ERROR".error)
    if frp then return frp.path // p
    return "/" // changed from null to default /
end function
NEXT = function(label) 
    if INPUT(("Press 1 to | "+label.white+" | any to exit").prompt).to_int != 1 then EXIT("Exiting SeaShell installer".sys)
end function

CSTR = "Specify the name youd like for your cache directory, or enter to default to .ss".prompt
USTR = ("Specify the user to build SS as, or enter for "+USER.green).prompt
AUTHSTR = "Provide an auth pass to use seashell, or enter for no password".prompt
M1STR = "Specify mail account, or hit enter to login when using raft".prompt
M2STR = "Specify mail pw, or hit enter to login when using raft".prompt
RSSTR = "Provide an rshell ip, or enter to specify on use".prompt
UPSTR = "Specify the unsecure pw value you want NPCs computers to be changed to".prompt
UCON = function(label)
    set = INPUT(label)
    confirm = INPUT("CONFIRM: ".sys+": ".prompt)
    while set != confirm
        confirm = INPUT("CONFIRM: ".sys+": ".prompt)
    end while
    return confirm
end function

// check for cache folder
// build cache folder
install_src = function()
    LOG("Creating source files. . .".sys)
    if not C.File(HOME+"/src") then C.create_folder(HOME, "src")
    if not C.File(HOME+"/src") then return LOG("An error occured building the src folder in install".error)
    for s in SRC 
        if not C.File(HOME+"/src/"+s) then 
            if C.touch(HOME+"/src/", s) == 1 then LOG("Created file: ".ok+s) else LOG("There was an issue creating: ".warning+s)
        else;LOG("File already exists: ".grey+s)
        end if
    end for
    p1 = C.File(HOME+"/src/modules")
end function
build_main = function 
    LOG("Building main file. . .".sys)
    auth = INPUT(AUTHSTR)
    if auth.len == 0 then
        LOG("This build of SeaShell will NOT have a password".warning) 
        auth = ""
    else;
        LOG("Auth pass set to: ".sys+auth)
    end if
    user = INPUT(USTR)
    if user.len == 0 then
        LOG("This build of SeaShell will use: ".sys+active_user) 
        user = active_user
    else;LOG("SS user set to: ".sys+user)
    end if
    email = INPUT(M1STR)
    if email.len == 0 then
        LOG("This build of SeaShell will NOT have a email account saved, raft will prompt login".warning) 
        email = ""
    else;LOG("Email set to: ".sys+email)
    end if
    email_pw = INPUT(M2STR)
    if email_pw.len == 0 then
        LOG("This build of SeaShell will NOT have a email pw saved, raft will prompt login".warning) 
        email_pw = ""
    else;LOG("Email pw saved: ".sys+email)
    end if
    rshell = INPUT(RSSTR)
    if rshell.len == 0 then
        LOG("This build of SeaShell will prompt for an rshell".warning) 
        rshell = "1.1.1.1"
    else;LOG("rshell ip saved: ".sys+rshell)
    end if
    upw = INPUT(UPSTR)
    if upw.len == 0 then
        LOG("This build of SeaShell will default to NPC pw f1shb0wl".warning) 
        upw = "f1shb0wl"
    else;LOG("NPC unsecure pw: ".sys+upw)
    end if
    p1 = HOME+"/src/utils"
    p2 = HOME+"/src/core"
    p3 = HOME+"/src/modules"
    main_src = "///====================== INIT =========================////&import"+"_"+"code('"+p1+"')&import"+"_"+"code('"+p2+"')&import"+"_"+"code('"+p3+"')&// auth_pass auth_user mail_acct mail_pw rshell_ip unsecure_pw&// * LEAVING MAIL AND MAILPW EMPTY, WILL PROMPT FOR LOGIN EACH TIME&// * CHOOSING PASSWORD AS "" WILL SKIP AUTHORIZATION ON LAUNCH&SS.init('"+auth+"','"+user+"','"+email+"','"+email_pw+"','"+rshell+"','"+upw+"')&//////////////////////////////////////////////////////////////  &///==================== SEASHELL ========================////&////////////////////////////////////////////////////////////&"
    main_src = main_src.replace("'", """").replace("&", char(10))
    if C.File(HOME+"/src/main.src") then return C.File(HOME+"/src/main.src").set_content(main_src)
end function
build_src = function
    LOG("Before you compile, you must save the following files, to do so: ".NL+"USING SECOND TERMINAL, PASTE EACH COMMAND".NL+(SRC.compileThese(CACHEFILE)))
    if INPUT("Press 1 to confirm build".prompt).to_int != 1 then EXIT("Exiting install".sys)
    for f in SRC
        test = C.File(HOME+"/src/"+f)
        if not test then continue 
        LOG("Compiling: "+f+" @ "+HOME+"/src")
        if test.name == "main.src" then 
            if T(build_main) == "string" then return LOG("Failed to define the main.src, please adjust main.src manually")
        end if
        if test.name != "main.src" then compile = S.build(HOME+"/src/"+f, HOME+"/src/", 1) else compile = S.build(HOME+"/src/"+f, HOME+"/src/")
        if compile.len < 1 then 
            LOG("Compiled: ".ok+f[:-3])
            if test.name == "main.src" then continue
            if test.delete.len< 1 then LOG("Deleted: ".ok+f)
        else 
            LOG(compile.warning)
        end if
    end for
    if C.File(HOME+"/src/main") then 
        C.File(HOME+"/src/main").move("/bin", "ss")
        LOG("Compiled SeaShell --> ".sys+"use command ss to run SeaShell")
    end if
end function
check_cache = function
    LOG("Checking cache. . .".sys)
    hf = hasFolder(".ss")
    if not hf then 
        cn = UCON(CSTR)
        if cn.len == 0 then
            UCACHE = ".ss" 
        else
            UCACHE = cn
        end if
    else 
        UCACHE = ".ss"
        CACHEFILE = hf
    end if
    LOG("SS cache set to : ".ok+UCACHE)
    if not C.File(HOME+"/"+UCACHE) then; if C.create_folder(HOME, UCACHE) == 1 then; LOG("Created directory: ".ok+UCACHE); end if; end if
    if not C.File(HOME+"/"+UCACHE) then return LOG("An error occured building the cache folder in install".error)
    CACHEFILE = C.File(HOME+"/"+UCACHE)
    if not CACHEFILE then EXIT("Unable to find the cache file")
    if C.create_folder(CACHEFILE.path, "ss.logs") == 1 then LOG("Created folder: ".ok+"ss.logs");wait(0.1)
    if C.create_folder(CACHEFILE.path, "ss.libs") == 1 then LOG("Created folder: ".ok+"ss.libs");wait(0.1)
    if C.create_folder(CACHEFILE.path+"/ss.libs", "weak") == 1 then LOG("Created folder: ".ok+"weak");wait(0.1)
    if C.create_folder(CACHEFILE.path+"/ss.libs", "strong") == 1 then LOG("Created folder: ".ok+"strong");wait(0.1)
    setUserConfig("-u", CACHEFILE)
    setUserConfig("-m", CACHEFILE)
    setUserConfig("-a", CACHEFILE)
    return CACHEFILE
end function
build_db = function(CACHEFILE)
    LOG("Building db. . .".sys)
    CACHEFILE = hasFolder(".ss")
    if not CACHEFILE then C.create_folder(HOME, ".ss")
    CACHEFILE = hasFolder(".ss") 
    db_folders = ["libssh", "libftp", "libhttp", "libsql", "libsmtp", "librepository", "libchat", "librshell", "kernelrouter", "kernelrouter1", "init"]
    if not C.File(CACHEFILE.path) then return LOG("An error occured building the cache folder in install".error)
    if not C.File(CACHEFILE.path+"/dict") then C.create_folder(CACHEFILE.path, "dict")
    if not C.File(CACHEFILE.path+"/dict/exploits") then C.create_folder(CACHEFILE.path+"/dict", "exploits")
    if not C.File(CACHEFILE.path+"/dict/rainbow") then C.create_folder(CACHEFILE.path+"/dict", "rainbow")
    for folder in db_folders
        if hasFile(folder) then; LOG("Directory already exists: ".grey+folder); continue; end if
        if C.create_folder(CACHEFILE.path+"/dict/exploits", folder) == 1 then LOG("Created exploit folder for library: <color=green>"+folder)
    end for
    if C.File(CACHEFILE.path+"/dict/exploits").get_folders.len == db_folders.len then LOG("Exploit DB structure --> OK !".ok)
    LOG("<color=green>[init]</color> Building hash table structure . . ."+char(10)+"<color=orange>\n<i>NOTE</i>\n".fill+"\nUse ctrl+shift+v to paste contents into the terminal and hit ENTER;\nThe pasted text will likely not appear in the terminal\nSo trust the instructions :)\n".fill)
    for i in range(1,7)
        if C.File(CACHEFILE.path+"/dict/brute"+str(i)+".src") then 
            validate = INPUT("<color=yellow>[Action required]</color> <color=yellow>"+CACHEFILE.path+"/dict/brute"+str(i)+".src </color>already exists."+char(10)+"Press 1 to paste SRC into file, 0 to skip --> ").to_int
            content = null
            if validate == 1 then content = INPUT("<color=yellow>[Action required]</color> Paste contents for brute"+str(i)+".src > ")
            if not content then continue
            if C.File(CACHEFILE.path+"/dict/brute"+str(i)+".src").set_content(content) == 1 then LOG("Successfully saved <color=green>"+CACHEFILE.path+"/dict/brute"+str(i)+".src")
            continue
        end if
        if C.touch(CACHEFILE.path+"/dict", "brute"+str(i)+".src") == 1 then 
            LOG("brute"+str(i)+" creation --> OK")
            content = INPUT("<color=yellow>[Action required]</color> Paste contents for brute"+str(i)+".src > ")
            if C.File(CACHEFILE.path+"/dict/brute"+str(i)+".src").set_content(content) == 1 then LOG("Successfully saved <color=green>"+CACHEFILE.path+"/dict/brute"+str(i)+".src")
            continue
        end if
        log("There was an issue with <color=yellow>"+CACHEFILE.path+"/dict/brute"+str(i)+".src")
    end for
end function
build_launch = function(CACHEFILE)
    LOG("Launching builder. . .".sys)
    if not CACHEFILE then C.create_folder(HOME, ".ss")   
    S.launch(CACHEFILE.path+"/dict/builder");
    if SS.cb != true then return print("Warning: we did not get a reponse from builder.".warning)
    print("".fill+NL+"Builder return --> OK !".ok+char(10)+"Starting cleanup . . .");
    for file in C.File(CACHEFILE.path+"/dict").get_files
        if file.indexOf("brute") or file.indexOf("builder") then 
            f = file.name
            print("Deleting: <color=yellow>"+file.name)
            if file.delete.len < 1 then print("<color=green>Successfully deleted "+f) 
        end if
    end for
end function
build_hashes = function(CACHEFILE)
    LOG("<color=green>[init]</color> Building hash files . . .") 
    if not CACHEFILE then 
        C.create_folder(HOME, ".ss")
        CACHEFILE = C.File(HOME+"/.ss")
    else 
        p = CACHEFILE.path

    end if
    builder_src = "data = get_custom_object;import_"+"code('"+p+"/dict/brute1.src');import_"+"code('"+p+"/dict/brute2.src');import_"+"code('"+p+"/dict/brute3.src');import_"+"code('"+p+"/dict/brute4.src');import_"+"code('"+p+"/dict/brute5.src');import_"+"code('"+p+"/dict/brute6.src');import_"+"code('"+p+"/dict/brute7.src');;Crack={'isNum':['0','1','2','3','4','5','6','7','8','9'],'alpha':'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789','max':64,'classID':'CrackLib','Version':'2.5.1-rc.1'}; Crack.dump = function;print 'Building the rainbow tables ...';l=[];l=brute1+brute2+brute3+brute4+brute5+brute6+brute7;r=[];a=0;c=get_shell.host_computer;p=c.File('"+p+"/dict/rainbow').path;for b in l;if self.isNum.indexOf(b[0])!=null then ;r.push b+':'+md5(b);continue;end if;r.push b+':'+md5(b);r.push b.lower+':'+md5(b.lower);if r.len>3792 then;f=null;c.touch(p,'r'+a);f=c.File(p+'/r'+a);f.set_content(r.join(char(10)));r=[];a=a+1;end if;end for;if r.len then;f=null;c.touch(p,'r'+a);f=c.File(p+'/r'+a);f.set_content(r.join(char(10)));data.cb = true;exit('completed build process');end if;end function;Crack.dump"
    p1 = CACHEFILE.path+"/dict/builder.src"

    if T(C.touch(CACHEFILE.path+"/dict", "builder.src")) != "string" then 
        LOG("".fill+NL+"Builder src created! --> compiling . . .".ok) ;wait(1);
        if T(C.File(CACHEFILE.path+"/dict/builder.src").set_content(builder_src.replace("'", """").replace(";", char(10)))) == "string" then exit("Failed to set builder content")
        compile = S.build(p1, p1[:-11], 0)
        if compile.len > 1 then print(compile);
        wait(0.5);
        build_launch(CACHEFILE)
    else if (C.File(p1)) then
        LOG("".fill+NL+"Builder source found! --> building . . .")
        if T(C.File(CACHEFILE.path+"/dict/builder.src").set_content(builder_src.replace("'", """").replace(";", char(10)))) == "string" then exit("Failed to set builder content")
        compile = S.build(p1, p1[:-11], 0)
        if compile.len > 1 then print(compile);
        wait(0.5);
        build_launch(CACHEFILE)
    else if (C.File(p1[:-4])) then 
        LOG("".fill+NL+"Builder found! --> launching . . .")
        build_launch(CACHEFILE)
        print("Warning: an error occured during the build process.".warning)
    else
        return LOG("An error occured with the builder's building process, how ironic".warning)
    end if

end function
CLEAR;LOG(("SeaShell Installer v"+SS.version).title("FFFFFF", 30))
if params.len < 1 or (["help", "-h", "-help"].indexOf(params[0]) != null) then EXIT("SeaShell Installer: ".sys.NL+"PRIMARY ARGUMENTS".grey.b.NL+" -a ".wrap.cap("Installs SeaShell, and all required files and directories").NL+" -src ".wrap.cap("Build SeaShell's source code").NL+" -cache ".wrap.cap("Build SeaShell cache").NL+" -db ".wrap.cap("Build exploit database").NL+" -hash ".wrap.cap("Build hash database"))
if params[0] == "-a" then
    NEXT("build SeaShell src, cache, hash + exploit db")
    CACHEFILE = check_cache
    NEXT("proceed to source create")
    install_src// check for src files and make if not present
    NEXT("proceed to source build")
    build_src
    NEXT("proceed to db build")
    build_db(CACHEFILE)
    NEXT("proceed to build hashes")
    build_hashes(CACHEFILE)
else if params[0] == "-cache" then 
    check_cache
else if params[0] == "-src" then
    CACHEFILE = check_cache
    install_src
    build_src
else if params[0] == "-db" then
    CACHEFILE = check_cache
    if INPUT("Press 1 to build db".prompt).to_int == 1 then build_db(CACHEFILE)
    build_hashes(CACHEFILE)
end if
//////////////////////////////////////////////////////////////  
///====================== INSTALL ========================///
////////////////////////////////////////////////////////////
