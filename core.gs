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
SS.capt = null // current apt
SS.crypto = null
SS.ccrypt=null
SS.mx = null
SS.cmx = null
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
SS.cfg.lf = null //item: log folder
SS.cfg.ip = SS.c.public_ip
SS.cfg.lan = SS.c.local_ip
SS.cfg.start_time = time
SS.cfg.timestamp = current_date
SS.cfg.unsecure_pw = "f1shb0wl"
SS.cfg.burnmailacct = "Oppelli@barner.com"
SS.cfg.burnmailpw = "Bitch"
SS.cfg.mailobj = null
SS.cfg.mailacct = "mail@bolds.net"
SS.cfg.mailpw = "mail"
SS.cfg.hackip = "214.85.237.165"
SS.cfg.repoip = "115.83.129.59"
SS.cfg.repowf = "init.weak.so"
SS.cfg.dat = null // data file
SS.cfg.macros = null // macro folder
SS.cfg.wf = null // weak lib file
SS.cfg.wm = "0x73CBD7B0" // weak lib memory zone
SS.cfg.wa = "havedoutlinenumbe" // weak lib memory address
SS.cfg.wv = null//weak version
SS.cfg.api1=null//ip
SS.cfg.api2=null//memzone
SS.cfg.api3=null//memaddr
SS.cfg.api4=null//api port
SS.cfg.api5=null
SS.cfg.api6=null
SS.cfg.libf = null//lib folder
SS.cfg.libfw = null//weak folder
SS.cfg.libfs = null//strong folder
SS.cfg.wlibs = []//weak
SS.cfg.slibs = []//strong
SS.heart = SS.GFX.f([{"<".red.b.size(18): [36, 0.2,-90,0]}, {"3".red.b.size(18): [36,-0.1,-90,0]}, {" by ".lblue+"Tuna Terps".b.cyan:[36.75, 0,0,0]}])
SS.dfs = []
SS.dfsbin = ["cd","ls","ps","pwd","ifconfig","iwconfig","iwlist","cat","rm","mv","cp","ssh","ftp","mkdir","rmdir","chmod","reboot","whois","sudo","useradd","userdel","passwd","nslookup","build","touch","chown","chgrp","groupadd","groupdel","groups","kill","ping","apt-get" ,"man","whoami"]
///==================== SS.CMD() ========================////
SS.CMD = {}
SS.CMD.isValid = function(param)
	if param == "" or param == " " then return null
	for c in SS.commands
		if (c["name"] == param) or (c["alias"] == param) then return c
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
	passed = 0; if (p.len > 0) and ((p[0] == cmd.name) or (p[0] == cmd.alias)) then p.pull
	if SS.debug then LOG("CMD: ".red+cmd["name"] +" "+"REQUIRED: ".yellow+cmd["params"].len+" "+"PASSED ARGS: ".orange+p);
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
				if (argIndex == cmdIndex) or (cmdIndex == "*") then
				//if T(p.indexOf(argIndex)) == "number" or (cmdIndex == "*") then 
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
	o=null;host=null; sym = "$";tsym = "S".green;
	obj = eo.o
	if eo.type != "file" then 
		if eo.type == "computer" then
			tsym = "C".blue; o = obj
		else if eo.type == "shell" then
			o = obj.host_computer
		else
			tsym = "FTP".yellow; o = obj.host_computer
		end if
		ip = o.public_ip
		lan = o.local_ip
		host = o.get_name.lblue
		if SS.remote == true then host = o.get_name.purple
	else 
		ip = eo.ip
		lan = eo.lan
		host = " "+obj.name.b.grey
		tsym = "F".orange
	end if
	ip = ip.lblue
	lan = lan.grey 
	if (SS.remote==false) and (eo.lan == SS.cfg.lan) then lan = lan.lblue
	if (SS.remote==true) and (eo.lan != SS.cfg.lan) then lan = lan.purple
	if SS.remote then ip = ip.purple
	user = SS.Utils.user(obj);
	if SS.debug then LOG("debugging user: ".debug+user+" "+T(user))
	if user == "root" then sym = "#"
	space = 3.9+(user.len+host.len)*0.6
	s =  NL+"<pos=04>—{"+user.isRoot(user, "FFFFFF")+"@".white+host+"}—[<b>"+tsym+"</b>]—{"+ ip.size(14).a +":".white+ lan.size(14).a +"}—["+SS.Utils.dash(SS.cwd, user).white.size(14)+"]<voffset=-0.5em><space=-"+space+"em><pos=00>|<voffset=-1em><space=-0.6em>|<voffset=-1.5em><pos=04>——:~"+sym.white+" "	
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
	ha = null
	cs = null
	if T(SS.cfg.aliases) == "file" then 
		c = SS.cfg.aliases.get_content
		cs = c.split(NL)
		if not cs or cs.len<1 then LOG("No aliases found") else ha = true
	else;LOG("Aliases not loaded on this host".grey.sys)
	end if
	if ha then; ha = function(n,p)
		for i in p
			check = i.split("=")
			if not check or check.len < 2 then continue
			if check[1] == n then return check[0]
		end for
		return null
	end function; end if
	for cmd in SS.CMD.list
		alias = null 
		if @ha != null then alias = ha(cmd[0], cs)
		SS.commands.push({"name":cmd[0], "desc":cmd[1], "params":cmd[2], "usage":cmd[3], "cb":cmd[4], "run":@cmd[5], "alias":alias})
	end for
end function
SS.CMD.getOne = function(n)
	for cmd in SS.commands
		if cmd.name == n then return cmd
	end for
	return null
end function
SS.CMD.setAlias = function(n, a)
	cmd = SS.CMD.getOne(n)
	if cmd == null then return LOG("Command not found: ".warning+n)
	if SS.CMD.getOne(a) != null then return LOG("Intended alias is a command: "+a)
	if SS.cfg.aliases == null then 
		LOG("Aliases file not found, build with -cfg -a -b".warning)
	else 
		pre = SS.cfg.aliases.get_content.split(NL)
		co = 0
		astr = null
		for al in pre
			if al.indexOf(a) != null then; astr = al; break; end if;

		end for 
	end if
	cmd.alias = n
end function
SS.CMD["cmd_list"] = function(usage = null)
	p = null
	if not usage then
		tData = []
		tData.push({"<u>".cyan: [0,0,0,0]})
		tData.push({"<b>[ "+"NAME".white+" ]": [0,0,0,0]})
		tData.push({"[ "+"ARGS".white+" ]": [11,0,0,0]})
		tData.push({"[ "+"DESC".white+" ]            </u>/\n": [32,0,0,0]})
		for c in SS.commands
			if c["name"] == "iget" then continue
			nl = c["name"].white
			if (SS.training_wheels == true) and ["crab", "cache", "surf", "mx", "crypto", "apt-get", "entry"].indexOf(c["name"]) != null then nl = c["name"].green
			tData.push({nl: [1,0,0,0]})
			tData.push({c["params"].join(" | ".b.lblue).cyan: [11,0,0,0]})
			tData.push({c["desc"].lblue+"\n": [32,0,0,0]})
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
		LOG("|".lblue+"CMD: ".cyan+"<b>"+usage.white+"</b>\n"+"|".lblue+"ARGS: ".cyan+i["params"]+"\n"+"|".lblue+"INFO:".cyan.s+i["usage"])
	end if
	LOG("<b>-->".white+ " *</b><i>"+" Represents a dynamic, or optional parameter.".lblue)
	if p then LOG("*"+"<i>DETAILS</i>".grey+"*  Use cmd: "+"-h".lblue.b+" [".white+"cmd_name".lblue+"]".white+" for CMD usage")
end function 
///==================== SeaShell() ========================////
SS.getUserConfig = function
	SS.cfg.i = SS.Utils.hasFolder(SS.c, ".ss")
	s = "Checking host . . .".sys
	if SS.cfg.i then
		s = "Cache found, checking user . . .".ok 
		p =  SS.cfg.i.path
		SS.cfg.dat = SS.Utils.fileFromPath(SS.s, p+"/ss.dat")
		SS.cfg.aliases = SS.Utils.fileFromPath(SS.s, p+"/ss.aliases")
		SS.cfg.macros = SS.Utils.fileFromPath(SS.s, p+"/ss.macros")
		SS.cfg.lf = SS.Utils.fileFromPath(SS.s, p+"/ss.logs")
	else 
		s = s+NL+"* Unable to locate cache folder".yellow
		SS.cfg.dat = SS.Utils.hasFile(SS.c, "ss.dat")
		SS.cfg.aliases = SS.Utils.hasFile(SS.c, "ss.aliases")
		SS.cfg.macros = SS.Utils.hasFile(SS.c, "ss.macros")
		SS.cfg.lf = SS.Utils.hasFolder(SS.c, "ss.logs")
	end if
	if T(SS.cfg.dat) == "file" then
		SS.setDat(SS.cfg.dat.get_content) 
		s = s+NL+"User config, loaded!".green.sys
	else 
		s = s+NL+"* Unable to load user config".grey
	end if
	if not SS.cfg.i then s = s+NL+"* missing cache   : ".grey+SS.ccd.cyan.b
	if not SS.cfg.dat then s = s+NL+"* missing resource: ".grey+"ss.dat"
	if not SS.cfg.aliases then s = s+NL+"* missing resource: ".grey+"ss.aliases"
	if not SS.cfg.macros then s = s+NL+"* missing resource: ".grey+"ss.macros"
	if not SS.cfg.lf then s = s+NL+"* missing resource: ".grey+"ss.logs"
	if T(SS.cfg.macros) == "file" then
		SS.setMacros(SS.cfg.macros.get_content)  
		s = s+NL+"User macros, loaded!".green.sys
	else 
		s = s+NL+"* Unable to load user macros".grey
	end if
	LOG(s)
end function
SS.buildEntireUserCache = function(flag = null, obj = null)// TODO: handle flag
	if obj == null then obj = SS.c
	h = SS.Utils.goHome(obj)
	if not h then return LOG("No home directory, malformed fs".warning)
	LOG("building user cache. . .".grey.sys)
	capa = h+"/"+SS.ccd
	f1 = SS.Utils.fileFromPath(SS.c, capa)
	if not f1 then 
		if obj.create_folder(h, SS.ccd) == 1 then 
			LOG("User cache directory built at: "+h.grey+"/".grey+SS.ccd.lblue)
			if obj.public_ip == SS.c.public_ip then SS.cfg.i = obj.File(capa)
		else;LOG("Failed to create the cache folder".warning)
		end if
		if obj.create_folder(capa, "ss.logs") == 1 then 
			LOG("Event Log directory built at: "+capa.grey+"/".grey+"ss.logs".lblue)
			if obj.public_ip == SS.c.public_ip then SS.cfg.lf = obj.File(capa+"/ss.logs")
		else;LOG("Failed to create the log folder".warning)
		end if 
		if obj.create_folder(capa, "ss.libs") == 1 then
			if obj.public_ip == SS.c.public_ip then SS.cfg.libf = obj.File(capa+"/ss.libs")
			wait(0.1) 
			if obj.create_folder(capa+"/ss.libs", "weak") == 1 then
				if obj.public_ip == SS.c.public_ip then SS.cfg.libfw = obj.File(capa+"/ss.libs") 
				LOG("Weak folder repo: "+capa.grey+"/".grey+"libs".lblue)
			else;LOG("Failed to create the log folder".warning)
			end if 
			if obj.create_folder(capa+"/ss.libs", "strong") == 1 then 
				LOG("Strong folder repo: "+capa.grey+"/".grey+"libs".lblue)
				if obj.public_ip == SS.c.public_ip then SS.cfg.libfs = obj.File(capa+"/ss.libs")
			else;LOG("Failed to create the log folder".warning)
			end if 
		else;LOG("Failed to create the lib folder".warning)
		end if
	end if
	if not f1 then f1 = SS.Utils.fileFromPath(SS.c, capa)
	if not f1 then return LOG("Unable to build the cache directory".warning)
	capb = capa+"/ss.dat"
	if not SS.Utils.fileFromPath(obj, capb) then;LOG("Setting config: ".sys+"user"); SS.setUserConfig("-u", "-b"); end if
	capc = capa+"/ss.macros"
	if not SS.Utils.fileFromPath(obj, capc) then;LOG("Setting config: ".sys+"maacros");SS.setUserConfig("-m", "-b");end if
	capd = capa+"/dict"
	if not SS.Utils.fileFromPath(obj, capd) then 
		LOG("Setting db: ".sys+"exploits".lblue); SS.setUserConfig("-e", "-b"); 
		LOG("Setting db: ".sys+"hashes".lblue); SS.setUserConfig("-h", "-b"); 
		LOG("Engaging paste protocol: ".sys+"hashes".lblue); SS.setUserConfig("-h", "-p"); 
	end if
	LOG("user cache build ran succesfully".sys)
	SS.getDb(obj)
	SS.setCache//sets certain env variables	
