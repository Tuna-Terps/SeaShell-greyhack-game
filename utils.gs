//////////////////////////////////////////////////////////////  
///======================= UTILS ========================////
////////////////////////////////////////////////////////////
SS = get_custom_object// SEASHELL CUSTOM OBJECT
SS.version = "1.0.7a"
SS.cwd = current_path
SS.ccd = ".ss"// current cache dir, this is where seashell builds
SS.debug = null
SS.anon = false
SS.og = null
SS.pastecb = false//builder
SS.o = null // current object
SS.bamrun = null// BAM runtask
SS.bamargs = []
SS.bamret = null // return?
SS.bamres = null// result?
SS.cb = null
SS.dbe = null
SS.dbec = 0
SS.dbh = null
SS.dbhc = 0
SS.dbhl = []
SS.dbl = null
SS.remote = false
OGT = function; s=true;if SS.og then s=null;SS.og=s;end function;
EXIT = function(s=null);if not s then s = "Exiting...".sys return exit(s); end function;
///==================== FuncRefs ========================////
LOG = @print
INPUT = @user_input
HOME = @home_dir
T = @typeof
NL = char(10)
COLUMNS = @format_columns
CLEAR = function; return clear_screen; end function;
///==================== Maps ========================////
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
    return "["+"input".white.b+"]"+"-- ".white+self.grey+" --> ".white
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
// end of mutation
end function
SS.mutate// to be reused in sf
///======================== DATE & UPTIME =========================////
SS.Date = {}
SS.Date.dd = null
SS.Date.mm = null
SS.Date.yy = null
SS.Date.hh = null
SS.Date.mm = null
SS.Date.add = function 
    d = current_date.split(" - ")
    d_p = d[0].split("/")
    t_p = d[1].split(":")
    self.dd = d_p[0]
    self.mm = d_p[1].month_int;
    self.yy = to_int(d_p[2]);
    self.hh = to_int(t_p[0]);
    self.m = to_int(t_p[1]);
    return self
end function// current
// TODO: date now
SS.Date.now = function()
    date = current_date.split(" - ")
    d_p = date[0].split("/");t_p = date[1].split(":");
    dd = to_int(d_p[0]);
    mm = d_p[1].month_int;
    yy = to_int(d_p[2]);
    hh = to_int(t_p[0]);
    m = to_int(t_p[1]);
    ret = (yy * 31536000 + mm * 2592000 + dd * 86400 + hh * 3600 + m * 60)
    return ret
end function
SS.Date.timer = function(start, jt = null)
    if jt then return str(SS.Date.up(round(time-start)))
    LOG("Elapsed: ".sys+str(SS.Date.up(round(time-start))))
end function
SS.Date.up = function(t = null)
    s=["s","m","h","d"];
    i=0;c=60;
    if not t then t = floor(time)
    if t<60 then return round(t,2)+s[i]
    while t>60
        if i == 3 then c = 24
        t=t/c
        i=i+1
    end while
    return round(t,2)+s[i]
end function
///======================== UTIL =========================////
SS.Utils = {}
SS.Utils.ds = function(o, type = "computer")
    types = [{"t": "shell", "v": 3}, {"t": "ftpshell", "v": 3}, {"t": "computer", "v": 2}, {"t": "file", "v": 1}]
    ds = null
    ret = null
    for t in types 
        if t["t"] != type then continue
        if t["t"] == type then ds = t 
        if SS.debug then LOG("ds: ".debug+T(o).white+" --> "+ds["t"].green)
        break
    end for
    if T(o) == "shell" or T(o) == "ftpshell" then
        if ds["v"] == 3 then ret = o 
        if ds["v"] == 2 then ret = o.host_computer
        if ds["v"] == 1 then ret = o.host_computer.File("/")
    else if T(o) == "computer" then
        if ds["v"] > 2 then
            LOG("Cannot perform this operation with a computer".error) 
            return null
        end if
        if ds["v"] == 2 then ret = o 
        if ds["v"] == 1 then ret = o.File("/")
    else if T(o) == "file" then
        if SS.debug then LOG("ds: c3".debug) 
        if ds["v"] > 1 then
            LOG("Cannot perform this operation with a file".error)
            return null
        end if
        ret = o
    end if
    if ret == null then LOG("ds error".error)
    return ret
end function
SS.Utils.user = function(o)
    if not o then return LOG("Invalid parameter provided: ".error+o)
    if SS.debug then LOG("Utils:user ".debug+T(o))
    h = null
    if T(o) != "file" then
        if T(o) != "computer" then o = o.host_computer
        if T(o.create_group("root", "fish")) != "string" then
            if SS.debug then LOG("IsUser ".debug+"root") 
            o.delete_group("root", "fish")
            return "root"
        end if
        h = o.File("/home")
    else 
        h = SS.Utils.fileFromPath(o, "/home")
        r = SS.Utils.rootFromFile(o)
        if r.owner == "root" then
            rc = r.set_owner("root")
            if rc.len < 1 then return "root"
        end if
    end if    
    if h == null then return "unknown"
    for f in h.get_folders
        if f.name == "guest" then continue
        if (f.has_permission("r") == true) and (f.has_permission("w")==true) and (f.has_permission("x")==true) then return f.name
    end for
    return "guest"
end function
SS.Utils.isRoot = function(o)
    if T(o) == "file" then 
        if T(o).owner == "root" then return true; 
    else 
        if T(o) != "computer" then o = o.host_computer
        if T(o.create_group("root", "fish")) != "string" then 
            o.delete_group("root", "fish"); return true;
        end if 
    end if
    return false;
end function
SS.Utils.path=function(p)
    if SS.debug then LOG("Utils:path ".debug+p)
    if p[0] != "/" and SS.cwd != "/" then p = SS.cwd+"/"+p
    if p[0] != "/" and SS.cwd == "/" then p = SS.cwd+p
    if p == ".." and SS.cwd != "/" then 
        parse = p.split("/")
        p = parse[0]+"/"
    end if
    return p
end function
SS.Utils.dash = function(p, u)
    if SS.debug then LOG("Utils:dash ".debug+p)
    ps = p.split("/");ps.pull;
    if SS.debug then LOG("home alias ".debug+ps+" : "+u)
    if u == "root" then 
        if ps[0] != u then return p
        r = 1
    else
        if ps.len == 1 and ps[0] != u then return "/"+ps[0]  
        r = 2;
    end if 
    if ps.len > 1 and ps[1] != u then return p    
    n = "~/";
    if ps.len < r+1 then return n
    for i in range(r,ps.len-1)
        n=n+ps[i]+"/"
    end for
    return n
end function
SS.Utils.rootFromFile = function(o)
    if T(o) != "file" then return LOG("This is only intended for files".error)
    while o.parent != null
        if o.parent != null then o = o.parent
    end while
    return o
end function
SS.Utils.getFromFile = function(o, p)
    if T(o) != "file" then return LOG("This is only intended for files".error)
    o = SS.Utils.rootFromFile(o)
    r = o.get_folders+o.get_files
    if p[0] != "/" then p = SS.Utils.path(p)
    parse = p.split("\/")// individual path
    mo = null // mutable file
    while 1
        cf = r.pull
        for i in range(0, parse.len-1)
            if cf.name == parse[i] then mo = cf
            if mo != null  and (i != parse.len-1) then break
            if mo != null and (i == parse.len-1) then return mo
        end for
        if mo == null then break
        if cf.is_folder then r = cf.get_folders+cf.get_files
        mo = null
    end while
    return mo
end function
SS.Utils.fileFromPath = function(o, p)
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
SS.Utils.goHome = function(o, u = null)
    if not u then u = SS.Utils.user(o)
    if SS.debug then LOG("go home --> ".debug+u)
    p = "/home/"+u
    if u == "root" then p = "/root"        
    frp = SS.Utils.fileFromPath(o, p)
    if frp == null then LOG("GOHOME ERROR".error)
    if frp then return frp.path // p
    return "/" // changed from null to default /
end function
SS.Utils.goConfig = function(o, u = null)// : String | null
    if not u then u = SS.Utils.user(o)
    if u == "root" then 
        p = "/root/Config"
    else 
        p = "/home/"+u+"/Config"
    end if
    if SS.Utils.fileFromPath(SS.Utils.ds(o,"file"), p) != null then return p
    return null
end function
SS.Utils.datapls = function 
    dat = INPUT("Specify a 3rd argument".prompt)
    if dat == ""  or dat == " " then dat = SS.cfg.unsecure_pw; if dat == SS.cfg.unsecure_pw then LOG("Defaulting to unsecure pw . . .".sys)
    if dat == null then return null 
    return dat
end function
SS.Utils.hasFile = function(o, n, all = false, clean = false)
    if not clean then LOG("Searching for file: ".sys+n)
    r = null
    if T(o) != "file" then
        if T(o) != "computer" then 
            r = o.host_computer.File("/")
        else 
            r = o.File("/")    
        end if 
    else 
        r = SS.Utils.rootFromFile(o)
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
SS.Utils.hasFolder = function(o, n, all = false, clean = false)
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
        r = SS.Utils.rootFromFile(o)
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
SS.Utils.hasLib = function(o, l, p = null, clean = null)
    lib = null
    if clean == null then LOG("Attempting to load library: ".sys+l)
    if p == null then lib = include_lib("/lib/"+l)
    if p != null then lib = include_lib(p)
    if lib == null then 
        lo = SS.Utils.hasFile(o, l)
        if lo != null then 
            lib = include_lib(lo.path); 
        end if
    end if
    if lib == null and (clean != null) then LOG("Library not found: ".warning+l)
    if lib and (clean == null) then LOG("Found library: ".ok+T(lib))
    return lib
end function
SS.Utils.loadLib = function(o, mx, n)
    if SS.cmx == null then return LOG("program is operating under cfg: ".warning+SS.cfg.label)
    LOG("Attempting to load metalib: ".sys+n)
    if T(o) == "shell" or T(o) == "ftpshell" then r = o.host_computer.File("/")
    if T(o) == "file" then r = SS.Utils.rootFromFile(o)
    if T(o) == "computer" then r = o.File("/")
    if not obj or r == null then return LOG("couldnt crawl fs".error)
    r=root.get_folders+root.get_files;
    mxf = null
    while r.len
        c=r.pull;
        if currFile.is_folder then r=r+c.get_folders+c.get_files;
        ml=mx.load(c.path);
        if T(ml) == "MetaLib" and n == c.name then
            LOG("found library: ".ok+c.name.green)
            mxf=ml;
            break;
        end if
    end while
    return mxf
end function
SS.Utils.saveFileFromList = function(o, l)
    if T(o) != "file" then return LOG("Must be of type file".error)
    set = null
    c = 0
    for i in l 
        if i == char(10) or i == "\n" or i == "" then
            set = set+char(10)
        else 
            if c == 0 then 
                set = set+i
            else
                set = set+char(10)
            end if
        end if
        c=c+1
    end for
    if T(o.set_content(set)) != "string" then LOG("Saved file: ".ok+o.name)
