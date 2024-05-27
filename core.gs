//////////////////////////////////////////////////////////////  
///======================= CORE =========================////
////////////////////////////////////////////////////////////
///==================== { SeaShell }
SS.s = get_shell;
SS.c = SS.s.host_computer; 
SS.f = SS.c.File("/"); 
SS.obj = null
SS.co = [] // push and pull from here for objects we take into surf mode
SEO = new SS.EO
SEO.map(SS.s)
CEO = new SS.EO
CEO.map(SS.c)
FEO = new SS.EO; 
FEO.map(SS.f, SS.c.public_ip, SS.c.local_ip)
SS.apt = null
SS.crypto = null
SS.mx = null
SS.mxp = null
SS.apt_updates = []
SS.shells = []
SS.computers = []
SS.files = []
SS.commands = []
SS.networks = []
SS.sessions = []
SS.mxlibs = []
SS.macros = []
SS.cfg = {} // cfg
SS.cfg.label = null
SS.cfg.i = null // item: cache/config folder
SS.cfg.start_time = current_date
SS.cfg.unsecure_pw = "f1shb0wl"
SS.cfg.burnmailacct = "Oppelli@barner.com"
SS.cfg.burnmailpw = "Bitch"
SS.cfg.mailacct = "mail@bolds.net"
SS.cfg.mailpw = "mail"
SS.cfg.hackip = ""
SS.cfg.dat = null // data file
SS.cfg.macros = null // macro folder
SS.cfg.wf = null // weak lib file
SS.cfg.wm = "0x73CBD7B0" // weak lib memory zone
SS.cfg.wa = "havedoutlinenumbe" // weak lib memory address
// TODO: weak lib implementation, transferral
///==================== SS.CMD() ========================////
SS.CMD = {}
SS.CMD.isValid = function(param)
	if param == "" or param == " " then return null
	for c in SS.commands
		if c["name"] == param then return c
		if c["name"] == "entry" and (is_valid_ip(param) or is_valid_ip(nslookup(param))) then return c
	end for
	return null
end function
SS.CMD.fcmd = function(s)
	s = s.replace("\|", " ") 
	s = s.split(" ")
	return s
end function
SS.CMD.hasRequiredArgs = function(cmd, p)
	passed = 0; if (p.len > 0) and (p[0] == cmd.name) then p.pull
	if SS.debug then LOG("SS.CMD: ".red+cmd["name"] +" "+"REQUIRED: ".yellow+cmd["params"].len+" "+"PASSED ARGS: ".orange+p);
	if p.len > cmd["params"].len then return false// even if a command is misconfigured, this should catch issues
	for cmdIndex in cmd["params"]
		if cmdIndex == "*" then
			if SS.debug then LOG("args: c1") 
			passed = passed+1
			continue
		end if
		if SS.debug then LOG("POSSIBLE ARG: ".purple+cmdIndex)
		if cmdIndex.indexOf("|") then
			parse = SS.CMD.fcmd(cmdIndex)
			if SS.debug then LOG("args: c2 "+parse) 
			for parsed in parse
				if T(p.indexOf(parsed)) == "number" or (parsed == "*") then 
					passed = passed+1
					break
				end if
			end for
		else
			if SS.debug then LOG("args: c3")  
			for argIndex in p
				if argIndex == "" then continue
				if T(p.indexOf(argIndex)) == "number" or (cmdIndex == "*") then 
					passed = passed+1
				end if
			end for
		end if
	end for
	if passed == cmd["params"].len then return true
	return false
end function
SS.CMD.chain = function(a)
	if SS.debug then LOG("chaining command(s): ".debug+a)
	if a.indexOf(";") == null then return a;ret = [];
	for c in a.split(";");ret.push(c.trim);end for;
	if SS.debug then LOG("chaining commands:".debug+ret)
	return ret
end function
SS.CMD.invoke = function(obj, p)
	result = null
	args = p.split(" ")
	if SS.debug then LOG("SS.CMD:invoke recieved cmd:".debug+" <b>" + p.grey+" via: "+T(obj))
	cmd = SS.CMD.isValid(args[0])
	if cmd == null then return LOG("Invalid Command: ".warning+args[0]+NL+"Use command ".white+"<b>-h</b>".grey+" for list of valid commands".white)
	if SS.CMD.hasRequiredArgs(cmd, args) == false then return LOG("Invalid Arguments: ".warning+NL+"Use command ".white+"-h <b>"+cmd.name+"</b>".grey+" for man usage".white)
	run = cmd["run"]
	if args.len == 0 then 
		if cmd["cb"] == null then run()
		if cmd["cb"] == "general" then run(obj)
		if cmd["cb"] == "result" then result = run(obj)
		if cmd["cb"] == "custom" then
			SS.cb = null 
			run(obj)
			if SS.cb != null then result = SS.cb
		end if
	else if args.len == 1 then 
		if cmd["cb"] == null then run(args[0])
		if cmd["cb"] == "general" then run(obj, args[0])
		if cmd["cb"] == "result" then result = run(obj, args[0])
		if cmd["cb"] == "custom" then
			SS.cb = null 
			run(obj, args[0])
			if SS.cb != null then result = SS.cb
		end if
	else if args.len == 2 then 
		if cmd["cb"] == null then run(args[0], args[1])
		if cmd["cb"] == "general" then run(obj, args[0], args[1])
		if cmd["cb"] == "result" then result = run(obj, args[0], args[1])
		if cmd["cb"] == "custom" then
			SS.cb = null 
			run(obj, args[0], args[1])
			if SS.cb != null then result = SS.cb
		end if
	else if args.len == 3 then 
		if cmd["cb"] == null then run(args[0], args[1], args[2])
		if cmd["cb"] == "general" then run(obj, args[0], args[1], args[2])
		if cmd["cb"] == "result" then result = run(obj, args[0], args[1], args[2])
		if cmd["cb"] == "custom" then
			SS.cb = null 
			run(obj, args[0], args[1], args[2])
			if SS.cb != null then result = SS.cb
		end if
	else if args.len == 4 then 
		if cmd["cb"] == null then run(args[0], args[1], args[2], args[3])
		if cmd["cb"] == "general" then run(obj, args[0], args[1], args[2], args[3])
		if cmd["cb"] == "result" then result = run(obj, args[0], args[1], args[2], args[3])
		if cmd["cb"] == "custom" then
			SS.cb = null 
			run(obj, args[0], args[1], args[2], args[3])
			if SS.cb != null then result = SS.cb
		end if
	else if args.len == 5 then 
		if cmd["cb"] == null then run(args[0], args[1], args[2], args[3], args[4])
		if cmd["cb"] == "general" then run(obj, args[0], args[1], args[2], args[3], args[4])
		if cmd["cb"] == "result" then result = run(obj, args[0], args[1], args[2], args[3], args[4])
		if cmd["cb"] == "custom" then
			SS.cb = null 
			run(obj, args[0], args[1], args[2], args[3], arg[4])
			if SS.cb != null then result = SS.cb
		end if
	end if
	return result
end function
SS.CMD.prompt = function(eo)
	if SS.debug then LOG("SS.CMD:prompt ".debug+T(eo))
	o=null;ip = "x.x.x.x".grey;lan="x.x.x.x".grey;host=null; sym = "$";tsym = "S".green;
	obj = eo.o
	if eo.type != "file" then 
		if eo.type == "computer" then
			tsym = "C".blue; o = obj
		else if eo.type == "shell" then
			o = obj.host_computer
		else
			tsym = "FTP".yellow; o = obj.host_computer
		end if
		host = o.get_name.grey
		if SS.anon != true then; ip = o.public_ip; lan = o.local_ip; end if
	else 
		ip = eo.ip
		lan = eo.lan
		host = " "+obj.name.b.grey
		tsym = "F".orange
	end if
	user = SS.Utils.user(obj);
	if SS.debug then LOG("debugging user: ".debug+user+" "+T(user))
	if user == "root" then sym = "#"
	space = 3.9+(user.len+host.len)*0.6
	s =  NL+"<pos=04>—{"+user.isRoot(user, "FFFFFF")+"@".cyan+host+"}—[<b>"+tsym+"</b>]—{"+ ip.white.size(14).a +":"+ lan.grey.size(14) +"}—["+SS.Utils.dash(SS.cwd, user).white.size(14)+"]<voffset=-0.5em><space=-"+space+"em><pos=00>|<voffset=-1em><space=-0.6em>|<voffset=-1.5em><pos=04>——:~"+sym.white+" "	
	return INPUT(s)
end function
SS.CMD.result = function(o)
	//if INPUT("New object returned !".sys+NL+"Press 1 to pass to surf mode ".grey).to_int != 1 then return
	if SS.debug then LOG("Result: ".debug+o)
	f = null
	if (o isa SS.EO) == false then
		f=new SS.EO;
		f.map(o)
		f.cache
		o = f
	end if
	SS.co.push(o)
	h = o.home
	if h != null then SS.cwd = h
	if SS.cwd == null then SS.cwd = "/"
	return SS.surf_mode(o)
end function
SS.CMD.setCommands = function
	for cmd in SS.CMD.list
		SS.commands.push({"name":cmd[0], "desc":cmd[1], "params":cmd[2], "usage":cmd[3], "cb":cmd[4], "run":@cmd[5]})
	end for
end function
SS.CMD.getOne = function(n)
	for cmd in SS.commands
		if cmd.name == n then return cmd
	end for
	return null
end function
//TODO: revise help menu
SS.CMD["cmd_list"] = function(usage = null)
	p = null
	if not usage then
		tData = []
		tData.push({"<u>": [0,0,0,0]})
		tData.push({"<b>[ "+"NAME".white+" ]": [0,0,0,0]})
		tData.push({"[ "+"ARGS".white+" ]": [10,0,0,0]})
		tData.push({"[ "+"DESC".white+" ]            </u>/\n": [33,0,0,0]})
		for c in SS.commands
			if c["name"] == "get" then continue
			tData.push({c["name"].white: [1,0,0,0]})
			tData.push({c["params"]: [10,0,0,0]})
			tData.push({c["desc"].size(14).grey+"\n": [33,0,0,0]})
		end for
		LOG(SS.GFX.f(tData))
		p = true
	else
		i = null
		for item in SS.commands
			if item["name"] == usage then 
				i = item
				break
			end if
		end for
		if not i or not i["usage"] then return LOG("*<i>Usage not found</i>*".grey+" cmd:<b> "+usage.white)//+"</b> \n-->"+color.grey+"* Chec")
		LOG("SS.CMD: ".purple+"<b>"+usage+"</b>\n"+"ARGS: ".green+i["params"]+"\n"+"USAGE:".white+NL+i["usage"])
	end if
	LOG("<b>-->".white+ " *</b><i>"+" Represents a dynamic, or optional parameter.".grey)
	if p then LOG("*"+"<i>DETAILS</i>".grey+"*  Use cmd: "+"<b>-h [cmd_name]</b>".white+" for SS.CMD usage")
end function 
///==================== SeaShell() ========================////
SS.getUserConfig = function
	SS.cfg.i = SS.Utils.hasFolder(SS.c, ".ss")
	s = "Checking host . . .".sys
	if SS.cfg.i then
		s = "Cache found, checking user . . .".ok 
		p =  SS.cfg.i.path
		SS.cfg.dat = SS.Utils.fileFromPath(SS.s, p+"/ss.dat")
		SS.cfg.macros = SS.Utils.fileFromPath(SS.s, p+"/ss.macros")
	else 
		s = s+NL+"* Unable to locate cache folder".yellow
		SS.cfg.dat = SS.Utils.hasFile(SS.c, "ss.dat")
		SS.cfg.macros = SS.Utils.hasFile(SS.c, "ss.macros")
	end if
	if T(SS.cfg.dat) == "file" then
		SS.setDat(SS.cfg.dat.get_content) 
		s = s+NL+"User config, loaded!".green
	else 
		s = s+NL+"* Unable to load user config".grey
	end if
	if T(SS.cfg.macros) == "file" then
		SS.setMacros(SS.cfg.macros.get_content)  
		s = s+NL+"User macros, loaded!".green
	else 
		s = s+NL+"* Unable to load user macros".grey
	end if
	LOG(s)
end function
SS.getLibConfig = function(self)
	SS.mx = SS.Utils.hasLib(SS.s, "metaxploit.so")
	SS.crypto = SS.Utils.hasLib(SS.s, "crypto.so")
	if SS.mx != null then 
		if SS.crypto == null then
			ret = "MX".yellow
		else 
			ret = "SS".cyan
		end if
	else if SS.crypto != null then 
		ret = "Crypto".orange
	else
		ret = "OS".red 
	end if
	SS.cfg.label = ret
	LOG("Configuration set: ".sys+SS.cfg.label)
	return ret 
end function
SS.getApt = function
	if SS.debug then LOG("setAPT".debug)
	SS.apt = SS.Utils.hasLib(SS.s, "aptclient.so")
	if T(SS.apt) != "aptclientLib" then return
	if SS.anon == null then SS.apt.update
	if SS.anon == true then return LOG("Unable to update apt: Anonymous mode is enabled".warning)
	if SS.apt.check_upgrade("/lib/aptclient.so") == true then LOG("An update for APT is available!".sys)
end function
SS.checkApt = function
	if SS.debug then LOG("checkApt".debug)
	ret = []
	if SS.apt == null then return
	fi = SS.c.File("/lib/")
	if fi == null or fi.is_folder == false then return
	for f in fi.get_files
		if SS.apt.check_upgrade(f.path) == true then ret.push(f.name)
	end for
	return ret