end function
SS.getLibConfig = function(self)
	SS.mx = SS.Utils.hasLib(SS.s, "metaxploit.so")
	SS.crypto = SS.Utils.hasLib(SS.s, "crypto.so")
	SS.cmx = null
	if SS.mx != null then
		SS.cmx = SS.mx 
		if SS.crypto == null then
			ret = "MX".yellow
		else 
			SS.ccrypt = SS.crypto
			ret = "SS".cyan
		end if
	else if SS.crypto != null then
		SS.ccrypt = SS.crypto 
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
	if SS.apt.check_upgrade("/lib/aptclient.so") == true then LOG(("An update for "+"APT".cyan+" is available!").grey.sys)
	f = SS.Utils.hasFile(SS.s, "metaxploit.so")
	if f then; if SS.apt.check_upgrade(f.path) == true then; LOG(("An update for "+"Metaxploit".red+" is available").grey.sys);end if; end if;
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
SS.getDb = function(o=null)
	if o == null then o = SS.c
	if SS.debug then LOG("setDB".debug)
	h = SS.Utils.hasFolder(o, "exploits")
	if T(h) == "file" then
		SS.dbe = h
	else 
		LOG("Unable to locate exploit db".warning)
	end if
	p = SS.Utils.hasFolder(o, "rainbow")
	if T(p) == "file" then 
		SS.dbh = p
		SS.dbh = SS.dbh
	else 
		LOG("Unable to locate password db".warning)
	end if
	if SS.cfg.user == "root" then p = "/root/"+SS.ccd+"/ss.libs/weak/init.so"
	if SS.cfg.user != "root" then p = "/home/"+SS.cfg.user+"/"+SS.ccd+"/ss.libs/weak/init.so"
	SS.dbl = SS.Utils.hasFolder(SS.s, "ss.logs")
	if T(SS.dbl) != "file" then;LOG("Logger not loaded".grey.sys);else; LOG("Loaded logger: ".ok+SS.dbl.path); end if;
	SS.cfg.libf = SS.Utils.fileFromPath(o, parent_path(parent_path(p)))
	//TODO: test compatibility check
	if T(SS.cfg.libf) != "file" then;LOG("Library db not found".grey.sys);
	else if T(parent_path(parent_path(parent_path(p)))+"/libs") == "file" then
		if SS.og then LOG("".fill.NL+"Sindbad was watching here 8)"+NL.fill+"COMPATIBLITY CHECK YO SELF OR WRECK YOURSELF")
		if SS.c.File(parent_path(parent_path(parent_path(p)))+"/libs").rename("ss.libs").len < 1 then LOG("Library db renamed to ss.libs".ok) else LOG("An issue occured with renaming libs to ss.libs, check that out".warning)
	end if
	SS.cfg.libf = SS.Utils.fileFromPath(o, parent_path(parent_path(p)))
	if T(SS.cfg.libf) != "file" then; LOG("Library cache: ".ok+SS.cfg.libf.path); 
		SS.cfg.libfs = SS.Utils.fileFromPath(o, SS.cfg.libf.path+"/strong")
		if T(SS.cfg.libfs) != "file" then;LOG("Strong libs not loaded".grey.sys);else; LOG("Strong directory: ".ok+SS.cfg.libfs.path); end if;
		SS.cfg.libfw = SS.Utils.fileFromPath(o, SS.cfg.libf.path+"/weak")
		if T(SS.cfg.libfw) != "file" then;LOG("Weak libs not loaded".grey.sys);else; LOG("Weak directory  : ".ok+SS.cfg.libfw.path); end if;
	end if;
	SS.cfg.wf = SS.Utils.fileFromPath(o, p)
	if T(SS.cfg.wf) != "file" then;LOG("No weak lib not loaded".grey.sys);else; LOG("Loaded weak lib: ".ok+SS.cfg.wf.path);if SS.mx then;SS.cfg.wv=SS.mx.load(SS.cfg.wf.path).version;end if; end if;
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
SS.loadHashes = function(fo)
	if not fo then return []
	LOG("Pushing MD5 hashes into memory. . .".grey.sys)
	_c = ["f1shb0wl:ff19407d8b4dbe5fa21d5d5248d26115"]
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
SS.setCache = function(_)
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
	SS.cfg.ip = SEO.ip
	SS.cfg.lan = SEO.lan
end function
SS.welcome = function
	LOG("".fill+NL+"       .               ".cyan+"               __..._".red+NL+"      ':'              ".cyan+"           ..-'      o.".red+NL+"    ___:____     |'\/'|".cyan+"         .-'           :".red+NL+"  ,'        `.    \  / ".cyan+"      _..'           .'__..--<".red+NL+"  |  O        \___/  | ".cyan+"...--""              '-.".red+NL+"~^~^~^~^~^~^~^~^~^~^~^~".cyan+"^~^~^~^~^~^~^~^~^~^~^~^~".red+NL+".                                            /\".red+NL+"   _____            ".cyan+"<color=#AA0000> _____ _          _ _   {.-}"+NL+"  / ____|           ".cyan+"<color=#AA0000>/ ____| |        | | | ;_.-'\"+ NL +" | (___   ___  __ _".cyan+"<color=#AA0000>| (___ | |__   ___| | |{    _.}_"+ NL +"  \___ \ / _ \/ _` |".cyan+"<color=#AA0000>\___ \| '_ \ / _ \ | | \.-' /  `,"+ NL +"  ____) |  __/ (_| |".cyan+"<color=#AA0000>____) | | | |  __/ | |  \  |    /"+ NL +" |_____/ \___|\__,_|".cyan+"<color=#AA0000>_____/|_| |_|\___|_|_|   \ |  ,/"+NL+".                                             \|_/".red+NL+"<b>SeaShell</b>".cyan+" Version: ".lblue+SS.version.cyan.b+" made with ".lblue+SS.heart+NL+"".fill)
	//LOG("".fill+NL+"       .               ".cyan+"               __..._".red+NL+"      ':'              ".cyan+"           ..-'      o.".red+NL+"    ___:____     |'\/'|".cyan+"         .-'           :".red+NL+"  ,'        `.    \  / ".cyan+"      _..'           .'__..--<".red+NL+"  |  O        \___/  | ".cyan+"...--""              '-.".red+NL+"~^~^~^~^~^~^~^~^~^~^~^~".cyan+"^~^~^~^~^~^~^~^~^~^~^~^~".red+NL+".<mark=#00BDFF>44444444444444444444444444444444444444444444<font=""LiberationSans SDF"">/\</font>".red+NL+"   _____            ".cyan+"<color=#AA0000> _____ _          _ _   {.-}"+NL+"  / ____|           ".cyan+"<color=#AA0000>/ ____| |        | | | ;_.-'\"+ NL +" | (___   ___  __ _".cyan+"<color=#AA0000>| (___ | |__   ___| | |{    _.}_"+ NL +"  \___ \ / _ \/ _` |".cyan+"<color=#AA0000>\___ \| '_ \ / _ \ | | \.-' /  `,"+ NL +"  ____) |  __/ (_| |".cyan+"<color=#AA0000>____) | | | |  __/ | |  \  |    /"+ NL +" |_____/ \___|\__,_|".cyan+"<color=#AA0000>_____/|_| |_|\___|_|_|   \ |  ,/"+NL+".                                             \|_/".red+NL+"<b>SeaShell</b>".cyan+" Version: ".lblue+SS.version.cyan.b+" made with ".lblue+SS.heart+NL+"".fill)
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
	if get_shell.host_computer.public_ip != SS.cfg.ip then 
		SS.remote = true
		l = "REMOTE".purple 
	else 
		SS.remote = false
		l = "LOCAL".lblue
	end if
	LOG("".sys+"<b>~~~^~~^~".blue+"SURF"+"~".blue+"MODE".cyan+"~".blue+"[ ".cyan+"ENABLED".green+" ]".cyan+"~^~~^~~~".blue+"</i>".cap(l).blue)
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
	return LOG("".sys+"<b>~~~^~~^~".blue+"SURF"+"~".blue+"MODE".cyan+"~".blue+"[ ".cyan+"DISABLED".red+" ]".cyan+"~^~~^~~~".blue+"</i>".cap(l).blue)
end function;																																																																							SS.env = function(_,__,___,____,_____,______,_______);SS.cfg.user = __;SS.cfg.burnmailacct = null;SS.cfg.burnmailpw = null;SS.cfg.mailacct = __+"@fishmail.net";SS.cfg.mailpw = md5("f1shbowl");if SS.cfg.mailacct == "" then SS.cfg.mailobj = mail_login(user_mail_address, ____) else SS.cfg.mailobj = mail_login(___, ____);SS.rsip = _____;SS.cfg.unsecure_pw = ______;SS.cfg.timestamp=_______;end function
SS.init = function(az,by,cx,dw,ev,fu,gt="TIWhateverYouLike2008NoScrubsTLC");
	if az.len > 0 then; if (INPUT(("["+"Auth Required".red+"]").b+" ", true) != az) then EXIT("><> ><> ><>".red);end if;																																													SS.env(az,by,cx,dw,ev,fu);
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
	SS.remote = false
	if get_shell.host_computer.public_ip != SS.cfg.ip then SS.remote = true
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
		if i isa SS.EO then 
			eo = i
		else
			eo = new SS.EO
			if T(i) != "file" then 
				eo.map(i, addr,lan) 
			else 
				eo.map(i)
			end if
		end if
		if T(eo.o) == "file" then 
			//eo.map(i, addr, lan)
			SS.files.push(eo)
		else if T(eo.o) == "computer" then 
			//eo.map(i)
			if not eo.isCached then SS.computers.push(eo)
		else
			//eo.map(i)
			if not eo.isCached then SS.shells.push(eo)
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
		if not SS.mx or not SS.ccrypt then h = "* "+"Script is lacking essential libs: ".red 
		if SS.mx == null then h = h.s+"metaxploit.so"
		if SS.crypto == null then h = h.s+"crypto.so"
		if SS.dbe == null then; h = h+NL+"* "+"Script is missing exploit database".yellow; else ; h = h+NL+"* "+"Exploit database loaded".green;end if;
		if SS.dbh == null then; h = h+NL+"* "+"Script is missing hash database".yellow;else ;h = h+NL+"* "+"Hash database loaded".green;end if;
		if SS.cfg.dat == null then; h = h+NL+"* "+"Script is missing user config".yellow;else;h = h+NL+"* "+"User config loaded".green; end if;
		if SS.cfg.macros == null then; h = h+NL+"* "+"Script is missing user macros".yellow;else;h = h+NL+"* "+"User macros loaded".green; end if;
		LOG(h)
	else if a == "-e" or a == "-h" then //SET
		return SS.setHost(t, a, p)
	else if ["-u", "-m", "-ccd", "-build", "-install"].indexOf(a) != null then 
		return SS.setUserConfig(a, t, p)
	end if
	if SS.dbhl.len == 0 and T(SS.dbh) == "file" then SS.loadHashes(SS.dbh)
	_d = [
		"SeaShell".title("FFFFFF", 20),
		"Version".wrap.lblue.cap(SS.buildv).lblue,
		"Uptime".wrap.lblue.cap(SS.Date.up(time)).lblue,
		"Config".wrap.lblue.cap(SS.cfg.label, null, true).lblue,
		"Cache".wrap.lblue.cap(SS.ccd).lblue,
		"User".wrap.lblue.cap(SS.cfg.user).lblue,
		"Active".wrap.lblue.cap(SS.Utils.user(SS.c).isRoot(SS.c)).lblue,
		"Exploits".wrap.lblue.cap(SS.dbec).lblue,
		"Hashes".wrap.lblue.cap(SS.dbhl.len).lblue,
	]
	if TW then _d.push "* Set during SeaShell build".grey.i
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
		"HackIp".wrap("A5A5A5").blue.cap(SS.cfg.hackip).blue,
		"RepoIp".wrap("A5A5A5").blue.cap(SS.cfg.repoip).blue,
		"API".wrap("A5A5A5").blue.cap(SS.cfg.api1).blue,
		"API1".wrap("A5A5A5").blue.cap(SS.cfg.api2).blue,
		"API2".wrap("A5A5A5").blue.cap(SS.cfg.api3).blue,
		"WEAK".wrap("A5A5A5").blue.cap(T(SS.cfg.wf)).blue,
		"WEAK1".wrap("A5A5A5").blue.cap(SS.cfg.wa).blue,
		"WEAK2".wrap("A5A5A5").blue.cap(SS.cfg.wm).blue,
	]
	if TW then _d.push"* Settings can be changed in: ".grey.i+SS.ccd+NL+"* in resource:".grey+" ss.dat"+" or see -h -cfg".grey.i
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
	helpwords = ["-ccd", "-install", "-install", "-build"]
	if (SS.cfg.i == null) and (helpwords.indexOf(act) == null) then
		return LOG("User config not found, use force flag -install to build everything, -ccd for cache".warning)
	else if helpwords.indexOf(act) != null then
		if act == "-ccd" then SS.c.create_folder(HOME, SS.ccd)
		SS.cfg.i = SS.Utils.fileFromPath(SS.f, HOME+"/"+SS.ccd)
		if act != "-ccd" then return SS.buildEntireUserCache(flag, SS.c)
	end if
	if T(SS.cfg.i) != "file" then return LOG("An error occured finding the cache".warning)
	item = null 
	s = null
	run = null 
	if act == "-u" then// userconfig
		s = "User Config"
		f = SS.cfg.dat
		if flag == "-b" then
			run = @SS["setDat"] 
			p = "ss.dat"
			d = "anonymousMode=0"+NL+"debugMode=0"+NL+"oldArtMode=1"+NL+"tutorialMode=0"+NL+"hackShopIp=214.85.237.165"+NL+"weakMemZone=null"+NL+"weakMemAddr=null"+NL+"hackRepoIp=214.85.237.165"+NL+"hackRepoWeakLib=null"+NL+"apiIp=150.74.29.50"+NL+"apiMemZone=0xF8E54A6"+NL+"apiMemVal=becolo"+NL+"apiPort=22"+NL+"apiAuth=2008TLCNoScrubs"+NL+"apiToken=null"
		else 
			return SS.cfgDat(flag, p)
		end if
	else if act == "-m" then // usermacros
		s = "User Macros"
		f = SS.cfg.macros
		run = @SS["setMacros"] 
		p = "ss.macros"
		d = "[MACRO NAME] [SS.CMD NAME] [ARGUMENTS/PLACEHOLDER] ; [SS.CMD NAME] [ARGUMENTS/PLACEHOLDER] *to use placeholders use format {1}*"+NL+"EXAMPLE ls ; cd {1} --> @EXAMPLE home"
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
		isN = (p[1] == "null")
		if p[0] == "anonymousMode" then 
			if p[1].to_int == 1 then SS.anon = true else SS.anon = false
		else if p[0] == "debugMode" then 
			if p[1].to_int == 1 then SS.debug = true else SS.debug = false
		else if p[0] == "oldArtMode" then 
			if p[1].to_int == 1 then SS.og = true else SS.og = false
		else if p[0] == "tutorialMode" then 
			if p[1].to_int == 1 then SS.training_wheels = true else SS.training_wheels = false
		else if p[0] == "hackShopIp" then 
			if isN then SS.cfg.hackip = null else SS.cfg.hackip =  p[1]
		else if p[0] == "hackRepoIp" then 
			if p[1] == "null" then SS.cfg.repoip = null else SS.cfg.repoip = p[1]
		else if p[0] == "weakMemZone" then 
			if isN then SS.cfg.wm = null else SS.cfg.wm =  p[1]
		else if p[0] == "weakMemAddr" then 
			if isN then SS.cfg.wa = null else SS.cfg.wa =  p[1]
		else if p[0] == "apiIp" then 
			if isN then SS.API.ip = null else SS.API.ip = p[1]
		else if p[0] == "apiMemZone" then 
			if isN then SS.API.mz = null else SS.API.mz = p[1]
		else if p[0] == "apiMemVal" then 
			if isN then SS.API.ma = null else SS.API.ma = p[1]
		else if p[0] == "apiPort" then 
			if isN then SS.API.p = null else SS.API.p = p[1].to_int
		else if p[0] == "apiAuth" then 
			if isN then SS.API.ai = null else SS.API.ai = p[1]
		else if p[0] == "apiToken" then 
			if isN then SS.API.ar = null else SS.API.ar = p[1]
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
		else if item == "weak4" and p[0] == "apiPort" then
			label = "api port"
			edit=i;break
		else if item == "hackip" and p[0] == "hackShopIp" then
			label = "hackshop ip"
			edit = i; break;
		else if item == "repoip" and p[0] == "hackRepoIp" then
			label = "repository ip"
			edit = i; break;
		else if item == "weak1" and p[0] == "weakMemZone" then
			label = "weak library memory zone"
			edit = i; break;
		else if item == "weak2" and p[0] == "weakMemAddr" then
			label = "weak library memory address"
			edit = i; break;
		end if
		c = c+1
	end for
	data.remove(c-1);
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
	//LOG(data)
	return LOG("wip".warning)