end function
//TODO: services list
SS.Utils.listServices = function(o)
    svs = SS.Utils.fileFromPath(o, "/lib")
    svs_dis = null
    if not svs then return
    // get a list of fwd ports 
    // loop subnets to check local services 
    for s in svs.get_files
        if not s.is_binary then continue
        library = include_lib(s.path)//SS.Utils.hasLib(o, s.name)
        if T(library) != "service" then continue
        status = "----->"+" missing".red+" X".grey
        if library == null then continue
        running = null
        router = get_router
        ports = router.device_ports(o.host_computer.local_ip)
        fwdPorts = router.used_ports
        fwd = " UNKNOWN".grey
        for p in ports
            srv = router.port_info(p)
            if not srv then continue
            lan = p.get_lan_ip
            service_parsed = srv.split(" ")
            service_lib = service_parsed[0]
            if ("lib"+service_lib+".so" == s) and (lan == ip) then 
                fwd = " INTERNAL".green
            end if
        end for
        for p in fwdPorts
            srv = router.port_info(p)
            if not srv then continue
            lan = p.get_lan_ip
            service_parsed = srv.split(" ")
            service_lib = service_parsed[0]
            if ("lib"+service_lib+".so" == s) and (lan == ip) then 
                fwd = " EXTERNAL".red
            end if
        end for
        test = library.stop_service
        if test == 1 then 
            library.start_service
            running = true
        end if
        if not running then 
            status = "----->"+" offline".yellow+fwd
        else 
            status = "----->"+" online".yellow+fwd
        end if
        svs_dis= s.name+" "+status+"\n"+svs_dis
    end for
    return LOG("".fill.blue+NL+COLUMNS(svs_dis))
end function
SS.Utils.ison = function(b)
    if b then return "ENABLED".green
    return "DISABLED".grey
end function
SS.Utils.random_ip = function()
    while true //loop
        ip = floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) //Generate a random ip
        if not is_valid_ip(ip) or is_lan_ip(ip) then continue //If the ip is invalid, try again
        //if not get_router(ip) then continue //do not check for this cause most of the time there will be a router and this slows down the process A LOT
        return ip //If the ip is valid, break out of the loop
    end while
end function
SS.Utils.router_fish = function(v)
    if not v or v.indexOf(".") == null then return LOG("Invalid arguments".warning)
    LOG("Fishing for kernel router version: ".sys+v)
    ret = null
    while 1 
        ip = floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) //Generate a random ip
        if not is_valid_ip(ip) or is_lan_ip(ip) then continue //If the ip is invalid, try again
        r = get_router(ip); if not r then continue; 
        if r.kernel_version != v then continue;
        return ip  
    end while
end function
SS.Utils.port_fish = function(p) 
	if ["21", "22", "25", "80", "141", "8080", "1222", "1542", "3306","3307","3308","6667", "37777"].indexOf(p) == null then LOG("Not a commonly used port, are you trying to catch a marlin?".warning)
    p = p.to_int
    if T(p) != "number" then return LOG("Inalid arguments".warning)
    LOG(("Fishing @ port "+str(p).green+" . . . ><> . . . ><> . . . ><>").sys)
    while 1 
        ip = floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) //Generate a random ip
        if not is_valid_ip(ip) or is_lan_ip(ip) then continue //If the ip is invalid, try again
        r = get_router(ip); if not r then continue; 
        ports = r.used_ports
        if ports.len == 0 then continue
        for po in ports 
            if po.port_number == p then return ip 
        end for
    end while
end function
SS.Utils.lib_fish = function(l, lv)
    if ["ssh", "ftp", "http", "sql", "rshell", "repository", "chat"].indexOf(l) == null then return LOG("invalid lib specified".warning)
    LOG("Fishing for library: ".sys+l+" "+lv)
    while 1 
        ip = floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) //Generate a random ip
        if not is_valid_ip(ip) or is_lan_ip(ip) then continue //If the ip is invalid, try again
        r = get_router(ip); if not r then continue; 
        ports = r.used_ports
        if ports.len == 0 then continue
        for po in ports
            p_i = r.port_info(po)
            p = p_i.split(" ")
            if p[0] != l then continue
            if p[1] != lv then continue
            return ip
        end for
    end while
end function
SS.Utils.wipe_logs = function(o)
    cf = null
    if T(o) == "file" then 
        cf = SS.Utils.fileFromPath(o, "/etc/fstab")
    else 
        if T(o) != "computer" then o = o.host_computer
        cf = o.File("/etc/fstab")
    end if
    status = "Unmodified".red
    if cf and cf.has_permission("w") then 
        cf.set_content(NL+NL+NL+NL+NL+NL+NL+NL+NL+NL+"><>")
        copied = cf.copy("/var/", "system.log"); wait(0.1);
        cf.set_content("")
        if copied == 1 then status = "Corrupted".green
    else
        if T(o) != "file" then
            h =  SS.Utils.goHome(o)
            o.touch(h, "fish.txt")
            f = o.File(h+"/fish.txt")
            if f != null then
                copied = f.copy("/var/", "system.log"); wait(0.1);
                f.set_content("")
                if copied == 1 then status = "Corrupted".yellow
            end if
        end if
    end if
    LOG("System Log: ".sys+status)
end function 
SS.Utils.wipe_tools = function(o, p = null)
    if not p then p = SS.ccd
    fo = SS.Utils.hasFolder(p)
    if not fo then return LOG("No cache to wipe")
    d = fo.delete
    if d.len > 1 then return LOG(d.warning)
    LOG("Tools have been wiped from system".ok)
end function 
SS.Utils.wipe_sys = function(o)
    if INPUT("Confirm (1) you want to wipe this system: ".prompt).to_int != 1 then return
    boot = null; sys = null; 
    if T(o) == "file" then 
        boot = SS.Utils.fileFromPath(self.o, "/boot")
        sys = SS.Utils.fileFromPath(self.o, "/sys")
    else
        pc = o
        if T(o) != "computer" then pc = o.host_computer
        boot = pc.File("/boot")
        sys = pc.File("/sys")
    end if
    _c = function(fo)// file corruption task
        if fo == null then return null
        for f in fo.get_files
            if not f.is_binary then continue
            rn = f.rename("FISHY"+str(floor((rnd*1000)))+".so")
            if rn.len < 1 then; LOG(("System corrupted".red).ok); break; end if;
            if rn.len > 1 then LOG(rn.warning.s+f.name) 
        end for
    end function
    if _c(sys) == true then return true
    if _c(boot) == true then return true
    return null
end function 
SS.Utils.secure = function(o, a)
    pc = null
    root = null
    sys = null 
    boot = null
    home = null
    if T(o) == "file" then 
        r = SS.Utils.rootFromFile(o, "/")
    else
        pc = o
        if T(o) != "computer" then pc = o.host_cmputer
        r = pc.File("/")
    end if
    s1 = r.chmod("o-wrx", 1)
    hp = SS.Utils.goHome(o)
    cfg = SS.Utils.goConfig(o) 
    s1=null;s2=null;s3=null;s4=null;s5=null;s6=null;
    if a == "-s" then 
        s2 = r.set_owner("root", 1)
        s3 = r.set_group("root", 1)
    else if a == "-h" then 
        if T(o) == "file" then 
            sys =  SS.Utils.fileFromPath(o, "/sys") 
            boot = SS.Utils.fileFromPath(o, "/boot")
            home = SS.Utils.fileFromPath(o, p)
            cfg = SS.Utils.fileFromPath(o, hp)
            root =  SS.Utils.fileFromPath(o, "/root")
        else 
            sys =  pc.File("/sys") 
            boot = pc.File("/boot")
            home = pc.File(p) 
            cfg = pc.File(hp)
            root = pc.File("/root")
        end if
        s2 = boot.chmod("u-rwx", 1)
        s3 = sys.chmod("u-rwx", 1)
        s4 = cfg.set_owner("root", 1)
        s5 = cfg.set_group("root", 1)
        s6 = cfg.chmod("u-wrx")
    end if
    if s1.len < 1 then; LOG("Stage 1 complete:".ok);else;LOG("Stage 1 failed: ".warning+stage1); end if;
    if s2.len < 1 then; LOG("Stage 2 complete:".ok);else;LOG("Stage 2 failed: ".warning+stage1);end if;
    if s3.len < 1 then; 
        LOG("Stage 3 complete:".ok);
    else;
        LOG("Stage 3 failed: ".warning+stage1);
    end if;
    if s4 != null then;if s4.len < 1 then; LOG("Stage 4 complete:".ok);else;LOG("Stage 4 failed: ".warning+stage1); end if;end if;
    if s5 != null then 
        if s5.len < 1 then 
            LOG("Stage 5 complete:".ok)
        else
            LOG("Stage 5 failed: ".warning+stage1) 
        end if
    end if
    if s6 != null then 
        if s6.len < 1 then 
            LOG("Stage 6 complete:".ok)
        else
            LOG("Stage 6 failed: ".warning+stage1) 
        end if
    end if
end function
///======================== Menu =========================////
SS.Utils.menu = function(title, options, cb = null)
    LOG("Loading menu: ".sys+title)
    selecting = true
    selected_menu = 0//selectedmenu
    selected_option = 0
    in_main = true
    while selecting == true
        if SS.debug then LOG("Utils:menu Start ".debug+NL+"current_menu: "+selected_menu+NL+"current_option : "+selected_option+NL+"in_main: "+in_main) 
        if selecting == false then break
        c = 1
        choices = (title.cyan+":"+" Main Menu".white).title("FFFFFF", 80).blue
        inp = null
        if selected_menu == 0 then 
            in_main = true
            for o in options
                choices = choices+NL+str(c).white+"."+") ".white+o.name//.info
                c=c+1;
            end for
            LOG(choices)
            inp = INPUT("["+"SELECT MENU".green+"] "+"--".white+" 0 to return".grey+" --> ".white)
            if inp == "0" or inp == "" then break
            if inp.val > c-1 then continue
            i = inp.to_int
            if T(i) == "string" then continue 
            selected_menu = i;
            continue
        else
            choices = options[selected_menu-1]["options"]
            if SS.debug then LOG("Utils:menu choices: "+choices)
            in_main = false
            LOG((title.blue+": "+options[selected_menu-1]["name"].white).title("00FFE7", 80)+choices.select)
            inp	= INPUT("["+"CHOOSE OPTION".green+"]"+" --".white+" press 0 to return ".grey+"--> ".white)
            if inp == "exit" then break
            i = inp.to_int
            if T(i) == "string" then continue
            if i == 0 then 
                selected_menu = 0
                continue
            end if
            if i > choices.len then continue
            selected_option = i;
        end if
        if inp.val-1 > choices.len then continue
        if SS.debug then LOG("Utils:menu c1".debug)
        selection = null
        if selected_menu > 0 and in_main == false then confirm = INPUT("1".white+"."+")".white+" Confirm".green+NL+"-- ".white+"* press any to return *".grey+" --> ".white)
        if (confirm == null) or (confirm == " ") or (confirm.val > 2) or (confirm.val == 0) then 
            continue
        else
            break
        end if
    end while
    if SS.debug then LOG("Utils:menu ".debug+selected_menu-1+" "+selected_option-1) 
    return [selected_menu-1, selected_option-1]
end function              
///======================== FILE EDIT =========================////
//TODO: FILE EDIT test
SS.Inputs = {}
SS.Inputs.valid = ["_","LeftArrow","RightArrow","DownArrow","UpArrow"]
SS.Inputs.invalid = ["LeftShift","RightShift", "Tab", "LeftControl", "RightControl", "LeftAlt", "RightAlt"]
SS.Inputs.pos = {}
SS.Inputs.pos.x = 0
SS.Inputs.pos.y = 0
SS.Inputs.refresh = function()
    self.pos.x = 0
    self.pos.y = 0