end function
//TODO: fix
SS.getDb = function
	if SS.debug then LOG("setDB".debug)
	h = SS.Utils.hasFolder(SS.c, "exploits")
	if T(h) == "file" then
		SS.dbe = h
	else 
		LOG("Unable to locate exploit db".warning)
	end if
	p = SS.Utils.hasFolder(SS.c, "rainbow")
	if T(p) == "file" then 
		SS.dbh = p
		SS.dbh = SS.dbh
	else 
		LOG("Unable to locate password db".warning)
	end if
	// for now, lets load our weak_lib here
	if SS.cfg.user == "root" then p = "/root/"+SS.ccd+"/libs/weak/init.so"
	SS.cfg.wf = SS.Utils.fileFromPath(SS.s, "/home/"+SS.cfg.user+"/libs/STRONG/init.so")
	if T(SS.cfg.wf) != "file" then;LOG("Weak lib not loaded".grey.sys);else; LOG("Loaded weak lib: ".ok+SS.cfg.wf.name); end if;
	if (SS.dbe == null and SS.dbh == null) then return LOG("Database was not configured".warning)
	if SS.dbe != null then
		for each in SS.dbe.get_folders 
			for f in each.get_files
				SS.dbec = SS.dbec+f.get_content.split("\n").len
			end for
		end for
		LOG("Exploit database configured successfully".ok)
	end if
	if SS.dbh != null then LOG("Hash database configured successfully".ok)
end function
//TODO: fixme
SS.loadHashes = function(fo)
	if not fo then return []
	LOG("Pushing MD5 hashes into memory. . .".sys)
	_c = []
	for fi in fo.get_files
		if fi.is_binary then continue
		for s in fi.get_content.split(NL)
			if s.indexOf(":") == null then continue
			_c.push(s)
		end for
	end for
	SS.dbhl = _c
	SS.dhc = _c.len
end function
SS.setCache = function
	SS.co.push(SEO)
	SEO.cache
	CEO.cache 
	FEO.cache
end function
SS.buildCo = function 
	// building custom object
	//SS.CMD = @SS.CMD
	//SS.CORE = @Core
	//SS.UTILS = @Utils