end function
SS.isMacro = function

	for m in SS.macros

	end for
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
	if p == null or p.len < 1 then 
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
		if isF then 
			dir = SS.Utils.rootFromFile(o)
		else
			dir = o.File("/")
		end if
	else if p[0] != "/" and cdur.name == "/" then 
		if isF then 
			dir = SS.Utils.fileFromPath(o, "/"+p)
		else 
			dir = o.File("/"+p)
		end if
	else if p[0] != "/" and cdur.name != "/" then
		if isF then 
			dir = SS.Utils.fileFromPath(o, cdur.path+"/"+p)
		else 
			dir = o.File(cdur.path+"/"+p)
		end if
	else 
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
	net = SS.Network
	net.map(a)
	if net == null then return LOG("Invalid Address".warning)
	LOG("".fill+NL+net.is)
end function
Core["nslookup"] = function(a)
	if a == null then return LOG("Invalid arguments".warning)
	if split(a, "www.").len < 1 then return LOG("Must be a domain".warning)
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
	if pF == null then return LOG("Invalid path specified".warning)
	if tF == null then tF = SS.cwd
	if pF[0] != "/" then pF = SS.Utils.path(pF)//pathfile
	if tF[0] != "/" then tF = SS.Utils.path(tF)//targetfile
	if not SS.Utils.fileFromPath(o, pF) then return LOG("File not found".warning)
	c = o.build(pF, tF, fN)
	if c.len > 1 then return LOG(c.warning)
	LOG((fN.white+" compiled at path: "+pF.yellow).ok)
end function
Core["launch"] = function(o, p, d1=null,d2=null,d3=null,d4=null)
	if T(o) != "shell" then return LOG("Only shells can launch binaries".warning)
	out=[];if d1 then out.push(d1);if d2 then out.push(d2);if d3 then out.push(d3);if d4 then out.push(d4)
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
	if out.len == 0 then return o.launch(fn)
	if out.len == 1 then return o.launch(fn, d1)
	return o.launch(fn, data.join(" "))
end function
Core["service"] = function(o, a, s = null, f = null)
	if T(o) != "shell" then return LOG("Must be of type: Shell".warning)
	if s == "libhttp.so" and (a == "-cfg") then return SS.Utils.webmanager(o, f) 
	if a == "-l" then return SS.Utils.listServices(o)
	if s == null then return LOG("No service specified".warning)
	act = null
	srv = SS.Utils.hasLib(o, s, null, true)
	if not srv then return 
	if a == "-i" then 
		al = "Installing:<i> ".grey+s
		act = srv.install_service
	else if a == "-s" then 
		al = "Starting<i> ".white+""
		act = srv.start_service
	else if a == "-k" then 
		al = "Stopping:<i> ".grey+s 
		act = srv.stop_service
	else 
		return LOG("Invalid arguments".warning)
	end if
	if T(act) == "string" then 
		return LOG(act.warning)
	else if act == 1 then
		st = al+" "+s.white+" ---> "+"OK".green 
		LOG(st.ok)
	else
		LOG("Did not succeed, but no error string".warning)
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
			s = "USER".cyan+" "+"PID".cyan+" "+"CPU".cyan+" "+"MEM".cyan+" "+"CMD".cyan
			ps = o.show_procs.split(NL); if ps.len != 0 then ps.pull;
			for p in ps
				p = p.split(" ")
				s = s + NL + p[0].isRoot(u, "00BDFF") + " " + p[1].white + " " + p[2].grey + " " + p[3].grey + " " + p[4].isProc
			end for
			return LOG("".fill+NL+COLUMNS(s)+NL+"".fill) 
		end function
	end if
	if not a then return _p
	_n = function
		if split(o.show_procs, "Notepad").len > 1 then return 1
		return null
	end function
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
	if not p then return LOG("Provide a PID or NAME".warning)
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
			if (parse[4] == p) or (p == "-a") then
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
	if not u or u == " " then u = INPUT("User: ".prompt)
	if u == "" or u == " " then return LOG("Invalid user".warning)
	p = INPUT("Changing password for user: ".sys + u +"\nNew password: ", true)
	if p == "" or p == " " then return LOG("Invalid password".warning)
	out = o.change_password(u, p)
	if T(out) == "string" then return LOG(out.warning)
	LOG("Password modified for: ".ok+u)
end function
Core["touch"] = function(o, fn, pf = null)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	if pf == null then pf = SS.cwd
	if not fn then return LOG("Specify a name".warning)
	if (o.File(pf) == null) or (o.File(pf).is_folder != true) then return LOG("Invalid parent folder".warning)
	t = o.touch(pf, fn)
	if t == 1 then return LOG("Created file: ".ok+pf.grey+"/".grey+fn)
	if T(t) == "string" then return LOG(t.warning)
end function
Core["mkdir"] = function(o, fn, pf = null)
	o = SS.Utils.ds(o, "computer")
	if o == null then return
	if pf == null then pf = SS.cwd
	if not fn then return LOG("Invalid arguments".warning)
	if (o.File(pf) == null) or (o.File(pf).is_folder != true) then return LOG("Invalid parent folder".warning)
	t = o.create_folder(pf, fn)
	if t == 1 then return LOG("Created directory: ".ok+pf.grey+"/".grey+fn)
	if T(t) == "string" then return LOG(t.warning)
end function
//TODO: save function that uses host shell to write files to the host
Core["savef"] = function(o, op, dp = null)
	o = SS.Utils.ds(o, "file")
	if not o then return


end function
Core["scp"] = function(r, a, op, dp = null)
	if T(r) != "shell" then return LOG("Object must be of type shell".warning)
	if r.host_computer.is_network_active == false then return LOG("Computer is offline".warning)
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
	if not op then return LOG("Specify filepath".warning)
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
	if not op then return LOG("Specify filepath".warning)
	out = null
	if dp == null then dp == SS.cwd
	if op[0] != "/" then op = SS.Utils.path(op)
	if dp[0] != "/" then dp = SS.Utils.path(op)
	if o.host_computer.File(op) == null then return LOG("File not found".warning)
	out = r.put(op, dp, SS.s)
	if T(out) == "string" then return LOG(out.warning)
	LOG("File downloaded to path: ".ok+dp)
end function
Core["ssh"] = function(o, cs, p = 22)
	if T(o) != "shell" then return LOG("Object must be of type shell".warning)
	if o.host_computer.is_network_active == false then return LOG("Computer is offline".warning)
	if not cs or cs.indexOf("@") == null then return LOG("Invalid usage: user@ip port".warning)
	if p != 22 then p = p.to_int
	cs = cs.split("@")
	if not is_valid_ip(cs[1]) then return LOG("Invalid usage: user@ip port")
	if T(p) == "string" then return LOG("Invalid usage: user@ip port".warning)
	svc = o.connect_service(cs[1], p, cs[0], INPUT("Enter password: ".prompt, true), "ssh")
	if T(svc) == "string" then; LOG(svc.warning); return null; end if
	if svc == null then return
	rs = "SSH connection established".ok
	if SS.og then rs = rs.ogconnect
	LOG(rs)
	return svc
end function
Core["ftp"] = function(o, cs, p = 21)
	if T(o) != "shell" then return LOG("Object must be of type shell".warning)
	if o.host_computer.is_network_active == false then return LOG("Computer is offline".warning)
	if not cs or cs.indexOf("@") == null then return LOG("Invalid usage: user@ip port".warning)
	if p != 21 then p = p.to_int
	if T(p) == "string" then return LOG("Invalid usage: user@ip port".warning)
	cs = cs.split("@")
	if not is_valid_ip(cs[1]) then return LOG("Invalid usage: user@ip port".warning)
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
		if g != null then;if (g.set_owner("root", true).len < 1) and (g.set_group("root", true).len < 1) then LOG("Guest has been secured".ok);end if;	
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
		if g != null then;if (g.set_owner("root", true).len < 1) and (g.set_group("root", true).len < 1) then LOG("Guest has been secured".ok);end if;
		files = [o.File("/boot"), o.File("/sys"), o.File("/lib")]
		if a == "-s" then cfg = o.File("/root/Config")
		if a == "-h" then cfg = o.File("/home/"+SS.Utils.user(o)+"/Config")
		pw = o.File("/etc/passwd")
	end if
	if a == "-s" then;if r.chmod("g-wrx", true).len > 1 then LOG("Failed to adjust scope Group to /".warning);if r.chmod("u-wrx", true).len > 1 then LOG("Failed to adjust scope User to /".warning);end if;
	if a == "-h" then;for f in files;if f then f.chmod("u-rwx", true); f.chmod("g-rwx",true);end for;
	if cfg != null then
		if T(o) == "file" then 
			b = GF(r, cfg.path+"/Bank.txt")
			m = GF(r, cfg.path+"/Mail.txt")
		else 
			b = o.File(cfg.path+"/Bank.txt")
			m = o.File(cfg.path+"/Mail.txt")
		end if
		out = cfg.set_owner("root", true)
		if T(out) == "string" and out.len > 0 then LOG(out.warning) else LOG("Config folder has been assigned to owner root".ok)
		out = cfg.set_group("root", true)
		if T(out) == "string" and out.len > 0 then LOG(out.warning) else LOG("Config folder has been assigned to group root".ok)
		if cfg.chmod("u-rwx", true).len > 1 then LOG("Failed to adjust rwx permissions to ".warning+cfg.path)
		m=o.File(cfg.path+"/Bank.txt")
		b=o.File(cfg.path+"/Bank.txt")
		if m == null then
			LOG("No Mail.txt found to delete".ok)
		else if m.delete().len < 1 then 
			LOG("Mail.txt has been deleted".ok)
		else;LOG("There was an issue securing the Mail.txt".warning)
		end if
		if b == null then 
			LOG("No Bank.txt found to delete".ok)
		else if b.delete().len < 1 then 
			LOG("Bank.txt has been deleted".ok)
		else;LOG("There was an issue securing the Bank.txt".warning)
		end if
	else;LOG("Config folder not found".warning)
	end if
	if pw then 
		pw = pw.delete
		if pw.len > 1 then LOG("Deleted /etc/passwd".ok)
	else;LOG("No password file to delete".grey.sys)
	end if
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
	if r == null or u == null then return LOG("Invalid args".warning)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	rec = false 
	if r == "-r" then rec = true
	if pa[0] != "/" then pa = SS.Utils.path(pa)
	f = SS.Utils.fileFromPath(o, pa)
	if f == null then return LOG("Unable to chmod file: not found".warning)
	out = f.chmod(u, rec)
	if (T(out) == "string" and out.len > 1) then return LOG(out.warning)
	fp = "/".lblue; if f.path != "/" then fp = parent_path(f.path).grey+"/"+f.name.lblue
	LOG((fp+" has been given permissions: "+u).ok)
end function
Core["chgrp"] = function(o, r, u, pa)
	if r == null or u == null then return LOG("Invalid args".warning)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	rec = false 
	if r == "-r" then rec = true
	if pa[0] != "/" then pa = SS.Utils.path(pa)
	f = SS.Utils.fileFromPath(o, pa)
	if f == null then return LOG("Unable to chgrp file: not found".warning)
	out = f.set_group(u, rec)
	if (T(out) == "string" and out.len > 1) then return LOG(out.warning)
	fp = "/".lblue; if f.path != "/" then fp = parent_path(f.path).grey+"/"+f.name.lblue
	LOG((fp+" has been assigned group: "+u).ok)
end function
Core["chown"] = function(o, r, u, pa)
	if r == null or u == null then return LOG("Invalid args".warning)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	rec = false 
	if r == "-r" then rec = true
	if pa[0] != "/" then pa = SS.Utils.path(pa)
	f = SS.Utils.fileFromPath(o, pa)
	if f == null then return LOG("Unable to change file owner: file not found".warning)
	out = f.set_owner(u, rec)
	if (T(out) == "string" and out.len > 1) then return LOG(out.warning)
	fp = "/".lblue; if f.path != "/" then fp = parent_path(f.path).grey+"/"+f.name.lblue
	LOG((fp+" is now owned by: "+u).ok)