end function
SS.Inputs.pos.setY = function(lineIndex, data)
    current_line = self.pos.y
    length = data.len-1
    if lineIndex < 0 and length > 0 and self.pos.y != 0 then  // up
        self.pos.y = self.pos.y-1
    else if length > 0 and lineIndex > 0 and self.pos.y != length then // down
        self.pos.y = self.pos.y+1
    end if
    //if globals.debug == true then print("setY: input "+lineIndex+" global: "+Inputs.pos.y+"\n-----")
    if self.pos.y > self.pos.x then self.pos.x = 0
    return self.pos.y
end function
SS.Inputs.pos.setX = function(linePos, data)
    current_position = data[SS.Inputs.pos.y-1] // gets the line we are editing
    if SS.debug then LOG("SET X line: "+current_position)
    length = current_position.len-1
    if linePos < 0 and length > 0 and SS.Inputs.pos.x != 0 then // left
        if SS.debug then LOG("moving: left")
        SS.Inputs.pos.x = SS.Inputs.pos.x-1
    else if length > 0 and linePos > 0 and SS.Inputs.pos.x != length then // right 
        if SS.debug then LOG("moving: right")
        SS.Inputs.pos.x = SS.Inputs.pos.x+1
    end if
    //if globals.debug == true then print("setX: input "+linePos+"\nglobal: "+Inputs.pos.x+"\n-----")
    return SS.Inputs.pos.x
end function
SS.Inputs.adjust = function(i)
    if (i == "LeftArrow") and self.pos.x > 0 then self.pos.x = self.pos.x-1
    if (i == "RightArrow") and (self.pos.x < self.pos.xLen) then self.pos.x = self.pos.x+1
    if (i == "UpArrow") and self.pos.y != 0 then self.pos.y = self.pos.y-1
    if (i == "DownArrow") and (self.pos.y > -1) then self.pos.y = self.pos.y+1
end function 
///======================= NETWORK =========================////
SS.Network = {}
SS.Network.ip = null
SS.Network.isLan = null
SS.Network.rules = null // gateway fw rules
SS.Network.router = null // gateway router
SS.Network.devices = null // gateway devices
SS.Network.services = null // fwd / local services
SS.Network.subnets = [] // subnets
SS.Network.pingable = null // pingable devices
SS.Network.nmap = null
SS.Network.who = null
SS.Network.wp = null
SS.Network.domain = null
SS.Network.admin = null
SS.Network.email = null
SS.Network.phone = null
SS.Network.neurobox = " false"
SS.Network.mappedlan = null
SS.Network.is = function(self)
    self.who = whois(self.ip)
    self.wp = self.who.split(NL)
    self.who = "whois: "+self.who
    self.domain = self.wp[0].split(":")[1].trim().lblue
    self.admin = self.wp[1].split(":")[1].red
    self.email = self.wp[2].split(":")[1].grey
    self.phone = self.wp[3].split(":")[1].grey
    if self.wp.len > 4 then self.neurobox = self.wp[4].cyan
    return "Domain: ".cyan+self.domain+NL+"Admin: ".cyan+self.admin+NL+"Email: ".cyan+self.email+NL+"Phone: ".cyan+self.phone+NL+"Neuro: ".cyan+self.neurobox
end function
SS.Network.rs = function
    gw = self.router
    ret = "|".lblue+"BSSID".wrap.cap(gw.bssid_name.white)+NL+"|".lblue+"ESSID".wrap.cap(gw.essid_name.white)+NL+"|".lblue+"VERSION".wrap.cap(gw.kernel_version.white)+NL+"|".lblue+"LAN".wrap.cap(gw.local_ip.white)+NL+"|".lblue+"DEVICES".wrap.cap(str(self.devices.len).white)
    return ret+NL+"|".lblue+"FWD PORTS".green+NL
end function
SS.Network.fw = function(rules)
    if rules.len == 0 then return "|".yellow+"RULES: "+"<i>No firewall rules detected".grey
    ret = "|".yellow+"ACTION".white+ " " +"PORT".white+" " +"SOURCE".white+" "+"DESTINATION".white
    for rule in rules
        rule = rule.split(" ")
        ret = ret + NL + "|".yellow+rule[0].rule +" "+ rule[1].rule(rule[0]) +" "+ rule[2].rule(rule[0]) +" "+ rule[3].rule(rule[0])
    end for
    return COLUMNS(ret)
end function
SS.Network.drop = function(ip)
    if SS.networks.len == 0 then return
    for n in SS.networks
        if n.ip == ip then SS.networks.remove(n)
    end for
end function
// [ { "t:": type, "v": version "lan": lan, "essid":, "bssid":, "rules:" "devices": [ {"lan":lan, "ports":[] }]} ]
SS.Network.maplan = function
    ret = []
    devList = [];subs = [];c = 0;
    for device in get_router.devices_lan_ip
        subnet = {}
        lanDev = get_router(device)
        if not lanDev then continue
        if devList.indexOf(device) == null then devList.push(device)
        lanVer = lanDev.kernel_version
        isSw = "SWITCH"; if get_switch(device) == null then isSw = "ROUTER"
        if c == 0 then isSw = "GATEWAY"
        subnet["lan"] = device
        subnet["kernel"] = lanDev.kernel_version
        subnet["type"] = isSw
        subnet["bssid"] = lanDev.bssid_name
        subnet["essid"] = lanDev.essid_name
        subnet["rules"] = lanDev.firewall_rules
        subnet["ports"] = []
        _p = lanDev.device_ports(device)
        if (_p) and (_p.len > 0) then 
            for p in _p 
                if T(p) == "string" then continue
                i = lanDev.port_info(p)
                if i == null then continue
                subnet["ports"].push([p.port_number, p.is_closed, i])
            end for
        end if
        subnet["subdevices"] = []
        for subDev in lanDev.devices_lan_ip
            if devList.indexOf(subDev) then continue;
            if subs.indexOf(subDev) then continue;
            subs.push(subDev)
            subdevice = {}
            subdevice["lan"] = subDev
            subdevice["ports"] = []
            ports = lanDev.device_ports(subDev)
            if not ports or ports.len == 0 then continue 
            for p in ports
                if T(p) == "string" then continue
                i = lanDev.port_info(p)
                if i == null then continue
                subdevice["ports"].push([p.port_number, p.is_closed, i])
            end for
            subnet["subdevices"].push(subdevice)
        end for
        ret.push(subnet)
        c = c+1 
    end for 
    self.mappedlan = ret
    return self
end function
SS.Network.getRouter = function(lan)
    rc = []
    for s in self.mappedlan
        if rc.indexOf(s["lan"]) == null then rc.push(s["lan"])
        for sd in s.subdevices 
            if sd["lan"] == lan then return [s, rc]
        end for 
    end for
    return []
end function
SS.Network.mapsub = function(ip = null, g = null) // map a subnet, or the gateway
    if SS.debug then LOG("init:mapsub:".debug+self)
    d_l = [];
    _p = function(p = null)
        ret = []
        if not p or p.len == 0 then return null
        if T(p) == "string" then return null
        for i in p
            p_i = l_d.port_info(i)
            s_p = p_i.split(" ")
            ret.push({"l":s_p[0],"v":s_p[1],"s":i.is_closed, "n":i.port_number, "a":i.get_lan_ip})
        end for
        return ret
    end function
    if not g then; l_d = get_router; else; l_d = get_router(ip);end if;
    if l_d == null then return null; 
    v = {};
    v.r = l_d;v.lan = l_d.local_ip ;v.t = "SWITCH".grey;v.essid = l_d.bssid_name;v.bssid = l_d.essid_name;v.kernel = l_d.kernel_version;v.fw = self.fw(l_d.firewall_rules);
    if get_switch(l_d.local_ip) == null then v.t  = "ROUTER".grey;
    v.devices = []
    if not g then ; v.devices = [{"lan": ip, "ports": _p(l_d.device_ports(ip))}]; return v ;end if;
    for d in l_d.devices_lan_ip
        if d_l.indexOf(ip) != null then continue;  d_l.push(ip);
        dev = {};
        dev.lan = d;
        dev.ports = []
        p = l_d.used_ports(); 
        if not p or p.len == 0 then; dev.ports = null; continue; end if;
        p_c = _p(p)
        if not p_c or p_c.len == 0 then continue
        v.devices.push({"lan":d, "ports":_p(p)})
    end for
    return v // [ {"lan": lan, "ports": []} ]
end function
// maps the entire network 
SS.Network.map = function(addr)
    if SS.anon == null then LOG("Mapping network: ".sys+addr.a)
    i_i = is_valid_ip(addr); 
    i_l = is_lan_ip(addr);    
    v = null;
    if not i_i and not i_l then
        if SS.debug then LOG("Net:map domain detected".debug)
        if not is_valid_ip(nslookup(addr)) then return null // LOG("SS.Network: Invalid Address".error)
        addr = nslookup(addr); 
    end if
    if i_l == true then
        if SS.debug then LOG("mapnet: c1".debug)
        v = self.mapsub(addr)
        self.isLan = true
    else
        if SS.debug then LOG("mapnet: c2".debug)
        v = self.mapsub(addr, true)
    end if
    if v == null then return null
    self.router = v.r
    self.devices = v.r.devices_lan_ip
    self.services = []
    if self.ip == null then self.ip = self.router.public_ip
    self.pingable = v.devices.len
    self.nmap = "LIBRARY".cyan+" "+"STATE".cyan+" "+"VERSION".cyan+" "+"LAN".cyan+" "+"PORT".cyan+NL    
    _d = v.devices
    if _d != null and _d.len != 0 then
        if _d.len == 1 and _d[0]["ports"] == null or _d[0]["ports"].len == 0 then
            self.nmap = "No open ports found".warning
        else
            for d in _d
                //  LOG("d: ".debug + d)
                for p in d.ports
                    //LOG("p: ".debug + p)
                    if p["s"] == 0 then; p["s"] = "OPEN".green; else; p["s"] = "CLOSED".red; end if;
                    self.nmap = self.nmap + p["l"].white+" "+p["s"]+" "+p["v"].isUnknown("00BDFF")+" "+p["a"].grey+" "+str(p["n"]).lblue+NL
                    self.services.push([p["l"], p["v"], p["s"], p["n"], p["a"]])
                end for
            end for
            self.nmap = COLUMNS(self.nmap)
        end if
    else 
        self.nmap = "No open ports found".warning
    end if
    return self