end function
SS.welcome = function
	LOG("       .               ".cyan+"               __..._".red+NL+"      ':'              ".cyan+"           ..-'      o.".red+NL+"    ___:____     |'\/'|".cyan+"         .-'           :".red+NL+"  ,'        `.    \  / ".cyan+"      _..'           .'__..--<".red+NL+"  |  O        \___/  | ".cyan+"...--""              '-.".red+NL+"~^~^~^~^~^~^~^~^~^~^~^~".cyan+"^~^~^~^~^~^~^~^~^~^~^~^~".red+NL+"".fill+NL+".                                            /\".red+NL+"   _____            </color><color=#AA0000> _____ _          _ _   {.-}"+NL+"  / ____|           </color><color=#AA0000>/ ____| |        | | | ;_.-'\"+ NL +" | (___   ___  __ _</color><color=#AA0000>| (___ | |__   ___| | |{    _.}_"+ NL +"  \___ \ / _ \/ _` |</color><color=#AA0000>\___ \| '_ \ / _ \ | | \.-' /  `,"+ NL +"  ____) |  __/ (_| |</color><color=#AA0000>____) | | | |  __/ | |  \  |    /"+ NL +" |_____/ \___|\__,_|</color><color=#AA0000>_____/|_| |_|\___|_|_|   \ |  ,/"+NL+".                                             \|_/".red+NL+"<b>SeaShell</b>".cyan+" <color=#00ED03>version: "+SS.version.cyan+" made with <3 by</color><color=#00FFE7> Tuna Terps"+NL+"".fill)
end function
SS.sail = function
	if SEO == null then return LOG("error".error)
	if params.len == 0 then return SS.surf_mode(SEO)
	pIndex = params.indexOf(",")
	if pIndex == null then return SS.surf_mode(SEO, SS.CMD.chain(params.join(" ")))
	if SS.debug then LOG("surf:sail ".debug+params.join(" ").replace(",", ";"))
	return SS.surf_mode(SEO, SS.CMD.chain(params.join(" ").replace(",", ";")))
end function
SS.surf_mode = function(o, args = null)
	LOG("".sys+"<b>~^~~~^~~^~".blue+"SURF MODE".cyan+"~".blue+"[ ".cyan+"ENABLED".green+" ]".cyan+"~^~~~^~~~".blue)
	SS.obj = o
	res = null;
	if args then
		cmds = SS.CMD.chain(args)
		if T(cmds) == "string" then
			res = SS.CMD.invoke(o.o, args)
			if res == "exit" then return
			if res != null then SS.CMD.result(res)
		else
			for cmd in cmds 
				res = SS.CMD.invoke(o.o, cmd)
				if res == "exit" then break
				if res != null then SS.CMD.result(res)
			end for
		end if	
	end if
	if res == "exit" then return
	while 1
		res = null;
		input = SS.CMD.prompt(SS.obj)
		if SS.debug then LOG("Input received: ".debug+input+" issa "+T(input))
		if input == " " then continue
		cmds = SS.CMD.chain(input)
		if T(cmds) == "string" then
			if SS.debug then LOG("sm_input: c1".debug) 
			res = SS.CMD.invoke(SS.obj.o, cmds)
			if res == "exit" then break; if res != null then SS.CMD.result(res)
		else if T(cmds) == "list" then
			if SS.debug then LOG("SS:sm_input: c2".debug)
			shouldbreak = null  
			for cmd in cmds
				res = SS.CMD.invoke(SS.obj.o, cmd)
				if res == "exit" then shouldbreak = true
				if (res != null) and (res != "exit") then SS.CMD.result(res)
			end for
			if shouldbreak then break// this will prolly break stuff
		else 
			LOG("sm_input: c3".debug)
		end if 
		if SS.debug and res then LOG("response found")
	end while
	return LOG("".sys+"<b>~^~~~^~~^~".blue+"SURF MODE".cyan+"~".blue+"[ ".cyan+"DISABLED".red+" ]".cyan+"~^~~~^~~~^~".blue)
end function;																																																																							SS.env = function(_,__,___,____,_____,______);SS.cfg.user = __;SS.cfg.burnmailacct = null;SS.cfg.burnmailpw = null;SS.cfg.mailacct = ___;SS.cfg.mailpw = ____;SS.cfg.rsip = _____;SS.cfg.unsecure_pw = ______;;end function
SS.init = function(az,by,cx,dw,ev,fu);
	if INPUT(("["+"Auth Required".red+"]").b+" ", true) != az then EXIT("><> ><> ><>".red);																																																				SS.env(az,by,cx,dw,ev,fu);
	SS.getUserConfig// check user settings
	SS.getLibConfig// load system libs
	SS.getApt// check for apt		
	SS.getDb// check internal database
	SS.setCache//sets certain env variables
	SS.CMD.setCommands// set system commands
	SS.buildCo// custom object mapping
	SS.welcome//verbose 
	SS.sail// set sail
end function;
SS.quit = function(_)
	if SS.debug then LOG("ss:quit ".debug+_)
	c = null
	if SS.co.len == 0 then return
	if SS.co.len > 1 then SS.co.pop // remove the old index
	c = SS.co[SS.co.len-1]
	SS.obj = c
	SS.cwd = c.home
	return "exit"
end function
SS.cache = function(l, addr = null, lan = null)
	if T(l) != "list" then return null
	for i in l
		if T(i) == "string" or T(i) == "number" then continue
		eo = new SS.EO; 
		if T(i) == "file" then 
			eo.map(i, addr, lan)
			SS.files.push(eo)
		else if T(i) == "computer" then 
			eo.map(i)
			SS.computers.push(eo)
		else
			eo.map(i)
			SS.shells.push(eo)
		end if
	end for 
end function
SS.getMemCache = function(_, m, a = null)
	if m == "-o" then return Core.objects(_, a)
	if m == "-ns" then return Core.ns_handle(a)
	if m == "-net" then return Core.net_handle(a)
	return LOG("Invalid arguments: ".warning+"-o|-ns|-net [*action]")
end function
SS.getHost = function(a = null, t = null, p = null)
	if a == "-i" then // DEPENDENCIES
		h = "* "+"Script can perform all operations under cfg: ".grey+SS.cfg.label;
		if not SS.mx or not SS.crypto then h = "* "+"Script is lacking essential libs: ".red 
		if SS.mx == null then h = h.s+"metaxploit.so"
		if SS.crypto == null then h = h.s+"crypto.so"
		if SS.dbe == null then; h = h+NL+"* "+"Script is missing exploit database".yellow; else ; h = h+NL+"* "+"Exploit database loaded".green;end if;
		if SS.dbh == null then; h = h+NL+"* "+"Script is missing hash database".yellow;else ;h = h+NL+"* "+"Hash database loaded".green;end if;
		if SS.cfg.dat == null then; h = h+NL+"* "+"Script is missing user config".yellow;else;h = h+NL+"* "+"User config loaded".green; end if;
		if SS.cfg.macros == null then; h = h+NL+"* "+"Script is missing user macros".yellow;else;h = h+NL+"* "+"User macros loaded".green; end if;
		LOG(h)
	else if a == "-e" or a == "-h" then //SET
		return SS.setHost(t, a, p)
	else if ["-u", "-m", "-ccd"].indexOf(a) != null then 
		return SS.setUserConfig(a, t, p)
	end if
	if SS.dbhl.len == 0 then SS.loadHashes(SS.dbh)
	_d = [
		"SeaShell".title("FFFFFF", 20),
		"Version".wrap.lblue.cap(SS.version).lblue,
		"Uptime".wrap.lblue.cap(SS.Date.up(time)).lblue,
		"Config".wrap.lblue.cap(SS.cfg.label, null, true).lblue,
		"Cache".wrap.lblue.cap(SS.ccd).lblue,
		"User".wrap.lblue.cap(SS.cfg.user).lblue,
		"Active".wrap.lblue.cap(SS.Utils.user(SS.c).isRoot(SS.c)).lblue,
		"Exploits".wrap.lblue.cap(SS.dbec).lblue,
		"Hashes".wrap.lblue.cap(SS.dhbl.len).lblue,

	]
	for d in _d ;LOG(d); end for;
	if SS.mx != null then
		LOG("Libraries".title("FFFFFF", 20))
		for f in SS.c.File("/lib/").get_files
			l = SS.mx.load(f.path)
			if T(l) != "MetaLib" then continue
			LOG(f.name[:-3].wrap("00BDFF").white.cap(l.version.lblue).white)
		end for
	end if
	_d = [
		"USER".title("FFFFFF", 20),
		"Anonymous".wrap("A5A5A5").blue.cap(SS.Utils.ison(SS.anon)).blue,
		"Old Art".wrap("A5A5A5").blue.cap(SS.Utils.ison(SS.og)).blue,
		"Debug".wrap("A5A5A5").blue.cap(SS.Utils.ison(SS.debug)).blue,
		"API".wrap("A5A5A5").blue.cap("server ip").blue,
		"API1".wrap("A5A5A5").blue.cap(SS.cfg.).blue,
		"API2".wrap("A5A5A5").blue.cap("addr").blue,
		"WEAK".wrap("A5A5A5").blue.cap("enabled?").blue,
		"WEAK1".wrap("A5A5A5").blue.cap("addr").blue,
		"WEAK2".wrap("A5A5A5").blue.cap("addr").blue,
	]
	for d in _d ;LOG(d); end for;
end function
SS.setHost = function(a, t, p = null)// act type path
	if a == null then return LOG("Specify: -e|-h")
	if p == null then 
		p = SS.cwd
	else if p[0] != "/" then 
		p = SS.Utils.path(SS.cwd)
	end if
	if t == "-e" then 
		if a == "-b" then return SS.EXP.bdb(SS.c, p, SS.ccd)
		//if t == "-d" then return SS.EXP.ddb(SS.c, p)
	else if t == "-h" then 
		if a == "-b" then return SS.MD5.bdb(SS.c, p, SS.ccd)
		if a == "-p" then return SS.MD5.paste(SS.s)
		//if t == "-d" then return SS.MD5.ddb(SS.c, p)
	end if
	return LOG("Invalid arguments [type] [action]")
end function
SS.setUserConfig = function(act, flag=null, p = null)
	if SS.cfg.i == null then return LOG("User config not found".warning)
	item = null 
	s = null
	run = null 
	if act == "-u" then// userconfig
		s = "User Config"
		f = SS.cfg.dat
		if flag == "-b" then
			run = @SS["setDat"] 
			p = "ss.dat"
			d = "anonymousMode=0"+NL+"debugMode=0"+NL+"oldArtMode=1"+NL+"apiIp=null"+NL+"apiMemZone=null"+NL+"apiMemVal=null"
		else 
			return SS.cfgDat(flag, p)
		end if
	else if act == "-m" then // usermacros
		s = "User Macros"
		f = SS.cfg.macros
		run = @SS["setMacros"] 
		p = "ss.macros"
		d = "[MACRO NAME] [SS.CMD NAME] [ARGUMENTS] ; [SS.CMD NAME] [ARGUMENTS]"+NL+"EXAMPLE ls ; cd /"
	else if act == "-ccd" then // user ccd
		s = "User Cache"
		f = SS.cfg.i
		p = SS.ccd
	else 
		return LOG("Invalid arguments".warning)
	end if
	dat = null
	if f == null then 
		r = SS.c.touch(SS.cfg.i.path, p)
		if T(r) == "string" then return LOG(r.warning+" "+p)
		f = SS.c.File(SS.cfg.i.path+"/"+p)
		if f == null then return LOG("System file error".warning)
		r = f.set_content(d)
		wait(0.1)
		if T(r) == "string" then return LOG(r.warning)
		LOG("System file created: ".ok+p)
	end if
	dat = f.get_content	
	return run(dat)
end function
SS.setDat = function(data)
	if SS.debug then LOG("SS:setDat: ".debug+data)
	if data.len == 0 then return LOG("No content in user.dat".warning)
	if data.indexOf(NL) == null then return LOG("Data not found")
	s = data.split(NL)
	if s.len == 0 then return LOG("File is empty".warning)
	for i in s 
		if i.len < 1 then continue 
		if i.indexOf("=") == null then continue
		p = i.split("=")
		if p[0] == "anonymousMode" then 
			if p[1].to_int == 1 then 
				SS.anon = true 
			else
				SS.anon = false
			end if
		else if p[0] == "debugMode" then 
			if p[1].to_int == 1 then 
				SS.debug = true 
			else 
				SS.debug = false
			end if
		else if p[0] == "oldArtMode" then 
			if p[1].to_int == 1 then SS.og = true else SS.og = false
		else if p[0] == "apiIp" then 
			SS.Server.API.ip = p[0]
		else if p[0] == "apiMemZone" then 
			SS.Server.API.memzone = p[0]
		else if p[0] == "apiMemVal" then 
			SS.Server.API.memval = p[0]
		end if
	end for 
end function
SS.cfgDat = function(item, change)
	if not SS.cfg.dat then return LOG("User not configured on this machine")
	data =  SS.cfg.dat.get_content
	if data.len < 10 then return LOG("File corrupted".error)
	data = data.split(NL)
	if data == null or data.len == 0 then return LOG("File corrupted".error)
	c = 0; isn = null; edit = null
	for i in data
		p = i.split("=")
		if p == null then continue
		if item == "anon" and p[0] == "anonymousMode" then
			label = "anonymous mode"
			isn = true 
			edit = i; break;
		else if item == "dev" and p[0] == "debugMode" then
			label = "debug mode"
			isn = true  
			edit = i; break;
		else if item == "art" and p[0] == "oldArtMode" then
			label = "original art mode"
			isn = true  
			edit = i; break;
		else if item == "api1" and p[0] == "apiIp" then
			label = "api ip" 
			edit = i; break;
		else if item == "api2" and p[0] == "apiMemZone" then
			label = "api memzone" 
			edit = i; break;
		else if item == "api3" and p[0] == "apiMemVal" then
			label = "api memval" 
			edit = i; break;
		end if
		c = c+1
	end for
	data.remove(c);
	if edit == null then return LOG("Incorrect setting".warning)
	if isn then 
		change = change.to_int
		if change != 0 and change != 1 then return LOG("Invalid setting option".warning)
		label2 = SS.Utils.ison(change)
		edit = edit.trim
		edit = edit[:-1]+str(change)
	else 
		label2 = change
		ep = edit.split("=")
		edit = ep[0]+"="+change
	end if
	data.push(edit)
	data = data.join
	data = data.trim
	data = data.replace(" ", NL)
	if SS.debug then LOG("Data set: ".debug+data)
	save = SS.cfg.dat.set_content(data)
	if T(save) == "string" then return LOG(save.warning)
	LOG("Setting saved: ".ok+label+" --> ".white+label2)
	return self.setDat(data)
end function
// TODO: set macro function
SS.setMacros = function(data)
	if data.len == 0 then return LOG("No content in user.macro".warning)

end function
///==================== CORE() ========================////
Core = {}
Core["anon"] = function(save = null)
	t = true; s = "ENABLED".green;
	if SS.anon == true then
		t = false; s = "DISABLED".red;
	end if
	if save then SS.cfgDat("anon", str(t))
	LOG("Anonymous mode: ".sys+s);SS.anon = t;
end function
Core["dev"] = function(save = null)
	t=true; s="ENABLED".green;
	if SS.debug == true then 
		t=false;s="DISABLED".red;
	end if
	if save then SS.cfgDat("dev", str(t))
	LOG("Debug mode: ".sys+s);SS.debug = t;
end function
Core["add"] = function(o)
	if T(o) == "shell" or T(o) == "ftpshell" then return SS.shells.push(o)
	if T(o) == "computer" then return SS.computers.push(o)
	return SS.files.push(o)
end function
Core["objects"] = function(_, p = null)
	objects = [SS.shells, SS.computers, SS.files]
	if p  == "-c" then 
		SS.shells = [SEO] // our collection of global shell objects
		SS.computers = [CEO] // our collection of global computer objects
		SS.files = [FEO] // our collection of global file objects
		return
	end if
	ret = null 
	s_l = [];c_l=[];f_l=[];
	for s in SS.shells; s_l.push(s.info); end for;
	for c in SS.computers; c_l.push(c.info); end for;
	for f in SS.files; f_l.push(f.info); end for;
	selection = SS.Utils.menu("Object Cache", [
		{"name": " Shells ".wrap("FFFFFF", 15).cap(str(SS.shells.len).lblue.b), "options": s_l },
		{"name": " Computers ".wrap("FFFFFF", 15).cap(str(SS.computers.len).lblue.b), "options": c_l},
		{"name": " Files ".wrap("FFFFFF", 15).cap(str(SS.files.len).lblue.b), "options":f_l},
	])
	if selection[0] == 0 and (selection[1]) == 0 then return null
	s_m = selection[0]
	s_o = selection[1]
	if p == "-e" then// EDIT
		UI = INPUT(["Remove from cache"].select).to_int
		if UI == 0 then return 
		if UI == 1 then return objects[s_m].remove(s_o)
	end if
	if s_m == -1 then return null
	if SS.debug then LOG("Passing to surf mode: ".ok+objects[s_m][s_o].info)
	return objects[s_m][s_o]
end function
Core["cd"] = function(o, p = null)
	if SS.debug then LOG("Core:cd ".debug+T(o)+" "+p)
	isF = null; if T(o) == "file" then isF = true;
	if isF then 
		cdur = SS.Utils.fileFromPath(o, SS.cwd)
	else 
		o = SS.Utils.ds(o, "computer")
		cdur = o.File(SS.cwd)
		if not cdur then cdur = o.File(SS.Utils.goHome(o))
	end if	
	dir = null
	if not cdur then return LOG("current directory error".error)
	if p == null then 
		u = SS.Utils.user(o)
		if T(o) == "file" then 
			dir = SS.Utils.fileFromPath(o, SS.Utils.goHome(o, u))
		else if u == "root" and o.File("/root") != null then 
			dir = o.File("/root")
		else if u != "root" and o.File("/home/"+u) != null then 
			dir = o.File("/home/"+u)
		end if
	else if p == ".." then
		dir = cdur.parent
	else if p == "." then
		if cdur.parent then dir = cdur.parent.parent  
	else if p == "/" then
		if SS.debug then LOG("cd 1".debug)
		if isF then 
			dir = SS.Utils.rootFromFile(o)
		else
			dir = o.File("/")
		end if
	else if p[0] != "/" and cdur.name == "/" then 
		if SS.debug then LOG("cd 2".debug)
		if isF then 
			dir = SS.Utils.fileFromPath(o, "/"+p)
		else 
			dir = o.File("/"+p)
		end if
	else if p[0] != "/" and cdur.name != "/" then
		if SS.debug then LOG("cd 3".debug)
		if isF then 
			dir = SS.Utils.fileFromPath(o, cdur.path+"/"+p)
		else 
			dir = o.File(cdur.path+"/"+p)
		end if
	else 
		if SS.debug then LOG("cd 4".debug)
		if isF then 
			dir = SS.Utils.fileFromPath(o, p)
		else 
			dir = o.File(p)
		end if
	end if
	if dir == null then return LOG("No directory found: ".warning+p)
	SS.cwd = dir.path
end function
Core["pwd"] = function
	LOG("Current directory: ".sys+SS.cwd.white)
end function
Core["me"] = function(o, act=null, p2=null)
	if act == null  or T(o) == "file" then return LOG("Current user: ".sys+SS.Utils.user(o))
	//if T(o) == "file" then return LOG("Must be of at least type computer".error)
	if T(o) == "shell" or T(o) == "ftpshell" then o = o.host_computer
	if p2 == null then return LOG("No user specified".warning)
	label = "removed"; task = null;
	if act == "-au" then return LOG("Active user: "+active_user)
	if act == "-d" then task = o.delete_user(p2, true)
	if act == "-a" then 
		task = o.create_user(p2, INPUT("Specify user password: ".sys, true))
		label = "added"
	end if
	if T(task) == "string" then return LOG(task.warning)
	s = p2+" was "+label
	LOG(s.ok)
end function
Core["groups"] = function(o, a = null, u = null, n = null)
	c = SS.Utils.ds(o, "computer"); if c == null then return;
	al = "Invalid arguments provided".warning; ret = null;
	if not u then u = INPUT("Specify user: ".white)
	if (a != "-l") and (n == null) then n = INPUT("Specify group: ".white)
	if a == "-a" then 
		ret = c.create_group(u, n); al = "added".green;
	else if a == "-d" then
		ret = c.delete_group(u, n); al = "removed".red;
	else if a == "-l" then
		return LOG("Groups assigned to ".sys+u+NL+c.groups(u))
	else 
		return LOG(al)
	end if
	if T(ret) == "string" then return LOG(ret.warning)
	LOG("Group has been adjusted: ".ok+al+" "+u)
end function
Core["whois"] = function(a)
	if a == null then return LOG("Invalid arguments".warning)
	net = SS.Network.map(a)
	if net == null then return LOG("Invalid Address".warning)
	LOG("".fill+NL+net.is)
end function
Core["nslookup"] = function(a)
	if a == null then return LOG("Invalid arguments".warning)
	LOG(nslookup(a).sys)
end function
Core["terminal"] = function(obj, _)
	if T(obj) != "shell" and T(obj) != "ftpshell" then return LOG("Cannot launch a terminal, object must be of type shell or ftp".warning)
	obj.start_terminal
	//exit(); // ty tux
	//return obj.start_terminal
end function
Core["sudo"] = function(s, a1, a2=null, a3=null)
	if T(s) != "shell" and T(s) != "ftpshell" then return LOG("Invalid operation: must be of object type shell or ftp".warning)
	// add a remote object handler??
	if a1 == null then return LOG("Invalid usage".warning)
	_a = function(u="root")
		return INPUT("[Auth] ".red+"Enter password for "+u.red+": ", true)
	end function
	o = null; ret = null;
	if a1 == "-s" then // root switch
		o = get_shell("root", _a)
	else if a1 == "-u" then // user switch
		if not a2 then a2 = INPUT("Specify user: ".white)
		o = get_shell(a2, _a(a2))
	else if a1 == "-b" then // binary commands
		if not a2 then return LOG("Invalid arguments".warning)
		if s.host_computer.File(a2) == null then return LOG("File not found".warning)
		if a3 == null then s.launch(a2)
		if a3 != null then s.launch(a2, a3)
	else // SS.CMD.invoke
		o = get_shell("root",_a)
		if SS.debug then LOG("Sudo: c1") 
		if T(o) != "shell" then return LOG("Failed to authenticate".error)
		if a2 == null then
			if SS.debug then LOG("Sudo: c2")  
			SS.CMD.invoke(o, a1)
		else if a2 != null then
			if SS.debug then LOG("Sudo: c3")  
			SS.CMD.invoke(o, a1+" "+a2)
		else if a3 != null then 
			SS.CMD.invoke(o, a1+" "+a2+" "+a3)
		else if a4 != null then 
			SS.CMD.invoke(o, a1+" "+a2+" "+a3+" "+a4)
		end if
		return // dont think i want to return root shell for sudo commands
	end if 	
	if o == null then return LOG("Failed to authenticate".error)
	return o
end function
Core["build"] = function(o, pF, tF, fN)
	if T(o) != "shell" then return LOG("Only shells can compile binaries".warning)
	if pF[0] != "/" then pF = SS.Utils.path(pF)//pathfile
	if tF[0] != "/" then tF = SS.Utils.path(tF)//targetfile
	if not Utils.fileFromPath(o, pf) then return LOG("File not found".warning)
	c = o.build(pF, tF, fN)
	if c.len > 1 then return LOG(c.warning)
	//s = (fN.white+" compiled at path: "+pF.yellow).ok
	LOG((fN.white+" compiled at path: "+pF.yellow).ok)
end function
Core["launch"] = function(o, p, data = null)
	if T(o) != "shell" then return LOG("Only shells can launch binaries".warning)
	fn=null
	if p == "-s" then fn = "ss"
	if p == "-p" then fn = "cargo"
	if p == "-e" then fn = "eel"
	if p[0] != "-" then 
		if p[0] != "/" and SS.cwd != "/" then fn = SS.cwd+"/"+p
		if p[0] == "/" then fn = p
	else 
		fn = SS.cwd+"/"+p
	end if
	f = o.host_computer.File(fn)
	if f == null then return LOG("Launch binary not found on target machine")
	if data == null then return o.launch(fn)
	return o.launch(fn, data)
end function
Core["service"] = function(o, a, s = null, f = null)
	if T(o) != "shell" then return LOG("Must be of type: Shell".warning)
	if (a == "-s" or a == "-k") and s == "libhttp.so" and f != null then return SS.Utils.webmanager(o, f) 
	if a == "-l" then return SS.Utils.listServices(o)
	if s == null then return LOG("No service specified".warning)
	act = null
	srv = SS.Utils.hasLib(o, s, null, true)
	if a == "-i" then 
		al = "Installing:<i> ".grey+s
		act = srv.install_service
	else if a == "-s" then 
		al = "Starting<i> ".white+""
		act = srv.start_service
	else if a == "-k" then 
		al = "Stopping:<i> ".grey+s 
		act = srv.stop_service
	end if
	if T(act) == "string" then 
		return LOG(act.warning)
	else if act == 1 then
		st = al+" "+s.white+" ---> "+"OK".green 
		LOG(st.ok)
	else
		st = "failed to "+al+" "+s
		LOG(st.warning)
	end if
end function
Core["ps"] = function(o, a = null)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	u = SS.Utils.user(o)
	w = 0.1
	if a == "-l" then 
		_p = function; return print(format_columns(show_procs(o))); end function;
	else 
		_p = function
			s = "USER".cyan+" "+"PID".cyan+" "+"CPU".cyan+" "+"MEM".cyan+" "+"SS.CMD".cyan
			ps = o.show_procs.split(NL); if ps.len != 0 then ps.pull;
			for p in ps
				p = p.split(" ")
				s = s + NL + p[0].isRoot(u, "00BDFF") + " " + p[1].white + " " + p[2].grey + " " + p[3].grey + " " + p[4].isProc
			end for
			return LOG("".fill+NL+COLUMNS(s)+NL+"".fill) 
			//return print(format_columns(s))
		end function
	end if
	if not a then return _p
	_n = function
		if split(o.show_procs, "Notepad").len > 1 then return 1
		return null
	end function
	// add a process switch, kill process to return to ss
	if not _n then return LOG("Open Notepad for resmon".warning)
	while 1
		CLEAR;
		_p;
		wait(0.1);
		if not _n then break;
	end while
end function
Core["kill"] = function(o, p, a = null)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	procs = o.show_procs.split(NL)
	if procs.len == 1 then return LOG("No processes to close".warning)
	n = null
	_c = function(num, n = null)
		if not n then n = p
		out = o.close_program(num.to_int)
		if out == true then LOG(("Process "+n.grey+" closed").ok)
		if T(out) == "string" then LOG(out.warning)
	end function
	if T(p.to_int) != "number" then 
		for i in range(1, procs.len-1)
			n = null
			parse = procs[i].split(" ")
			if parse[4] == p then
				n = true 
				_c(parse[1])
				if a != "-a" then break
			end if 
		end for		
		if not n then return LOG(("Process "+p.yellow+" is invalid").warning)
	else 
		for i in range(1, procs.len-1)
			parse = procs[i].split(" ")
			if parse[1].to_int == p.to_int then
				n = parse[4] 
				_c(parse[1])
				break
			end if
		end for
		if not n then return LOG(("Process "+p.yellow+" is invalid").warning)	
		if a != "-a" then return
		procs = o.show_procs.split(NL)
		if procs.len == 1 then return LOG("No other processes to close".warning)
		for i in range(1, procs.len-1)
			parse = procs[i].split(" ")
			if parse[4] != n then continue
			_c(parse[1], parse[4])
		end for
	end if
end function
Core["passwd"] = function(o, u)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	out = o.change_password(u, INPUT("Changing password for user: ".sys + u +"\nNew password: ", true))
	if T(out) == "string" then return LOG(out.warning)
	LOG("Password modified for: ".ok+u)
end function
Core["touch"] = function(o, fn, pf = null)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	if pf == null then pf = SS.cwd
	if (o.File(pf) == null) or (o.File(pf).is_folder != true) then return LOG("Invalid parent folder".warning)
	t = o.touch(pf, fn)
	if t == 1 then return LOG("Created file: ".ok+pf.grey+"/".grey+fn)
	if T(t) == "string" then return LOG(t.warning)
end function
Core["mkdir"] = function(o, fn, pf = null)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	if pf == null then pf = SS.cwd
	if (o.File(pf) == null) or (o.File(pf).is_folder != true) then return LOG("Invalid parent folder".warning)
	t = o.create_folder(pf, fn)
	if t == 1 then return LOG("Created directory: ".ok+pf.grey+"/".grey+fn)
	if T(t) == "string" then return LOG(t.warning)
end function
Core["scp"] = function(r, a, op, dp = null)
	if T(r) != "shell" then return LOG("Object must be of type shell".warning)
	out = null
	if SS.debug then LOG("scp: ".debug+"op: "+op+" dest: "+dp+" ")
	if dp == null then dp = SS.cwd
	if op[0] != "/" then op = SS.Utils.path(op)
	if dp[0] != "/" then dp = SS.Utils.path(op)
	if a == "-d" then
		if r.host_computer.File(op) == null then return LOG("File not found on rhost".warning)
		out = r.scp(op, dp, SS.s)		
	else if a == "-u" then
		if SS.c.File(op) == null then return LOG("File not found on lhost".warning) 
		out = SS.s.scp(op, dp, r)
	end if
	if T(out) == "string" then LOG(out.warning)
end function
Core["put"] = function(r, op, dp = null)
	if T(r) != "ftpshell" then return LOG("Surf Mode's object must be of type ftp shell".warning)
	out = null
	if dp == null then dp == SS.cwd
	if op[0] != "/" then op = SS.Utils.path(op)
	if dp[0] != "/" then dp = SS.Utils.path(op)
	if SS.s.host_computer.File(op) == null then return LOG("File not found".warning)
	out = SS.s.scp(op, dp, r)// this will need to be adjusted
	if T(out) == "string" then return LOG(out.warning) 
	LOG("File uploaded to path: ".ok+dp)
end function
Core["get"] = function(r, op, dp = null)
	if T(r) != "ftpshell" then return LOG("Surf Mode's object must be of type ftp shell".warning)
	out = null
	if dp == null then dp == SS.cwd
	if op[0] != "/" then op = SS.Utils.path(op)
	if dp[0] != "/" then dp = SS.Utils.path(op)
	if o.host_computer.File(op) == null then return LOG("File not found".warning)
	out = r.put(op, dp, SS.s)
	if T(out) == "string" then return LOG(out.warning)
	LOG("File downloaded to path: ".ok+dp)
end function
//TODO: invalid arg handle
Core["ssh"] = function(o, cs, p = 22)
	if T(o) != "shell" then return LOG("Object must be of type shell".warning)
	if cs.indexOf("@") == null then return LOG("Invalid usage: user@ip port".warning)
	if p != 22 then p = p.to_int
	cs = cs.split("@")
	svc = o.connect_service(cs[1], p, cs[0], INPUT("Enter password: ".prompt, true), "ssh")
	if T(svc) == "string" then; LOG(svc.warning); return null; end if
	if svc == null then return
	rs = "SSH connection established".ok
	if SS.og then rs = rs.ogconnect
	LOG(rs)
	return svc
end function
//TODO: invalid arg handle
Core["ftp"] = function(o, cs, p = 21)
	if T(o) != "shell" then return LOG("Object must be of type shell".warning)
	if cs.indexOf("@") == null then return LOG("Invalid usage: user@ip port".warning)
	if p != 21 then p = p.to_int
	cs = cs.split("@")
	svc = o.connect_service(cs[1], p, cs[0], INPUT("Enter password: ".prompt, true), "ftp")
	if T(svc) == "string" then; LOG(svc.warning); return null; end if
	if svc == null then return
	rs = "FTP connection established".ok
	if SS.og then rs = rs.ogconnect
	LOG(rs)
	return svc
end function
Core["secure"] = function(o, a)
	//[todo:] file object compatability
	LOG("Securing system . . .".sys)
	if a == "-p" then return SS.Utils.patch(o)
	m=null;b=null;out=null;cfg=null
	GF = @SS.Utils.fileFromPath
	isR = SS.Utils.isRoot(o)
	if T(o) == "file" then
		if o.owner == "root" then isR = true
		r = SS.Utils.rootFromFile(o)
		if r.chmod("o-wrx", true).len > 1 then LOG("Failed to adjust scope Other to /".warning)
		g = SS.Utils.fileFromPath(o, "/home/guest")
		if g != null then;if (g.set_owner("root", true).len < 1) and (g.set_group("root", true) < 1) then LOG("Guest has been secured".ok);end if;	
		files = [GF(r,"/sys") , GF(r,"/boot") , GF(r,"/lib")]
		if a == "-s" then cfg = GF(r, "/root/Config")
		if a == "-h" then cfg = GF(r, "/home/"+o.owner)
		pw = GF(r, "/etc/passwd")
	else 
		o = SS.Utils.ds(o, "computer")
		if o == null then return
		r = o.File("/")
		if r.chmod("o-wrx", true).len > 1 then LOG("Failed to adjust scope Other to /".warning)
		g = o.File("/home/guest")
		if g != null then;if (g.set_owner("root", true).len < 1) and (g.set_group("root", true) < 1) then LOG("Guest has been secured".ok);end if;
		files = [o.File("/boot"), o.File("/sys"), o.File("/lib")]
		if a == "-s" then cfg = o.File("/root/Config")
		if a == "-h" then cfg = o.File("/home/"+SS.Utils.user(o)+"/Config")
		pw = o.File("/etc/passwd")
	end if
	if a == "-s" then;if r.chmod("g-wrx", true).len > 1 then LOG("Failed to adjust scope Group to /".warning);if r.chmod("u-wrx", true).len > 1 then LOG("Failed to adjust scope User to /".warning);end if;
	if a == "-h" then;for f in files;if f then f.chmod("u-rwx", true);end for;
	if cfg != null then
		if T(o) == "file" then 
			b = GF(r, cfg.path+"/Bank.txt")
			m = GF(r, cfg.path+"/Mail.txt")
		else 
			b = o.File(cfg.path+"/Bank.txt")
			m = o.File(cfg.path+"/Mail.txt")
		end if
		out = cfg.set_owner("root", true)
		if T(out) == "string" then LOG(out.warning)
		out = cfg.set_group("root", true)
		if T(out) == "string" then LOG(out.warning)
		if cfg.chmod("u-rwx", true).len > 1 then LOG("Failed to adjust rwx permissions to ".warning+cfg.path)
		m=o.File(cfg.path+"/Bank.txt")
		b=o.File(cfg.path+"/Bank.txt")
		if m != null and m.delete().len < 1 then LOG("Mail.txt has been deleted".ok)
		if m != null and b.delete().len < 1 then LOG("Bank.txt has been deleted".ok)
	end if
	if pw then pw = pw.delete
	if pw.len > 1 then LOG("Deleted /etc/passwd")
end function
Core["webmanager"] = function(o, a, p)
	if a == "-b" then return SS.Utils.site_build(o, p)
	if a == "-u" then return SS.Utils.site_wipe(o, p)
	return LOG("Invalid arguments provided".warning)
end function
Core["ls"] = function(o, p = null)
	if p == null then p = SS.cwd
	if p[0] != "/" then p = SS.Utils.path(p)
	if T(o) == "file" then
		f = SS.Utils.fileFromPath(o, p)
	else 
		o = SS.Utils.ds(o, "computer")
		f = o.File(p)
	end if 
	if o == null then return LOG("Script error".error)
	if f == null then return LOG("Directory not found: ".warning+p)
	if f.is_folder == false then return LOG("Not a folder: ".warning+p)
	sf = f.get_folders+f.get_files;out = "";u = SS.Utils.user(o);
	if not sf then return LOG("*"+"<i>This Directory Has No Content</i>".grey+"*  \nUse cmd: "+"<b>cd ..</b>".white+" to navigate to previous directory")
	if sf.len > 0 then 
		out = "PERMISSIONS".cyan+" "+"OWNER".cyan+" "+"GROUP".cyan+" "+"TYPE".cyan+" "+"SIZE".cyan+" "+"NAME ".cyan
	end if
	fpar = f.parent
	if (fpar != null) and (fpar.parent != null) then out = out + NL + fpar.parent.permissions.white + " " + fpar.parent.owner.isRoot(u, "00BDFF")+" "+fpar.parent.group.isRoot(u, "00BDFF")+" "+"dir".lblue+" "+fpar.parent.size.bitToByte.grey+" "+".".lblue+fpar.parent.path.size(14)
	if fpar != null then out = out + NL + fpar.permissions.white + " " + fpar.owner.isRoot(u, "00BDFF")+" "+fpar.group.isRoot(u, "00BDFF")+" "+"dir".lblue+" "+fpar.size.bitToByte.grey+" "+"..".lblue+fpar.path.size(14)
	for s in sf
		fT = "txt".cyan;
		if s.is_folder then fT = "dir".lblue;
		if s.is_binary == true and s.is_folder == false then fT = "bin".purple
		out = out + NL + s.permissions.white + " " + s.owner.isRoot(u, "00BDFF")+" "+s.group.isRoot(u, "00BDFF")+" "+fT+" "+s.size.bitToByte.grey+" "+s.name.white
	end for
	return LOG("Listing Directory: ".sys+f.path+NL+"".fill+NL+COLUMNS(out))
end function
Core["chmod"] = function(o, r, u, pa)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	rec = false 
	if r == "-r" then rec = true
	if pa[0] != "/" then pa = SS.Utils.path(pa)
	f = SS.Utils.fileFromPath(o, pa)
	if f == null then LOG("Unable to chmod file: not found".warning)
	out = f.chmod(u, rec)
	if out.len > 1 then return LOG(out.warning)
	fp = "/".lblue; if f.path != "/" then fp = f.parent_path.grey+"/"+f.name.lblue
	LOG((fp+" has been given permissions: "+u).ok)
end function
Core["chgrp"] = function(o, r, u, pa)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	rec = false 
	if r == "-r" then rec = true
	if pa[0] != "/" then pa = SS.Utils.path(pa)
	f = SS.Utils.fileFromPath(o, pa)
	if f == null then LOG("Unable to chgrp file: not found".warning)
	out = f.set_group(u, rec)
	if out.len > 1 then return LOG(out.warning)
	fp = "/".lblue; if f.path != "/" then fp = f.path.grey+"/"+f.name.lblue
	LOG((fp+" has been assigned group: "+u).ok)
end function
Core["chown"] = function(o, r, u, pa)
	if SS.debug then LOG("debug".debug+o+NL+r+u+pa)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	rec = false 
	if r == "-r" then rec = true
	if pa[0] != "/" then pa = SS.Utils.path(pa)
	f = SS.Utils.fileFromPath(o, pa)
	if f == null then LOG("Unable to change file owner: file not found".warning)
	out = f.set_owner(u, rec)
	if out.len > 1 then return LOG(out.warning)
	fp = "/".lblue; if f.path != "/" then fp = f.path.grey+"/"+f.name.lblue
	LOG((fp+" is now owned by: "+u).ok)
end function
Core["cat"] = function(o,p)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	f = SS.Utils.fileFromPath(o, p)
	if f == null then return LOG("File not found: ".warning + p)
	if f.is_binary then return LOG("Unable to open - file is binary".warning)
	if f.has_permission("r") == false then return LOG("Cannot open - permission denied".warning)
	LOG("content:".ok+NL+f.get_content)
end function
Core["move"] = function(o, cfp, tfp, fn)
	if tfp[0] != "/" then tfp = SS.Utils.path(tfp)
	if T(o) == "file" then return o.move(tfp, tpf)
	if cfp[0] != "/" then cfp = SS.Utils.path(cpf)
	if T(o) != "computer" then o = o.host_computer
	f = o.File(cfp)
	if f == null then return LOG("File not found at: ".warning+tfp)
	t = f.move(tfp, fn)
	if T(t) == "string" then return LOG(f.warning)
	fp = "/".lblue; if f.path != "/" then fp = f.parent_path.grey+"/"+f.name.lblue
	LOG(("Moved file: "+fp+" to path: "+tfp.grey).ok)
end function
Core["copy"] = function(o, cfp, tfp, fn)
	if cfp == null then return LOG("path dest name")
	if tfp[0] != "/" then tfp = SS.Utils.path(tfp)
	if T(o) == "file" then return o.copy(cfp, tfp)
	if cfp[0] != "/" then cfp = SS.Utils.path(cfp)
	if T(o) != "computer" then o = o.host_computer
	f = o.File(cfp)
	if f == null then return LOG("File not found at: ".warning+cfp)
	t = f.copy(tfp, fn)
	if T(f) == "string" then return LOG(f.warning)
	fp = "/".lblue; if f.path != "/" then fp = f.parent_path.grey+"/"+f.name.lblue
	LOG(("Copied file: "+fp+" to path: "+tfp.grey).ok)
end function
Core["rm*"] = function(o, p)
	o = SS.Utils.ds(o, "file"); isGlob = null;
	if o == null then return
	if p[p.len-1] == "*" then isGlob = true
	if p[0] != "/" then p = SS.Utils.path(p)
	if isGlob != null then 
		LOG(p[:(p.len)-1])
		f = SS.Utils.fileFromPath(o, p[:p.len-1])
		if f == null then return LOG("Unable to delete - File not found".warning)
		if f.is_folder == false then return LOG("Unable to delete - Not a folder for *".warning)
		for fi in f.get_folders+f.get_files
			n = fi.name
			d = fi.delete
			if d == 1 then LOG("File Deleted: ".ok+n)
			if T(d) == "string" and d.len > 0 then LOG(d.warning)
		end for
	else 
		f = SS.Utils.fileFromPath(o, p)
		if f == null then return LOG("Unable to delete - File not found".warning)
		if f.has_permission("w") == false then return LOG("Unable to delete - permission denied".warning)
		n = f.name
		d = f.delete
		if d.len > 0 then return LOG(d.warning)
		LOG("File has been deleted: ".ok+n)
	end if
end function
Core["rn"] = function(o, p, n)// obj path newName
	o = SS.Utils.ds(o, "file")
	if o == null then return
	if p[0] != "/" then p = SS.Utils.path(p)  
	f = SS.Utils.fileFromPath(o, p)
	if f == null then return LOG("Couldn't rename - File not found".warning)
	if f.has_permission("w") == false then return LOG("Unable to rename - permission denied".warning)
	r =  f.rename(n)
	if r.len > 0 then return LOG(r.warning)
	LOG("File has been renamed: ".ok+n)
end function
Core["edit"] = function(o, p, clean = null)
	SS.Inputs.refresh()
	o = SS.Utils.ds(o, "file")
	if o == null then return
	if p[0] != "/" then p = SS.Utils.path(p)
	f = SS.Utils.fileFromPath(o, p)
	if f == null then return LOG("Unable to edit - File not found".warning)
	if f.has_permission("w") == false then return LOG("Unable to edit - Permission denied: ".warning+"W")
	if f.has_permission("r") == false then return LOG("Unable to edit - Permission denied: ".warning+"R")
	raw = f.get_content
	edit = null
	lastSel = null
	while 1
		CLEAR; input = null
		if edit == null then edit = raw
		parse = edit.split(NL)
		view = null
		c = 0
		currLine = parse[SS.Inputs.pos.y]
		mut_line = ""
		SS.Inputs.pos.xLen = currLine.len
		SS.Inputs.pos.yLen = parse.len
		for i in parse
			if c == 0 then 
				view = c+".) ".white+i
			else
				view = view+NL+c+".) ".white+i
			end if
			c = c+1
		end for
		LOG("Editing:".blue+f.path.yellow+NL+view)
		input = INPUT("-----INPUT: "+lastSel+NL+"X: ".white+SS.Inputs.pos.x+" | Y: ".white+SS.Inputs.pos.y, false, true)
		lastSel = input
		if input == "Escape" then break
		if input == "F1" then return SS.Utils.saveFileFromList(o, parse) 
		
		if SS.Inputs.invalid.indexOf(input) != null then continue			
		if SS.Inputs.valid.indexOf(input) then 
			if input == "LeftArrow" then 
				SS.Inputs.pos.setX(-1, parse)
			else if input == "RightArrow" then 
				SS.Inputs.pos.setX(1, parse)
			else if input == "UpArrow" and lineIndex != 0 and lineIndex > 0 then 
				SS.Inputs.pos.setY(-1, parse)
			else if input == "DownArrow" and lineIndex > -1 then 
				SS.Inputs.pos.setY(1, parse)
			end if
			continue
		else if input == "" then 
			parse.push(""); continue
		else 
			charIndex = 0
			for chars in currLine.values
				if charIndex != SS.Inputs.pos.x then 
					mut_line = mut_line+chars
				else 
					if (input == "Backspace") and SS.Inputs.pos.x < SS.Inputs.pos.xLen then 
						mut_line = mut_line+""
						SS.Inputs.pos.x = SS.Inputs.pos.x-1
					else if input == "Spacebar" then 
						mut_line = mut_line+" "
						SS.Inputs.pos.x = SS.Inputs.pos.x+1
					else 
						mut_line = mut_line+chars+input
					end if
				end if
				charIndex = charIndex + 1 
			end for
			if input != "Backspace" and input != "" then SS.Inputs.pos.x = SS.Inputs.pos.x+1
			parse[SS.Inputs.pos.y] = mut_line
		end if
	end while
end function
Core["ping"] = function(s, i)
	if T(s) != "shell" then return LOG("Must be of type shell".error)
	r = s.ping(i)
	if r == null then return LOG("Address unreachable".warning)
	if T(r) == "string" then return LOG(r.warning)
	LOG("Ping successful".ok)
end function
Core["sniff"] = function
	if SS.mx == null then return LOG("Program is operating under cfg: ".warning+SS.cfg.label)
	LOG("Listening for connections . . .".sys)
	LOG(SS.mx.sniffer)
end function
Core["iwlist"] = function(obj, net)
	obj = SS.Utils.ds(obj, "computer")
	if obj == null then return
	networks = obj.wifi_networks(net)
	if networks == null then return LOG("invalid usage")
	i = "BSSID".cyan+" "+"PWR".cyan+" "+"ESSID".cyan
	for network in networks
		n=network.split(" ")
		i = i + NL + n[0].lblue+" "+ n[1].grey+" "+ n[2].white
	end for
	LOG(COLUMNS(i))
end function
Core["ifconfig"] = function(o, addr = null, gate = null, device = null)
	//ifconfig [net interface] [ip address] gateway [ip address]
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	if addr == null then 
		if o.is_network_active == false then return LOG("Not connected to the network".warning)
		r = get_router
		out = "Ethernet connection: "
		if o.active_net_card == "WIFI" then out = "Connected to Wi-Fi:"+NL+"Essid: "+r.essid_name.white+NL+"Bssid: "+r.bssid_name.white
		out = out+NL+" - - - - - "+NL+"Public IP:".white+r.public_ip+NL+"Local IP: ".white + o.local_ip + NL + "Gateway: ".white + o.network_gateway + NL
		LOG(out)
	else
		if not gate or not device then return LOG("invalid args".error)
		if not is_valid_ip(addr) then return LOG("invalid ip address".warning)
		if not is_valid_ip(gate) then return LOG("invalid gateway".warning)
		output = o.connect_ethernet(device, addr, gate)
		if output.len > 0 then LOG(output)
	end if
end function
Core["iwconfig"] = function(obj, net, bss, ess, pass)
	//Usage: iwconfig [net device] [bssid] [essid name] [pass key]
	o = SS.Utils.ds(obj, "computer")
	if o == null then return
	devices = o.network_devices
	if devices == null or devices.indexOf(net) == null then return print("iwconfig: SS.Network device not found")
	status = o.connect_wifi(net, bss, ess, pass)
	if T(status) == "string" then LOG(status)
end function
Core["airmon"] = function(obj, option, device)
	if SS.crypto == null then return LOG("Missing crypto library".warning)
	obj = SS.Utils.ds(obj, "computer"); if obj == null then return;
	formatOutput = "Interface".cyan+" "+" Chipset".cyan+" "+"Monitor_Mode".cyan
	if option != "start" and option != "stop" then return LOG("invalid arguments, [start|stop]".warning)
	output = SS.crypto.airmon(option, device)
	if not output then return LOG("Invalid device choice".warning)
	if T(output) == "string" then return LOG(output.warning)
	ret = ""
	LOG( COLUMNS(obj.network_devices))
end function
Core["aireplay"] = function(bssid, essid)
	if (not bssid) or (not essid) then return LOG("invalid arguments [bssid] [essid]".warning)
	if SS.crypto == null then return LOG("Missing crypto library".warning)
	result = SS.crypto.aireplay(bssid, essid)
	if T(result) == "string" then return LOG(result)
end function
Core["aircrack"] = function(obj, pathFile)
	//command: aircrack
	if SS.crypto == null then return LOG("Missing crypto library".warning)
	if pathFile[0] != "/" then pathFile = SS.Utils.path(pathFile)
	obj = SS.Utils.ds(obj, "computer")
	if obj == null then return null
	file = obj.File(pathFile)
	if file == null then return LOG("aircrack: file not found: ".warning+pathFile)
	if not file.is_binary then return LOG("aircrack: Can't process file. Not valid filecap.".warning)		
	if not file.has_permission("r") then return LOG("aircrack: permission denied".warning)
	key = SS.crypto.aircrack(file.path)
	if key then return LOG("KEY FOUND!".ok+" [" + key + "]" )
	LOG("Unable to get the key".warning )
end function
Core["apt"] = function(c, p=null)
	if SS.apt == null then return LOG("apt client not found".warning)
	if c == "-u" then return LOG(SS.apt.update)
	if p == null then 
		if c != "--" then return LOG(" ")
		libs = SS.checkApt
		if libs.len == 0 then return LOG("No updates needed !".ok)
		LOG("The following packages will be updated:"+NL+libs.select(""))
		if INPUT("Press 1 to continue, any to canel").to_int != 1 then return
		c = 0
		for i in libs 
			o = SS.apt.install(i)
			if o == true then c = c+1
			if T(o) == "string" then LOG(o)
		end for
		LOG("Packages updated: ".ok+c)
	else
		if c == "install" then 
			LOG("Downloading " + p);
			output = SS.apt.install(p)
			if  output == true then return LOG( "Installed: ".ok+p)
			return LOG(output.warning)
		end if
		if c == "addrepo" then
			port = 1542
			output = SS.apt.add_repo(p)
			if output.len != 0 then LOG(p)
			return LOG("Repository " + p + " added succesfully.\nLaunch apt with the update option to apply the changes")
		else if c == "delrepo" then
			output = SS.apt.del_repo(param)
			if output then LOG(output)
			return LOG("Repository " + p + " removed succesfully.\nLaunch apt with the update option to apply the changes")
		end if
		if c == "search" then return LOG(SS.apt.search(p));
		if c == "show" then return LOG(SS.apt.show(p));
	end if
end function
Core["cipher"] = function(h, a)
	if SS.debug then LOG("cipher debug".debug+h+" "+a)
	ret = null 
	if a == "-c" then
		if SS.debug then LOG("Cipher:c1".debug)
		if SS.crypto == null then return LOG("Program is operating under cfg: >"+SS.cfg.label) 
		if h.indexOf("&") then h = p.split("&")[0]
		LOG("Crypto selected: ".sys+"Beginning manual scan...".grey)
		ret = SS.crypto.decipher(h)
	else
		if SS.debug then LOG("Cipher:c2".debug) 
		ret = SS.MD5.find(h)
	end if
	if ret == null then return LOG("Unable to decipher: ".warning+h)
	LOG("Dehashed value: ".ok+ret)
	return ret
end function
Core["smtp"] = function(addr, port)
	if (not addr) or (not port) then return LOG("Invalid args".warning)
	if SS.crypto == null then return LOG("Program is operating under CFG: "+SS.cfg.label)
	port = port.to_int
	if T(port) != "number" then return LOG("Port must be a number")
	u = SS.crypto.smtp_user_list(addr, port)
	if T(u) == "string" then return LOG(u.warning)
	LOG("Mail users found: ".ok.NL+u)
end function
Core["router"] = function(addr) 
	if not is_valid_ip(addr) then return LOG("Invalid ip address".warning)
	net = new SS.Network; net.map(addr);
	if net == null then return null
	r = net.router
	LOG("".fill +NL+ "~^~~~^~".lblue+"[ <b>".white+r.public_ip.white+"</b> ]".white+ "~^~~~^~".lblue + "( "+r.kernel_version.isOp("1.1.6")+" )"+ NL +"|".lblue+"BSSID: " +r.bssid_name.lblue + NL +"|".lblue+"ESSID: " +r.essid_name.lblue + NL + net.fw(r.firewall_rules))
end function
Core["nmap"] = function(addr, a = null)
	if SS.c.is_network_active == false then return LOG("Script is offline".warning)
	if addr == "-r" then addr = SS.Utils.random_ip
	if not is_valid_ip(addr) then return LOG("Invalid ip specified".warning)
	net = new SS.Network; net = net.map(addr);
	if net == null then return LOG("netmap: An error occured".error)
	ret = net.nmap
	if a == "-w" then ret = "".fill+NL+net.is+NL+"".fill+NL+ret
	if a == "-a" then ret = "".fill +NL+ net.is +NL+ "".fill +NL+ net.rs + ret
	LOG(ret)
end function
Core["scanlan"] = function
	if SS.c.is_network_active == false then return LOG("Script is offline".warning)
	net = new SS.Network.scanlan
end function
// create and manage net sessions by each step
// address , port, action, data
// address , port, memAddr, memValue
Core["ns"] = function(addr, p, a = null, d = null)
	if SS.debug then LOG("SS.NS".debug+NL+"addr "+addr+NL+"port "+p+NL+"action: "+a+NL+"data "+d)
	if not addr and not p then return null
	p = to_int(p)
	addr = addr.isIp
	res = []
	if ["-f", "-i"].indexOf(a) != null then 
		netsesh = new SS.NS.map(addr, p, a)
	else 
		netsesh = new SS.NS.map(addr, p, null)
	end if
	if netsesh.session == null then return //LOG("Unable to establish net session".warning)
	LOG("Pushing net session to cache . . .".ok) ; netsesh.cache;
	if not a then return 
	exploits = null
	LOG(netsesh.summary)
	if a == "-s" then // select
		exploits = netsesh.mlib.browse
	else if a == "-a" then // all
		exploits = netsesh.mlib.scanned
	else if a == "-i" then 
		return
	else
		if not d then return
		res = netsesh.mlib.of([[{"exploit":"Unknown"}, {"memory": a},{"string": d}]], SS.Utils.datapls)
		//exploits = true
	end if
	if SS.debug then LOG("Exploits: ".debug+exploits)
	if exploits == null then
		if INPUT("Press 1 to confirm manual scan".prompt).to_int != 1 then return
		netsesh.mlib.scan(netsesh.mlib)
		exploits = netsesh.mlib.get(netsesh.mlib)
	end if
	if not d then d = SS.Utils.datapls
	if d == ""  or d == " " then d = SS.cfg.unsecure_pw; if d == SS.cfg.unsecure_pw then LOG("Defaulting to unsecure pw . . .".sys)
	if d == null then return LOG("Data error".error)
	if T(exploits) == "list" then
		res = netsesh.mlib.of(exploits, d)
	else if T(exploits) == "string" then
		res = netsesh.mlib.of(null, d)
	end if
	if res.len == 0 or res == null then return LOG("No objects returned".warning)
	isL = is_lan_ip(addr)
	if isL == true then 
		ip = addr.getGw 
		lan = addr
	else
		ip = addr
		lan = null
	end if
	SS.cache(res, ip, lan)
end function 
Core["ns_handle"] = function(a = null)
	if SS.sessions.len == 0 then return LOG("No sessions found in cache".warning)
	ret=null;res=null;UC=null;
	while 1
		c = []
		for i in SS.sessions  
			c.push(i.summary)
		end for
		UI = INPUT(c.select+NL+"Choose a net session".prompt)
		if UI == "" or UI == " " then break
		UI = UI.to_int
		if (UI-1) > SS.sessions.len then continue
		ret = SS.sessions[UI-1]
		UC = INPUT(["Select Exploit(s)", "Exploit all", "Remove"].select.NL+"choose | any to return".prompt).to_int
		if UC == "" or UC == " " then continue
		if ret then break
	end while
	if ret == null then return null
	if UC == 1 then 
		e = ret.mlib.browse
	else if UC == 2 then 
		e = ret.mlib.scanned
	else if UC == 3 then 
		return SS.sessions.remove(UC-1)
	else 
		return null 
	end if
	if T(e) == "list" then
		res = ret.mlib.of(e, SS.Utils.datapls)
	else if T(e) == "string" then
		res = ret.mlib.of(null, SS.Utils.datapls)
	end if

end function
// TODO: network handler; perhaps one day if we have more router methods :')
Core["net_handle"] = function(a = null)

	return null
end function
Core["entry"] = function(_, addr, p1 = null)// easy net session entry
	if SS.mx == null then return LOG("Program is operating under cfg: ".warning+SS.cfg.label)
	if addr == "-r" then addr = SS.Utils.random_ip
	net = SS.Network.map(addr)
	if net == null then return //LOG("netentry: An error occured".error)
	addr = addr.isIp
	ns = null
	// bring up our mapped services 
	if net.services.len == 0 then 
		// default to targeting router
		if INPUT("No open ports found".orange.warning.NL+"Press 1 to target router".prompt).to_int != 1 then return null
		ns = new SS.NS.map(addr, 0, "-f")
	else
		t = net.nmap.split(NL)
		svcs = net.nmap.split(NL)
		svcs.pull 
		sel = INPUT(("   LIBRARY".cyan+"   STATE".cyan+"  VERSION".cyan+"  LAN".cyan+"          PORT".cyan+NL+svcs.select2)).to_int
		if T(sel) != "number" then return null
		if sel == 0 then
			ns = new SS.NS.map(addr, 0, "-i")
		else if sel <= net.services.len then
			s = net.services[sel-1]
			if SS.debug then LOG("Net:entry:c2".debug+s)
			ns = new SS.NS.map(addr, s[3], "-i")
		else 
			if SS.debug then LOG("Entry:c3".debug)
			LOG("Invalid choice".warning)
		end if
	end if
	if ns.session == null then return null
	LOG(ns.summary)
	sel = INPUT([("Use "+"ALL".green+" Exploits").white, ("Select Exploit("+"s".green+")").white, ("Manual Scan "+"(No Saves)".red).white].select.NL+"confirm option".prompt).to_int
	payload = null
	if sel == 1 then 
		payload = ns.mlib.scanned
	else if sel == 2 then 
		payload = ns.mlib.browse
	else if sel == 3 then 
		payload = ns.mlib.manscan
	else if self.scanned == null then 
		return null 
	end if
	d = SS.Utils.datapls
	if (d == "")  or (d == " ") then d = SS.cfg.unsecure_pw
	res = []
	if T(payload) == "list" then
		res = ns.mlib.of(payload, d)
	else if T(payload) == "string" then
		res = ns.mlib.of(null, d)
	end if
	if res.len == 0 or res == null then return LOG("No objects returned".warning)
	i = null; l = null
	if is_lan_ip(addr) == true then 
		i = addr.getGw 
		l = addr
	else
		i = addr
		l = null
	end if
	SS.cache(res, i, l)
end function
// TODO: local hax revised
Core["localhax"] = function(o, a, l)
	if not SS.mx then return LOG("Program operating under CFG: "+SS.cfg.label)
	if ["init.so", "kernel_module.so", "net.so", "aptclient.so", "-a"].indexOf(l) == null then return LOG("Invalid arguments".warning)
	m = new SS.MX
	m.i(o)
	ip = null // addme
	lan = null // addme
	if m.x == null then return null
	if l == "-a" then// all libraries
		m.l("-a")
	else// name
		m.l(l)
	end if
	for l in m.libs 
		if not l then continue
		exploits = null
		if a == "-a" then 
			exploits = l.scanned
		else
			exploits = l.browse
		end if
		res = null
		if not exploits then LOG("An error occurs")
		if T(exploits) == "list" then 
			res = l.of(exploits, SS.Utils.datapls)
		else if T(exploits) == "string" then
			res = l.of(null, SS.Utils.datapls)
		end if
		if res == null or res.len == 0 then; LOG("No objects returned".warning); continue; end if;
		SS.cache(res, ip, lan)
	end for
end function
Core["fish"] = function(obj, lib, libVersion)
	ip = null
	if lib == "kernel_router" then 
		ip = SS.Utils.router_fish(libVersion)
	else if lib == "-p" then 
		ip = SS.Utils.port_fish(libVersion)
	else 
		ip = SS.Utils.lib_fish(lib, libVersion)
	end if
	if ip then ; LOG(ip.ok); return Core.entry(obj, ip); end if
	return LOG("lib finder error".warning)
end function
// quickly transfer tools to systems
Core["mount"] = function(o, t, p = null)
	if T(o) != "shell" then return LOG("Invalid type".warning)
	pc = SS.Utils.ds(o, "computer")
	if pc == null then return
	if not p then p = "/home/guest/Desktop"//+SS.ccd
	if p[0] != "/" then p = SS.Utils.path(p)
	files = ["metaxploit.so", "crypto.so", "ss"]
	if t == "-a" then files = ["metaxploit.so", "crypto.so", "ss", "sf"]
	if t == "-p" then files = ["sf"] // pivot
	dirs = ["/lib/", "/bin/", launch_path+"/", parent_path(launch_path)+"/", p+"/"+SS.ccd]
	ret = []
	for f in files 
		for d in dirs 
			if SS.c.File(d+f) != null then 
				ret = ret.push(SS.c.File(d+f)); break;
			end if
		end for
	end for
	if ret.len == 0 and (t != "-p") then return LOG("Cannot find payload".warning)
	cache = pc.File(p+"/"+SS.ccd)  
	if cache == null then 
		f = pc.create_folder(p, SS.ccd)
		cache = pc.File(p+"/"+SS.ccd) 
	end if 
	if cache == null then return LOG("There was a problem creating the cache".warning)
	cache.chmod("g+rwx", true)
	cache.chmod("o+rwx", true)
	cache.chmod("u+rwx", true)
	pf = cache.path
	LOG(pf)
	LOG(("mounting --> "+p.yellow).sys)
	for f in ret
		c = SS.s.scp(f.path, pf, o)
		if T(c) == "string" then; LOG(c.warning.s+f.name); continue; end if; 
		LOG("Transferred file: ".ok+f.name)
		//fi = pc.File(pf)
		//if not fi then continue
		//fi.set_owner("guest")
		//fi.set_group("guest")
	end for
end function
Core["wipe"] = function(o, t)
	if t == "-l" then 
		return SS.Utils.wipe_logs(o)
	else if t == "-t" then
		return SS.Utils.wipe_tools(o)
	else if t == "-s" then 
		return SS.Utils.wipe_sys(o)
	end if
end function
// action: -l | -p | ! | -c
Core["rshell"] = function(o, a, i = null, d = null)
	x = new SS.MX
	x.i(o)//include
	if x.x == null then x.fi//force include
	if x.x == null then return LOG("Unable to load metaxploit".warning)
	return x.rs(a, i, d)
end function
Core["bam"] = function(o, cmd, a1=null,a2=null,a3=null,a4=null)
	if T(o) != "shell" then return LOG(("B.A.M requires a "+"shell".red).warning)
	args = []
	if a1 != null then args.push(a1)
	if a2 != null then args.push(a2)
	if a3 != null then args.push(a3)
	if a4 != null then args.push(a4)
	isCmd = SS.CMD.isValid(cmd)
	isMod = SS.BAM.isModule(cmd)
	if isCmd != null then 
		return SS.BAM.handler(o, isCmd, args)
	else if isMod != null then 
		return SS.BAM.handler(o, isMod, args, 1)
	else 
		return LOG("Neither a command or module")
	end if
end function
Core["iget"] = function(o, act, d1 = null, d2 = null, d3 = null, d4 = null)// internal get
	SS.bamres = null
	if act == "mx" or act == "rshell" then 
		m = new SS.MX
		m.i(o)
		if m.x == null then m.fi(o)
		if m.x == null then return null
		SS.bamres = m.x
	else if act == "network" then
		if not d1 then d1 = o.host_computer.public_ip
		net = new SS.Network
		SS.bamres = net.map(d1) 
	else if act == "ns" then
		m = new SS.MX
		m.i(o)
		if m.x == null then m.fi(o)
		if m.x == null then return null
		netsesh = new SS.NS.map(d1, d2, "-f", m.x)
		if netsesh == null or netsesh.session == null then return null
		SS.bamres = netsesh//.mlib.of(null, d1)
	else if act == "shell" then
		//ret = get_shell
	else if act == "rootshell" then
		SS.bamres = Core["shellfish"]// res, not a ret as that goes to surf mode
	else if act == "scan" then
		SS.bamres = "add me"
	else if act == "mail" then 
		SS.bamres = mail_login(SS.cfg.mailacct, SS.cfg.mailpw)
	else if act == "rcon" then 
		SS.bamres = SS.MD5.connect(o, d1, d2, d3, d4)
	else if act == "api" then 
		SS.bamres = LOG("API needs implementation!")
	else 
		LOG("Invalid use of iget".error)
	end if
	return SS.bamres
end function
Core["proxybounce"] = function(o)
	if T(o) != "shell" or T(o) != "ftpshell" then return LOG("A shell is required".warning)
	server = new SS.Server
	server.proxtunnel(o)
end function
Core["npc"] = function(o, t=null,d=null,n=null)
	if T(o) != "shell" then return LOG("Need a shell for bam".warning)
	if not t then t = "-p"
	LOG("Beginning NPC mission completion. . .".ok)
	SS.NPC.mission(o, t, d, n)
end function
Core["shellfish"] = function(_, u = "root")
	result = null
	result = SS.MD5.shell(u)
	SS.bamres = result
	return result
end function
Core["md5"] = function(s)
	if not s then return LOG("Provide a string to return an md5".warning)
	LOG(md5(s).ok)
end function
Core["test"] = function
	// menu tests
	//t_o = [
	//	{"name": "Page 1", "options": ["choice1".green, "choice2".yellow, "choice3".red, ]},
	//	{"name": "Page 2", "options": ["choice1".green, "choice2".yellow, "choice3".red, ]},
	//	{"name": "Page 3", "options": ["choice1".green, "choice2".yellow, "choice3".red, ]},
	//]
	//menu = SS.Utils.menu("Testing", t_o )
	// network tests
	//NET = SS.Network.map(get_shell.host_computer.local_ip)
	//NET.maplan 
	//LOG(NET.subnets)
	//eo = new SS.EO ; eo.map(get_shell("root", "root"));
	//SS.shells.push(eo)
	//LOG(eo.info)
	//eo = new SS.EO ; eo.map(SS.f);
	//SS.files.push(eo)
	//
	//eo = new SS.EO ; eo.map(SS.f, SS.c.public_ip);
	//SS.files.push(eo)
	//LOG(eo.info)

	// time
	//LOG(floor(time))
	//LOG(SS.Date.now)

	//start = time
	//wait(5)
	//SS.Date.timer(start)

	//netsesh = new SS.NS.map("1.1.1.1", 22, "-i")
	////netsesh = new SS.NS.map("172.16.16.8", 80, "-i")
	//if netsesh.session == null then return
	//LOG(netsesh.summary)
	//LOG(netsesh.addr)
	//LOG(T(netsesh.dump))
	//ret = []
	//LOG("sessions "+SS.sessions.len)
	//netsesh.cache
	//LOG("sessions "+SS.sessions.len)
	//netsesh.cache
	//LOG("sessions "+SS.sessions.len)
	
	//test = netsesh.browse()
	//LOG(test)
	//netsesh.of(test, "testing")

	//m = new SS.MX.i(SS.s)
	//if m == null then return LOG("mx error".debug)
	//m.l
	//LOG(m.libs.len)
	//m.l("-a")
	//LOG(m.libs.len)
	//target_lan = "192.168.1.5"
	//total = 0
	//for lib in m.libs
	//	local_hacks = lib.of(null, target_lan)
	//	total = total + local_hacks.len
	//end for
	//LOG(total)
	//if m.x == null then return LOG("NO MX")
	//cmd = SS.CMD.getOne("iget")
	//bam = SS.BAM.handler(SS.s, cmd, ["ns", "1.1.1.1", 22, m.x])
	////ret1 = SS.bamres//network
	//LOG("RET "+T(SS.bamres))
	cmd = SS.CMD.getOne("iget")
	SS.BAM.handler(SS.s, cmd, ["mail"])
	LOG(SS.bamres.fetch.len)

	LOG(SS.cfg.wf)
end function

///======================= SS.CMD LIST =========================////
// name desc params usage cb run 
SS.CMD.list = [
	// 	//////////////////////////////////    // SEASHELL
	["-h", "Displays all SeaShell commands", ["*"], "* no arguments --> prints all registered commands\n[cmdName] --> gives detailed information on most commands", null, @SS.CMD["cmd_list"]],
	["-e", "Exit Surf Mode", [], "As you pass objects, seashell will create a new surf loop, using -e will help you close these", "result", SS["quit"]],
	["-c", "Clear the screen", [], null, null, @CLEAR],
	["-anon", "Toggle anonymous mode", ["-s|*"], null, null, @Core["anon"]],
	["-dev", "Toggle debug mode", ["-s|*"], null, null, @Core["dev"]],
	["-og", "Toggle original artwork", ["-s|*"], null, null, @OGT],
	["cache", "SeaShell Cache Menu", ["-o|-ns|-net", "*|-c"], "-c", "result", @SS["getMemCache"]],
	["-cfg", "SeaShell config", ["*","*","*"], "* --> prints general config info\n-i --> host config info"+NL+"-e|-h [-b|-d] --> manage hash and exploit databases"+NL+"-u|-m|-ccd [-b|-d] --> manage user config", null, @SS["getHost"]],
	["apt", "APT client update tool", ["*|-u|--", "*|-f"], "install [libName] --> install a package\n-u --> updates the machine\n-- [*|-f] upgrades the machine, use -f to force update all\naddrepo [ip] --> add a new repository\ndelrepo [ip] --> remove a new repository\search [lib] --> searches for all packages\show [ip] --> shows all packages in a repo\n", null, @Core["apt"]],
	["-d", "Decipher a hash", ["*", "-c|-d|*"], "* [path] --> Path of file to decrack\n* [-c|-d] --> -c uses CryptoLib, -d uses HashTables (reccomended)", null, @Core["cipher"]],	
	["sudo", "Sudo Commands", ["-s|-u|*", "*"], "-s --> launch a root shell\n-u [user] --> switch user\n[path] [arg] --> invoke commands\n**sudo can only get new shells on the machine running the script\nthis means youll need to launch with cmd ! [-s|path_to_ss] to get a new shell for remote objects", "result", @Core["sudo"]],
	["!", "Launch a binary file", ["*", "*", "*"], "-e --> launches eel\n-s --> launches ss in surf_mode\n[path] [arg*] --> define a path to launch ex: ! /bin/nslookup www.google.com", "general", @Core["launch"]],
	["-t", "Start a terminal", [], "Starts a terminal on the object, start a terminal before usage of sudo", "result", @Core["terminal"]],

	["cd", "Change working directory", ["*"], ".. represents parent directory", "general", @Core["cd"]],
	["ls", "[path] List directory contents", ["*"], "* no arguments --> lists the cwd\n[path] --> list all files at the path", "general", @Core["ls"]],
	["ps", "Computer process list", ["*"], "List computer processes, use additional flag to enter resmon", "general", @Core["ps"]],
	["kill", "Kill a specified process", ["*", "*"], "[pid|name] [-a|*]\npid --> with no argument will close the pid\nname --> with no argument will close the first program containing the name, use -a for all ", "general", @Core["kill"]],
	["user", "Prints current user | Add/Del User", ["-a|-d|*", "*"], "-a [username] --> add a user\n-d [username] --> delete a user", "general", @Core["me"]],
	["passwd", "Change a user's password [requires root]", ["*"], null, "general", @Core["passwd"]],
	["groups", "Group View | Add/Del Group", ["-a|-d|*", "*", "*"], "-a [username] [group] --> add a group\n-d [username] [group] --> delete a group", "general", @Core["groups"]],
	["secure", "Secure PC permissions [requires root]", ["-s|-h|-p", ], "-s --> secures a server config\n-h --> secure home config\n-p --> attempts to patch the system to working order", "general", @Core["secure"]],

	["pwd", "Print working directory", [], "Print SeaShell's working directory", null, @Core["pwd"]],
	["touch", "Creates a file", ["*", "*"], null, "general", @Core["touch"]],
	["build", "Build binary", ["*","*","*" ], "[src] [dest] [import] Build a src file into a compiled binary", "general", @Core["build"]],
	["mkdir", "Creates a folder", ["*", "*"], null, "general", @Core["mkdir"]],

	["cat", "Show contents of a file", ["*"], null, "general", @Core["cat"]],
	["rn", "Rename a file/directory", ["*", "*"], null, "general", @Core["rn"]],
	["copy", "Copies content of the specified file", ["*", "*", "*"], null, "general", @Core["copy"]],
	["move", "Moves file to the specified directory", ["*", "*"], null, "general", @Core["move"]],
	["rm", "Deletes the specified file", ["*"], null, "general", @Core["rm*"]],
	["chmod", "Changes file permissions", ["-r|-d", "*", "*"], null, "general", @Core["chmod"]],
	["chgrp", "Changes file group", ["*", "*", "*"], null, "general", @Core["chgrp"]],
	["chown", "Changes file owner", ["*", "*", "*"], null, "general", @Core["chown"]],
	["edit", "Edit contents of a file", ["*", "-c|*"], null, "general", @Core["edit"]],

	["ssh", "Create SSH connection *requires SSH", ["*", "*"], "p1: user@ip"+NL+"p2: port, default is 22", "result", @Core["ssh"]],
	["scp", "Upload/Download files *requires SSH", ["-u|-d", "*", "*"], "-d [remote path] [destination] --> download remote files, destination defaults to cwd"+NL+"-u [target path] [destination] --> download remote files, destination defaults to cwd", "general", @Core["scp"]],
	["ftp", "Create FTP connection", ["*", "*"], "p1: user@ip"+NL+"p2: port, default is 21", "result", @Core["ftp"]],
	["put", "Upload file remotely *require FTP", ["*", "*"], null, "general", @Core["put"]],
	["get", "Download file remotely *require FTP", ["*", "*"], null, "general", @Core["get"]],
	["svc", "Manage services [action] [service] [data]" , ["*", "*", "*"], "-l --> Lists the services installed\n-i [name] --> install a service\n-s/-k [name] --> starts/stops a service", "general", @Core["service"]],
	
	//////////////////////////////////    // COMPUTER
	//["site", "Manage Local Website", ["-b|-u", "*|html"], null, null, @Utils["webmanager"]],
	//////////////////////////////////    // FILE

	//////////////////////////////////	// NETWORK
	["ping", "Ping a specified device", ["*"], null, "general", @Core["ping"]],

	["ifconfig", "Configure Internet Connection", ["*", "*", "*"], null, "general", @Core["ifconfig"]],
	["iwconfig", "Connect to WIFI", ["*", "*", "*", "*"], null, "general", @Core["iwconfig"]],
	["iwlist", "List WIFI networks", ["*", ], null, "general", @Core["iwlist"]],

	["airmon", "Manage Monitor Mode", ["start|stop", "*"], "[action] [device] --> begin to start or stop monitoring mode", "general", @Core["airmon"]],
	["aireplay", "WIFI Frame Injection", ["*", "*"], null, null, @Core["aireplay"]],
	["aircrack", "Key Cracking Program", ["*"], null, "general", @Core["aircrack"]],
	["sniff", "Sniff device for incoming connections", [], null, null, @Core["sniff"]],
	["smtp", "List mail users", ["*", "*"], "[addr] [port]", null, @Core["smtp"]],
	["nslookup", "[domain] Returns ip of a domain", ["*"], null, null, @Core["nslookup"]],
	["whois", "[ip] SS.Network administration info", ["*"], null, null, @Core["whois"]],
	["router", "Simple router scan", ["*"], null, null, @Core["router"]],
	["nmap", "SS.Network mapping tool", ["*", "*"], null, null, @Core["nmap"]],
	["scanlan", "Local network mapping", ["*"], null, null, @Core["scanlan"]],
	["ns", "Manual NetSessions", ["*","*","*","*"] , "[addr] [port] [action|null] [data|null]".NL+"[addr] target address".NL+"[port] target port".NL+"[action|memory zone]".NL+"-s --> select specific exploits to overflow".NL+"-a --> exploit all vulnerabilities".NL+"[data|memory value]".NL+"* --> defaults to unsecure password change".NL+"*LAN --> attempts lan bounce".NL+"*PW --> changes pw to given value", null, @Core["ns"] ],
	["local", "Local library exploitation", ["*", "*"], "", "general", @Core["localhax"]],

	["entry", "SS.NS on rails", ["*", "*"], "Designed to work like earlier versions of SeaShell\n* Enter an IP/LAN/Domain as the command name to utilize this feature\nYou can also use entry -r for a random ip", "result", @Core["entry"]],

	["fish", "Hunt for specified lib | port", ["*", "*"], "[lib]", "general", @Core["fish"]],

	/////////////////////////////////  // TOOLS & OTHER
	["mount", "Mount binaries to shell objects", ["*", "*"], "-a --> mounts all files [ss,mx,crypto,sf]\n-p --> pivot mount", "general", @Core["mount"]],
	["wipe", "Wipe the system", ["-t|-l|-s"], null, "general", @Core["wipe"]],
	//["sea", "[action] [recon] [bam] <i>Collects all objects</i>", ["*", "*","*" ], null, null, @Core["exp.mass_loop"]],
	//["db", "[name] [version] database search", ["*", "*"], null, null, @Core["browse_exploits"]],
	//["api", "[connect|exploits|hashes|build] Utilize the NPM api", ["*"], null, "general", @Client["handle"]],
	["tsunami", "Brute force connection", ["*", "*", "*", "*"], "[ip][user][port][protocol]", "result", @SS.MD5["connect"]],
	["shellfish", "local shell Brute force", ["*"], null, "result", @Core["shellfish"]],
	["mailfish", "NPC mail Brute force", ["*"], null, null, @SS.MD5["mail"]],
	["rshell", "MX rshells", ["*", "*", "*"], null, "result", @Core["rshell"]],
	["npc", "NPC mission competion", ["*", "*", "*"], null, "general", @Core["npc"]],
	["md5", "String -> md5", ["*"], null, null, @Core["md5"]],
	["bam", "", ["*", "*", "*", "*", "*"], "Binary attack module is a remote option for using seashell commands, and specified payloads\n[cmd|info|module] [args]\nex: bam sudo -s | bam touch /home/guest", "result", @Core["bam"]],

	["shellget", "local shell Brute force", ["*"], "This command doesnt return the shell to surf mode, rather used internally", "general", @Core["shellfish"]],
	["test", "testing function", [], null, null, @Core["test"]],
	["iget", "*InternalUse*", ["*", "*", "*", "*", "*", "*"], null, "general", @Core["iget"]],
	["quit", "Exit SeaShell", [], null, null, @EXIT],
]
///======================= Binary.Attack.Module =========================////
SS.BAM = {}
SS.BAM.bamstring = "LOG = @print;INPUT = @user_input;HOME = @home_dir;T = @typeof;NL = char(10);COLUMNS = @format_columns;CLEAR = function; return clear_screen; end function;string.size = function(self, s);if T(s) == 'number' then s = str(s);return '<size='+s+'>'+self+'</size>';end function;string.b = function(self);return '<b>'+self+'</b>';end function;string.i = function(self);return '<i>'+self+'</i>';end function;string.s = function(self);return self+' ';end function;string.white = function(self);return '<#FFFFFF>' + self + '</color>';end function;string.grey = function(self);return '<#A5A5A5>' + self + '</color>';end function;string.red = function(self);return '<#AA0000>' + self + '</color>';end function;string.orange = function(self);return '<#FF6E00>' + self + '</color>';end function;string.yellow = function(self);return '<#FBFF00>' + self + '</color>';end function;string.green = function(self);return '<#00ED03>' + self + '</color>';end function;string.lblue = function(self);return '<#00BDFF>' + self + '</color>';end function;string.blue = function(self);return '<#003AFF>' + self + '</color>';end function;string.purple = function(self);return '<#D700FF>' + self + '</color>';end function;string.cyan = function(self);return '<#00FFE7>' + self + '</color>';end function;string.sys = function(self);return '[<#00FFE7>SeaShell</color>] <i>' + self.white;end function;string.debug = function(self);return '[<#00FFE7>debug</color>] <i>' +self.white;end function;string.ok = function(self);return '[<#00ED03><b>success</b></color>] ' + self.white;end function;string.warning = function(self);return '[<#FBFF00><b>warning</b></color>] <i>' + self.grey;end function;string.error = function(self);return '[<#AA0000><b>error</b></color>] ' + self.yellow;end function;string.prompt = function(self);return '['+'input'.white.b+']'+'-- '.white+self.grey+' --> '.white;end function;string.fill = function(self);return '><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><> ><>'.blue + self;end function;string.NL = function(self);return self+globals.NL;end function;string.strip = function(self);if self.len < 15 then return null;self = self[:15];return self[:self.len-8];end function;string.bitToByte = function(self);b = to_int(self);s=['B','KB','MB','GB'];i=0;;while b>1024;b=b/1024;i=i+1;end while;return round(b,2)+s[i];end function;string.isRoot = function(self, u, hex = 'FFFFFF');if self == u then return self.green;if self == 'root' or self == 'unknown' then return self.red;if self == 'guest' then return self.orange;return '<#'+hex+'>'+self+'</color>';end function;string.isSlash = function;if self == '/' then return 'root'.green;return self.grey;end function;string.isPc = function(self);if get_router(self).local_ip != self then return true;return false;end function;string.isProc = function(self);if ['Xorg','kernel_task', 'dsession'].indexOf(self) != null then return self.red;if ['Terminal', 'CodeEditor', 'Browser', 'Mail', 'Settings','FileExplorer', 'Notepad', 'Chat', 'ConfigLan', 'AdminMonitor'].indexOf(self) != null then return self.green;return self.yellow;end function;string.isIp = function(self);if not is_valid_ip(self) and not is_lan_ip(self) then return nslookup(self);return self;end function;string.isLan = function ;if is_lan_ip(self) then return self;end function;string.getGw = function(self);if is_lan_ip(self) then return get_router.public_ip;if is_valid_ip(self) then return self;return '!Invalid!'.error;end function;string.isUnknown = function(self, hex = 'FFFFFF');if self.lower == 'unknown' then return self.grey;return '<#'+hex+'>'+self+'</color>';end function;string.rule = function(self, s = null);if self == 'DENY' or s == 'DENY' then return self.red;if self == 'ALLOW' or s == 'ALLOW' then return self.green;return self.grey;;end function;string.month_int = function(self);return to_int((['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',].indexOf(self))+1);end function;string.wrap = function(self, hex = 'FFFFFF', n = 20);sl = '['+self+']'; sl = sl.len;;s_t = '[<#'+hex+'>'+self+'</color>]';if sl >= n then return s_t;for i in range(1, (n-sl)); s_t = s_t+'-'; end for;;return s_t;end function;string.cap = function(self, cap, hex = 'FFFFFF', ih = null);if hex and ih then return self+'[<#'+hex+'>'+cap+'</color>]';if ih then return self+'['+cap+']';return self+'[<#'+hex+'>'+cap+'</color>]';end function;string.title = function(self, hex = 'FFFFFF', si = 40);sl = '['+self+']'; sl = sl.len;;s_t = '[<#'+hex+'>'+self+'</color>]';if sl >= si then return s_t;for i in range(1, (si-sl)/2); s_t = '-'+s_t+'-'; end for;;return s_t;end function;string.fromMd5 = function(self);if SS.debug then LOG('from md5 --> '.debug.s+self);if T(SS.dbh) != 'file' then return self;find = SS.MD5.find(self);if find != null then return find;return self;end function;string.isOp = function(self, v);if self == v then return self.red;return self.white;end function;string.ogconnect = function(self);if SS.og == null then return self;out = '';out = out+'   _______________                        |'.white+'*'.red+'\_/'.white+'*'.red+'|________'.white+NL;out = out+'  |  ___________  |     '.white+'.-.     .-.'.red+'      ||_/-\_|______  |'.white+NL;out = out+'  | |           | |    '.white+'.****. .****.'.red+'     | |           | |'.white+NL;out = out+'  | |   '.white+'0   0'.green+'   | |    '.white+'.*****.*****.'.red+'     | |   '.white+'0   0'.red+'   | |'.white+NL;out = out+'  | |     -     | |     '.white+'.*********.'.red+'      | |     -     | |'.white+NL;out = out+'  | |   \___/   | |      '.white+'.*******.'.red+'       | |   \___/   | |'.white+NL;out = out+'  | |___     ___| |       '.white+'.*****.'.red+'        | |___________| |'.white+NL;out = out+'  |_____|\_/|_____|        '.white+'.***.'.red+'         |_______________|'.white+NL;out = out+'    _|__|/ \|_|_'.white+'............'.red+'.*..............'.red+'_|________|_'.white+NL;out = out+'   / ********** \                          / ********** \'.white+NL;out = out+' /  ************  \                      /  ************  \'.white+NL;out = out+'--------------------                    --------------------'.white+NL;out = out+self;self = out;return self;end function;string.a = function(self);if SS.anon == true then return 'HIDDEN'.grey.size(14);return self;end function;list.table = function(title);return self;end function;list.select = function(l=null);if l then ret = l;if l == null then ret = '[ '+'SELECT'.grey+' ] '+NL;c = 1;for s in self;if c == self.len then ;ret = ret + str(c).white + '.'+') '.white+s;else;ret = ret + str(c).white + '.'+') '.white+s+NL;end if;c = c+1;end for;ret = ret;return ret;end function;list.select_w_count = function(self, l);ret = '[ '+'SELECT'.grey+' ] '+NL;c = 1;for i in range(0, l.len-1);ret = ret + str(c).white + '.'+') '.white+self[i]+' '+l[i] +NL;end for;end function;list.select2 = function();ret = '';c=1;for s in self;ret = ret + str(c).white + '.'+') '.white+s+NL;c = c+1;end for;ret = ret + '0'.white+'.'+') '.white+'Exploit the router'.orange.b+NL;ret = ret+NL+'Select'.prompt;return ret;end function;"
SS.BAM.bamstring = SS.BAM.bamstring+"LOG(('Launching '+ 'B'.red.b+'.'+'A'.red.b+'.'+'M'.red.b).sys);SS = get_custom_object;args = SS.bamargs;if args.len == 0 then;if SS.bamrun.cb == 'general' then ; SS.CMD.invoke(SS.o, SS.bamrun.name);else if SS.bamrun.cb == 'result' then ;SS.bamret = SS.CMD.invoke(SS.o, SS.bamrun.name);else ;SS.CMD.invoke(SS.o, SS.bamrun.name);end if;else if args.len == 1 then ;if SS.bamrun.cb == 'general' then  ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args[0]);else if SS.bamrun.cb == 'result' then ;SS.bamret = SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args[0]);else ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args[0]);end if;else if args.len > 1 then ;if SS.bamrun.cb == 'general' then  ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args.join(' '));else if SS.bamrun.cb == 'result' then ;SS.bamret = SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args.join);else ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args.join);end if;end if;if SS.bamret != null and SS.bamret != 'exit' then SS.CMD.result(SS.bamret)"
SS.BAM.isModule = function(c)// check registered modules
	for i in self.modules 
		if i.name == c then; return i; break; end if
	end for
	return null
end function
SS.BAM.isCmd = function(c) // check if its a ss command
	for i in SS.commands 
		if i.name == c then; return i; break; end if
	end for
	return null 	
end function
SS.BAM.frun = function(s)
	ret = null 
	ret = s.replace(";", NL)
	ret = ret.replace("'", """")
	//if SS.debug then LOG("Formatted BAM: ".debug+ret)
	return ret
end function
SS.BAM.handler = function(o, cmd, args, isModule = null)
	if T(o) != "shell" then ; LOG("must be of type shell for bam".warning); return;end if;
	SS.o = o
	SS.bamrun = cmd
	SS.bamargs = args
	SS.bamret = null
	if isModule == null then
		if cmd["cb"] == "result" then return self.run(o, self.bamstring)
		self.run(o, self.bamstring)
	else
		if cmd["cb"] == "result" then return self.run(o, self.frun(cmd["string"]))
		self.run(o, self.frun(cmd["string"]))
	end if
end function
SS.BAM.run = function(o, s)
	h = SS.Utils.goHome(o)
	launcher = SS.Utils.fileFromPath(o, h+"/sf.src")
	payload = null
	if launcher == null then
		o.host_computer.touch(h, "sf.src")
		launcher = SS.Utils.fileFromPath(o, h+"/sf.src")
		if launcher == null then; LOG("An error occured in creation ".warning+h); return; end if;
		payload = launcher.set_content(self.frun(s))
	else if launcher.has_permission("w") then 
		payload = launcher.set_content(self.frun(s))
	else
		LOG("Something else happens".warning) 
		return 
	end if
	if T(payload) == "string" then; LOG("An error occured in setting bam: ".warning+payload); return; end if;
	compile = o.build(launcher.path, h, 0)
	//launcher.set_content("><> ><> ><>")
	if T(compile) == "string" and compile.len > 1 then; LOG("An error occured in compilation of bam: ".warning+compile); return; end if;
	launched = o.launch(launcher.path[:-4])
	if launched == null then; LOG("An error occured launching bam".warning); return; end if;
end function
SS.BAM.modules = [
	{"name":"module", "desc":"", "params":[], "usage":"something helpful", "cb":"general", "string":"print('hello there world')"},
]


//////////////////////////////////////////////////////////////  
///======================= CORE =========================////
////////////////////////////////////////////////////////////