end function
Core["cat"] = function(o,p)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	if not p then return LOG("Invalid argument".warning)
	f = SS.Utils.fileFromPath(o, p)
	if f == null then return LOG("File not found: ".warning + p)
	if f.is_binary then return LOG("Unable to open - file is binary".warning)
	if f.has_permission("r") == false then return LOG("Cannot open - permission denied".warning)
	LOG("content:".ok+NL+f.get_content)
end function
Core["move"] = function(o, cfp, tfp, fn)
	if cfp == null then return LOG("path dest name")
	if tfp[0] != "/" then tfp = SS.Utils.path(tfp)
	if not tfp then return LOG("Invalid argument".warning)
	if T(o) == "file" then return o.move(tfp, tpf)
	if cfp[0] != "/" then cfp = SS.Utils.path(cfp)
	if T(o) != "computer" then o = o.host_computer
	f = o.File(cfp)
	if f == null then return LOG("File not found at: ".warning+tfp)
	if fn == null then fn = f.name
	t = f.move(tfp, fn)
	if T(t) == "string" then return LOG(t.warning)
	fp = "/".lblue; if f.name != "/" then fp = parent_path(f.path).grey+"/"+f.name.lblue
	LOG(("Moved file: "+parent_path(cfp).grey+"/"+fn+" to path: "+tfp.grey).ok)
end function
Core["copy"] = function(o, cfp, tfp, fn)
	if cfp == null then return LOG("path dest name")
	if tfp[0] != "/" then tfp = SS.Utils.path(tfp)
	if T(o) == "file" then return o.copy(cfp, tfp)
	if cfp[0] != "/" then cfp = SS.Utils.path(cfp)
	if T(o) != "computer" then o = o.host_computer
	f = o.File(cfp)
	if f == null then return LOG("File not found at: ".warning+cfp)
	if fn == null then fn = f.name
	t = f.copy(tfp, fn)
	if T(f) == "string" then return LOG(f.warning)
	fp = "/".lblue; if f.name != "/" then fp = parent_path(f.path).grey+"/"+f.name.lblue
	LOG(("Copied file: "+parent_path(cfp).grey+"/"+fn+" to path: "+tfp.grey).ok)
end function
Core["rm*"] = function(o, p)
	o = SS.Utils.ds(o, "file"); isGlob = null;
	if not p then return LOG("Invalid argument".warning)
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
	if not p then return LOG("Invalid argument".warning)
	if p[0] != "/" then p = SS.Utils.path(p)  
	f = SS.Utils.fileFromPath(o, p)
	if f == null then return LOG("Couldn't rename - File not found".warning)
	if f.has_permission("w") == false then return LOG("Unable to rename - permission denied".warning)
	if not n then n = INPUT("File name not specified: ".prompt)
	r =  f.rename(n)
	if r.len > 0 then return LOG(r.warning)
	LOG("File has been renamed: ".ok+n)
end function
Core["fs"] = function(o, a, f)
	ob = SS.Utils.ds(o, "file")
	if a == "-f" then 
		if not f then return LOG("Invalid arguments [find] [filename*]")
		fl = "No files found by this name".grey
		fll = "No directories by this name"
		files = SS.Utils.hasFile(o, f, true, true)
		folders = SS.Utils.hasFolder(o, f, true, true)
		if files and files.len > 0 then 
			o=[]
			for f in files 
				fp = f.path.split("/")
				fe = fp.pop.lblue
				fp = fp.join("/").grey 
				o.push((fp+"/"+fe))
			end for
			LOG("Files found: ".sys+NL+o.join(NL)) 
		end if
		if folders and folders.len > 0 then 
			o=[]
			for f in folders 
				fp = f.path.split("/")
				fe = fp.pop.lblue
				fp = fp.join("/").grey 
				o.push((fp+"/"+fe))
			end for
			LOG("Directories found: ".sys+NL+o.join(NL)) 
		end if
		if (not files) and (not folders) then return LOG("No file/directory found with the name: ".warning+f)
	else if a == "-i" then
		_im = function(c, parse, p)
			LOG("Beginning injection process".grey.sys)
			while 1
				LOG((parent_path(c.path)+"/").grey+c.name.red+NL+"Content of the file: ".sys+NL+p) 
				select = INPUT("SELECT A LINE TO INJECT | any to skip".prompt).to_int
				if (T(select) == "string") or (select > parse.len) then break
				payload = INPUT("SPECIFY THE CODE TO INJECT".red.NL+"This will likely need to be custom, refer to the script you're injecting".grey.i.NL+"Payload".prompt)
				if (payload == E) or (payload == " ") then break 
				payloadString = parse[select-1]+(char(9)*1000)+(";"+payload)
				parse[select-1] = payloadString
				s = parse.join(NL)
				if c.set_content(s) == 1 then
					LOG("File has been injected".ok) 
					return parse
				end if 
			end while
			LOG("Injection process failed to yield a result".warning)
			return null 
		end function
		_inject = function(o)
			LOG("Searching for injectable files. . .".grey.sys)
			r = SS.Utils.rootFromFile(SS.Utils.ds(o, "file"))
			src = []
			cf = r.get_folders+r.get_files
			while cf.len
				c = cf.pull
				if c.is_folder then cf = cf+c.get_folders+c.get_files
				if (c.name.len > 3) and c.name[-3:] == "src" then
					sel=INPUT("".fill+NL+"Injection file found: ".ok+(parent_path(c.path)+"/").lblue+c.name.red+NL+"press 1 to inject | any to skip".prompt)
					if sel.to_int != 1 then continue
					if sel == "exit" then return 
					if (c.has_permission("r") == false) or (c.has_permission("w") == false) then; LOG("Lacks required permissions".warning); continue; end if
					content = c.get_content 
					if ((content.len == 0)  or (content.split(NL) == null)) and (INPUT("This file is empty, proceed?".prompt).to_int != 1) then continue
					parse = content.split(NL)
					p = parse.select
					inj = _im(c, parse, p)
					if not inj then continue
					if inj then return true
				end if
			end while
			LOG("Files not injected. . .".warning) 
		end function
		if (not f) or (f == "-a") then return _inject(o)
		if f[0] != "/" then f = SS.Utils.path(f)
		fi = SS.Utils.fileFromPath(o, f)
		if (fi != null)and(fi.has_permission("r"))and(fi.has_permission("w")) then return _im(o, fi.get_content.split(NL))
		if not fi then LOG("File not found, opting for loop".warning)
		return _inject(o)
	else if a == "tree" then 
		return LOG("TODO:")
	end if
end function
Core["edit"] = function(o, p, clean = null)
	o = SS.Utils.ds(o, "file")
	if o == null then return
	if p[0] != "/" then p = SS.Utils.path(p)
	if not p then return LOG("Invalid argument".warning)
	f = SS.Utils.fileFromPath(o, p)
	if f == null then return LOG("Unable to edit - File not found".warning)
	if f.has_permission("w") == false then return LOG("Unable to edit - Permission denied: ".warning+"W")
	if f.has_permission("r") == false then return LOG("Unable to edit - Permission denied: ".warning+"R")
	fishedit = new SS.Phim.map(f)
	fishedit.edit
end function
Core["ping"] = function(s, i)
	if T(s) != "shell" then return LOG("Must be of type shell".error)
	if (i == null) or (is_valid_ip(i) == false) then return LOG("Invalid ip".warning)
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
	i = ("|".grey)+"BSSID".cyan+" "+("|".grey)+"PWR".cyan+" "+("|".grey)+"ESSID".cyan;c=1
	for network in networks
		n=network.split(" ")
		i = i + NL + (c+"|".grey)+n[0].lblue+" "+ n[1].grey+" "+ n[2].white; c=c+1;
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
	if SS.ccrypt == null then return LOG("Missing crypto library".warning)
	obj = SS.Utils.ds(obj, "computer"); if obj == null then return;
	formatOutput = "Interface".cyan+" "+" Chipset".cyan+" "+"Monitor_Mode".cyan
	if option != "start" and option != "stop" then return LOG("invalid arguments, [start|stop]".warning)
	output = SS.ccrypt.airmon(option, device)
	if not output then return LOG("Invalid device choice".warning)
	if T(output) == "string" then return LOG(output.warning)
	ret = ""
	LOG( COLUMNS(obj.network_devices))
end function
Core["aireplay"] = function(bssid, essid, acks=null)
	if SS.ccrypt == null then return LOG("Missing crypto library".warning)
	if (not bssid) or (not essid) then return LOG("invalid arguments [bssid] [essid]".warning)
	if acks then acks = acks.to_int
	if (not acks) or (T(acks) == "string" )then acks = 10000
	result = SS.ccrypt.aireplay(bssid, essid, acks)
	if T(result) == "string" then return LOG(result)
end function
Core["aircrack"] = function(obj, pathFile)
	//command: aircrack
	if SS.ccrypt == null then return LOG("Missing crypto library".warning)
	if pathFile[0] != "/" then pathFile = SS.Utils.path(pathFile)
	obj = SS.Utils.ds(obj, "computer")
	if obj == null then return null
	file = obj.File(pathFile)
	if file == null then return LOG("aircrack: file not found: ".warning+pathFile)
	if not file.is_binary then return LOG("aircrack: Can't process file. Not valid filecap.".warning)		
	if not file.has_permission("r") then return LOG("aircrack: permission denied".warning)
	key = SS.ccrypt.aircrack(file.path)
	if key then return LOG("KEY FOUND!".ok+" [" + key + "]" )
	LOG("Unable to get the key".warning )
end function
Core["apt"] = function(c, p=null,pa=null)
	if SS.apt == null then return LOG("apt client not found".warning)
	if c == "-u" then return LOG("APT".sys+NL+SS.apt.update)
	if p == null then 
		if c != "--" then return LOG("Invalid arguments".warning)
		libs = SS.checkApt
		if libs.len == 0 then return LOG("No updates needed !".ok)
		LOG("The following packages will be updated:".sys+NL+libs.select(""))
		if INPUT("Press 1 to continue, any to canel".prompt).to_int != 1 then return
		c = 0
		for i in libs 
			o = SS.apt.install(i)
			if o == true then c = c+1
			if T(o) == "string" then LOG(o)
		end for
		LOG("Packages updated: ".ok+c)
	else
		va = ["install", "addrepo", "delrepo", "search", "show"]
		if va.indexOf(c) == null then return LOG("Expected args: ".warning+va.join(" | ".lblue))
		if c == "install" then
			if p == null then return LOG("Specify package".warning)
			pl = p
			if pa == null then  
				output = SS.apt.install(p)
			else
				if pa[0] != "/" then pa = SS.Utils.path
				if not SS.Utils.fileFromPath(SS.f, pa) then return LOG("Directory not found: ".warning+pa)				
				pl = pl+" at path: "+pa
				output = SS.apt.install(p,pa)
			end if
			LOG("Downloading: ".grey.sys + pl);
			if  output == true then return LOG( "APT installed: ".ok+p)
			return LOG(output.warning)
		end if
		if c == "addrepo" then
			port = null
			if p == null or is_valid_ip(p) == false then return LOG("Specify a valid ip")
			if pa == null then port = 1542
			if not port and pa != null then port = port.to_int
			if T(port) != "number" then return LOG("Invalid port specified".warning)
			output = SS.apt.add_repo(p)
			if output.len != 0 then LOG(p)
			return LOG(("Repository " + p + " added succesfully.").ok+ "\nLaunch apt with the update option to apply the changes")
		else if c == "delrepo" then
			if not p then return LOG("Specify ip of repository to remove".warning)
			output = SS.apt.del_repo(p)
			if output then LOG(output)
			return LOG(("Repository " + p + " added succesfully.").ok+ "\nLaunch apt with the update option to apply the changes")
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
		if SS.ccrypt == null then return LOG("Program is operating under cfg: >"+SS.cfg.label) 
		if h.indexOf("&") then h = p.split("&")[0]
		LOG("Crypto selected: ".sys+"Beginning manual scan...".grey)
		ret = SS.ccrypt.decipher(h)
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
	if SS.ccrypt == null then return LOG("Program is operating under CFG: "+SS.cfg.label)
	port = port.to_int
	if T(port) != "number" then return LOG("Port must be a number")
	u = SS.ccrypt.smtp_user_list(addr, port)
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
		if T(SS.dbe) != "file" then return LOG("Database not configured, build using cd ; -cfg -e -b") 
		exploits = netsesh.mlib.browse
	else if a == "-a" then // all
		if T(SS.dbe) != "file" then return LOG("Database not configured, build using cd ; -cfg -e -b") 
		exploits = netsesh.mlib.scanned
	else if a == "-i" then 
		return
	else
		if not d then return
		res = netsesh.mlib.ofe([[{"exploit":"Unknown"}, {"memory": a},{"string": d}]], SS.cfg.unsecure_pw)
	end if
	if SS.debug then LOG("Exploits: ".debug+exploits)
	if exploits == null then
		if INPUT("Press 1 to confirm manual scan".prompt).to_int != 1 then return
		exploits = netsesh.mlib.manscan(netsesh.mlib)
	end if
	if not exploits then return null
	if not d then d = SS.Utils.datapls
	if d == ""  or d == " " then d = SS.cfg.unsecure_pw; if d == SS.cfg.unsecure_pw then LOG("Defaulting to unsecure pw . . .".sys)
	if d == null then return LOG("Data error".error)
	if T(exploits) == "list" then
		res = netsesh.mlib.ofe(exploits, d)
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
	if( addr == null) or (addr == "-r") then addr = SS.Utils.random_ip
	net = SS.Network
	net.map(addr)
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
		if T(SS.dbe) != "file" then return LOG("Database not configured, build using cd ; -cfg -e -b") 
		payload = ns.mlib.scanned
	else if sel == 2 then
		if T(SS.dbe) != "file" then return LOG("Database not configured, build using cd ; -cfg -e -b")  
		payload = ns.mlib.browse
	else if sel == 3 then 
		payload = ns.mlib.manscan
		if not payload then return LOG("Manual scan wip, why do this?".warning)
	else if ns.mlib.scanned == null then 
		return null 
	else;return null;
	end if
	d = SS.Utils.datapls
	if (d == "")  or (d == " ") then d = SS.cfg.unsecure_pw
	res = []
	if T(payload) == "list" then
		res = ns.mlib.ofe(payload, d)
	else if T(payload) == "string" then
		res = ns.mlib.ofe(null, d)
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
	if TW then; if res.len > 0 then LOG("Objects returned to cache, use command -cache -o".sys.grey) else LOG("No objects returned, this library is locked up tight!".warning); end if
	SS.cache(res, i, l)