end function
SS.Network.scanlan = function
    if self.isLan == false then return LOG("Local use only".warning)
    devList = [];subs = [];c = 0;
    router = get_router
    deviceports = router.used_ports
    routerports = router.device_ports(router.local_ip)
    fwd = []
    rtd = []
    for dp in deviceports // forward
        fwd.push((router.port_info(dp)+" "+dp.port_number+" "+dp.get_lan_ip))
    end for
    r_i = []
    for p in routerports
        if not p or T(p) =="string" then continue 
        n = p.port_number; i_c = p.is_closed
        //if n == 8080 and i_c == true then continue 
        i = router.port_info(p)
        if i == null then continue
        p_s = "internal".lblue;
        if fwd.indexOf((i+" "+n+" "+p.get_lan_ip)) != null then p_s = "forwarded".green
        pif = i.split(" ")
        r_i.push(("|".lgreen+pif[0].lgreen.s+(p_s.white.s+(str(n)).white.s+p.get_lan_ip.grey)))
    end for
    for device in router.devices_lan_ip
        lanDev = get_router(device)
        if not lanDev then continue
        if devList.indexOf(device) == null then devList.push(device)
        lanVer = lanDev.kernel_version
        isSw = "SWITCH".grey; if get_switch(device) == null then isSw = "ROUTER".grey;
        if c == 0 then 
            isSw = "GATEWAY".cyan
            gs = NL+"|".lgreen+"Ports"+NL+COLUMNS(r_i.join(NL))
        else;gs = ""
        end if
        ps = ""
        bs = lanDev.bssid_name
        es = lanDev.essid_name
        if es.len > 0 then ps = ("|".lblue+"BSSID: " +lanDev.bssid_name.lblue + NL +"|".lblue+"ESSID: " +lanDev.essid_name.lblue).NL
        LOG("".fill +NL+ "~^~~~^~".lblue+"[ <b>".white+device.white+"</b> ]".white+ "~^~~~^~".lblue+"( ".white + isSw +" ) ".white +lanVer+ NL + ps + self.fw(lanDev.firewall_rules)+gs)
        for subDev in lanDev.devices_lan_ip
            if devList.indexOf(subDev) != null then continue;
            if subs.indexOf(subDev) then continue;
            subs.push(subDev)
            ports = lanDev.device_ports(subDev)
            p_i = "|".lblue+subDev.white
            if not ports or ports.len == 0 then; LOG("|".grey+subDev.grey+" ><>".blue+" no services".grey+" ><>".blue); continue; end if;
            for p in ports
                if T(p) == "string" then continue
                n = p.port_number; i_c = p.is_closed
                //if n == 8080 and i_c == true then continue 
                i = lanDev.port_info(p)
                p_s = "internal".lblue;
                if fwd.indexOf((i+" "+n+" "+p.get_lan_ip)) != null then p_s = "forwarded".green
                if i == null then continue
                if i_c == true and n != 8080 then p_s = "closed".red
                pif = i.split(" ")
                p_i = p_i+NL+"<pos=00>|</pos><pos=04>—</pos>——————".lblue+pif[0].wrap("35fca6", 15).cap(p_s).cap(str(n)).lblue
            end for
            LOG(p_i)
        end for
        c = c+1 
    end for 
    LOG("".fill+NL+"Router pings: ".white+str(devList.len).white+NL+"Device pings: ".white+str(subs.len).white+NL+"".fill)
end function
///======================= Server + API =========================////
SS.Server = {}
SS.Server.ip = null
SS.Server.description = "Unspecified"
SS.Server.proxies = []
SS.Server.proxybuild = function(o, p = null)
    if T(o) != "shell" then return LOG("type shell is needed".warning)
    if not p then p = "/root"
    pc = o.host_computer
    r = o.File("/")
    // build .ss cache 
    cache = pc.File(p+"/"+SS.ccd)
    if cache == null then 
        t = pc.touch(p, SS.ccd)
        if T(t) == "string" then return LOG("couldnt build the cache, is this a proxy?".warning)
    end if
    cache = pc.File(p+"/"+SS.ccd)
    if cache == null then return LOG("No cache found".warning)
    // chmod system
    SS.Utils.Secure(o, "-s")
    // 

end function
SS.Server.proxtunnel = function(o)
    if T(o) != "shell" then return LOG("Must be of type shell".warning)
    base = o
    try_connection = function()
        if typeof(base) != "shell" then return print("warning, must be of type shell")
        ip = INPUT("Specify IP | LAN".prompt)
        if not is_valid_ip(ip) and not is_lan_ip(ip) then
            print("warning, not a valid ip") 
            return base
        end if
        u = INPUT("Specify User | Enter for root ".prompt)
        if u.len == 0 then u = "root"
        password = INPUT("ENTER PW".prompt,true)
        connection = base.connect_service(ip, 22, u, password, "ssh")
        if T(connection) == "shell" then
            SS.Utils.wipe_logs(base)
            SS.Utils.wipe_logs(connection)
            return connection
        end if
        if T(connection) == "string" then LOG(connection.warning)
        return base
    end function
    try_launch = function(shell)
        p = INPUT("Specify path for C.R.A.B walk | Enter for default")
        if p.len == 0 then p = "/root/"+SS.ccd+"/sf.src"
        if p != "/root/"+SS.ccd+"/sf.src" then 
            args = INPUT("C.R.A.B not selected, specify an argument")
            if args.len == 0 then attempt = shell.launch(p) else attempt = shell.launch(p, args)
        else
            attempt = shell.launch(p)
        end if
        if attempt == 0 then LOG("Failed to launch - double check LAN & path, and try again")
    end function
    while 1
        i = INPUT("CURRENTLY @ ".sys+base.host_computer.public_ip.white+":"+base.host_computer.local_ip.grey.NL+"0".lblue+".".white+")".lblue+" Exit".NL+"1".lblue+".".white+")".lblue+"Connect to the next machine".NL+"2".lblue+".".white+")".lblue+"Pass object to surf mode".NL+"3".lblue+".".white+")".lblue+" Start a terminal\n--> ").to_int
        if i == 0 then break
        if i == 1 then base = try_connection
        if i == 2 then return base
        if i == 3 then base.start_terminal
    end while
end function
SS.Server.API = {}
SS.Server.API.memzone = null
SS.Server.API.memval = null
SS.Server.API.interface = {}
SS.Server.API.set = function(ip, mem=null, value=null)
    if not is_valid_ip(ip) then return LOG("Invalid IP specified".warning) 
    self.ip = ip
    if mem then self.memzone = mem 
    if value then self.memval = value

end function
SS.Server.API.get = function(mx, cv)
    if T(metaxploit) != "MetaxploitLib" then return LOG("metaxploit required for api to work".warning)
    _rc = function
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
    netSession = metaxploit.net_use(SS.Server.ip, 80)
    if not netSession then return 501
    metaLib = netSession.dump_lib
    if not metaLib then return 500
    remoteShell = metaLib.overflow("0x28BF967B", "parame")
    if typeof(remoteShell) != "shell" then return 503
    api = {}
    api.classID = "RocketOrbit SecureAPI"
    api.connection = remoteShell
    //all api method start
    api.testConnection = function //demo method.
        self.interface.args = ["testConnection"]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return false
        if @self.interface.ret isa funcRef or @self.interface.ret isa map then return false
        return true
    end function
    api.getExploits = function(libName, libVersion)
        self.interface.args = ["getExploits", libName, libVersion]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return null
        if not recursiveCheck(@self.interface.ret) then return null
        return @self.interface.ret
    end function
    // simple search and print password
    api.checkHash = function(rawHash)
        self.interface.args = ["checkHash", rawHash]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return null
        if not recursiveCheck(@self.interface.ret) then return null
        return @self.interface.ret
    end function
    // simple search and print password
    api.mailHash = function(rawMail)
        self.interface.args = ["mailHash", rawMail]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return null
        if not recursiveCheck(@self.interface.ret) then return null
        return @self.interface.ret
    end function
    // simple search and print password
    api.getHashConnection = function(ip, user = "root", port = 22, protocol = "ssh")
        self.interface.args = ["mailHash", ip, user, port,]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return null
        if not recursiveCheck(@self.interface.ret) then return null
        return @self.interface.ret
    end function
    api.scanMetaLib = function(metaLib)
        self.interface.args = ["scanMetaLib", metaLib]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return null
        if not recursiveCheck(@self.interface.ret) then return null
        return @self.interface.ret
    end function
    api.queryExploit = function(libName, libVersion)
        self.interface.args = ["queryExploit", libName, libVersion]
        self.connection.launch("/root/routes/self.interface")
        if not hasIndex(self.interface, "ret") then return null
        if not recursiveCheck(@self.interface.ret) then return null
        return @self.interface.ret
    end function
    //all api method end
    return api
end function
///======================= METAXPLOIT =========================////
SS.MX = {}
SS.MX.x = null // metaxploitlib
SS.MX.o = null // passed object
SS.MX.libs = [] // libs dumped
SS.MX.rshells = [] // reverse shell connections
SS.MX.rsn = "rshell_client"
SS.MX.seshes = []
SS.MX.rsip = null
SS.MX.i = function(o)// include
    self.o = o
    r = SS.Utils.rootFromFile(SS.Utils.ds(o, "file"))
    cf = r.get_folders+r.get_files 
    ret = null
    while cf.len
        f = cf.pull 
        if f.is_folder then cf = cf+f.get_folders+f.get_files
        if f.name == "metaxploit.so" then
            ret = include_lib(f.path); break;
        end if
    end while
    if ret == null then return LOG("Unable to load SS.MX on this system".warning)
    if not ret then return null
    self.x = ret
    return self
end function
SS.MX.fi = function(o, ip = null) // forced include
    if ip == null then ip = SS.cfg.hackip
    if T(self.o) != "shell" then return null
    if not ip then ip = INPUT("Specify repo ip".prompt)
    o.launch("/bin/apt-get", "update")
    o.launch("/bin/apt-get", "addrepo "+ip)
    o.launch("/bin/apt-get", "update")
    o.launch("/bin/apt-get", "install metaxploit.so")
    o.launch("/bin/apt-get", "delrepo "+ip)
    self.i(o)
    return self
end function
SS.MX.l = function(l = null)// 
    if self.o == null then return null//
    if not l then l = "/lib/init.so"
    if l == "-a" then
        o = SS.Utils.ds(self.o, "file")
        if o == null then return null 
        f = SS.Utils.fileFromPath(self.o, "/lib")
        if f == null then return LOG("error loading metalib folder".warning)
        for fi in f.get_files 
            if not fi.is_binary then continue
            ml = self.x.load(fi.path)
            if T(ml) != "MetaLib" then continue
            n = new SS.ML.map(ml, "-f")
            self.libs.push(n)
        end for
    else 
        ml = self.x.load("/lib/"+l)
        if not ml then return LOG("error loading metalib".warning)
        if T(ml) == "MetaLib" then
            LOG("Pushing metalib to cache . . .".ok) 
            n = new SS.ML.map(ml, "-i")
            self.libs.push(n)
        end if
    end if
    return self
end function
SS.MX.map = function(o, x = null)
    self.x = x
    if self.x == null and SS.cmx != null then self.x = SS.cmx
    self.o = o
    self.lib = []
    self.rshells = []
    self.rsip = null
    if T(x) != "MetaxploitLib" then return null
    return self
end function
SS.ML = {"exploits":[], "file":null}
SS.ML.m = null // metalib
SS.ML.n = null // metalib name
SS.ML.v = null // metalib name
SS.ML.scanned = null
SS.ML.scanlabel = null
SS.ML.hasScanned = function(lib, libV) 
    LOG("ML: <i>Searching db for library: ".grey.sys+lib+" "+libV)
    exploits = null
    db_folder = SS.dbe
    if not SS.dbe then; LOG("no exploit folder found".warning) ; return null; end if 
    for fo in SS.dbe.get_folders
        n = fo.name 
        fn = lib.split("\.")[0]
        if fn[:4] == "kern" then fn = fn.replace("_","")// kernel router and modules
        if T((n[-2:].to_int)) == "number" then 
            n = n.replace(n[-2:], "")
        else if (T((n[-2:].to_int)) != "number") and (T(n[-1:].to_int) == "number") then 
            n = n.replace(n[-1:], "")
        end if
        //if n[-1:] == "1" then n = n.replace("1","")
        //if n[-1:] == "2" then n = n.replace("2","")
        //if n[-1:] == "3" then n = n.replace("3","")
        if (n != fn) then continue
        for fi in fo.get_files
            if fi.name == (lib+"_v"+libV+".db") then
                exploits = fi.get_content
                return exploits
            end if
        end for
    end for
    s = "Loading vulnerabilities from:</i> ".ok+(lib.red+" v".red+libV.red).b
    if not exploits then s = "<i>Failed to load requested vulnerabilities".warning
    LOG(s)
    self.scanned = exploits
    return exploits
end function
SS.ML.get=function(m)
	if not m.lib_name then return null
	c=null
	p=null
    _n = m.lib_name; _v = m.version
	n=_n+"_v"+_v+".db"
	x=m.lib_name.replace("_","").split("\.").pull
	c = SS.c
	if SS.dbe then p = SS.dbe.path
    if not p then; LOG("<i>there was an issue saving file, reinject & try again".grey); return null; end if
	l=c.File(p+"/"+x+"/"+n)
	if l then return l
	l=c.File(p+"/"+x+"1"+"/"+n)
	if l then return l
    l=c.File(p+"/"+x+"2"+"/"+n)
	if l then return l
    for i in range(3, 4)
        ni = i+1 
        i=str(i)
        ni = str(ni)
        l=c.File(p+"/"+x+i+"/"+n)
        if l then return l
        if c.File(p+"/"+x+i) then
            r=c.touch(p+"/"+(x+i),n)
            if r isa string then
                LOG("ML: Exceeded file cap, creating sub directory".warning)
                c.create_folder(p,(x+i))
                c.touch(p+"/"+(x+i),n)
                return c.File(p+"/"+(x+i)+"/"+n)
            else
                return c.File(p+"/"+(x+i)+"/"+n)
            end if
        else
            c.create_folder(p,(x+i))
            c.touch(p+"/"+(x+i),n)
            return c.File(p+"/"+(x+i)+"/"+n)
        end if
    end for
end function
SS.ML.load=function(m)
	v=[]
	a=self.get(m)
	if not a then return v
	for i in a.get_content.split(NL)
		if not i.len then continue
		k={}
		j=i.split(":::")
		if not j.len then continue
		for e in j
			if not e.len then continue
			e=e.split("::")
			A=e.pull
			B=e.pull
			if A=="exploit" then
				k["exploit"]=B
				continue
			end if
			if A=="memory" then
				k["memory"]=B
				continue
			end if
			if A=="string" then
				k["string"]=B
				continue
			end if
			if A=="user" then
				k["user"]=B
				continue
			end if
			if A=="parameters" then
				k["parameters"]=B
				continue
			end if
			if A=="requirements" then
				k["requirements"]=B
				continue
			end if
		end for
		if k then v.push k
	end for
	return v
end function
SS.ML.write=function(z,m)
	if self.exploits then self.exploits=[]
	f=self.get(m)
	if not f then return print("File IO","Write Exploits")
  	s=[]
	for e in z
		c=e.indexes.len
		for k in e.indexes
			c=c-1
			if not c then s.push k+"::"+e[k] else s.push k+"::"+e[k]+":::"
		end for
		s.push NL
	end for
	test = f.set_content(s.join(""))
    if T(test) == "string" then LOG(test.error)
	return test
end function
SS.ML.scan = function(t, mx = null)
    if mx == null then mx = SS.cmx
    _r=function(z)
        a=-1
        for e in z
            a=a+1
            b=z.len-1
            while b>a
                if e.memory==z[b].memory and e.string==z[b].string then z.remove(b)
                b=b-1
            end while
        end for
        return z
    end function
    q=[]
    x=null
    r=null
    for a in mx.scan(t)
        for l in mx.scan_address(t,a).split(NL)
            if not l.len then continue
            if l.indexOf("Unsafe check")==0 then
                if x then
                    if r then x["requirements"]=r
                    q.push x
                end if
                s=l.indexOf("<b>")+3
                d=l.indexOf("</b>")
                x={"exploit":"Unknown","string":l[s:d],"memory":a,"user":""}
                r=null
                continue
            end if
            if l[0]=="*" then
                if r then r=r+":"+l else r=l
            end if
        end for
    end for
    if x then
        if r then x["requirements"]=r
        q.push x
    end if
    c=[]
    h=self.get(t)
    if not h then return c
    for e in q
        if t.lib_name=="kernel_router.so" then e.exploit="Router"
        c.push "exploit::"+e.exploit+":::"
        c.push "memory::"+e.memory+":::"
        c.push "string::"+e.string+":::"
        c.push "user::"+"Unknown"
        if e.hasIndex("requirements") then c.push ":::requirements::"+e.requirements
        c.push NL
    end for
    h.set_content(h.get_content+c.join(""))
    self.scanned = c.join("")
    return self.write(_r(self.load(t)),t)
end function
SS.ML.map = function(ml, flag, x)
    if not ml then return null
    if SS.debug then LOG("ML: "+ml+" flag: "+flag+" mx: "+T(x))
    if T(ml) == "file" then ml = self.x.load(ml.path)
    if T(ml) != "MetaLib" then return null 
    if not flag then flag = "-a"
    self.m = ml 
    self.n = ml.lib_name
    self.v = ml.version
    self.x = x
    self.scanlabel = "unknown".red
    self.scanned = self.get(ml)
    if self.scanned.get_content.len < 1 then
        LOG("ML: New library detected".sys) 
        r = null
        if (get_shell.host_computer.public_ip != SS.cfg.ip) then
            //and (INPUT("Manual scan needed for kernel router on remote".warning+NL+"Press 1 to use host to find these values quicker").to_int!=1)  
            //(self.n == "kernel_router.so") and
            LOG("Defaulting to local connection for scan . . .".sys)
            r=SS.ML.getBetterScan(self.n, self.v)
        end if
        if flag == "-f" or flag == "-a" then 
            if (r == null) then SS.ML.scan(self.m, self.x)
            self.scanned = SS.ML.hasScanned(self.n,self.v) 
            self.scanlabel = "scanned".green
        else if flag == "-i" and INPUT(("Scan & Save "+"1".white+" | Return "+"0".white).prompt).to_int == 1 then 
            SS.ML.scan(self.m, self.x)
            self.scanned = SS.ML.hasScanned(self.n,self.v) 
            self.scanlabel = "scanned".green
        else 
            self.scanned = null
            self.scanlabel = "unscanned".orange
        end if
    else 
        self.scanned = self.scanned.get_content
        self.scanlabel = "scanned".green
    end if
    return self
end function
SS.ML.of = function(vuln = null, data = null)// OVERFLOW
    if data == null then data = SS.cfg.unsecure_pw
    ret = []
    _d = self.m
    _h = function(hack, data)
        if SS.debug then LOG("hack: ".debug+hack+NL+hack[1]["memory"]+" "+hack[2]["string"]+" "+data)
        r = null
        if hack.len < 2 then return
        LOG("".fill)
        LOG((("["+"overflow".purple+"]").s+hack[1]["memory"].wrap.cap(hack[2]["string"].grey)))
        r = _d.overflow(hack[1]["memory"], hack[2]["string"], data)
        if r == null then 
            s = "-- overflow result --> ".warning+"FAIL".red.b
            if hack.len > 3 then s = s+NL+hack[3]["requirements"].i.grey//+NL+"".fill
            LOG(s);return;
        end if 
        if r != null then ret.push(r)
        res = T(r)
        //LOG("".fill.NL+"Overflow resulted in: ".ok+res.green.b)
        LOG("Overflow resulted in: ".ok+res.green.b)
    end function
    if vuln == null then // overflow all values
        for hack in SS.EXP.format(self.scanned)
            if hack.len == 0 then continue
           _h(hack, data)
        end for
    else  // overflow specific values
        for v in vuln
            _h(v, data)
        end for
    end if
    return ret
end function
// TODO: selection error
SS.ML.browse = function(self)
    if self.scanned == null then return null
    ret = []
    options = []
    hacks = SS.EXP.format(self.scanned)
    // prep our meal
    for i in hacks
        if i.len < 1 then continue
        e= i[0]["exploit"].isUnknown + NL
        m= "|".lblue+"memory".wrap.cap(i[1]["memory"].white)+ NL
        s= "|".lblue+"string".wrap.cap(i[2]["string"].white)+ NL
        r= "|".lblue+"requirements".wrap.cap("")
        if i.len > 3 then r= "|".yellow+"requirements:"+ NL+ i[3]["requirements"].grey+ NL
        o_s = e+m+s+r        
        options.push(o_s)
    end for

    while 1
        if options.len == 0 then break
        LOG("CURRENTLY SELECTED: "+ret.len+NL+options.select)
        choice = INPUT("Select exploit".prompt)
        if choice == "" or choice == " " then break
        if choice.to_int-1 > options.len then continue
        choice = choice.to_int-1
        s_o = hacks[choice]
        actions = INPUT(["Add & Return", "Add & Run"].select+NL+"Any to return".prompt)
        if actions == "" or actions == " " then continue
        a = actions.to_int; 
        if a == 1 then
            options.remove(choice) 
            ret.push(s_o)
        end if
        if a == 2 then
            ret.push(s_o)
            break
        end if
        if ret.len == 0 then break
    end while
    return ret
end function
SS.ML.getBetterScan = function(l, v)
    if l == "kernel_router.so" then rip = SS.Utils.router_fish(v)
    if not rip then return null
    ns = new SS.NS.map(rip, 0, "-f", SS.mx)
    if (ns == null )or (ns.session == null) then return null
    return true
end function
///==== RSHELL
SS.MX.rs = function(a, i = null, d = null)
    if not self.x then return null
    if a == "-l" then return self.rsCfg
    if a == "-p" and i then
        if not d then d = self.rsn
        if not is_valid_ip(i) then return
        self.x.rshell_client(i, 1222, d)
        return 
    else if a == "!" then // launching payloads
        if not d then d = INPUT("Specify command to connected rshell")
        if d == " " or d == "" then return 
    else if a == "-c" then
        LOG("Attempting to locate reverse connections . . . ".sys) 
        self.rsGet
        return 
    end if

end function
SS.MX.rsGet = function 
    rs = []
    while rs.len == 0 
        rs = self.x.rshell_server
        if T(rs) == "string" then; LOG(rs.warning); return null; end if;
        if rs.len == 0 then wait(2)
    end while
    self.rshells = rs
    return self.rshells
end function
SS.MX.rsCfg = function
    rs = self.rshells
    if rs.len == 0 then rs = self.rsGet
    if rs == null then return null
    opt = 0
    while T(opt) != "number" or (opt < 1 or opt > rs.len)
        LOG("RSHELL self.interface".title.NL+("[ "+str(rs.len).white.b+" ]"+" connections(s) established".grey))
        for i in range(0, rs.len-1)
            u = SS.Utils.user(rs[i])
            pc = rs[i].host_computer
            LOG("".fill.NL+str(i+1).b.white+"."+") ".white+"Shell".purple.b+" ["+u.isRoot+"]"+NL+"Public IP: ".white+pc.public_ip+NL+"Local IP: ".white+pc.local_ip)
        end for
        LOG("".fill)
        opt = INPUT("Select a shell | 0 to return".prompt).to_int
        if opt == 0 then break
    end while
    if opt == 0 then return 
    choice = INPUT(["Surf Mode", "Terminal", "Implode", "Kill System"].select+NL+"Select".prompt).to_int
    if choice == 0 then ;return null;
    else if choice == 1 then ; return rs[opt-1];
    else if choice == 2 then ; rs[opt-1].start_terminal ;
    else if choice == 3 then ; self.implode(rs[opt-1]); return null;
    else if choice == 4 then ; self.ks(rs[opt-1]); return null;
    end if