end function
Core["localhax"] = function(o, a, l)
	if not SS.mx then return LOG("Program operating under CFG: "+SS.cfg.label)
	exA = ["init.so", "kernel_module.so", "net.so", "aptclient.so","metaxploit.so", "crypto.so", "-a"]
	if exA.indexOf(l) == null then return LOG("Invalid arguments, expected: ".warning+exA.join(" | ".lblue))
	m = new SS.MX
	m.map(o, SS.cmx)
	ip = null // addme
	lan = null // addme
	if m.x == null then return null
	if l == "-a" then// all libraries
		m.l("-a")
	else// name
		m.l(l)
	end if
	d = SS.Utils.datapls
	for l in m.libs
		LOG("Exploit loop") 
		if not l then continue
		exploits = null
		if a == "-a" then 
			exploits = l.scanned
		else
			exploits = l.browse
		end if
		res = null
		if not exploits then return LOG("No exploits selected".warning)
		if T(exploits) == "list" then 
			res = l.of(exploits, d)
		else if T(exploits) == "string" then
			res = l.of(null, d)
		end if
		if res == null or res.len == 0 then; LOG("No objects returned".warning); continue; end if;
		SS.cache(res, ip, lan)
	end for
end function
Core["fish"] = function(obj, lib, libVersion, a = null)
	if not lib then return LOG("specify library or -p to fish".warning) 
	ip = null
	if lib == "kernel_router" then
		if not libVersion then return LOG("specify kernel version to fish".warning)  
		ip = SS.Utils.router_fish(libVersion)
	else if lib == "-p" then
		if not libVersion then return LOG("specify port to fish".warning)
		if (a != null) and (T(a.to_int) == "number") then 
			_c=[]
			for i in range(0, a.to_int)
				_c.push("target found: ".sys+SS.Utils.port_fish(libVersion, true))
			end for
			return LOG(_c.join(NL).trim)
		end if
		ip = SS.Utils.port_fish(libVersion)
	else
		if not libVersion then return LOG("specify library version to fish".warning) 
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
	ezt = null
	if (cache == null) and (t != "-a") then 
		f = pc.create_folder(p, SS.ccd)
		cache = pc.File(p+"/"+SS.ccd) 
	else if SS.cfg.i isa file then  
		if SS.s.scp(SS.cfg.i.path, p, o) == 1 then LOG("Transferred cache to remote host".ok) else LOG("An issue occured with transferring the host".warning)
		cache = pc.File(p+"/"+SS.ccd)
		ezt = true
	end if 
	if cache == null then return LOG("There was a problem creating the cache".warning)
	cache.chmod("g+rwx", true)
	cache.chmod("o+rwx", true)
	cache.chmod("u+rwx", true)
	if ezt then return
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
Core["rshell"] = function(o, a, i = null, d = null)
	if SS.cmx == null then 
		x = new SS.MX
		x.i(o)//include
	else 
		x = new SS.MX
		x.map(o,SS.cmx)
	end if 
	if x.x == null then x.fi//force include
	if x.x == null then return LOG("Unable to load metaxploit".warning)
	return x.rs(a, i, d)
end function
Core["crab"] = function(o, cmd, a1=null,a2=null,a3=null,a4=null)
	if T(o) != "shell" then return LOG(("requires a ".crab+"shell".red).warning)
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
Core["surf"] = function(o)
	if T(o) != "shell" then return LOG("BAM can only be invoked with a shell".warning)
	SS.BAM.handler(o, SS.CMD.getOne("iget"), ["surf"])
	return SS.bamres
end function
Core["iget"] = function(o, act, d1 = null, d2 = null, d3 = null, d4 = null)// internal get
	if SS.debug then LOG("INTERNAL GET: "+act+d1+" "+d2+" "+d3+" "+d4)
	SS.bamres = null;
	if act == "mx" or act == "rshell" then 
		m = new SS.MX
		m.i(o)
		if m.x == null then m.fi(o)
		if T(m.x) != "MetaxploitLib" then LOG("iget: an issue occured finding & installing mx".warning)
		SS.bamres = m.x
	else if act == "crypto" then 
		c = new SS.CRO 
		c.i(o)
		if c.c == null then c.fi(o)
		if T(c.c) != "cryptoLib" then LOG("iget: an issue occured finding & installing crypto".warning)
		SS.bamres = c.c
	else if act == "apt" then 
		a = new SS.APT	
		a.i(o)
		if a.a == null then a.fi(o)
		if T(SS.bamres) != "aptclientLib" then LOG("iget: an issue occured finding & installing apt".warning)
		SS.bamres = a.a
	else if act == "network" then
		ip = o.host_computer.public_ip
		net = new SS.Network
		net.map(ip)
		if d1 == "maplan" then net.maplan
		SS.bamres = net
	else if act == "ns" then
		m = new SS.MX
		m.i(o)
		if m.x == null then m.fi(o)
		if m.x == null then return null
		netsesh = new SS.NS.map(d1, d2, "-f", m.x)
		if netsesh == null or netsesh.session == null then return null
		SS.bamres = netsesh//.mlib.of(null, d1)
	else if act == "surf" then
		SS.bamret = o
		return SS.bamret
	else if act == "rootshell" then
		SS.bamres = Core["shellfish"]// res, not a ret as that goes to surf mode
	else if act == "scan" then
		SS.bamres = "add me"
	else if act == "mail" then
		if T(SS.cfg.mailobj) != "MetaMail" then SS.bamres = mail_login(INPUT("Mail account login: ".prompt, true), INPUT("Mail account pw: ".prompt, true)) else SS.bamres = SS.cfg.mailobj
	else if act == "rcon" then 
		SS.bamres = SS.MD5.connect(o, d1, d2, d3, d4)
	else if act == "api" then 
		SS.bamres = LOG("API needs implementation!")
	else if act == "result" then
		object.delete
	else if act == "wl" then 
		if T(SS.cfg.wf)!= "file" then return null
		//TODO: handoff the transfer to the repo instead
		// optional ip arg?
		if SS.cfg.repoip != null and SS.cfg.repowf != null then
			LOG("Beginning repo tasks. . .".grey.sys+NL+"".fill)
			o.launch("/bin/apt-get", "update")
			o.launch("/bin/apt-get", "addrepo "+SS.cfg.repoip)
			o.launch("/bin/apt-get", "update")
			o.launch("/bin/apt-get", "install "+SS.cfg.repowf)
			o.launch("/bin/apt-get", "delrepo "+SS.cfg.repoip)
			LOG("Concluding repo tasks. . .".white.sys+NL+"".fill)
			wf = SS.Utils.hasFile(o, SS.cfg.repowf)
			if T(wf) == "file" then
				f2dn = wf.name.replace(".weak","")
				f = SS.Utils.ds(o, "file")
				f2d = SS.Utils.fileFromPath(f, "/lib/"+f2dn)
				if f2d then f2d.rename(f2dn+".seashell");wait(0.1);
				f2rn = SS.Utils.fileFromPath(f, "/lib/"+SS.cfg.repowf)
				if f2rn then f2rn = frn.rename(f2dn)
				SS.bamres = (f2rn.len < 1)
				if SS.bamres == 1 then; LOG("weak library was deposited".ok);return SS.bamres; else; LOG("there was an issue with the repo, defaulting to SCP".grey.sys); end if
			end if
		end if
		transfer = SS.s.scp(SS.cfg.wf.path, "/lib", o)
		if T(transfer) == "string" and transfer.len > 0 then LOG("There was an issue transferring the file: ".warning+transfer)
		if transfer == 1 then LOG("weak library was delivered".ok)
		SS.bamres = transfer
	else 
		LOG("Invalid use of iget".error)
	end if
	return SS.bamres
end function
Core["proxybounce"] = function(o, a1 = null, a2 = 10)
	if T(o) != "shell" then return LOG("A shell is required".warning)
	if not a1 then a1 = "-b"
	server = new SS.Server
	if a1 == "-b" then 
		res = server.proxtunnel(o)
	else if a1 == "-d" then
		if T(a2) == "string" then a2 = a2.to_int
		if a2 != null and T(a2) != "number" then a2 = 10
		res = server.dirtytunnel(o, a2)
	end if
	if T(res) == "shell" then return res
end function
Core["proxy"] = function(o, a1=null,a2=null)
	if T(o) != "shell" then return LOG("must be of type shell".warning)
	if SS.Utils.user(o) != "root" then return LOG("must be root".warning)
	ea = ["-build", "-repo", "-rshell", "-api"]
	if ea.indexOf(a1) == null then return LOG("Invalid args, expected: ".warning+ea.join(" | ".lblue)) 
	if a1 == "-build" then return SS.Server.proxybuild(a2)
	ts = null
	if a1 == "-repo" then ts = "librepository.so"
	if a1 == "-rshell" then ts = "librshell.so"
	if a1 == "-api" then ts = null // "api"
	if ts then return SS.Server.svcbuild(ts)
end function
Core["npc"] = function(o, t=null,d=null,n=null,f=null)
	if T(o) != "shell" then return LOG("Need a shell for crab".warning)
	if not t then t = "-p"
	SS.NPC.mission(o, t, d, n, f)
end function
Core["shellfish"] = function(_, u = "root")
	result = null
	result = SS.MD5.shell(u)
	if T(result) == "shell" then SS.cache(result)
	SS.bamres = result
	return result
end function
Core["md5"] = function(s)
	if not s then return LOG("Provide a string to return an md5".warning)
	LOG(md5(s).ok)
end function
Core["loadmx"] = function(o, act)
	if act == "-clear" then; SS.cmx = SS.mx; LOG("Loading home MX".ok); return; end if
	if T(o) != "shell" then return LOG("Invalid type shell is needed".warning)
	SS.BAM.handler(o, SS.CMD.getOne("iget"), ["mx"])
	if T(SS.bamres) != "MetaxploitLib" then return LOG("Unable to load mx".warning)
	if SS.mx == null then SS.mx = SS.bamres
	LOG("Loading MX object from: ".sys+o.host_computer.public_ip)
	mx = new SS.MX
	mx.map(o,  SS.bamres)
	SS.mxlibs.push(mx)
	SS.cmx = mx.x
end function
Core["loadcrypto"] = function(o, act)
	if act == "-clear" then; SS.ccrypt = SS.crypto; LOG("Loading home Crypto".ok); return; end if
	if T(o) != "shell" then return LOG("Invalid type shell is needed".warning)
	SS.BAM.handler(o, SS.CMD.getOne("iget"), ["crypto"])
	if T(SS.bamres) != "cryptoLib" then return LOG("Unable to load crypto".warning)
	LOG("Loading Crypto object from: ".sys+o.host_computer.public_ip)
	SS.ccrypt = SS.bamres
end function
Core["loadapt"] = function(o, act)
	if act == "-clear" then; SS.capt = SS.apt; LOG("Loading home APT".ok); return; end if
	if T(o) != "shell" then return LOG("Invalid type shell is needed".warning)
	SS.BAM.handler(o, SS.CMD.getOne("iget"), ["apt"])
	if T(SS.bamres) != "aptclientLib" then return LOG("Unable to load apt client".warning)
	LOG("Loading APT object from: ".sys+o.host_computer.public_ip)
	SS.capt = SS.bamres
end function
Core["runmacro"] = function(o, n, a1=null,a2=null,a3=null)
	if SS.macros.len == 0 then return LOG("No macros loaded".warning)
	ism = null 
	for m in SS.macros 
		if m.name == n then; ism = true; break; end if
	end for
	if not ism then return LOG("Invalid macro specified".warning)
	// format the macros as commands
	
		// check if amount of placeholders == arguments

	// pass it to the earliest place 

end function
Core["ezwifi"] = function(o, f1 = null, f2=null, f3=null)
	o = SS.Utils.ds(o, "computer")
	if not o then return 
	if T(SS.dbl) != "file" then return LOG("log folder not found".warning)
	l=o.File(SS.dbl.path+"/WIFI.db")
	if not l then o.touch(SS.dbl.path, "WIFI.db")
	l=o.File(SS.dbl.path+"/WIFI.db")
	// check connection
	// check interface
	if not l then return LOG("Was unable to create/reference the log file".warning)
	log = null; dict = null; con=null; random=null;all=null;force=null;mon=null
	args = []; if f1 then args.push(f1); if f2 then args.push(f2); if f3 then args.push(f3)
	if args.indexOf("-a") then 
		all = true
	else if args.indexOf("-r") then 
		random = true 
	end if
	if args.indexOf("-l") != null then log = true
	//if args.indexOf("-connect") then con = true
	if args.indexOf("-d") != null then dict = true
	if args.indexOf("-f") != null then force = true
	if args.indexOf("-monitor") != null then
		log = true; mon = true
	end if
	if log != null then 
		logger = new SS.Logger
		logger.map("WIFI")
		if logger.file then logger.entry("SOE", ("NETWORKS CRACKED: "+logger.file.get_content.split(NL).len))
		if mon then return logger.monitor("")
	end if
	net = "wlan0"
	ns = o.wifi_networks(net)
	if ns.len == 0 then return LOG("No wlan0 networks found")
	LOG("Wifi Networks: ".sys+ns.len)
	c0 = 0 
	has = function(f, bssid)
		content = f.get_content
		if not content or content.len == 0 then return null
		for b in content.split(NL)
			if b.len < 1 then continue
			if split(b, bssid).len > 1 then return b
		end for
		return null
	end function
	for n in ns 
		p = n.split(" ")
		b=p[0]
		if has(l, b) != null then 
			LOG("Entry already saved, skipping".grey.sys);continue
		end if
		e=p[2]
		pct = null
		res = null
		if dict != null then res = SS.MD5.wifish(o,b,e,net)
		if res == null then 
			if SS.crypto == null then continue
			pct = p[1].toack
			con = null
			if (force == null) and (pct.to_int > 30000) then 
				con = INPUT(("This wifi will require "+pct.red+" acks, proceed?").prompt).to_int
			end if
			if (force == null) and ((con == null) or (T(con) == "string")) and (pct.to_int > 30000) then 
				LOG("Skipping this network. . .".sys)
				continue
			end if
			SS.crypto.airmon("start", net)
			dc = SS.crypto.aireplay(b,e, pct.to_int)
			if T(dc) == "string" then; LOG(dc.warning) ; continue ; end if
			fi = SS.Utils.hasFile(o, "file.cap")
			if not fi then continue
			res = SS.crypto.aircrack(fi.path)
			if fi.delete == 1 then LOG("Deleted file.cap".ok) else LOG("Unable to delete file.cap".warning)
		end if
		nstr = ("NETWORKS CRACKED: "+str(c0))
		if log then logger.entry((net+" "+b+" "+e+" "+res),nstr)
		if not res then LOG("Failed to acquire key from: ".warning+b+" "+e) else LOG("Connection success at: ".ok+b+" "+e+" "+res.grey)
		c0 = c0+1
	end for
end function
Core["wibounce"] = function(o, a=null,f1=null,f2=null)
	if T(SS.dbl) != "file" then return LOG("Requires ss.logs".warning)
	o = SS.Utils.ds(o, "computer"); if not o then return;
	il = function()
		if split(o.show_procs, "Notepad").len > 1 then return 1
		return null
	end function
	a=[];if f1 then a.push(f1); if f2 then a.push(f2)
	force = null
	if a.indexOf("-f") != null then force == true
	if (force == null) and (il == null) then return LOG("Open notepad to use wifi bouncer".warning)
	l=o.File(SS.dbl.path+"/WIFI.db")
	if not l  then return LOG("Wifi source not collected, use ezwifi to collect".warning)
	LOG("Beginning wifi bounce. . .".grey.sys)
	while 1 
		c = l.get_content
		pa = c.split(NL)
		if not pa then break
		for p in pa
			sp = p.split(" ")
			leng = sp.len
			if leng < 4 then 
				if (p != "SOE") and (sp[0] != "CAPTURED:" or sp[0] != "NETWORKS") then LOG("No key saved, skipping"); 
				continue
			else if leng > 4 then 
				LOG("Malformed entry, skipping");continue
			end if
			o.connect_wifi(sp[0], sp[1], sp[2], sp[3])
			wait(0.1)
		end for
		if (force == null) and not il() then break
		wait(1.0)
	end while
end function
Core["spearfish"] = function(o, ip, f1=null,f2=null, f3=null, f4=null)
	if SS.cfg.wf == null then return LOG("No weak lib".warning)
	random = null;listref = null
	if (ip == "-r") or (ip == "-loop") then
		if ip == "-r" then random = true
		ip = SS.Utils.random_ip
	else if ip == "-list" then 
		listref = true
	else 
		if not is_valid_ip(ip) then return LOG("Invalid ip provided".warning)
	end if 
	args = [];
	if f1 then args.push(f1);if f2 then args.push(f2);if f3 then args.push(f3);if f4 then args.push(f4);
	loop=null;log=null;player=null;fC =null; fCf = null
	if args.len == 0 then player = true
	if args.indexOf("-loop") != null then loop = true
	if args.indexOf("-log") != null then log = true
	if args.indexOf("-f") != null then fC = true
	if args.indexOf("-r") != null then random = true
	if args.indexOf("-list") != null then listref = true
	if fC != false and args.len > 1 then fCf = args[1]
	logbot = null
	if log then 
		logbot = new SS.Logger
		logbot.map("SPEARFISH")
	end if
	il = function(o)
		if split(o.host_computer.show_procs, "Notepad").len > 1 then return 1
		return null
	end function
	if il(o) == null and loop != null then return LOG("Open Notepad for looping".warning)
	launchips = []
	launchO = []
	SF = function(o, ip, player, loop, log, fC, fCf)
		shell = null
		res = SS.Utils.getLaunchPoint(o, ip)
		if res == null then 
			LOG("There was an issue with the launch acquisition".warning)
			return null
		else if T(SS.launchres[1]) != "MetaxploitLib" then
			return null
		end if
		_mx = new SS.MX
		_mx.map(SS.launchres[0].o, SS.launchres[1])
		_mx.l(SS.cfg.wf.name)
		SS.BAM.handler(SS.launchres[0].o, SS.CMD.getOne("iget"), ["network", "maplan"])
		if SS.bamres == null then return null
		net = SS.bamres
		pcs = []
		LOG(("The water is about to ripple. . .".sys).ogsniff)
		for lan in net.lans
			root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], lan)
			if root.len == 0 then continue
			pcs.push(root[0])
		end for
		fishes = []
		guppies = []
		for p in pcs 
			if T(p) != "computer" then continue
			if p.get_name == "fishtank" then continue//;O
			hek = new SS.EO
			hek.map(p);fishy=null;guppy=null;
			if player then fishy = hek.check_player()
			if fishy then fishes.push(hek)
			if fC then guppy = hek.check_fs(fCf) 
			if guppy then guppies.push(hek)
		end for 
		if fishes.len > 0 then
			if loop == null then 
				LOG("Pushing to cache. . .".grey.sys); SS.cache(fishes)
			else if INPUT(("Fishy "+"player".red.b+"activity found | 1 to cache").prompt).to_int == 1 then
				LOG("Pushing to cache. . .".grey.sys); SS.cache(fishes)
			else;LOG("Skipping this fish, don't tell the old man!".warning)
			end if
		else;LOG(("Searched: "+(str(pcs.len).white).b+" devices, "+"no fishies found".b+", did we miss them?").warning)
		end if
		if guppies.len > 0 then 
			if loop == null then 
				LOG("Pushing to cache. . .".grey.sys); SS.cache(guppies)
			else if INPUT(("Fishy "+"fs".orange.b+"activity found | 1 to cache").prompt).to_int == 1 then
				LOG("Pushing to cache. . .".grey.sys); SS.cache(guppies)
			else;LOG("Skipping this guppy, don't tell the old man!".warning)
			end if
		else;LOG(("Searched: "+(str(pcs.len).white).b+" devices, "+"no guppies found".b+", did we miss them?").warning)
		end if
		ret = []
		if fishes.len > 0 then ret = ret+fishes
		if guppies.len > 0 then ret = ret+guppies
		if ret.len > 0 then return ret
		return null
	end function
	if listref == true then
		if not SS.cfg.lf then return LOG("No log folder found".warning)
		ref = SS.Utils.fileFromPath(o, SS.cfg.lf.path+"/PONDS.db")
		if ref == null then; if o.host_computer.touch(SS.cfg.lf.path, "PONDS.db") != 1 then return LOG("Unable to create POND file".warning) else LOG("Created log file: ".sys+SS.cfg.lf.path.grey+"/".grey+"PONDS.db".lblue); end if
		ref = SS.Utils.fileFromPath(o, SS.cfg.lf.path+"/PONDS.db")
		if ref == null then return LOG("There was an issue finding and creating the db file".warning)
		c=ref.get_content
		if c.len == 0 then return LOG("Empty pond file".warning)
		p = c.split(NL)
		good=[]//todo: add a handler for launch points, to add more as theyre dynamically fed
		bad=[]
		if not p then return LOG("Malformed pond file".warning)
		LOG("".fill.NL+"Establishing Launch Points".title)
		for pa in p
			wait(0.1)
			if not is_valid_ip(pa) then continue
			res = SS.Utils.getLaunchPoint(o, pa)
			if log and logbot then 
				// todo: entry
				LOG("Have you implemented me yet? Looks like you haven't :c")
			end if
			if SS.launchres == null or SS.launchres.len < 2 then 
				LOG("There was an issue with the launch acquisition".warning)
				continue
			else if T(SS.launchres[1]) != "MetaxploitLib" then
				LOG("There was an issue with including MX".warning)
				continue
			end if
			if launchips.indexOf(SS.launchres[0].ip) == null then
				eo =  SS.launchres[0]
				mx = SS.launchres[1]
				launchips.push(ip)
				SS.BAM.handler(eo.o, SS.CMD.getOne("iget"),["network", "maplan"])				
				launchO.push({"eo":eo, "mx":mx, "lans":SS.bamres.lans, "bs":0})
			end if
		end for
		for ob in launchO
			shell = ob.eo.o
			locmx = ob.mx
			lans = ob.lans
			_mx = new SS.MX
			_mx.map(shell, locmx)
			_mx.l(SS.cfg.wf.name)
			if _mx.libs.len<1 then continue
			for l in lans
				root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], l)
				if root.len > 0 then
					for r in root 
						eo = new SS.EO
						eo.map(r)
						if eo.check_player != null then ;LOG("PLAYER DETECTED".red.ok); SS.cache(eo); continue; end if
					end for
					// log event
				else;LOG("No computer returned".warning)
				end if
			end for
		end for
		LOG("".fill.NL+"Watching Launch Points".title)
		while 1
			// attack loop
			wait(0.1)
			for ls in launchO
				// local network map
				shell = ls.eo.o
				locmx = ls.mx
				if T(shell) != "shell" then continue
				SS.BAM.handler(shell, SS.CMD.getOne("iget"),["network", "maplan"])
				// check lans 
				if SS.bamres == null then 
					LOG("An issue occured mapping the network".warning)
					continue
				end if
				badlan = null
				if ls.lans != SS.bamres.lans then 
					LOG("Fishy Activity Detected on this Server. . .".red.sys)
					badlan = ls.lans.oddOne(SS.bamres.lans)
				else;LOG("No change detected, skipping".grey.sys); continue 
				end if
				if not badlan then;LOG("Badlan return was bad, imagine that".warning);continue; end if
				// proceed accordingly o7
				_mx = new SS.MX
				_mx.map(shell, locmx)
				_mx.l(SS.cfg.wf.name)
				if _mx.libs.len<1 then; LOG("Lib not loaded, imagine that !!".warning); continue; end if
				root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], badlan)
				if root.len > 0 then
					LOG("New objects detected, pushing them to cache".ok)
					// log event
					SS.cache(root)
				else;LOG("No computer returned".warning)
				end if
			end for 
			if loop != true then break
			if il(o) == null then break
		end while 
	else
		while 1
			if (fCf == "DungeonSeeker") and (random != null) then ip = SS.Utils.port_fish(1542)
			res = SF(o, ip, player, loop, log, fC, fCf)
			if res != null then 
				LOG("Have you implemented me yet? Looks like you haven't :c")
				//if log and logbot then logbot.entry()
			end if
			if loop != true or ((loop == true) and (random == false) and (res == null))then break
			if il(o) == null then break
			if random == true then 
				if (fCf != "DungeonSeeker") then ip = SS.Utils.random_ip else ip = SS.Utils.port_fish(1542)				
			end if
		end while
	end if
end function
Core["db"] = function(o, lib, libv)
	if T(SS.dbe) != "file" then return LOG("DB directory not found, build using cd ; -cfg -e -b".warning)
	if lib == "-load" then return SS.getDb(o)
	if lib == null then return LOG("Invalid argument [lib] [version|action]".warning)
	dbf = null
	if libv == null then
		dbf = [] 
		libv == "-a"
		for fo in SS.dbe.get_folders 
			n = fo.name 
			fn = n.split("\.")[0]
			if fn[:4] == "kern" then fn = fn.replace("_","")// kernel router and modules
			if T((n[-1:].to_int)) == "number" then 
				n = n.replace(n[-1:], "")
			else if (T((n[-2:].to_int)) != "number") and (T(n[-1:].to_int) == "number") then 
				n = n.replace(n[-1:], "")
			end if
			if (n != lib) then continue
			dbff = []
			for fi in fo.get_files 
				dbff.push(BL+fi.name.white.wrap.cap(fi.get_content.split(NL).len.rate)+((fi.path).genSimpleExpSummary))
			end for 
			dbf.push({"name": fo.name , "files":dbff})
		end for
		if dbf.len == 0 then return null
		for fob in dbf 
			LOG("".fill+NL+"DIRECTORY: "+fob.name+NL+"CONTENTS:"+NL+fob.files.join(NL))
		end for
	else 
		dbf = SS.EXP.getOne(lib, libv)
		if dbf == null then return
		hacks = SS.EXP.format(dbf.get_content)
		LOG("DB FILE: ".sys+parent_path(dbf.path).grey+"/".grey+dbf.name.lblue)
		for h in hacks
			if h.len < 3 then continue
			s = "".fill+NL+BL+"USER".wrap("00BDFF", 10).purple.cap(h[3].user.isRoot(null,"00FFE7")).purple+NL+BL+"TYPE".wrap("00BDFF", 10).purple.cap(h[0].exploit.r8).purple+NL+BL+"ZONE".wrap("00BDFF", 10).purple.cap(h[1].memory.grey).purple+NL+BL+"ADDR".wrap("00BDFF", 10).purple.cap(h[2].string.grey).purple
			if h.len > 4 then s = s+NL+YL+"*".white+"REQUIRES".grey+"*".white+NL+h[4]["requirements"]
			LOG(s)
		end for
	end if
end function
Core["api"] = function(o, act, f1=null,f2=null,f3=null,f4=null)
	if act == null then return LOG("Invalid args, what args? idk wip")
	// new server + api
	if act == "-new" then// new connection to existing api
		if not f1 then f1 = INPUT("Specify ip".prompt)
		if not f2 then f2 = INPUT("Specify port".prompt).to_int
		if not f3 then f3 = INPUT("Specify memory zone".prompt)
		if not f4 then f4 = INPUT("Specify memory address".prompt)
	else if act == "-build" then 
		return SS.Server.svc_build(o, "api")
	else if is_valid_ip(act) != null then 
		// existing api
		if SS.cfg.api1 != null and f1 == null then f1 = SS.cfg.api1 else f1 = INPUT("specify api ip:".prompt)
		if SS.cfg.api2 != null and f2 == null then f2 = SS.cfg.api2 else f2 = INPUT("specify api port:".prompt)
		if SS.cfg.api2 != null and f3 == null then f3 = SS.cfg.api3 else f3 = INPUT("specify api memory zone:".prompt)
		if SS.cfg.api3 != null and f4 == null then f4 = SS.cfg.api4 else f4 = INPUT("specify api memory address:".prompt)
	end if
	api = new SS.API.map(SS.cmx,f1,f2,f3,f4)
	req = api.get
	if req isa number then return LOG("API error: ".warning+req)
	