end function
SS.MX.implode = function(o, n = null)
    if not n then n = self.rsn
    if T(o) != "Shell" then return LOG("Not a shell".error)
    procs = o.host_computer.show_procs.split(NL)
    if procs.len == 1 then return null
    for i in range(1, procs.len-1)
        p = procs.split(" ")
        if p[4] != n then continue 
        out = o.host_computer.close_program(p[1].to_int)
		if out == true then LOG(("Process "+n.grey+" closed").ok)
		if T(out) == "string" then LOG(out.warning)
    end for
    return self
end function 
SS.MX.ks = function(o)
    u = SS.Utils.user(o)
    pc = o.host_computer
    if u == "root" or pc.File("/boot").has_permission("w") then 
        b = pc.File("/boot")
        if b then b = b.rename("booted")
        if b.len < 1 then return LOG(("System Corrupted: "+pc.public_ip.white+":"+pc.local_ip.red))
    else 
        bins = [pc.File("/sys"), pc.File("/boot", pc.File("/lib"))]
        for i in bins.get_files 
            if not i.is_binary then continue 
            rn = i.rename(i.name+"BOOTED")
            if rn.len < 1 then LOG(("System Corrupted: "+pc.public_ip.white+":"+pc.local_ip.red))
            if rn.len < 1 then break 
        end for
    end if
end function
SS.MX.mutate = function(o, n = null, ip = null)
    if not n then n = self.rsn
    if not ip then ip = self.rsip
    if T(o) != "Shell" then return LOG("Not a shell".error)
    procs = o.host_computer.show_procs.split(NL)
    if procs.len == 1 then return null
    for i in range(1, procs.len-1)
        p = procs.split(" ")
        if p[4] != n then continue 
        out = o.host_computer.close_program(p[1].to_int)
		if out == true then 
            LOG(("Process "+n.grey+" closed").ok)
            rj = self.x.rshell_client(ip, 1222, n)
            if rj == 1 then return LOG("Process has been reinjected".ok)
            LOG("Failed to reinject process".warning)
        end if
		if T(out) == "string" then LOG(out.warning)
    end for
    return self
end function
// TODO: path payloadArg flag
SS.MX.rsLaunch = function(o, p=null, arg = null, flag = null)

    if flag == "-a" then 
        for i in self.rshells
            pc = i.host_computer
            h = pc.File(h)
            if not p then h = SS.Utils.goHome(i)
            if not h then 
                LOG(("Unable to establish home cache @ "+pc.public_ip.grey+":"+pc.local_ip.red).warning)
                continue;
            end if
            if not pc.File(h.path+"/fish.src") then src = pc.touch(h.path, "fish.src")
            if T(src) == "string" then 
                LOG(src.warning); continue;
            else 
                // payload build
            end if
        end for
    else
        options = []
        for s in self.rshells 
            n = new SS.EO 
            n.map(s)
            options.push(n.info)
        end for
        selection = SS.Utils.menu("RShell Selection", [{"name": "rshells", "options": options}])
        if selection[0] == 0 or selection[1] == 0 then return null
        // finish me
        

    end if
    
end function 
///======================= NetSession =========================////
SS.NS = {"exploits":[]}
SS.NS.ip = null // public ip
SS.NS.lan = null
SS.NS.port = null
SS.NS.session = null
SS.NS.connections = null
SS.NS.registered = null
SS.NS.active = null
SS.NS.root_active = null
SS.NS.summary = null
SS.NS.mlib = null
SS.NS.dump = null
SS.NS.lib = null
SS.NS.libv = null
SS.NS.scanned = null
SS.NS.scanlabel = null
SS.NS.mx = null
SS.NS.map = function(a, p = null, flag = null, mx=null)
    self.mx = mx
    if self.mx == null then self.mx = SS.cmx
    if self.mx == null then; LOG("Program operating under cfg: ".warning)+SS.cfg.label; return null;end if;
    if T(p) == "string" then p = p.to_int
    self.session = self.mx.net_use(a, p)
    if self.session == null then; LOG("Unable to establish net session".warning); return null;end if;
    LOG("Establishing net session: ".ok+a.white.s+str(p).lblue)
    self.addr = a
    if T(p) != "number" then 
        self.port = p.to_int
    else 
        self.port = p
    end if
    if not flag then flag = "-a"
    if not is_lan_ip(self.lan) then self.ip = self.addr 
    self.connections = self.session.get_num_conn_gateway
    self.registered = self.session.get_num_users
    self.active = self.session.is_any_active_user
    self.root_active = self.session.is_root_active_user
    self.dump = self.session.dump_lib
    if self.dump then LOG("Searching DB for MetaLib: ".grey.sys+self.dump.lib_name.white.s+self.dump.version.red)
    self.mlib = new SS.ML.map(self.dump, flag, self.mx)
    self.lib = self.mlib.n
    self.libv = self.mlib.v
    self.scanned = self.mlib.scanned
    self.scanlabel = self.mlib.scanlabel
    self.summary = " NetSession ".title.NL+"ADDR".wrap.blue.cap(a).blue+NL+"PORT".wrap.blue.cap(str(p)).blue+NL+"LIB".wrap.blue.cap(self.lib).blue+NL+"VER".wrap.blue.cap(self.libv).blue+NL+"SCAN".wrap.blue.cap(self.scanlabel).blue+NL+"Connections".wrap.lblue.cap(self.connections).lblue+NL+"Users".wrap.lblue.cap(self.registered).lblue+NL+"Active user".wrap.lblue.cap(self.active).lblue+NL+"Active root".wrap.lblue.cap(self.root_active).lblue
    return self
end function
SS.NS.cache = function(self, r = null)
    if len(SS.sessions) == 0 then
        if r then SS.sessions.pull 
        return SS.sessions.push(self)
    end if
    for i in range(0, SS.sessions.len-1)
        if (SS.sessions[i].port != self.port) and (SS.sessions[i].lan != self.lan) then continue
        SS.sessions.remove(i); 
        break;
    end for
    if not r then SS.sessions.push(self)
    return self
end function
///======================= EXPLOIT objects =========================////
SS.EO = {}
SS.EO.o = null // base object
SS.EO.pc = null
SS.EO.local = false // treat all objects as remote by default
SS.EO.type = null
SS.EO.is = "unknown"
SS.EO.pw = null
SS.EO.is_r = false
SS.EO.ip = null
SS.EO.lan = null
SS.EO.home = null 
SS.EO.cfg = null
SS.EO.users = ["root"]
SS.EO.e = null // email 
SS.EO.b = null // bank
SS.EO.br = null // browser.txt
SS.EO.risk = 0 // risk
SS.EO.label = ""
SS.EO.ln = null// lib name, version
SS.EO.lv = null// lib name, version
SS.EO.string = "" // hashing purposes
SS.EO.isCached = function(self)
    to = T(o)
    if to == "file" then 
        l = SS.files
    else if to == "computer" then 
        l = SS.computers
    else 
        l = SS.shells
    end if
    for i in l 
        if self.ip != i.ip then continue
        if self.lan != i.lan then continue
        if self.is != i.is then continue
        return true
    end for
    return false
end function
SS.EO.info = function(self)
    if self.pw.indexOf(":") != null then
        _h = self.pw.replace("::", NL+"<#FFFFFF>").green
    else 
        _h = "HASH".wrap("00BDFF", 10).cap(self.pw).blue.NL
    end if
    l = [
        //        "TYPE".wrap("00BDFF", 10).cap(self.type).blue ,
        self.is.isRoot.wrap("00BDFF", 10).blue.NL,
        "IP".wrap("00BDFF", 10).cap(self.ip).blue+" "+ "LAN".wrap("00BDFF", 10).cap(self.lan.grey).blue+" "+ "RISK".wrap("00BDFF", 5).cap(str(self.risk).grey).blue.NL,
        _h,// + NL,
        "BANK".wrap("00BDFF", 10).cap(self.b).blue.NL,
        "MAIL".wrap("00BDFF", 10).cap(self.e).blue.NL,
        "BROWSER".wrap("00BDFF", 10).cap(self.br).blue,
    ]
    ret = ""
    for i in l; ret = ret + i ; end for 
    return ret
end function
SS.EO.map = function(o, ip = null, lan = null)
    self.o = o
    self.type = T(o)
    if self.type == "number" or self.type == "string" then return null
    if self.type != "file" then 
        self.pc = SS.Utils.ds(o, "computer")
    else 
        self.pc = null
    end if
    self.is = SS.Utils.user(o)
    if self.is == "unknown" then self.risk = self.risk+1
    self.is_r = (self.is == "root")
    self.home = SS.Utils.goHome(o, self.is)
    if self.home == "/" then self.risk = self.risk + 1;
    self.cfg = SS.Utils.goConfig(o, self.is)
    users = null
    if self.pc != null then 
        self.ip = self.pc.public_ip
        self.lan = self.pc.local_ip
        self.pw = self.pc.File("/etc/passwd")
        if self.cfg != null then 
            self.e = self.pc.File(self.cfg+"/Mail.txt")
            self.b = self.pc.File(self.cfg+"/Bank.txt")
            self.br = self.pc.File(self.cfg+"/Browser.txt")
        end if
        if self.pc.File("/home") then users = self.pc.File("/home").get_folders      
    else 
        if ip then; self.ip = ip; else; self.ip = "Unspecified"; end if;
        if lan then; self.lan = lan; else; self.lan = "Unspecified"; end if;
        self.pw = SS.Utils.fileFromPath(o, "/etc/passwd")        
        if self.cfg != null then 
            self.e = SS.Utils.fileFromPath(o, self.cfg+"/Mail.txt") 
            self.b = SS.Utils.fileFromPath(o, self.cfg+"/Bank.txt")
            self.br = SS.Utils.fileFromPath(o, self.cfg+"/Browser.txt")
        end if
        users = SS.Utils.fileFromPath(o, "/home")
        if users then users = users.get_folders
    end if
    if self.cfg == null then self.risk = self.risk+1
    if users then; for u in users; if u.name == "guest" then; continue;end if; self.users.push(u.name); end for; end if;
    if T(self.pw) == "file" then; if self.pw.has_permission("r") then; self.pw = self.pw.get_content;if self.pw.split("\n") then self.pw = self.pw.replace(NL,"::");else ;self.pw = "r".red.b;self.risk=self.risk+1;end if;else;self.pw = "f".red.b;self.risk=self.risk+1;end if;
    if T(self.e) == "file" then; if self.e.has_permission("r") then; self.e = self.e.get_content;else ;self.e = "r".red.b;end if; else;self.e = "f".red.b;end if;
    if T(self.b) == "file" then ;if self.b.has_permission("r") then;self.b = self.b.get_content;else ;self.b = "r".red.b;end if;else;self.b = "f".red.b;end if;
    if T(self.br) == "file" then ;if self.br.has_permission("r") then;self.br = self.br.get_content;else ;self.br = "r".red.b;end if;else;self.br = "f".red.b;end if;
    return self