end function
Core["test"] = function(_, a=null)

	if a == null then 
		SS.BAM.handler(SS.s, SS.CMD.getOne("iget"), ["mail"])
		LOG("Mailbox: ".sys+SS.bamres.fetch.len)
	end if

	for i in range(1, 100)
		LOG("ProgressBar100".progressBar(i, 100))
	end for
	for i in range(1, 10)
		LOG("ProgressBar10".progressBar(i, 100))
	end for
	for i in range(1, 25)
		LOG("ProgressBar25".progressBar(i, 100))
	end for
	for i in range(1, 50)
		LOG("ProgressBar50".progressBar(i, 100))
	end for
	//if a != null then
	//	id = INPUT("Select an ID to delete: ".prompt) 
	//	d = SS.bamres.delete(id)
	//	if d isa string then LOG(d.warning)
	//	if d == 1 then LOG("Deleted email: ".ok+id)
	//end if

	//=============================== RIPPLE ===============================
	//LOG("Test function in the ocean".ocean+"<sprite=0>".oc)
	//SS.Man = {}//MANUAL
	//SS.Man["-h"] = {
	//	hl:  "Test help",//HEADLINE,
	//	pa: [ {"a:":"*" "label": "command name","o":true,"d":true} ],
	//	f1: []
	//}
end function
///======================= SS.CMD LIST =========================////
// name desc params usage cb run 
SS.CMD.list = [
	// 	//////////////////////////////////    // SEASHELL
	["-h", "Displays all SeaShell commands", ["*"], "* no arguments --> prints all registered commands\n[cmdName] --> gives detailed information on most commands", null, @SS.CMD["cmd_list"]],
	["-e", "Exit Surf Mode", [], "As you pass objects, SeaShell will create a new surf loop, using -e will help you close these".grey, "result", SS["quit"]],
	["-c", "Clear the screen", [], "Clears the screen", null, @CLEAR],
	["-t", "Start a terminal", [], "Starts a terminal on the object, requires a shell".grey, "result", @Core["terminal"]],
	["-d", "Decipher a hash", ["*", "-c|-d|*"], "Decipher a hash".grey.NL+"* [path] --> Path of file to decrack\n* [-c|-d] --> -c uses CryptoLib, -d uses HashTables (reccomended)", null, @Core["cipher"]],	
	["!", "Launch a binary file", ["*", "*", "*", "*", "*"], "Launches a binary".grey.NL+"-e --> launches eel\n-s --> launches ss in surf_mode\n[path] [arg*] --> define a path to launch ex: ! /bin/nslookup www.google.com".NL+"MULTIPLAYER: DO NOT USE THIS COMMAND ON UNTRUSTED BINARIES".red, "general", @Core["launch"]],
	
	["-anon", "Toggle anonymous mode", ["-s|*"], "Tries to hide as many IPs as possible,".grey.NL+" streaming mode made this rather obsolete but good to have", null, @Core["anon"]],
	["-dev", "Toggle debug mode", ["-s|*"], "debugging mode, no need to worry", null, @Core["dev"]],
	["-og", "Toggle original artwork", ["-s|*"], "This is old art from all previous versions of SeaShell, nostaliga trumps concisiveness", null, @OGT],
	["-cfg", "SeaShell configuration tool", ["build|*","*","*"], ("SeaShell Config, use flag ""build"" for full installation").grey.NL+"* --> prints general config info\n-i --> host config info"+NL+"-e|-h [-b|-d] --> manage hash and exploit databases"+NL+"-u|-m|-ccd [-b|-d] --> user|macros|cache build|delete manage user config.\n-u [setting] [option] change SeaShell config options using premade flags\nEach part can be created individually, or for a fresh full install use flag -ccd or -install".NL+"USER CONFIG FLAGS".NL+"anon [1|0] --> anonymous mode".NL+"art [1|0] --> classic art mode".NL+"anon [1|0] --> anonymous mode".NL+"hackip [ip] --> hackshop ip".NL+"api1 [memoryzone] --> api value 1".NL+"api2 [memoryaddr] --> api value 2".NL, null, @SS["getHost"]],
	["apt", "APT client update tool", ["*|-u|--", "*|-f"], "APT Client".grey.NL+"install [libName] --> install a package\n-u --> updates the machine\n-- [*|-f] upgrades the machine, use -f to force update all\naddrepo [ip] --> add a new repository\ndelrepo [ip] --> remove a new repository\search [lib] --> searches for all packages\show [ip] --> shows all packages in a repo\n", null, @Core["apt"]],
	["cache", "*Manage captured objects, sessions, networks*", ["-o|-ns|-net", "*|-c"], "SeaShell Main Cache".grey.NL+"-o --> exploit object cache, the results from ns|entry|local|shellget|shellfish etc".NL+"-ns --> net sessions captured during the entry|ns phase".NL+"-net --> networks, a WIP", "result", @SS["getMemCache"]],
	["sudo", "Perform actions as specified user|root", ["-s|-u|*", "*"], "-s --> launch a root shell\n-u [user] --> switch user\n[path] [arg] --> invoke commands\n**sudo can only get new shells on the machine running the script\nthis means youll need to launch with cmd ! [-s|path_to_ss] to get a new shell for remote objects", "result", @Core["sudo"]],
	["secure", "Secure PC permissions [requires root]", ["-s|-h|-p", ], "-s --> secures a server config\n-h --> secure home config\n-p --> attempts to patch the system to working order", "general", @Core["secure"]],
	["wipe", "System|Log|Tool wipe", ["-s|-l|-t"], "-t --> this will wipe any SeaShell items from the machine\n-l --> will wipe the server logs\n-s --> will wipe the SYSTEM", "general", @Core["wipe"]],
	//////////////////////////////////    // COMPUTER
	["cd", "Change SS working directory", ["*"], "Change working directory".grey.NL+".. represents parent directory".NL+". represents parent's parent", "general", @Core["cd"]],
	["ls", "[path] List directory contents", ["*"], "* no arguments --> lists the cwd\n[path] --> list all files at the path", "general", @Core["ls"]],
	["pwd", "Print working directory", [], "Print SeaShell's working directory".grey, null, @Core["pwd"]],
	["ps", "Computer process list", ["*"], "List computer processes, use additional flag to enter resmon".grey, "general", @Core["ps"]],
	["kill", "Kill a specified process", ["*", "*"], "[*pid|*name|-a]".grey.NL+" [-a|*]\npid --> with no argument will close the pid\nname --> with no argument will close the first program containing the name, use -a for all ".NL+"-a --> use -a -a to kill all", "general", @Core["kill"]],
	["user", "Prints current user | Add/Del User", ["-a|-d|*", "*"], "User manager".grey.NL+"-a [username] --> add a user\n-d [username] --> delete a user", "general", @Core["me"]],
	["passwd", "Change a user's password [requires root]", ["*"], "Password changer".grey.NL+"[user] --> this requires root permission", "general", @Core["passwd"]],
	["groups", "Group View | Add/Del Group", ["-a|-d|*", "*", "*"], "Groups manager".grey.NL+"-a [username] [group] --> add a group\n-d [username] [group] --> delete a group", "general", @Core["groups"]],
	["touch", "Creates a file in specified directory", ["*", "*"], "It makes a file".grey.NL+"[path|name] [?name]", "general", @Core["touch"]],
	["build", "Build binary from specified directory", ["*","*","*" ], "It compiles a file into a binary".grey.NL+"[srcPath] [buildPath] [import] Build a src file into a compiled binary", "general", @Core["build"]],
	["mkdir", "Creates a folder in specified directory", ["*", "*"], "Make a folder".grey.NL+"[path|name] [?name]".NL+"If not specified as a path, mkdir [name]", "general", @Core["mkdir"]],
	//////////////////////////////////    // FILE
	["fs", "Search the filesystem", ["-f|-i", "*"], "Can't find a file? Use me".grey.NL+"[find] [name] --> search for any file with this name".NL+"[inject] [name|-a] --> file injection function", "general", @Core["fs"]],
	["cat", "Show contents of a file", ["*"], "File content, what's in there?".grey.NL+"[path]", "general", @Core["cat"]],
	["chmod", "Changes file permissions", ["-r|-d", "*", "*"], "Change file's permissions".grey.NL+"[-r|-d] permissions path", "general", @Core["chmod"]],
	["chgrp", "Changes file group", ["*", "*", "*"], "File group manager".grey.NL+"[-r|-d] groupname path", "general", @Core["chgrp"]],
	["chown", "Changes file owner", ["*", "*", "*"], "File owner manager".grey.NL+"[-r|-d] ownername path", "general", @Core["chown"]],
	["copy", "Copies file to the specified directory", ["*", "*", "*"], "Copy a file".grey.NL+"[dir] [dest] [name]", "general", @Core["copy"]],
	["move", "Moves file to the specified directory", ["*", "*"], "Move a file".grey.NL+"[dir] [dest]", "general", @Core["move"]],
	["rm", "Deletes the specified file/directory", ["*"], "DELETES".grey.NL+"general", "general", @Core["rm*"]],
	["rn", "Rename a file/directory", ["*", "*"], "RENAMES".grey.NL+"[path] [name]", "general", @Core["rn"]],
	["edit", "Edit contents of a file", ["*", "-c|*"], "File Editor, improved!".grey.NL+"PRIMARY ARGUMENT: ".grey.b+"filePath".NL+"DETAILS".grey.b.NL+"INSERT mode makes use of ANYKEY, meaning it registers single key inputs".lblue+NL+"Use the arrow keys to navigate the file, use the commands on top to perform key actions".NL+"Characters can also be inserted into the text at the cursor position (hence the name!)".NL+"Your cursor will be notated by a white box, this is wip and at times cursor will not highlight on blank lines, or end of line".NL+"PASTE mode allows an entire user_iput to be entered, paste mode also has command functionality".purple+"Refer to the col, and line to reference XY pos", "general", @Core["edit"]],
	//////////////////////////////////	// SERVICE
	["ssh", "Create SSH connection *requires SSH", ["*", "*"], "Connect to a ssh service".grey.NL+"p1: user@ip"+NL+"p2: port, default is 22", "result", @Core["ssh"]],
	["scp", "Upload/Download files *requires SSH", ["-u|-d", "*", "*"], "Secure copy protocol".grey.NL+"-d [remote path] [destination] --> download remote files, destination defaults to cwd"+NL+"-u [target path] [destination] --> download remote files, destination defaults to cwd", "general", @Core["scp"]],
	["ftp", "Create FTP connection", ["*", "*"], "Connect to a ftp service".grey.NL+"p1: user@ip"+NL+"p2: port, default is 21", "result", @Core["ftp"]],
	["put", "Upload file remotely *require FTP", ["*", "*"], "File Transer Protocol, or is it fish?".grey, "general", @Core["put"]],
	["get", "Download file remotely *require FTP", ["*", "*"], "File Transfer Protocol, or is it fish??".grey, "general", @Core["get"]],
	["proxchain", "Server proxy tunnel", ["-b|-d", "*"], "Proxy server connection tool".grey.NL+"PRIMARY ARGUNEMTS".grey.NL+"-b --> bounce from 1 machine to another, wipes logs along the way".NL+"-d [?amount] --> dirty bounce, hacks routers of random networks wiping logs along the way", "result", @Core["proxybounce"]],
	//////////////////////////////////	// NETWORK
	["ping", "Ping a specified device", ["*"], "Ping a device, doesn't account for firewalls".grey, "general", @Core["ping"]],
	["ifconfig", "Configure Internet Connection", ["*", "*", "*"], "Configure internet connection".grey.NL+"Internet/Ethernet", "general", @Core["ifconfig"]],
	["iwconfig", "Connect to WIFI", ["*", "*", "*", "*"], "WiFi connect".grey.NL+"[netdevice][essid][bssid][password]\nex: iwconfig wlan0 E3:AD:BD.. Aquarium Password", "general", @Core["iwconfig"]],
	["iwlist", "List WIFI networks", ["*", ], "WiFi info".grey.NL+"[device] ex: iwlist wlan0", "general", @Core["iwlist"]],
	["airmon", "Manage Monitor Mode", ["start|stop", "*"], "WiFi monitor".grey.NL+"[action] [device] --> begin to start or stop monitoring mode\nex: airmon start wlan0", "general", @Core["airmon"]],
	["aireplay", "WIFI Frame Injection", ["*", "*", "*"], "WiFi injector".grey.NL+"[essid] [bssid]\nMonitor and listen for ACKS", null, @Core["aireplay"]],
	["aircrack", "Key Cracking Program", ["*"], "WiFi cracker".grey.NL+"[path] specify a file path for aircrack to generate the key", "general", @Core["aircrack"]],
	["smtp", "List mail users", ["*", "*"], "Mail server when".grey.NL+"[addr] [port]", "Works exactly like smtp-users-list", @Core["smtp"]],
	["sniff", "Sniff device for incoming connections", [], "Network sniffer".grey.NL+"Works exactly like sniffer", null, @Core["sniff"]],
	["nslookup", "[domain] Returns ip of a domain", ["*"], "Domain lookup".grey.NL+"Works exactly like nslookup", null, @Core["nslookup"]],
	["whois", "[ip] Network administration info", ["*"], "Network lookup".grey.NL+"Works exactly like whois", null, @Core["whois"]],
	["router", "Simple router scan", ["*"], "Router lookup".grey.NL+"Works exactly like a scanrouter", null, @Core["router"]],
	["nmap", "Network mapping tool", ["*", "*"], "Network mapping tool".grey.NL+" [addr] [flag?]\nflags:\n-w --> with whois \n -a --> full assesment of whois, router info, etc.", null, @Core["nmap"]],
	["scanlan", "Visual local network mapping", [], "Poor Man's scanlan".grey, null, @Core["scanlan"]],
	//////////////////////////////////	// NETWORK OFFENSE
	["ns", "Manual NetSession hack, works similar to entry", ["*","*","*","*"] , "NetSessionHacking".grey.NL+"[addr] [port] [action|null] [data|null]".NL+"[addr] target address".NL+"[port] target port".NL+"[action|memory zone]".NL+"-s --> select specific exploits to overflow".NL+"-a --> exploit all vulnerabilities".NL+"[data|memory value]".NL+"* --> defaults to unsecure password change".NL+"*LAN --> attempts lan bounce".NL+"*PW --> changes pw to given value", null, @Core["ns"] ],
	["entry", "Hack on rails, enter an ip|domain to begin. entry -r for random", ["*", "*"], "AutoHacking".grey.NL+"Designed to work like earlier versions of SeaShell\n* Enter an IP/LAN/Domain as the command name to utilize this feature\nYou can also use entry -r for a random ip", "result", @Core["entry"]],
	["fish", "Hunt for specified lib | port", ["*", "*", "*"], "NetSessionHacking".grey.NL+"[-p|libname] [port|version] [amount*]\nFish is your primary way to look for targets\n-p [port] [amount*] if amount is specified, it will not start entry", "general", @Core["fish"]],
	["local", "Local library exploitation", ["*", "*"], "LocalHacking".grey.NL+"Local hacking tool, use first argument -a|-s to use all, or selective amount of exploits\nOur second argument is either the name of the lib, or use -a to hack them all!", "general", @Core["localhax"]],
	["rshell", "MX rshell interface + more", ["*", "*", "*"], "RemoteHacking".grey.NL+"rshell function still wip\n-l --> Rshell Interface\n-p [?ip] [?name] --> plant an rshell client\n! --> run a payload on the clients (will prompt for command)\n-depo --> deposits logs of all rshells\n-wipe-logs --> wipe all logs", "result", @Core["rshell"]],
	["mx", "Load an aquired metaxploit lib", ["*|-clear"], "LocalHacking".grey.NL+"This command is a replacement for mount, you use it to load metaxploit to a host.".NL+"With no argument, mx will return a new MX object from the current host. Use -clear to revert to SS mx", "general", @Core["loadmx"]],
	["crypto", "Load an aquired crypto lib", ["*|-clear"], "LocalHacking".grey.NL+"With no argument, crypto will return a new crypto object from the current host. Use -clear to revert to SS crypto", "general", @Core["loadcrypto"]],
	["apt-get", "Load an aquired apt lib", ["*|-clear"], "LocalAPTUsage".grey.NL+"With no argument, crypto will return a new apt object from the current host. Use -clear to revert to SS apt", "general", @Core["loadapt"]],
	/////////////////////////////////  // TOOLS & OTHER
	["svc", "Manage services [action] [service] [data]" , ["*", "*", "*"], "-l --> Lists the services installed\n-i [name] --> install a service\n-s/-k [name] --> starts/stops a service", "general", @Core["service"]],
	["mount", "Mount binaries to shell objects", ["*", "*"],  "Quick File Transfer *Deprecated*".grey.NL+"-a --> mounts all files [ss,mx,crypto,sf]\n-p --> pivot mount".NL+"To use seashell command on a remote host without needing to upload seashell directly, use the crab prefix on a command. Need root? Try crab shellget ; cache -o".NL+"Need MX loaded on this host ? Use command mx", "general", @Core["mount"]],
	["proxy", "Proxy|Service|API server builder", ["*","*"], "Eazy Proxy Builder".grey.NL+"Primary arguments".grey.b.NL+"-build --> build a simple proxy server, will transfer cache from host to remote".NL+"[-repo | -rshell | -http] --> specify these services to be built on this proxy","general", @Core["proxy"]],
	["site", "Manage Local Website", ["-b|-d", "*|html"], "WebsiteBuilder".grey.NL+"arguments [build|delete] [bank|hack|isp]".NL+"Build or delete a predefined website, perhaps a folder will be added for html of choice", null, @Core["webmanager"]],
	//["sea", "[action] [recon] [bam] <i>Collects all objects</i>", ["*", "*","*" ], null, null, @Core["exp.mass_loop"]],
	["db", "Exploit database search", ["*", "*"], "Exploit Database Viewer".grey.NL+"PRIMARY ARGUMENTS".NL+"[lib] [version|action]", null, @Core["db"]],
	["api", "Utilize the SeaShell api", ["*"], null, "general", @Core["api"]],
	["crab", "Command Relay Access Bridge: used in addition to other commands".crab, ["*", "*", "*", "*"], ("C".red+"ommand "+"R".red+"elay "+"A".red+"ccess "+"B".red+"ridge is a remote option for using local SeaShell commands, and specified payloads").white.NL+"\n[cmd|info|module] [args]\nex: crab sudo -s | crab scanlan".grey.NL+"In essence, CRAB acts as a way to use commands that you can only use on a machine that you have originated from, get_shell | get_router for example.".lblue.NL.NL+"Try using".lblue+(" ""sudo -s""").red+" on a captured shell from ".lblue+("""entry/ns""").grey+" and it's root pw, this will fail, what you need to use is ".lblue+("""crab sudo -s""").green+" with that shell's password.".lblue.NL+"<u>This has now allowed you to use SeaShell as if it was uploaded to the target shell, without needing to transfer any files.".lblue.NL.NL+"This can be used in combination with all SeaShell commands, and in correct combination can result in quick and efficient pivoting through networks".grey, "result", @Core["crab"]],
	["surf", "New surf loop on current shell host, works like a toggle for crab", [], "Begin surfing on a new host, essentially a toggle for crab.\nSurf Mode is a recursive loop of the main program, you can use this to loop and perform local operations on remote hosts".NL+"This will allow you to use commands like 'sudo' instead of having to specify its being used with crab like ""crab sudo""", "result", @Core["surf"]],
	["raft", "NPC mission competion".raft, ["-c|-p|*", "*", "*", "*"], "Remote Assignment Fulfillment Tool: simply sign up and reply to the remaining emails".NL.raft+"Primary arguments:".grey.b.NL+"-c --> corruption missions".cyan+NL+"-p --> credentials missions".cyan+NL+"-clear --> clears any mission emails from inbox".cyan.NL+"-monitor --> used when R.A.F.T is running on another SeaShell, to monitor its progress *MUST USE -l FLAG ON SeaShell USING R.A.F.T*".cyan.NL+"FLAGS can be added in any combination in this command".b.grey.NL+"-d --> deletes failed missions".lblue+NL+"-n --> gives mission logs".lblue+NL+"-l --> generate mission logs".lblue.NL+"!s --> skip tsunami with no confirmation".NL.lblue+"?s --> prompt tsunami skip".lblue.NL+"ex: raft -c -d -n".grey, "general", @Core["npc"]],
	//////////////////////////////////	// DICT OFFENSE
	["shellfish", "Local shell ""brute force"", surfs on new host *hash database*", ["*"], "Shell -> Surf".grey.NL+"Shellfish is a brute force shell getter, utilizing the hash database it will try to return a shell.\nIt's important to note that on success, this will launch a surf mode on the new host. Meaning crab is enabled by default.", "result", @Core["shellfish"]],
	["shellget", "Local shell ""brute force"", adds shell to cache *hash database*", ["*"], "Shell -> cache".grey.NL+"Shellget works exactly as shellfish does, the only difference is that it does NOT start a surf mode loop on the host\nThis is useful when you simply want to add a root shell to the object cache", "general", @Core["shellfish"]],
	["tsunami", "SSH/FTP ""brute force"" connection *hash database*", ["*", "*", "*", "*"], "Shell -> Surf".grey.NL+"[ip][user][port][protocol]\nTSUNAMI is a brute force logging tool, it utilizes the hash database to find NPC passwords, results not garunteed!", "result", @SS.MD5["connect"]],
	["mailfish", "NPC mail ""brute force"" *hash database*", ["*"], "Mail Fisher".grey.NL+"Mail login brute force, simply provide a email address, results not always garunteed but is a great pivoting resource", null, @SS.MD5["mail"]],
	["wifish", "WiFi ""brute force"" *hash database*", ["*", "*"], "WiFi Fisher".grey.NL+"[netdevice] [bssid] [essid], unfortunately this seemingly is the least effective dictionary attack, seriously try something else!", "general", @SS.MD5["wifish"]],
	["ezwifi", "WiFi ""all in one"" *crypto/hash database*", ["*", "*", "*"], "WiFi Getter".grey.NL+"This command is meant to crack all wifis in your proximity".NL+"FLAG CAN BE USED IN ANY COMBINATION WITH THIS COMMAND".grey.NL+"-d --> will use the hash database for a dictionary attack, good for large ack counts!".NL+"-f --> force cracking with no confirmation".NL+"-l --> logs results to WIFI.db, USE THIS TO ENABLE WIBOUNCE".NL+"-monitor --> secondary seashell instance can track the progress of WIFI.db", "general", @Core["ezwifi"]],
	["wibounce", "WiFi bouncer", ["*", "*", "*"], "WiFi bouncer".grey.NL+"Using database file WIFI.db, it will connect via wifi to all the addresses.".NL+"file line format: netDevice bssid essid password", "general", @Core["wibounce"]],
	["spearfish", "PVP player finder", ["*", "*", "*", "*", "*"], "PVP".grey.NL+"PRIMARY ARGUMENTS".grey.NL+"[*ip|-r|-list] --> specify a ip or use -list to use ss.logs/PONDS.db, requires having created the file or running using -log flag".NL+"ADDITIONAL FLAGS CAN BE USED IN ANY ORDER ON THIS COMMAND".grey.NL+"-log --> logs".NL+"-loop --> loop, used in addition to providing an ip, to start with the primary ip", "general", @Core["spearfish"]],
	//////////////////////////////////	// MISC
	["test", "testing function", ["*"], null, "general", @Core["test"]],
	["md5", "String -> md5", ["*"], "A simple md5 hash conversion, its important to note these md5s do not work the same as the md5s from password hashes, try f1shbowl and decipher it", null, @Core["md5"]],
	["iget", "*InternalUse*", ["*", "*", "*", "*", "*", "*"], "Theres nothing to know about this command, you should not be using it!", "general", @Core["iget"]],
	["quit", "Exit SeaShell", [], "A full exit from SeaShell, kills all surf mode loops", null, @EXIT],
]
///======================= Command.Relay.Access.Bridge =========================////
SS.BAM = {}
SS.BAM.bamstring = "LOG = @print;INPUT = @user_input;HOME = @home_dir;T = @typeof;NL = char(10);COLUMNS = @format_columns;CLEAR = function; return clear_screen; end function;"
SS.BAM.bamstring = SS.BAM.bamstring+"SS = get_custom_object;SS.mutate;BL='|'.lblue;YL='|'.yellow;RL='|'.red;LOG(('Now walking. . .').crab.sys);args = SS.bamargs;if args.len == 0 then;if SS.bamrun.cb == 'general' then ; SS.CMD.invoke(SS.o, SS.bamrun.name);else if SS.bamrun.cb == 'result' then ;SS.bamret = SS.CMD.invoke(SS.o, SS.bamrun.name);else ;SS.CMD.invoke(SS.o, SS.bamrun.name);end if;else if args.len == 1 then ;if SS.bamrun.cb == 'general' then  ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args[0]);else if SS.bamrun.cb == 'result' then ;SS.bamret = SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args[0]);else ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args[0]);end if;else if args.len > 1 then ;if SS.bamrun.cb == 'general' then  ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args.join(' '));else if SS.bamrun.cb == 'result' then ;SS.bamret = SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args.join);else ;SS.CMD.invoke(SS.o, SS.bamrun.name+' '+args.join);end if;end if;if SS.bamret != null and SS.bamret != 'exit' then SS.CMD.result(SS.bamret)"
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
	return ret