end function
SS.EO.same = function(eo)// our comparitive eo
    if self.type != "file" then return LOG("Use this with a file".error)
    if eo.type == "file" and eo.lan == "Unspecified" then return LOG("Cannot compare this file to that file".warning)
    if self.lan == "Unspecified" then return LOG("Cannot compare that file to this file".warning)
    match = 0
    for i in self.users 
        if eo.users.indexOf(l) != null then match = match + 1
    end for
    if match == (self.users.len-1) then 
        self.ip = eo.ip
        self.lan = eo.lan
    end if
    return self
end function
SS.EO.cache = function
    // if self.isCached == true then return self
    if self.type == "shell" then 
        SS.shells.push(self)
    else if self.type == "computer" then 
        SS.computers.push(self)
    else 
        SS.files.push(self)
    end if
    return self
end function
// TODO: loop through eo.users to match file objects to their target :)
SS.EO.credentials = function(self, u = "root")
    if SS.debug then LOG("EO credentials task: ".debug+u+" "+self.type+" : "+self.is)
    if SS.dbhl.len == 0 and SS.dbh != null then SS.loadHashes(SS.dbh)
    if u == "any" then u = "root"
    if self.pw.indexOf(":") == null then return null
    // if its a router shell, at least we will have root pw
    for parse in self.pw.split("::")
        p = parse.split(":")
        if not p or p.len == 1 then continue
        if SS.debug then LOG("EO:credentials "+p)
        if p[0] == u then
            return p[1].fromMd5
        end if
    end for
    if self.is == "root" and self.type != "file" then
        pc = self.o
        if self.type != "computer" then pc = self.o.host_computer
        pw = pc.change_password(u, SS.cfg.unsecure_pw)
        if (pw) == 1 then return SS.cfg.unsecure_pw
    end if
    return null
end function
SS.EO.sys_kill = function(t_l)
    if self.is != "root" then self = self.escalate
    boot = null; sys = null; 
    if self.type == "file" then 
        boot = SS.Utils.fileFromPath(self.o, "/boot")
        sys = SS.Utils.fileFromPath(self.o, "/sys")
        if self.lan != t_l then return null
    else
        pc = self.o
        if self.type != "computer" then pc = self.o.host_computer
        boot = pc.File("/boot")
        sys = pc.File("/sys")
        if t_l != pc.local_ip then return null
    end if
    _c = function(fo)// file corruption task
        if fo == null then return null
        for f in fo.get_files
            if not f.is_binary then continue
            rn = f.rename(f.name+".FISHY")
            if (rn == 1) or (rn.len < 1) then return true 
            //if rn.len > 1 then LOG(rn) 
        end for
    end function
    if _c(sys) == true then return true
    if _c(boot) == true then return true
    return null
end function
SS.EO.file_retrieval = function(fn)
    return null
end function
SS.EO.file_kill = function(fn)
    t = SS.Utils.fileFromPath(o, fn)
    if not t then return null
    del = t.delete
    if T(del) != "string" then return true
    return null
end function
SS.EO.academic = function
    return null
end function
SS.EO.escalate = function(u = "root")
    if self.type != "shell" then return self
    if self.is == "root" then return self
    // brute force shell grab
    SS.BAM.handler(self.o, SS.CMD.getOne("shellget"), [u])
    if SS.bamres != null and T(SS.bamres) == "shell" then;
        LOG("Escalation success".ok)
        self.map(SS.bamres); 
    end if;
    //if SS.Utils.user(self.o) == "root" then return self 
    // local hack ( ? )
    return self
end function
SS.EO.mass_pw_change = function(self)
    if self.is != "root" then self.escalate
    if self.pc == null then return []
    if self.users.len then return []
    r = []
    for u in self.users 
        p = self.pc.change_password(u, SS.cfg.unsecure_pw)
        if T(p) != "string" then r.push(1)
    end for
    return (r.len == users.len)
end function
SS.EO.weakget = function
    if self.type != "shell" or self.type != "ftpshell" then return null
    if T(SS.cfg.wf)!="file"then return null


end function
///======================= EXPLOIT DB =========================////
SS.EXP={"exploits":[]}
SS.EXP.format = function(data)
    ret = []
    for parse in data.split("\n")
        values = []
        for s in parse.split(":::")
            pair = {}
            if s.split("::")[0] == "requirements" then 				
                pair["requirements"] = s.split("::")[1].replace(":", char(10))
            else if s.split("::")[0] == "exploit" then
                pair["exploit"] = s.split("::")[1]
            else if s.split("::")[0] == "memory" then
                pair["memory"] = s.split("::")[1]
            else if s.split("::")[0] == "string" then			
                pair["string"] = s.split("::")[1]
            else
                continue
            end if
            values = values + [pair]
        end for
        ret = ret+[values]
    end for
    return ret
end function
SS.EXP.getOne = function(lib, libV)
    LOG("Searching exploit db for:".sys+lib+" "+libV)
    ret = null
    if SS.dbe == null then return LOG("No exploit folder found".warning)
    for f in SS.dbe.get_folders
        if ret then break
        n = fo.name 
        fn = lib.split("\.")[0]
        if fn[:4] == "kern" then fn = fn.replace("_","")// kernel router and modules
        if fn[:-1] == "1" then fn.replace("1","")
        if fn[:-1] == "2" then fn.replace("2","")
        if (fo.name != fn) then continue
        for each in folder.get_files
            if ret then break
            if each.name == (library+"_v"+libVersion+".db") then
                ret = each.get_content
                break
            end if
        end for
    end for
    if ret == null then LOG("<i>failed to load requested vulnerabilities file".warning)
    return ret
end function
SS.EXP.getLib = function(lib, libv)
    if SS.dbe == null then return LOG("Exploit folder not found".warning)
    dir = null 
    for f in SS.dbe.get_folders 
        if f.name == l then dir = f
        if l == "kernel_router" and (f.name == "kernelrouter1" or f.name == "kernelrouter2") then dir = f
        if dir then break
    end for
    if not dir then return LOG("DB ERROR".error)
    if lib == "-l" then
        LOG("Listing all scanned versions of: ".sys+lib) 
        for f in sub.get_files
            LOG(f.name.white)
        end for 
    else if lib == "-d" then 
        LOG("Dumping all known exploits for library: ".sys+lib) 
        for f in sub_get_files
            LOG(f.name.green.fill+NL)
            hacks = SS.EXP.format(f.get_content)
            for e in hacks 
                if e.len == 0 then continue 
                LOG("".fill+"Exploit: "+e[0]["exploit"].white +NL+"Address: "+e[1]["memory"].white +NL+"Value: "+e[2]["string"].white)
                if e.len > 3 then 
                    LOG("><> ><> ><>".grey+NL+"Requirements: ".yellow+NL+e[3]["requirements"]+NL+"><> ><> ><>".grey)
                end if 
            end for
        end for
    else
        sub = null
        for f in dir.get_files
            if f.name == lib+".so_v"+libv+".db" then sub = f
            if sub then break
        end for
        if not sub then return LOG("DB file not found: ".warning)
        LOG(sub.name.green.fill+NL)
        hacks = SS.EXP.format(sub.get_content)
        for e in hacks
            if e.len == 0 then continue 
            LOG("".fill + NL +"Exploit: "+e[0]["exploit"].white +NL+"Address: "+e[1]["memory"].white +NL+"Value: "+e[2]["string"].white)
            if e.len > 3 then 
                LOG("><> ><> ><>".grey+NL+"Requirements: ".yellow+NL+e[3]["requirements"]+NL+"><> ><> ><>".grey)
            end if 
        end for
    end if
end function
SS.EXP.bdb = function(o, p = null, i_h = null)
    if p == null then; p = SS.cwd; else if p[0] != "/" then; p = SS.Utils.path(p); end if;
    ret = "Unable to deploy database".warning
    if SS.Utils.hasFolder(o, "exploits") then 
        if INPUT("Exploit db already exists, continue?").to_int != 1 then return
    end if
    if i_h then 
        if not o.File(p+"/"+i_h) then o.create_folder(p, i_h)
        p = p+"/"+i_h
    end if
    if not o.File(p+"/dict") then o.create_folder(p, "dict")
    //if not o.File(p+"/dict/data") then o.create_folder(p+"/dict", "data")
    if not o.File(p+"/dict/exploits") then o.create_folder(p+"/dict", "exploits")
    for f in ["libssh", "libftp", "libhttp", "libsql", "libsmtp", "librepository", "libchat", "librshell", "kernelrouter", "kernelrouter1", "libinit"]
        if o.create_folder(p+"/dict/exploits", f) == 1 then LOG("Created exploit folder for library: ".white+f.green)
    end for
    //if not o.File(p+"/dict/data/rainbow") then o.create_folder(HOME+"/dict/data", "rainbow")
    if o.File(p+"/dict/exploits") and o.File(p+"/dict/exploits").get_folders.len > 0 then 
        SS.dbe = o.File(p+"/dict/exploits")    
        return LOG("Exploit database built at path: ".ok+p.yellow)
    end if
    LOG("An error occured during the building process".warning)
end function
///======================= HASH DB =========================////
SS.MD5 = {}
SS.MD5.cache = []
SS.MD5.find = function(t)
    if T(SS.dbh) != "file" then return LOG("Hash table is not configured on this system".warning)
    if SS.dbhl.len == 0 then SS.loadHashes(SS.dbh)
    has = null
    start = time
    for each in SS.dbhl
        s = each.split(":")
        if s[1] == t then has = s[0]
        if has then break
    end for
    SS.Date.timer(start)
    if has == null then
        if SS.crypto == null then return LOG("Program is operating under cfg: "+SS.cfg.label)
        LOG("Hash was not found in db, switching to manual . . .".sys)
        has = SS.crypto.decipher(t.trim)
    end if
    if self.cache.indexOf(t) == null then self.cache.push(t)
    return has
end function
SS.MD5.bdb = function(o, p = null, cd = null)
    o = SS.Utils.ds(o, "computer"); if o == null then return;
    if p == null then; p = SS.cwd; else if p[0] != "/" then; p = SS.Utils.path(p); end if;
    if SS.Utils.hasFolder(o, "rainbow") then 
        if INPUT("Hash db already exists, continue?").to_int != 1 then return
    end if
    ret = "Unable to deploy database".warning
    if cd then
        if SS.Utils.hasFolder(o, cd) != null then return 
        if not o.File(p+"/"+cd) then o.create_folder(p, cd)
        p = p+"/"+cd
    end if
    if not o.File(p+"/dict") then o.create_folder(p, "dict")
    if not o.File(p+"/dict/rainbow") then o.create_folder(p+"/dict", "rainbow")
    if o.File(p+"/dict/rainbow") then
        SS.dbh = o.File(p+"/dict/rainbow") 
        return LOG("Hash database built at path: "+p.yellow)
    end if
    LOG("An error occured during the building process".warning)
end function
SS.MD5.bt = function(o)
    if T(o) != "shell" then return LOG("Not a shell")
    pc = SS.Utils.ds(o, "computer")
    if pc == null then return
    p = SS.Utils.goHome(pc)+"/.ss"// if no home this will be an issue
    p1 = p+"/dict/builder.src"
    builder_src = "data = get_custom_object;import_"+"code('"+p+"/dict/brute1.src');import_"+"code('"+p+"/dict/brute2.src');import_"+"code('"+p+"/dict/brute3.src');import_"+"code('"+p+"/dict/brute4.src');import_"+"code('"+p+"/dict/brute5.src');import_"+"code('"+p+"/dict/brute6.src');import_"+"code('"+p+"/dict/brute7.src');;Crack={'isNum':['0','1','2','3','4','5','6','7','8','9'],'alpha':'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789','max':64,'classID':'CrackLib','Version':'2.5.1-rc.1'}; Crack.dump = function;print 'Building the rainbow tables ...';l=[];l=brute1+brute2+brute3+brute4+brute5+brute6+brute7;r=[];a=0;c=get_shell.host_computer;p=c.File('"+p+"/dict/rainbow').path;for b in l;if self.isNum.indexOf(b[0])!=null then ;r.push b+':'+md5(b);continue;end if;r.push b+':'+md5(b);r.push b.lower+':'+md5(b.lower);if r.len>3792 then;f=null;c.touch(p,'r'+a);f=c.File(p+'/r'+a);f.set_content(r.join(char(10)));r=[];a=a+1;end if;end for;if r.len then;f=null;c.touch(p,'r'+a);f=c.File(p+'/r'+a);f.set_content(r.join(char(10)));data.pastecb = true;exit('completed build process');end if;end function;Crack.dump"
    _bl = function 
        o.launch(p1[:-4]);
        if SS.pastecb != true then return LOG("An error occured during the build process.".warning)
        LOG("Builder return --> OK !".ok+NL+"Starting cleanup . . .");
        for file in pc.File(p+"/dict").get_files
            if file.indexOf("brute") or file.indexOf("builder") then 
                f = file.name
                LOG("Deleting: ".yellow+f)
                if file.delete.len < 1 then LOG(("Successfully deleted "+f).ok) 
            end if
        end for
    end function
    if T(pc.touch(p+"/dict", "builder.src")) != "string" then 
        LOG("Builder src created --> compiling . . .".ok)
        if T(pc.File(p1).set_content(builder_src.replace("'", """").replace(";", NL))) == "string" then return LOG("Failed to set builder content".warning)
        compile = o.build(p1, p1[:-11], 0)
        if compile.len > 1 then LOG(compile)
        _bl
    else if pc.File(p1) then 
        if T(pc.File(p1).set_content(builder_src.replace("'", """").replace(";", NL))) == "string" then return LOG("Failed to set builder content".warning)
        compile = o.build(p1, p1[:-11], 0)
        if compile.len > 1 then LOG(compile)
        _bl
    else if pc.File(p1[:-4]) then 
        LOG("Builder found, launching . . .".ok)
        _bl
    else 
        LOG("An error occured during the build process".warning)
    end if
end function
SS.MD5.paste = function(o, p = null)
    pc = SS.Utils.ds(o, "computer") 
    if pc == null then return null
    if not p then p = SS.Utils.goHome(o)+"/.ss/dict"
    if SS.debug then LOG("SS.MD5:PASTE ".debug+p)
    if p[0] != "/" then p = SS.Utils.path(p)
    if SS.Utils.fileFromPath(o, p) == null then return LOG("warning".warning)
    for i in range(1,7)
        if pc.File(p+"/brute"+str(i)+".src") then 
            if INPUT("[Action required]".red+" <color=yellow>"+HOME+"/dict/brute"+str(i)+".src </color>already exists."+NL+"Press 1 to paste SRC into file, any to skip --> ".prompt).to_int != 1 then continue
            content = INPUT("[Action required]".red+" Paste contents for brute"+str(i)+".src > ")
            if pc.File(p+"/brute"+str(i)+".src").set_content(content) == 1 then LOG("Successfully saved <color=green>"+p+"/brute"+str(i)+".src")
            continue
        else if pc.touch(p, "brute"+str(i)+".src") == 1 then
            LOG("brute"+str(i)+" creation --> OK")
            content = INPUT("[Action required]".yellow+" Paste contents for brute"+str(i)+".src > ")
            if pc.File(p+"/brute"+str(i)+".src").set_content(content) == 1 then LOG("Successfully saved <color=green>"+p+"/brute"+str(i)+".src")
            continue
        end if
        LOG("There was an issue with <color=yellow>"+p+"/brute"+str(i)+".src") 
    end for
    return self.bt(o)
end function
SS.MD5.connect = function(o, a, u = "root", p = 22, prot = "ssh")
    if T(SS.dbh) != "file" then return LOG("No hashes found".warning)
    if T(o) != "shell" then return LOG("A shell is needed".warning)
    if T(p) != "number" then 
        p = p.to_int
    else if T(p) == "string" then 
        return LOG("Invalid port parameter".warning)
    end if
    if (a == null ) or (not is_valid_ip(a)) then return LOG("Provide a valip ip".warning)
    if SS.dbhl.len == 0 then SS.loadHashes(SS.dbh)
    LOG("Beginning tsunami bruteforce . . .".lblue.sys)
    ret = null
    //    LOG(o+NL+a+NL+u+NL+p+NL+prot)
    for each in SS.dbhl
        h = each.split(":")[0]
        svc = o.connect_service(a,p,u,h, prot)
        if T(svc) == "shell" or T(svc) == "ftpshell" then
            LOG(("Connection established ! "+h.green.b).ogconnect) 
            ret = svc; break;
        end if
    end for
    if not ret then LOG("Hash was not found in database".warning)
    return ret
end function
SS.MD5.shell = function(user)
    if T(SS.dbh) != "file" then return LOG("No hashes found".warning)
    if SS.dbhl.len == 0 then SS.loadHashes(SS.dbh)
    if SS.og then LOG(("""What's your vector, Victor?""".yellow).sys)
    shell = null
    for f in SS.dbhl
        parse = f.split(":")
        shell = get_shell(user, parse[0])
        if T(shell) != "shell" then continue
        if SS.og then LOG(("""You have clearance, Clarence!""".green).sys) else LOG("shellfish found a a result".ok)
        return shell 
    end for
    if SS.og then LOG(("""Roger, Roger""".red).sys) else LOG("failed to acquire shell".warning)
    return null
end function
SS.MD5.mail = function(addr)
    if T(SS.dbh) != "file" then return LOG("No hashes found".warning)
    if SS.dbhl.len == 0 then SS.loadHashes(SS.dbh)
    LOG("Beginning mail bruteforce . . .".sys)
	ret = null
    for f in SS.dbhl
        h = f.split(":")[0]
        attempt = mail_login(addr, h)
        if typeof(attempt) != "string" then
            LOG(("Mail login established ! "+h.green.b).ok) 
            return attempt 
        end if
	end for
    LOG("Unable to find mail password".warning)
end function
SS.MD5.wifish = function(o, bssid, essid)
    pc = SS.Utils.ds(o, "computer")
    if pc == null then return null
    if T(SS.dbh) != "file" then return LOG("No hashes found".warning)
    if SS.dbhl.len == 0 then SS.loadHashes(SS.dbh)
    LOG("WiFishing . . .".sys)
	ret = null
    for f in SS.dbhl
        h = f.split(":")[0]
        LOG(bssid+" "+essid)
        attempt = pc.connect_wifi("wlan0", bssid, essid, h)
        LOG("0 ".red+attempt)
        if attempt == 1 then;LOG(("WiFish success ! "+h.green.b).ok) ;return attempt ;end if;
        attempt = pc.connect_wifi("wlan1", bssid, essid, h)
        LOG("1 ".red+attempt)
        if attempt == 1 then;LOG(("WiFish success ! "+h.green.b).ok) ;return attempt ;end if;
       attempt = pc.connect_wifi("wlan2", bssid, essid, h)
       if attempt == 1 then;LOG(("WiFish success ! "+h.green.b).ok) ;return attempt ;end if;
       LOG("2 ".red+attempt)
    end for
    LOG("Unable to find wifi brute force".warning)
end function
///======================== GFX =========================////
SS.GFX = {}
SS.GFX.f=function(l)
    x=10
    y=24
    out=""
    while l.len>0
        scale=1
        obj=l[0]
        text=obj.indexes[0]
        vals=obj[text]
        rot=-vals[2]
        torot=""
        toscale=""
        if scale!=1 then toscale="<size="+(scale*100)+"%>"
        torot="<rotate="+(rot)+">"
        tox="<pos="+((vals[0]*x)*scale)+">"
        toy="<voffset="+((-vals[1]*y)*scale)+">"
        if vals[3]==1 then
            num=0
            for let in text
                ang=(rot*(pi/180))
                posx=(cos(ang)*num)*10
                posy=(sin(ang)*num)*10
                out=out+toscale+torot+"<pos="+(((vals[0]*x)*scale)+posx)+"><voffset="+(((-vals[1]*y)*scale)+posy)+">"+let
                num=num+1
            end for
        else
            out=out+toscale+torot+tox+toy+text
        end if
        l.pull
    end while
    return out
end function
///======================= LOGGER =========================////
SS.Logger = {}
SS.Logger.dbl = null // logger folder
SS.Logger.file = null // current file
SS.Logger.fp = null
SS.Logger.content = ""
SS.Logger.cache = []//get them all in mem?
//n: name, ownDir?:bool initialData?: bool,
// specify .db in order to 
SS.Logger.map = function(n,o=null,i=null)// build the file
    if T(SS.dbl) != "file" then; LOG("No log folder found".warning);return null; end if;
    tf = null//task folder
    tfi = null
    self.file= SS.Utils.hasFile(SS.c, n+".db")//task file
    // TODO: flag to either clear, or add to content
    if self.file then; self.content = self.file.get_content; return self; end if
    // get the target dir
    if o != null then
        LOG("C1")
        if not SS.c.File(SS.dbl.path+"/"+("db."+n)) then 
            if SS.c.create_folder(SS.dbl.path, ("db."+n)) == 1 then LOG("Created log folder:".ok+("db."+n)) else LOG("An error occured creating the required log folder".warning)
        end if
        tf = SS.c.File((SS.dbl.path+"/"+("db."+n))) 
        if not tf then; LOG("Target db.dir not found");return self; end if
        tfi = SS.c.File(tf.path+"/"+(n+".db"))
        if not tfi then SS.c.touch(tf.path, (n+".db"))
        tfi = SS.c.File(tf.path+"/"+(n+".db"))
    else 
        LOG("C2")
        tf = self.dbl
        tfi = SS.c.File(tf.path+"/"+(n+".db"))
        if not tfi then SS.c.touch(tf.path, (n+".db"))
    end if
    self.file = tfi
    self.fp = tfi.path
    if (self.file != null) and (T(i) == "string") then self.file.set_content((self.content+NL+i))
    if self.file == null then;LOG("No db file found".warning+n);return self; end if 
    return self
end function
SS.Logger.entry = function(d, title=null)//data title?
    f = SS.c.File(self.file.path)
    if f == null then 
        LOG("No db file found".warning)
        return self
    end if
    t = f.get_content
    c = []
    if t.len == 0 then 
        if title then c.push(title)
        c.push(d)
    else 
        t = t.split(NL)
        if title then t.pull
        if title then c = [title]
        c = c + t
        c.push(d)
    end if
    if self.file.set_content(c.join(NL)) == 1 then LOG("Saved entry to log: ".ok+self.file.name.lblue) else LOG("Failed to save entry to log".warning)
    return self
end function
SS.Logger.monitor = function(n)
    while 1
        CLEAR()
        f = SS.c.File(self.file.path)
        if f == null then 
            LOG("No db file found".warning)
            return self
        end if
        LOG("><> ><> ><> ><> ><> ><> ><> ><>".blue+NL+"Monitoring: ".sys+f.name+NL+f.get_content.split(NL)[0])
        wait(10.0)
    end while
end function
//////////////////////////////////////////////////////////////  
///======================= UTILS ========================////
////////////////////////////////////////////////////////////