end function
SS.BAM.handler = function(o, cmd, args, isModule = null)
	if T(o) != "shell" then ; LOG("must be of type shell for crab".warning); return;end if;
	SS.o = o
	SS.bamrun = cmd
	SS.bamargs = args
	SS.bamret = null
	SS.bamhost = get_shell
	if isModule == null then
		if cmd["cb"] == "result" then return self.run(o, self.bamstring)
		self.run(o, self.bamstring)
	else
		if cmd["cb"] == "result" then return self.run(o, self.frun(cmd["string"]))
		self.run(o, self.frun(cmd["string"]))
	end if
end function
SS.BAM.run = function(o, s)
	if T(o) != "shell" then return
	h = SS.Utils.goHome(o)
	hp = h
	if h == "/" then hp == ""
	launcher = SS.Utils.fileFromPath(o, hp+"/sf.src")
	payload = null
	if launcher == null then
		o.host_computer.touch(h, "sf.src")
		hp = "sf.src"
		launcher = SS.Utils.fileFromPath(o, h+"/sf.src")
		if launcher == null then; LOG("An error occured in creation ".warning+h); return; end if;
		payload = launcher.set_content(self.frun(s))
	else if launcher.has_permission("w") then 
		payload = launcher.set_content(self.frun(s))
	else
		LOG("Something else happens".warning) 
		return 
	end if
	if T(payload) == "string" then; LOG("An error occured in setting crab: ".warning+payload); return; end if;
	compile = o.build(launcher.path, h, 0)
	launcher.set_content("><> ><> ><>")
	if T(compile) == "string" and compile.len > 1 then; LOG("An error occured in compilation of crab: ".warning+compile); return; end if;
	launched = o.launch(launcher.path[:-4])
	if launched == null then; LOG("An error occured launching crab".warning); return; end if;
end function
SS.BAM.modules = [
	{"name":"module", "desc":"", "params":[], "usage":"something helpful", "cb":"general", "string":"print('hello there world')"},
]

//////////////////////////////////////////////////////////////  
///======================= CORE =========================////
////////////////////////////////////////////////////////////
