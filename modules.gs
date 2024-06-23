//////////////////////////////////////////////////////////////  
///====================== MODULES =======================////
////////////////////////////////////////////////////////////
///======================== MAIL =========================////
SS.NPC = {}
SS.NPC.fixmekuro = null// MetaMail
SS.NPC.mailacct = null
SS.NPC.maillpw = null
SS.NPC.fml = null
SS.NPC.results = []
SS.NPC.results2 = []
SS.NPC.d = false 
SS.NPC.n = false
SS.NPC.u = []// users
SS.NPC.pw = []// pw_changes
SS.NPC.tusers = []//target users
SS.NPC.tl = null//target lan
SS.NPC.cache = [] // object cache
SS.NPC.shellips = []
SS.NPC.disables = []
SS.NPC.p4t = false//prompt for tsunami
SS.NPC.skip = false// force skip tsunami
SS.NPC.logger = false
SS.NPC.storeshell = function(eo)// TODO: fixme
    if T(eo) == "shell" then 
        neo = new SS.EO
        neo.map(eo)
    else if self.shellips.indexOf(eo.ip) then 
        self.cache.push(eo)
    end if
end function
SS.NPC.mission = function(o, mission, del = null, notes = null, force=null)
    self.fixmekuro = null
    cmd = SS.CMD.getOne("iget")
    SS.BAM.handler(o, cmd, ["mail"])
    if T(SS.bamres) == "string" then return LOG(SS.bamres.warning)
    if T(SS.bamres) != "MetaMail" then return LOG("MetaMail login failed".warning)
    self.fixmekuro = SS.bamres
    if T(self.fixmekuro) == "string" then return LOG(self.fixmekuro.warning)
    LOG(("Analyzing metamail. . .".sys)+NL+("Launching raft. . .").raft.sys);start = time;
    ret = "";g=0;c=0;
    self.d = false; self.n = false;self.p4t = false;self.skip=false;self.logger = false
    args=[]
    if del != null then args.push(del)
    if notes != null then args.push(notes)
    if force != null then args.push(force)
    if args.indexOf("-d") != null then self.d = true 
    if args.indexOf("-n") != null then self.n = true
    if (args.indexOf("-l") != null) or (mission == "-monitor") then self.logger = true
    logbot = null
    if self.logger == true then ;logbot = new SS.Logger;logbot.map("RAFT", true);end if
    if self.logger == true and ((args.indexOf("-monitor") != null) or( mission == "-monitor")) then return logbot.monitor("")
    if (args.indexOf("?f") != null) and (args.indexOf("!f") == null) then self.p4t = true 
    if (args.indexOf("!f") != null) and (args.indexOf("?f") == null) then self.skip = true 
    if mission == "-clear" or (del == "-clear" ) then
        LOG("Clearing mailbox . . .".sys) 
        m = self.fixmekuro.fetch();sw = null
        if m.len > 250 then sw = true; swc = 0
        for plz in m
            m = plz.split(NL)
            id = m[2].split(" ")[1]
		    if m[4] != "Subject: Mission Contract" then continue
            d = self.fixmekuro.delete(id)
            if d isa string then LOG(d.warning)
            if d == 1 then LOG("Deleted email: ".ok+id)
            if sw then
                swc = swc+1 
                if swc == 100 then                  
                    wait(5); LOG("Giving the script some room to breathe;");
                end if
            end if
        end for
        return
    else if mission == "-inbox" then 
        return LOG("Mailbox: ".sys+self.fixmekuro.fetch.len)
    end if
    LOG(("Beginning NPC mission completion. . .".grey.sys).raftPic)
    for plz in self.fixmekuro.fetch()
        target = "any"
		target_ip = null
		target_lan = null
        m = plz.split(NL)
        id = m[2].split(" ")[1]
		if m[4] != "Subject: Mission Contract" then continue
        content = self.fixmekuro.read(m[2].split(" ")[1])
		// OBJECTIVE STATEMENT
		word = content.split(NL)[3].split(" ")
        label = "error"
		// OBJECTIVE DETAILS
		detail = content.split(NL)[4].split(" ")
        if mission == "-p" then // credentials
            if word[5] != "credentials" then continue
			label = "credentials"
			if word[7] == "the" then target = word[9].replace("\<b\>", "")[:-5]
			LOG("NPC: ".grey+word[5])
			target_ip = detail[7].replace("<b>", "").replace("</b>","")[:-1]
			target_lan = detail[25].replace("<b>", "").replace("</b>","")
		else if mission == "-c" then 
            if word[7] != "stop"  then continue // corrupt system
			label = "system corruption"
			LOG("NPC: ".grey+"Corrupt")
			LOG(content.split(NL)[3])
            target_ip = detail[7].replace("<b>", "").replace("</b>","")[:-1]
            target_lan = detail[25].replace("<b>", "").replace("</b>","")
		//else if mission == "-fd" then 
        //    if word[5] != "delete"  then continue // delete remote file
		//	label = "file deletion"
		//	LOG("NPC: ".grey+"Remote File [delete]")
		//	detail = content.split(NL)[5].split(" ")
        //    target = detail[22].replace("<b>", "").replace("</b>","")[:-1]
        //    target_ip = detail[7].replace("<b>", "").replace("</b>","")[:-1]
        //    target_lan =detail[18].replace("<b>", "").replace("</b>","")
		//else if mission == "-fg" then
        //    if word[10] != "get" then continue
		//	label = "file retrieval"
		//	LOG("NPC:".grey+"Remote File [delete]")
        //    detail = content.split(NL)[5].split(" ")
        //    target = detail[22].replace("<b>", "").replace("</b>","")[:-1]
        //    target_ip = detail[7].replace("<b>", "").replace("</b>","").trim
        //    target_lan =detail[18].replace("<b>", "").replace("</b>","")
		end if
        if SS.debug then LOG(word)
        result = null
        result = self.run(id, label, target, target_ip, target_lan)
        reslabel = "FAILED".red.b;c = c+1;
        if result != null then 
            reslabel = "COMPLETE".green.b
            g = g+1
        else 
            if self.d then self.fixmekuro.delete(id)
        end if
        restring = (" ".fill).red+NL+"Mission Tasks Complete".ok+NL+(label.lblue.b+" - "+reslabel).title.NL+" Target ".wrap.cap(target).NL+" IP ".wrap.cap(target_ip).NL+" LAN ".wrap.cap(target_lan).NL+" DAT ".wrap.cap(result)+NL+" NOTE ".wrap.cap(self.results[self.results.len-1])
        if self.n then restring = restring.NL+self.results2[self.results2.len-1]
        LOG(restring)
        if (self.logger == true) and (logbot != null) then
            d = (label+" "+target_ip.a+" "+target_lan+" "+self.results[self.results.len-1])
            //if self.n then d = d+NL+self.results2[self.results2.len-1]
            cr = "COMPLETED: ".raft
            logbot.entry( d,(cr+str(c)))
        end if
        ret = ret+restring+NL
    end for
    if g == 0 then ratio = 0
    if g > 0 then ratio = floor((g/c)*100)
    if ratio > 75 then 
        ratio = str(ratio).green
    else if ratio > 51 then 
        ratio = str(ratio).lblue
    else if ratio > 30 then
        ratio = str(ratio).yellow
    else 
        ratio = str(ratio).red
    end if
    LOG("".fill.NL+"Mission(s) Summary".title+("["+"Completion".grey.s+ratio+"%".white+"]")+NL+ret+NL+("Analyzing results. . .".raft).sys.NL+"passed".wrap.cap(str(g))+NL+"total".wrap.cap(str(c))+NL+"percent".wrap.cap((ratio+"%".white))+NL+"time".wrap.cap(SS.Date.timer(start, true))+NL+"logged".wrap.cap(self.logger))
    self.fixmekuro.fetch
    self.fixmekuro = null
    //SS.BAM.handler(o, cmd, ["mail"])
end function
//TODO: find the missing end if, im almost positive there is one
SS.NPC.run = function (id, label, target, target_ip, target_lan)
    LOG("".fill+"MISSION START".b.title.b.NL+"ID: ".white+id.NL+"TYPE: ".white+label.NL+"TARGET: ".white+ target.NL+"IP: ".white+ target_ip.NL+"LAN: ".white+ target_lan.NL+"".fill)
    sumstring = "*"+"Mission Log".lblue+"*"
    self.results = SS.NPC.results
    self.results2 = SS.NPC.results2
    self.results = []// refesh our list, even though you should restart ss to reuse this god forsaken command
    self.results2 = []
    result = null
    r0 = null // gateway router ns
    r0shell = null // remote shell exploit object
    l0 = null // local network
    l_mx = null// local mx
    fwd_ports = []// fwd ports
    prime_ports = []// ports our machine is running remotely
    local_ports = []// services running locally on the network
    prime_local = []// serivces our machine is running locally
    metaxs = []// local metaxploits that we get along the way
    p_r_sessions = []// PRIME remote sessions
    r_sessions = [] // MIDS remote sessions
    p_l_sessions = []//local sessions
    m_l_sessions = []
    p_r_obj = [] // PRIME remote objects
    r_obj = []// MIDS remote objects
    p_l_obj = []// PRIME local objects
    l_obj = []// PRIME local objects
    rem_last = []// remote last options
    loc_last = []// local last options
    self.pw_changes = SS.NPC.pw
    globals.tu = SS.NPC.tusers
    tl = target_lan
    sh = false
    dat_sw = SS.cfg.unsecure_pw//data switch
    need_new_shell = false
    _t = function(eo, label, target_lan)
        task = null
        if SS.debug then LOG("NPC:task:completion ".debug+"eo: ".white+eo.type+" eolan: ".white+eo.lan+" target: ".white+target_lan)
        if eo.type == "shell" and eo.is != "root" then eo.escalate
        if label == "credentials" then
            task = eo.credentials(target)
        else if label == "system corruption" then
            task = eo.sys_kill(target_lan)
        else if label == "file_deletion" then 
            task = eo.file_kill(target, target_lan)
        else if label == "file_retrieval" then  
            task = eo.file_get(target, target_lan)
        end if
        return task
    end function
    _check = function(l, lan)// check for local network
        if l.len == 0 then return null
        if l0 != null then return l0
        for p in l
            SS.BAM.handler(p, SS.CMD.getOne("iget"), ["network", lan])
            if SS.bamres != null then
                l0 = SS.bamres; break; 
            end if;
        end for
    end function
    _mx = function(l)// get a mx lib
        if l.len == 0 then return null
        for p in l
            SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"])
            if T(SS.bamres) == "MetaxploitLib" then
                SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"])
                metaxs.push(SS.bamres)
            end if;
        end for
    end function 
    _loop = function(ns, dat)//loop a ns
        objs = ns.mlib.of(null, dat)
        //if objs.len == 0 then return []
        out=[]
        pw = null
        for o in objs
            if ns.lib != "kernel_router.so" and T(o) == "number" then pw = true
            if (T(o) == "number") or (T(o) == "string") then continue
            eo = new SS.EO
            eo.map(o)
            //eo.escalate
            // if target users hasnt been defined, push them to the list 
            if (SS.NPC.tusers.len == 0) and (eo.lan == SS.NPC.tl) then SS.NPC.tusers = eo.users
            if SS.NPC.tusers.len > 0 and (eo.users == tu) then
                LOG("C2a")
                // file objects might be able to handle the job, lets stop sleeping on them 
                if eo.lan == "Unspecified" then eo.lan = tl
            end if
            if (eo.pc != null) and( pw != null) and (self.pw_changes.indexOf(eo.pc.local_ip) == null) then self.pw_changes.push(eo.pc.local_ip)
            out.push(eo)
        end for
        return out
    end function
    _rloop = function(ns)
        r_obj = []
        o1 = _loop(ns, SS.cfg.unsecure_pw)
        o2 = _loop(ns, target_lan)
        if o1.len > 0 then r_obj = r_obj+o1
        if o2.len > 0 then r_obj = r_obj+o2
        return r_obj
    end function
    //TODO: wrap the file transfer in a launch, to catch IO errors
    _ezb_old = function(eo, ss, tl)
        if eo.type != "shell" then return null
        if T(SS.cfg.wf) != "file" then return null
        LOG("".fill+("Task: Easy Bounce with "+eo.lan.white).title)
        if eo.is != "root" then eo.escalate
        if r0shell == null then r0shell = eo
        div = eo.o.host_computer.File("/lib/init.so")
        if div then div.rename("init.so"+str(floor(rnd*10)))
        wait(0.1)
        if T(div) == "string" then return null
        //SS.bamrgs = SEO
        SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["wl"])
        //drop = SS.s.scp(SS.cfg.wf.path, "/lib", eo.o)
        //if T(drop) == "string" then ; LOG(drop.warning);return null; end if;
        while SS.bamres != 1
            if T(SS.bamres) == "string" then break
            wait(1)
        end while
        if SS.bamres == 1 then
            wait(1)
            SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["mx"])
            if not SS.bamres then 
                LOG("THERE WAS AN ISSUE ACQUIRING MX ON THE BOUNCE MACHINE".error)
                return null
            end if
            _mx = new SS.MX
            _mx.map(eo.o, SS.bamres)
            _mx.l("init.so")
            if _mx.libs.len<1 then return null 
            root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], tl)
            wait(1)
            if root.len < 1 then
                sumstring = sumstring+NL+"Failed to get the root computer".grey
                LOG("THERE WAS AN ISSUE ACQUIRING ROOT COMPUTER".error)
            else
                LOG("Root computer bounce obtained ".red.ok+root[0].local_ip.s+" "+(root[0].local_ip == tl))
                eo = new SS.EO
                eo.map(root[0])
                if (tu.len == 0) and (eo.lan == tl) then tu = eo.users
                task = _t(eo, label, tl)
                if task != null then 
                    sumstring = ss+NL+"Weak library completed the mission".grey
                    SS.NPC.results.push("Completed with root computer bounce")
                    SS.NPC.results2.push(sumstring)
                    return task
                end if
            end if
        else 
            sumstring = sumstring+NL+"Failed to drop the cargo".grey
        end if
        return null
    end function
    _ezb = function(eo, ss, tl)
        if eo.type != "shell" then return null
        if T(SS.cfg.wf) != "file" then return null
        LOG("".fill+("Task: Easy Bounce with "+eo.lan.white).title)
        if eo.is != "root" then eo.escalate
        if r0shell == null then r0shell = eo
        SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["mx"])
        if not SS.bamres then 
            LOG("THERE WAS AN ISSUE ACQUIRING MX ON THE BOUNCE MACHINE".warning)
            return null
        end if
        _mx = new SS.MX
        _mx.map(eo.o, SS.bamres)
        _mx.l(SS.cfg.wf.name)
        if _mx.libs.len<1 then return null
        if SS.cfg.wv == null then SS.cfg.wv = SS.mx.load(SS.cfg.wf.path).version 
        if _mx.libs[0].v != SS.cfg.wv then
            LOG("Preparing to load weak library. . .".grey.sys)  
            div = eo.o.host_computer.File("/lib/"+SS.cfg.wf.name)
            if div then div.rename("init.so"+str(floor(rnd*10)))
            wait(0.1)
            SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["wl"])
            while SS.bamres != 1
                if T(SS.bamres) == "string" then break
                wait(1)
            end while         
            if T(div) == "string" then return null
            _mx.libs = []
            _mx.l(SS.cfg.wf.name)
            if _mx.libs.len<1 then return null 
        else;LOG("Weak lib already loaded! ".ok)
        end if 
        root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], tl)
        wait(1)
        if root.len < 1 then
            sumstring = sumstring+NL+"Failed to get the root computer".grey
            LOG("THERE WAS AN ISSUE ACQUIRING ROOT COMPUTER".error)
        else
            LOG("Root computer bounce obtained: ".red.ok+root[0].local_ip.s+" "+(root[0].local_ip == tl))
            eo = new SS.EO
            eo.map(root[0])
            if (tu.len == 0) and (eo.lan == tl) then tu = eo.users
            task = _t(eo, label, tl)
            if task != null then 
                sumstring = ss+NL+"Weak library completed the mission".grey
                SS.NPC.results.push("Completed with root computer bounce")
                SS.NPC.results2.push(sumstring)
                return task
            end if
        end if
        return null
    end function
    _ezcs = function(eo, tl)
        // easy computer swap? doubted
    end function
    _ezfd = function(eo, tl, x) // return our potentially better shell
        // simple fw disable, if this doesnt do 
        gateshell = null
        LOG("".fill+("Mission task: firewall disable").title)
        SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["network", "maplan"])
        if SS.bamres == null then return null
        m = SS.bamres
        if not m then return null
        tlc = tl.split("\."); tlc.pop; tlc = tlc.join(".")
        tot=[];f=SS.NPC.disables; g=[]
        shellips = []; ret = []
        for t in m.mappedlan
                rlc = t["lan"].split("\."); rlc.pop; rlc = rlc.join(".");
                if (t["bssid"].len > 1) and (t["essid"].len > 1) then
                    //connection = SS.MD5.wifish(eo.o, t["bssid"], t["essid"]) 
                end if
                hasDeny = null
                for _s in t.rules 
                    if _s.indexOf("DENY") != null then 
                    tot.push(t["lan"])
                        hasDeny = true 
                        break
                    end if 
                end for                 
                if (t.rules.len < 1) and (rlc != tlc) and (hasDeny == null) then continue
                if t.indexOf(t["lan"]) == null then t.push(t["lan"])
                netsesh = new SS.NS
                netsesh.map(t["lan"], 8080, "-f", x)   
                if netsesh == null or netsesh.session == null then 
                    if f.indexOf(t["lan"]) == null then f.push(t["lan"])
                    continue
                end if
                netsesh.mlib.of(null, tl)
                ds = netsesh.mlib.of(null, SS.cfg.unsecure_pw)
                if (ds.len == 0) and (f.indexOf(t["lan"]) == null) then f.push(t["lan"])
                for d in ds 
                    if T(d) == "number" and g.indexOf(t["lan"] == null)then
                        g.push(t["lan"]);
                    else if T(d) == "string" then
                        if f.indexOf(t["lan"]) == null then f.push(t["lan"]) 
                    else if (T(d) == "shell" ) and (SS.NPC.shellips.indexOf(d.host_computer.local_ip) == null)then 
                        SS.NPC.cache.push(d)
                        tlc = tl.split("\."); tlc.pop
                        slc = d.host_computer.local_ip.split("\."); slc.pop 
                        if tlc.join(".") == slc.join(".") then gateshell = d
                        LOG("NEW SHELL DETECTED".red)
                    end if
                end for
        end for
        fm = f 
        LOG("FIREWALL ATTEMPT 2".title)
        netsesh = new SS.NS.map("1.1.1.1", 0, "-f", x)
        wait(0.1)
        c = 0
        for failed in f
            cur = f.pop
            netsesh = null
            netsesh = new SS.NS.map(failed, 8080, "-f", x)
            wait(0.1)
            if netsesh == null or netsesh.session == null then continue   
            ds = netsesh.mlib.of(null, tl)
            if (ds.len == 0) and (f.indexOf(cur) == null) then f.push(t["lan"])
            for d in ds 
                if T(d) == "number" and (g.indexOf(failed)  == null )then
                    g.push(failed);
                //else if T(d) == "string" and (f.indexOf(failed) == null) then
                else if (T(d) == "shell" ) and (SS.NPC.shellips.indexOf(d.host_computer.local_ip) == null)then 
                    SS.NPC.cache.push(d)
                    tlc = tl.split("\."); tlc.pop
                    slc = d.host_computer.local_ip.split("\."); slc.pop 
                    if tlc.join(".") == slc.join(".") then gateshell = d
                    LOG("NEW SHELL DETECTED".red)
                end if
            end for
        end for
        LOG([m.len, tot.len, g.len, f.len].join(" "))
        if T(gateshell) == "shell" then 
            neo = new SS.EO 
            neo.map(gateshell)
            gateshell = neo
        end if
        return gateshell
    end function
    _bff = function(o, ip, p, u, pr, ss)//brute force finish
        ret = null
        svc = SS.MD5.connect(o, ip, u, p, pr)
        if T(svc) == "shell" or t(svc) == "ftpshell" then 
            eo = new SS.EO
            eo.map(eo)
            eo.escalate 
            LOG("Task: bf".grey.sys) 
            task = _t(eo, label, target_lan)
            if task != null then
                sumstring = sumstring+NL+"We were able to brute force ".grey
                self.results.push("Completed: Via brute force")
                self.results2.push(sumstring)
                return task
            end if
            ez = _ezb(eo, sumstring, target_lan);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
            return ez;end if;   
        else;LOG("Remote brute force connection failed".sys.grey)
            sumstring = ss+NL+"We were unable to brute force the connection ".grey
        end if
        return null
    end function
    // =============== INITIAL MAPPING ===============
    network = new SS.Network
    network.map(target_ip)
    if network == null then return null
    // router session
    r0 = new SS.NS;r0.map(target_ip, 0, "-f");if r0 == null then
        sumstring = sumstring+NL+"Failed to get a router session".grey
        self.results.push("Failed: Router session failed, likely an error")
        self.results2.push(sumstring)
        return null
    end if
    r_obj = _rloop(r0)
    if r_obj.len == 0 then 
        LOG("No results from router".grey.sys)
    else 
        LOG("".fill+("Mission task: Router Loop").title)
        sumstring = sumstring+NL+"Router objects found".grey
        has_bounced = null
        for o in r_obj
            if o.type == "shell"  then
                if r0shell == null then r0shell = o else self.cache.push(o)
                if not has_bounced then ez = _ezb(o, sumstring, target_lan)
                has_bounced = true
                if ez != null then
                    sumstring = sumstring+NL+"Router had a shell".grey
                    SS.Utils.wipe_logs(o.o)
                    self.results.push("Completed: Via router bounce")
                    self.results2.push(sumstring) 
                    return ez
                else if SS.bamres != 1 then 
                    sumstring = sumstring+NL+"Router had a shell".grey
                    need_new_shell = true
                end if
            end if
            if (tu.len == 0) and (o.lan == tl) then tu = o.users
            if tu.len > 0 and (o.users == tu) then
                // file objects might be able to handle the job, lets stop sleeping on them 
                if o.lan == "Unspecified" then o.lan = tl
            end if
            if o.type == "file" and o.users.len > 1 then o.lan = target_lan
            task = _t(o, label, target_lan)
            if task != null then
                self.results.push("Completed: Via router object "+o.type.white)
                self.results2.push(sumstring)       
                return task
            end if
            if self.u.len > 0 then continue
            if o.lan != target_lan then continue
            self.u.push(o.users)
        end for
        if r0shell != null then sumstring = sumstring+NL+("Router shell was assigned: "+r0shell.o.host_computer.local_ip.white).grey   
        if r0shell == null then sumstring = sumstring+NL+("No shell from the router").grey   
    end if
    if network.services.len == 0 and r0shell == null then// no open ports found, how do we move forward?
        sumstring = sumstring+NL+"No forwarded ports, and was unable to get a remote shell".grey
        LOG("No shells or fwd ports, unable to move forward".warning)
        self.results.push("Failed: No fwd ports | initial shell") 
        self.results2.push(sumstring)
        return null
    end if 
    if network.services.len > 0 then
        LOG("".fill+("Mission task: Forward Ports").title)
        sumstring = sumstring+NL+"Forwarded ports found".grey
        LOG("Checking forwarded ports...".sys)
        // if we have fwd ports, we sort and work from there
        for net in network.services
            if net[4] == target_lan then prime_ports.push(net)
            if net[4] != target_lan then fwd_ports.push(net)            
        end for
        // =============== POST INITIAL MAPPING
        if prime_ports.len > 0 then
            LOG("".fill+("Mission task: Target Sessions").title)
            LOG("Remote services found on the machine".green.sys) 
            for prime in prime_ports 
                primesesh = new SS.NS.map(target_ip, prime[3], "-f")
                if primesesh == null or primesesh.session == null then 
                    if SS.debug then LOG("NPC: c3e1 prime session failed")
                    continue
                end if
                p_r_sessions.push(primesesh) 
            end for 
        else; LOG("No prime ports for the target machine".grey.sys);
            sumstring = sumstring+NL+"No external ports for target machine".grey
        end if
        if fwd_ports.len > 0 then
            LOG("".fill+("Mission task: Misc Sessions").title)
            sumstring = sumstring+NL+"External ports found aside from the target machine".grey
            for port in fwd_ports 
                midssesh = new SS.NS.map(target_ip, port[3], "-f")
                if midssesh == null or midssesh.session == null then 
                    if SS.debug then LOG("NPC: c3e2 mids session failed")
                    continue
                end if
                r_sessions.push(midssesh) 
            end for 
        else;LOG("No fwd ports on the network".grey.sys);
            sumstring = sumstring+NL+"No forwarded ports for non target machines".grey
        end if
        // =============== HANDLE SESSION MAPPING
        if p_r_sessions.len > 0 then
            LOG("Checking prime sessions. . .".green.sys); 
            sumstring = sumstring+NL+"Prime remote sessions were found".grey
            // we exploit those objects and possibly get local sessions
            for r in p_r_sessions 
                objects = r.mlib.of(null, dat_sw)
                if objects.len == 0 then 
                    if SS.debug then LOG("NPC: c4e p_r_session failed")
                    continue;
                end if
                hn = null//has number
                gr = false
                for o in objects
                    if T(o) == "number" then hn = true 
                    if (T(o) == "string") or (T(o) == "number") then continue 
                    eo = new SS.EO
                    eo.map(o)
                    if (tu.len == 0) and (eo.lan == tl) then tu = eo.users
                    if tu.len > 0 and (eo.users == tu) then
                        // file objects might be able to handle the job, lets stop sleeping on them 
                        if eo.lan == "Unspecified" then eo.lan = tl
                    end if
                    if eo.type == "shell" then
                        if r0shell == null then r0shell = eo
                        if hn and self.pw_changes.indexOf(eo.lan) == null then
                            sumstring = sumstring+NL+("PW change detected at "+eo.lan).grey 
                            self.pw_changes.push(eo.lan)
                        end if
                        ez = _ezb(eo, sumstring, target_lan)
                        if ez != null then
                            self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
                            sumstring = sumstring+NL+"Root bounce via prime object".grey 
                            return ez
                        end if
                        eo.escalate
                        if eo.pc != null and eo.is == "root" then eo.mass_pw_change
                    end if
                    p_r_obj.push(eo)
                    if not eo.pc then continue
                    if (hn != null) and (self.pw_changes.indexOf(eo.pc.local_ip) == null) then self.pw_changes.push(eo.pc.local_ip)
                end for
            end for
            if (r0shell != null) and (r0shell.lan == target_lan) then sumstring = sumstring+NL+("Remote shell assigned to target: "+r0shell.o.host_computer.local_ip.white).grey   
        else;LOG("No prime remote sessions, moving to other forwarded ports".grey.sys);
        end if
        if r_sessions.len > 0 then 
            LOG("Checking remote sessions. . .".sys);
            sumstring = sumstring+NL+"Remote sessions were found".grey
            // we exploit those objects and possibly get local sessions
            for r in r_sessions
                objects = r.mlib.of(null, dat_sw)
                if objects.len == 0 then 
                    if SS.debug then LOG("NPC: c5e r_session failed")
                    continue;
                end if
                hn = null//has number
                for o in objects
                    if T(o) == "number" then hn = true  
                    if (T(o) == "string") or (T(o) == "number") then continue 
                    eo = new SS.EO
                    eo.map(o)
                    if eo.type == "shell" then
                        if r0shell == null then
                            r0shell = eo
                            sumstring = sumstring+NL+("Remote shell assigned to: "+r0shell.o.host_computer.local_ip.white).grey   
                        end if
                        ez = _ezb(eo, sumstring, target_lan)
                        if ez != null then
                            self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
                            sumstring = sumstring+NL+"Root bounce via mids object".grey 
                            return ez
                        end if
                        if hn != null and self.pw_changes.indexOf(eo.lan) == null then
                            sumstring = sumstring+NL+("PW change detected at "+eo.lan).grey 
                            self.pw_changes.push(eo.lan)
                        end if
                    end if
                    if eo.is != "root" then eo.escalate
                    if eo.pc != null and eo.is == "root" then eo.mass_pw_change
                    r_obj.push(eo)
                end for
            end for
        else;LOG("No remote sessions found, checking local".grey.sys);
            sumstring = sumstring+NL+"No remote sessions were found".grey
        end if
         // =============== PRIME REMOTE OBJECTS
        if p_r_obj.len > 0 then
            sumstring = sumstring+NL+"Returned prime objects".grey
            h_w = null
            LOG("Prime objects found, attempting completion. . .".sys);
            for p in p_r_obj
                if p.type == "shell" then
                    ez = _ezb(p, sumstring, target_lan)
                    if ez != null then
                        self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
                        sumstring = sumstring+NL+"Root bounce via prime object".grey 
                        return ez
                    end if
                    r0shell = p // replace our old eo with a better one
                end if 
                LOG("Task: p_r_o".grey.sys) 
                completed = _t(p, label, target_lan)
                if not h_w then; SS.Utils.wipe_logs(p.o); h_w = true; end if;
                if completed != null then
                    if r0shell != null then sumstring = sumstring+NL+("Remote shell assigned to target: "+r0shell.o.host_computer.local_ip.white).grey   
                    self.results.push("Completed via prime remote object")
                    self.results2.push(sumstring) 
                    return completed
                end if
                // TODO: user stage 1 prime remote
                if (p.pc != null) and (p.lan == target_lan) and (self.u.len < 1) then self.u.push(p.users)
            end for
        else;LOG("No prime objects found, checking other objects".grey.sys);
            sumstring = sumstring+NL+"No prime objects were found".grey
        end if
        // =============== REMOTE OBJECTS, AT THIS POINT ANY SHELL ANYWHERE WORKS
        if (r_obj.len > 0) and (r0shell == null) then
            LOG("".fill+("Mission task: Shell Assignment").title)
            sumstring = sumstring+NL+"Remote objects found, and mission needed a shell".grey
            if r0shell == null then LOG("Mission still needs a shell".grey.sys);
            // local mapping, push to prime_local, local_ports, and l_obj
            h_w = null
            for o in r_obj
                if not h_w then; SS.Utils.wipe_logs(o.o); h_w = true; end if; 
                if o.type == "shell" then
                    ez = _ezb(o, sumstring, target_lan)
                    if ez != null then
                        self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
                        sumstring = sumstring+NL+"Root bounce via prime object".grey 
                        return ez
                    end if 
                    if not r0shell then r0shell = o; break;
                end if
            end for
            if r0shell != null then sumstring = sumstring+NL+("Shell assigned to remote: "+r0shell.o.host_computer.local_ip.white).grey   
        else if r0shell != null then; 
            sumstring = sumstring+NL+"Remote objects failed, a shell is detected".grey;LOG("No remote objects found, we have a shell".grey.sys);
            ez = _ezb(r0shell, sumstring, target_lan)
            if ez != null then
                self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
                sumstring = sumstring+NL+"Root bounce via prime object".grey 
                return ez
            end if 
        else;LOG("No remote objects found, we did not find a shell".grey.sys);
            sumstring = sumstring+NL+"Remote objects failed, no shell returned".grey
        end if
    end if
    // =============== LOCAL NETWORK GET
    if r0shell != null then // router map
        sumstring = sumstring+NL+("We had a launch shell at "+r0shell.o.host_computer.local_ip.white).grey
        if _ezb(r0shell, sumstring, target_lan) != null then
            self.results.push("Completed: Via prime local object bounce")
            self.results2.push(sumstring)  
            sumstring = sumstring+NL+"Root bounce via local object".grey 
            return true
        end if
        LOG("Remote shell found, ready to map network".sys);
        SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["network", target_lan])
        l0 = SS.bamres
        r0shell.mass_pw_change
        SS.Utils.wipe_logs(r0shell.o)
    else;LOG("No remote shell obtained".grey.sys);
        sumstring = sumstring+NL+"We did not get a remote shell initially".grey
    end if
    // local network full mapping and pivot
    if l0 != null then
        LOG("Local network has been mapped".ok)
        SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["mx"])
        //while (T(SS.bamres) != "MetaxploitLib")
        //    wait(1)
        //    if SS
        //end while
        wait(5)
        if SS.bamres != null then sumstring = sumstring+NL+"We mapped the network from our initial shell".grey 
        if T(SS.bamres) == "MetaxploitLib" then
            sumstring = sumstring+NL+"We loaded metaxploit locally".grey 
            l_mx = new SS.MX
            l_mx.map(r0shell.o, SS.bamres)
            LOG(("Local "+T(l_mx.x).red+" obtained on remote shell. . .").sys) 
            if l0.services.len > 0 then
                sumstring = sumstring+NL+"We found locally running services on the target machine".grey  
                LOG("Internal services found".ok);
                for s in l0.services 
                    SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"),  ["ns", s[4], s[3]])
                    LOG(s)
                    if T(SS.bamres) == "map" then p_l_sessions.push(SS.bamres)
                end for
                LOG("Targeting local services, going for completion. . .".sys)
                if p_l_sessions.len > 0 then
                    sumstring = sumstring+NL+"Established net sessions at some of these services".grey   
                    LOG("Prime local sessions found, exploiting".green.sys)
                    for p in p_l_sessions 
                        res = p.mlib.of(null, dat_sw)
                        if res.len > 0 then 
                            for r in res
                                if T(r) == "number" then 
                                    LOG("PW change detected".ok)
                                    pw = true
                                    continue 
                                else if T(r)=="number"then;continue;
                                end if
                                eo = new SS.EO
                                eo.map(r)
                                if eo.type == "computer" and eo.is == "root" then LOG(("ROOT COMPUTER DETECTED".green.s+p.lib.red.s+p.libv.white).sys)
                                if (tu.len == 0) and (eo.lan == tl) then tu = eo.users
                                if tu.len > 0 and (eo.users == tu) then
                                    // file objects might be able to handle the job, lets stop sleeping on them 
                                    if eo.lan == "Unspecified" then eo.lan = tl
                                end if
                                if eo.pc != null and eo.is == "root" then eo.mass_pw_change
                                if eo.type == "shell" then
                                    eo.escalate 
                                    ez = _ezb(eo, sumstring, target_lan)
                                    if ez != null then
                                        self.results.push("Completed: Via prime local object bounce")
                                        self.results2.push(sumstring)  
                                        sumstring = sumstring+NL+"Root bounce via local object".grey 
                                        return ez
                                    end if
                                end if
                                LOG("Task: local object".grey.sys) 
                                task = _t(eo, label, target_lan)
                                if task != null then
                                    self.results.push("Completed: Via prime local object")
                                    self.results2.push(sumstring)  
                                    return task
                                end if
                                ez = _ezb(eo, sumstring, target_lan);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);return ez;end if;
                                if eo.pc != null and eo.is == "root" then eo.mass_pw_change
                                p_l_obj.push(eo)
                            end for
                        else;LOG("No local objects returned, looking for a tsunami. . .".grey.sys)
                        end if
                        // simple bf since dict seemingly takes, FOREVER 
                        if ((p.lib == "libssh.so") or (p.lib == "libftp.so")) then
                            sumstring = sumstring+NL+"Detected SSH/FTP running locally".grey   
                            LOG("Attempting simple connection. . .".green.sys) 
                            rooted = r0shell.o.connect_service(target_lan, p.port, "root", SS.cfg.unsecure_pw, p.lib.replace("lib","").replace(".so",""))
                            if T(rooted) == "shell" or T(rooted) == "ftpshell" then
                                sumstring = sumstring+NL+"We detected a pw change, and defaulted to a simple connection as root".grey    
                                LOG(("Root".red+" connection established").ok)
                                eo = new SS.EO
                                eo.map(rooted)
                                ez = _ezb(eo, sumstring, target_lan);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);return ez;end if;
                                LOG("Task: shell1".grey.sys) 
                                task = _t(eo, label, target_lan)
                                if task != null then
                                    self.results.push("Completed: PW change brute force ROOT local connection")
                                    self.results2.push(sumstring)   
                                    return task
                                end if
                                ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);return ez;end if;
                            else
                                LOG("Root connection failed, moving to regular users. . .".grey.sys)
                                for i in r0shell.users
                                    rooted = r0shell.o.connect_service(target_lan, p.port, i, SS.cfg.unsecure_pw, p.lib.replace("lib","").replace(".so",""))
                                    if T(rooted) == "shell" or T(rooted) == "ftpshell" then
                                        sumstring = sumstring+NL+("We detected a pw change, and defaulted a connection as "+i.white+" and escalated to root").grey     
                                        LOG("User connection established".ok)
                                        eo = new SS.EO
                                        eo.map(rooted)
                                        LOG("Task: shell2".grey.sys) 
                                        task = _t(eo, label, target_lan)
                                        if task != null then
                                            self.results.push("Completed: PW change brute force USER -> ROOT local connection")    
                                            self.results2.push(sumstring)      
                                            return task
                                        end if
                                        ez = _ezb(eo, sumstring, target_lan);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);return ez;end if;
                                    else if T(rooted) == "string" then
                                        if (rooted == "Remote host is down") and (label == "system corruption") then return true// pretty sure we dont even capture this, so
                                        LOG("simple connect: ".warning+rooted)
                                    end if
                                end for 
                            end if   
                            LOG("Launching tsunami. . .".grey.sys)
                            if (self.p4t == false) or ((self.p4t == true) and (INPUT("Confirm Tsunami".prompt).to_int == 1)) then SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["rcon", target_lan, "root", p.port, p.lib.replace("lib","").replace(".so","")])
                            if T(SS.bamres) == "shell" then
                                eo = new SS.EO
                                eo.map(SS.bamres)
                                task = _t(eo, label, target_lan)
                                if task != null then
                                    sumstring = sumstring+NL+"We brute forced a local connection using tsunami".grey    
                                    self.results.push("Completed: Brute force local connection from tsunami")
                                    self.results2.push(sumstring)     
                                    return task
                                end if
                                ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                            else;LOG("Internal brute force failed")
                            end if
                        end if
                    end for
                    // STILL NOT DONE?! LOCAL LIB BOUNCE HOUSE!
                    if p_l_obj.len > 0 then
                        sumstring = sumstring+NL+"Moved onto local objects".grey    
                        for p in p_l_obj
                            if T(p.o) == "shell" then
                                task = _t(p, label, target_lan)
                                if task != null then
                                    sumstring = sumstring+NL+"Completed mission with a NS shell object".grey     
                                    self.results.push("Completed: Via exploiting a local service")
                                    self.results2.push(sumstring)     
                                    return task
                                end if
                                ez = _ezb(p, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                p.escalate
                                SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"]) 
                                if SS.bamres != null then  
                                    LOG(("Local "+T(SS.bamres).red+" obtained on "+"TARGET".green+" shell. . .").sys) 
                                    mx = new SS.MX.map(p.o, SS.bamres)
                                    LOG(T(mx.x))
                                    mx.l("-a")
                                    for lib in mx.libs 
                                        local_hacks = lib.of(null, target_lan)
                                        if local_hacks.len == 0 then continue
                                        for l in local_hacks
                                            if (T(l) == "number") or (T(l) == "string") then continue 
                                            eo = new SS.EO
                                            eo.map(l, target_ip, target_lan)
                                            // TODO:
                                            if eo.type == "computer" and eo.is == "root" then LOG(("ROOT COMPUTER DETECTED".green).sys)
                                            if (tu.len == 0) and (eo.lan == eo.lan) then tu = eo.users
                                            if tu.len > 0 and (eo.users == tu) then
                                                // file objects might be able to handle the job, lets stop sleeping on them 
                                                if eo.lan == "Unspecified" then eo.lan = tl
                                            end if
                                            eo.escalate
                                            task = _t(eo, label, target_lan)
                                            if task != null then
                                                sumstring = sumstring+NL+"Completed mission with a local ML object".grey     
                                                self.results.push("Completed: Via exploiting a local library")
                                                self.results2.push(sumstring)      
                                                return task
                                            end if
                                            ez = _ezb(eo, sumstring, target_lan);self.results.push("Completed: Via root bounce");self.results2.push(sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                        end for 
                                    end for
                                else;LOG("MX was not loaded on the target machine".grey.sys)
                                    sumstring = sumstring+NL+"We were unable to load MX onto our remote shell".grey     
                                end if 
                            else 
                                task = _t(p, label, target_lan)
                                if task != null then
                                    sumstring = sumstring+NL+"Completed mission with a NS non-shell object".grey    
                                    self.results.push("Completed: Via exploiting a local library")
                                    self.results2.push(sumstring)       
                                    return task
                                end if
                            end if
                        end for
                    else;
                        LOG("No local objects returned".grey.sys)
                        sumstring = sumstring+NL+"We did not return any local objects".grey     
                    end if
                else;
                    LOG("No prime local sessions, moving to local bounce. . .".grey.sys)
                    sumstring = sumstring+NL+"We had the ability to locally bounce, but we didnt! add me :(".grey     
                end if
            else//l0.services.len < 0 
                // here would be a good opportunity to check all the other services, because in this case there is a service thats exploitable
                LOG("".fill+("Mission task: Local Fallback").title)
                newShell = _ezfd(r0shell, target_lan, l_mx.x)
                tried = false
                if newShell != null then
                    r0Shell = newShell
                    SS.NPC.cache.push(newShell)
                    sumstring = sumstring+NL+"We reassigned our shell to one in the target subnet: ".grey+newShell.lan.white
                    ez = _ezb(newShell, sumstring, target_lan);tried = true;if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;LOG("MISSION COMPLETE".green.size(40));return ez;end if;                      
                end if
                LOG("No internal services found, exploiting local libraries. . .".grey.sys);
                l_mx.l("-a")
                if l_mx.libs.len > 0 then
                    sumstring = sumstring+NL+"We had no local services, so we tried a local library bounce".grey
                    fwd = _ezfd(r0shell, target_lan)      
                    ez = _ezb(r0shell, sumstring, target_lan);tried = true;if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;LOG("MISSION COMPLETE".green.size(40));return ez;end if;  
                    ret = null
                    libs = []
                    for lib in l_mx.libs 
                        lh = lib.of(null, target_lan)
                        if lh.len == 0 then continue
                        libs = libs + lh 
                    end for
                    tried = null
                    for o in libs
                        if not o then continue 
                        if (T(o) == "number") or (T(o) == "string") then continue 
                        eo = new SS.EO
                        eo.map(o)
                        if tu.len > 0 and (eo.users == tu) then
                            // file objects might be able to handle the job, lets stop sleeping on them 
                            if eo.lan == "Unspecified" then eo.lan = tl
                        end if
                        LOG("This particular operation is under maintenance, it should NOT cause exceptions".warning)
                        // THIS MIGHT BREAK STUFF
                        if (eo.type == "shell") and (tried != true )then ez = _ezb(eo, sumstring, target_lan);tried = true;if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;LOG("MISSION COMPLETE".green.size(40));return ez;end if;  
                        task = _t(eo, label, target_lan)
                        if task != null then
                            SS.NPC.results.push("Completed: Via exploiting a local library")
                            SS.NPC.results2.push(sumstring)       
                            return task
                        end if
                        // we need to do something with gco, maybe
                    end for
                else;LOG("Unable to load local libraries".error)
                    sumstring = sumstring+NL+"We were unable to load the libraries".grey     
                end if
            end if
             // router local bounce    
        else 
            if l0.services.len > 0 then
                LOG("MX not loaded, but we have ports to try".sys)
                sumstring = sumstring+NL+"Without MX, we rechecked the network for brute force opportunities".grey      
                for l in l0.services
                    if l[0] != "ssh" or l[0] != "ftp" then continue
                    sumstring = sumstring+NL+("We found a viable service: "+l[0].white).grey       
                    LOG(("NON exploitable service, moving on".grey).sys); 
                    LOG("Launching tsunami. . .".grey.sys)
                    if (self.p4t == false) or ((self.p4t == true) and (INPUT("Confirm Tsunami".prompt).to_int == 1)) then SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["rcon", target_lan, "root", l[3], l[0]])
                    if T(SS.bamres) == "shell" or T(SS.bamres) == "ftpshell" then
                        eo = new SS.EO
                        eo.map(SS.bamres)
                        if tu.len > 0 and (eo.users == tu) then
                            // file objects might be able to handle the job, lets stop sleeping on them 
                            if eo.lan == "Unspecified" then eo.lan = tl
                        end if
                        LOG("Task: local svc".grey.sys) 
                        task = _t(eo, label, target_lan)
                        if task != null then; return task;else;LOG("Internal brute force failed".grey.sys);end if
                        ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    end if
                end for
            else;LOG("MX not loaded on network & No internal services to brute force".grey.sys)
                sumstring = sumstring+NL+"Unable to find a viable local port to connect to".grey       
            end if 
        end if
    else
        LOG("Local network was not mapped, rechecking remote. . .".grey.sys)
        sumstring = sumstring+NL+"Local network not mapped during router run".grey       
        if prime_ports.len > 0 then 
            sumstring = sumstring+NL+"Ports were found on the target machine".grey       
            //remote brute force
            for p in prime_ports
                if (p[0] != "ssh") or (p[0] != "ftp") then continue
                isu = null
                if self.u.len > 0 and self.pw_changes.indexOf(target_lan) != null then
                    sumstring = sumstring+NL+("Detected PW change, tried simple connect via "+p[0].white).grey
                    for i in self.u 
                        isu = SS.s.connect_service(target_ip, p[3], i, SS.cfg.unsecure_pw, p[0])
                        if T(isu) == "shell" or T(isu) == "ftpshell" then break
                    end for
                    if isu then//remote connection 
                        sumstring = sumstring+NL+("Established remote connection via port "+p[3].white).grey        
                        eo = new SS.EO  
                        eo.map(isu)
                        eo.escalate
                        task = _t(eo, label, target_lan)
                        if task != null then 
                            self.results.push("Completed: Via PW change -> simple bf using local services")
                            self.results2.push(sumstring)   
                            return task
                        else 
                            ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                        end if
                        if (eo.type == "shell") and (r0shell == null )then r0shell = eo
                    else;
                        LOG("No remote shell obtained".grey.sys);
                        sumstring = sumstring+NL+"Simple connection failed".grey       
                    end if
                else;LOG("No PW changes or users not collected")
                    sumstring = sumstring+NL+"No PW changes or users not collected".grey 
                    // TODO brute force function
                    //s = _bff(SS.s, target_ip, "root", s[3], s[4])
                    //if s != null then 
                    //   eo = new SS.EO 
                    //   eo.map(s) 
                    //end if
                end if
                sumstring = sumstring+NL+("We found ports to connect to "+p[1]).grey        
                LOG("We have prime ports to try".green.sys)
                svc = SS.MD5.connect(SS.s, target_ip, "root", s[3], s[0])
                if T(svc) == "shell" or t(svc) == "ftpshell" then 
                    eo = new SS.EO
                    eo.map(eo)
                    eo.escalate 
                    LOG("Task: fwd port".grey.sys) 
                    task = _t(eo, label, target_lan)
                    if task != null then
                        sumstring = sumstring+NL+"We were able to brute force a forwarded port ".grey
                        self.results.push("Completed: Via connecting to a prime fwd port")
                        self.results2.push(sumstring)      
                        return task
                    end if
                    ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                else;LOG("Remote brute force connection failed".sys.grey)
                    sumstring = sumstring+NL+"We were unable to brute force the connection ".grey
                end if
            end for
        else if (fwd_ports.len > 0)  and (r0shell == null) then
            sumstring = sumstring+NL+"We were unable to acquire a remote shell and attempted to leverage fwd ports".grey 
            // desperate measures?
            for p in prime_ports
                if p[0] != "ssh" then continue 
                LOG("We have fwd ports to try".green.sys)
                svc = SS.MD5.connect(SS.s, target_ip, "root", p[3], p[0])
                if T(svc) == "shell" then//for sake of fairness, ftp would be exploitive 
                    sumstring = sumstring+NL+"We got a SSH connection on a fwd machine".grey 
                    eo = new SS.EO
                    eo.map(svc)
                    ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    if r0shell == null then r0shell = eo; 
                    break;
                else if T(svc) == "string" then; LOG(svc);
                else;LOG("Remote brute force connection failed".sys.grey)
                end if
            end for
            for p in fwd_ports
                if p[0] != "ssh" then continue 
                LOG("We have fwd ports to try".green.sys)
                svc = SS.MD5.connect(SS.s, target_ip, "root", p[3], p[0])
                if T(svc) == "shell" then//for sake of fairness, ftp would be exploitive 
                    sumstring = sumstring+NL+"We got a SSH connection on a fwd machine".grey 
                    eo = new SS.EO
                    eo.map(svc)
                    ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    if r0shell == null then r0shell = eo; 
                    break;
                else;LOG("Remote brute force connection failed".sys.grey)
                end if
            end for
            if r0shell != null then
                sumstring = sumstring+NL+("We finally got a shell at "+r0shell.o.host_computer.local_ip.white).grey
                LOG("Remote shell finally found, ready to map network".sys);
                SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["network", target_lan])
                l0 = SS.bamres
                SS.BAM.handler(r0shell.o,SS.CMD.getOne("iget"), ["mx"])
                l_mx = SS.bamres
                SS.Utils.wipe_logs(r0shell.o)
                if T(l0) == "map" and T(l_mx) == "MetaxploitLib" then 
                    // router bounce and local hacks
                    _ezfd(r0shell, target_lan, l_mx)
                    ez = _ezb(r0shell, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via lc root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    if l0 == null then; LOG("Unable to map the local network".sys.grey);end if;
                    if l_mx == null then; LOG("Unable to get a local MX".sys.grey);end if;
                    if (l0 != null) and (l_mx != null) then
                        sumstring = sumstring+NL+"We mapped the network and loaded MX on our second pass".grey   
                        if l0.services.len == 0 then 
                            l_mx = new SS.MX
                            l_mx.map(r0shell.o, SS.bamres)
                            LOG(("Local "+T(l_mx.x).red+" obtained on remote shell. . .").sys) 
                            if l0.services.len > 0 then 
                                LOG("Internal services found".ok);
                                sumstring = sumstring+NL+"We found internal services".grey   
                                for s in l0.services 
                                    SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"),  ["ns", s[4], s[3]])
                                    if T(SS.bamres) == "map" then p_l_sessions.push(SS.bamres)
                                end for
                            else 
                                // local router bounce, have we tried to bounce with r0shell yet?
                                sumstring = sumstring+NL+"We didnt find internal services, we had the chance to router bounce, but we didnt!".grey   
                                SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"),  ["ns", target_ip, 0])
                                if SS.bamres != null then p_l_sessions.push(SS.bamres)
                            end if
                            for p in p_l_sessions 
                                res = p.mlib.of(null, dat_sw)
                                if res.len > 0 then
                                    for r in res
                                        pw = null
                                        if T(r) == "number" and p.lib != "kernel_router.so" then 
                                            LOG("PW change detected".ok)
                                            pw = true
                                            continue 
                                        else if T(r)=="number"then;continue;
                                        end if
                                        eo = new SS.EO
                                        eo.map(r)
                                        if tu.len > 0 and (eo.users == tu) then
                                            // file objects might be able to handle the job, lets stop sleeping on them 
                                            if eo.lan == "Unspecified" then eo.lan = tl
                                        end if
                                        if pw != null then LOG("addme")
                                        eo.escalate
                                        if eo.pc != null and eo.is == "root" then eo.mass_pw_change
                                        if eo.lan == target_lan then r0shell = eo // reassign out r0shell
                                        LOG("Task: local svc".grey.sys) 
                                        task = _t(eo, label, target_lan)
                                        if task != null then
                                            self.results.push("Completed: Via exploiting a local library after leveraging fwd ports")
                                            self.results2.push(sumstring)        
                                            return task
                                        end if
                                        ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                        p_l_obj.push(eo)
                                    end for
                                else;LOG("No local objects returned, looking for a tsunami. . .".grey.sys)
                                end if
                                // simple bf since dict seemingly takes, FOREVER 
                                if ((p.lib == "libssh.so") or (p.lib == "libftp.so")) then
                                    LOG("Attempting simple connection. . .".green.sys) 
                                    rooted = r0shell.o.connect_service(target_lan, p.port, "root", SS.cfg.unsecure_pw, p.lib.replace("lib","").replace(".so",""))
                                    if T(rooted) == "shell" or T(rooted) == "ftpshell" then 
                                        LOG(("Root".red+" connection established").ok)
                                        eo = new SS.EO
                                        eo.map(rooted)
                                        task = _t(eo, label, target_lan)
                                        if task != null then
                                            self.results.push("Completed: Via PW change -> simple brute force using local services")
                                            self.results2.push(sumstring)   
                                            return task
                                        end if
                                        ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                    else if T(rooted) == "string" then
                                        //if rooted == "Remote host is down" and label == "system corruption" then return true
                                        LOG("simple connect: ".warning+rooted)
                                    else
                                        LOG("Root connection failed, moving to regular users. . .".grey.sys)
                                        for i in r0shell.users
                                            svc = null 
                                            rooted = r0shell.o.connect_service(target_lan, p.port, SS.cfg.unsecure_pw, p.lib.replace("lib","").replace(".so",""))
                                            if T(rooted) == "shell" or T(rooted) == "ftpshell" then 
                                                LOG("User connection established".ok)
                                                eo = new SS.EO
                                                eo.map(svc)
                                                LOG("Task: shell3".grey.sys) 
                                                task = _t(eo, label, target_lan)
                                                if task != null then
                                                    self.results.push("Completed: Via PW change -> simple brute force using local services *escalated to root from user*")
                                                    self.results2.push(sumstring)          
                                                    return task
                                                end if
                                                ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                            else if T(svc) == "string" then
                                                if (svc == "Remote host is down") and (label == "system corruption") then return true
                                                LOG("simple connect: ".warning+svc)
                                            end if
                                        end for 
                                    end if   
                                    LOG("Launching tsunami. . .".grey.sys)
                                    if (self.p4t == false) or ((self.p4t == true) and (INPUT("Confirm Tsunami".prompt).to_int == 1)) then SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["rcon", target_lan, "root", p.port, p.lib.replace("lib","").replace(".so","")])
                                    if T(SS.bamres) == "shell" then
                                        sumstring = sumstring+NL+"Brute forced connection via ssh".grey    
                                        eo = new SS.EO
                                        eo.map(SS.bamres)
                                        //eo.escalate 
                                        LOG("Task: shell4".grey.sys) 
                                        task = _t(eo, label, target_lan)
                                        if task != null then 
                                            self.results.push("Completed: Via tsunami -> brute force using local services")
                                            self.results2.push(sumstring)          
                                            return task
                                        end if
                                        ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                    else;LOG("Internal brute force failed")
                                    end if
                                end if
                            end for
                            // STILL NOT DONE?! LOCAL LIB BOUNCE HOUSE!
                            if p_l_obj.len > 0 then
                                sumstring = sumstring+NL+"We found objects on the target machine".grey    
                                for p in p_l_obj
                                    if T(p.o) == "shell" then
                                        p.escalate
                                        LOG("Task: shell5".grey.sys) 
                                        task = _t(p, label, target_lan)
                                        if task != null then
                                            sumstring = sumstring+NL+"We were able to leverage local NS object".grey    
                                            self.results.push("Completed: Via exploiting prime local shell")
                                            self.results2.push(sumstring)           
                                            return task
                                        end if
                                        ez = _ezb(eo, sumstring, target_lan);
                                        if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                        SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"]) 
                                        if SS.bamres != null then
                                            sumstring = sumstring+NL+("We loaded MX onto the system as "+p.is.white).grey      
                                            LOG(("Local "+T(SS.bamres).red+" obtained on "+"TARGET".green+" shell. . .").sys) 
                                            mx = new SS.MX
                                            mx.map(p.o, SS.bamres)
                                            _ezfd(r0shell, target_lan, SS.bamres)
                                            ez = _ezb(r0shell, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via lc root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;                              
                                            mx.l("-a")
                                            for lib in mx.libs 
                                                local_hacks = lib.of(null, target_lan)
                                                if local_hacks.len == 0 then continue
                                                for l in local_hacks
                                                    if T(l) == "number" or T(l) == "string" then continue  
                                                    eo = new SS.EO
                                                    eo.map(l)
                                                    if tu.len > 0 and (eo.users == tu) then
                                                        // file objects might be able to handle the job, lets stop sleeping on them 
                                                        if eo.lan == "Unspecified" then eo.lan = tl
                                                    end if
                                                    eo.escalate
                                                    LOG("Task: local hax".grey.sys) 
                                                    task = _t(eo, label, target_lan)
                                                    if task != null then
                                                        sumstring = sumstring+NL+"We locally exploited the target machine".grey      
                                                        self.results.push("Completed: Via exploiting prime local objects' local libraries")      
                                                        self.results2.push(sumstring)      
                                                        return task
                                                    end if
                                                    ez = _ezb(eo, sumstring, target_lan);if ez != null then;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                                end for
                                            end for 
                                        else;LOG("MX was not loaded on the target machine".grey.sys)
                                            sumstring = sumstring+NL+"Unable to load mx on the system".grey      
                                        end if 
                                    else 
                                        LOG("Task: local hax: eo".grey.sys) 
                                        task = _t(p, label, target_lan)
                                        if task != null then
                                            sumstring = sumstring+NL+("We used locally obtained NS exploits on the target machine").grey      
                                            self.results.push("Completed: Via exploiting prime local object")
                                            self.results2.push(sumstring)            
                                            return task
                                        end if
                                    end if
                                end for
                            end if
                    else;
                        LOG("No local services returned".grey.sys)
                        sumstring = sumstring+NL+"Unable to find prime local services".grey      
                    end if  
                else;LOG("MX | NS not loaded locally".grey.sys)
                    sumstring = sumstring+NL+"Failed to load local mx c1".grey      
                end if 
            else
                LOG("No remote shell was obtained".grey.sys)
                sumstring = sumstring+NL+"Failed to acquire shell".grey      
            end if
        else;
            LOG("We have exhausted our options, moving forward. . .".grey.sys)
            sumstring = sumstring+NL+"Failed to load local mx".grey      
        end if
    end if
    if r0shell == null then sumstring = sumstring+NL+"No shell on the network and unable to move forward".grey 
    LOG("MISSION FAILED".red.sys.b) 
    self.results.push("Failed: Our efforts were futile")
    self.results2.push(sumstring)      
    return result
end function
// modularize
SS.NPC._t = function(eo, label, target_lan)
    task = null
    if SS.debug then LOG("NPC:task:completion ".debug+"eo: ".white+eo.type+" eolan: ".white+eo.lan+" target: ".white+target_lan)
    if eo.type == "shell" and eo.is != "root" then eo.escalate
    if label == "credentials" then
        task = eo.credentials(target)
    else if label == "system corruption" then
        task = eo.sys_kill(target_lan)
    else if label == "file_deletion" then 
        task = eo.file_kill(target, target_lan)
    else if label == "file_retrieval" then  
        task = eo.file_get(target, target_lan)
    end if
    return task
end function
SS.NPC._check = function(l, lan)// check for local network
    if l.len == 0 then return null
    if l0 != null then return l0
    for p in l
        SS.BAM.handler(p, SS.CMD.getOne("iget"), ["network", lan])
        if SS.bamres != null then
            l0 = SS.bamres; break; 
        end if;
    end for
end function
SS.NPC._mx = function(l)// get a mx lib
    if l.len == 0 then return null
    for p in l
        SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"])
        if T(SS.bamres) == "MetaxploitLib" then
            SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"])
            metaxs.push(SS.bamres)
        end if;
    end for
end function 
SS.NPC._loop = function(ns, dat)//loop a ns
    objs = ns.mlib.of(null, dat)
    //if objs.len == 0 then return []
    out=[]
    pw = null
    for o in objs
        if ns.lib != "kernel_router.so" and T(o) == "number" then pw = true
        if (T(o) == "number") or (T(o) == "string") then continue
        eo = new SS.EO
        eo.map(o)
        eo.escalate
        // if target users hasnt been defined, push them to the list 
        if (SS.NPC.tusers.len == 0) and (eo.lan == SS.NPC.tl) then SS.NPC.tusers = eo.users
        if SS.NPC.tusers.len > 0 and (eo.users == tu) then
            LOG("C2a")
            // file objects might be able to handle the job, lets stop sleeping on them 
            if eo.lan == "Unspecified" then eo.lan = tl
        end if
        if (eo.pc != null) and( pw != null) and (self.pw_changes.indexOf(eo.pc.local_ip) == null) then self.pw_changes.push(eo.pc.local_ip)
        out.push(eo)
    end for
    return out
end function
SS.NPC._rloop = function(ns)
    r_obj = []
    o1 = _loop(ns, SS.cfg.unsecure_pw)
    o2 = _loop(ns, target_lan)
    if o1.len > 0 then r_obj = r_obj+o1
    if o2.len > 0 then r_obj = r_obj+o2
    return r_obj
end function
SS.NPC._ezb = function(eo, ss, tl)
    if eo.type != "shell" then return null
    if T(SS.cfg.wf) != "file" then return null
    if eo.is != "root" then eo = eo.escalate
    if r0shell == null then r0shell = o
    div = eo.o.host_computer.File("/lib/init.so")
    if div then div.rename("init.so"+str(floor(rnd*10)))
    if T(div) == "string" then return null
    drop = SS.s.scp(SS.cfg.wf.path, "/lib", eo.o)
    wait(0.1)
    if T(drop) == "string" then ; LOG(drop.warning);return null; end if;
    if drop == 1 then
        SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["mx"])
        if not SS.bamres then return null
        _mx = new SS.MX
        _mx.map(eo.o, SS.bamres)
        _mx.l("init.so")
        test = _mx.x.load("/lib/init.so")
        if _mx.libs.len<1 then return null 
        root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], target_lan)
        wait(1)
        if root.len < 1 then
            sumstring = sumstring+NL+"Failed to get the root computer".grey
        else
            LOG("Root computer bounce obtained ".red.ok+root[0].local_ip.s+" "+(root[0].local_ip == tl))
            eo = new SS.EO
            eo.map(root[0])
            if (tu.len == 0) and (eo.lan == tl) then tu = eo.users
            task = _t(eo, label, tl)
            if task != null then 
                sumstring = sumstring+NL+"Weak library completed the mission".grey
                SS.NPC.results.push("Completed with root computer bounce")
                SS.NPC.results2.push(ss)
                return task
            end if
        end if
    else 
        sumstring = sumstring+NL+"Failed to drop the cargo".grey
    end if
    return null
end function
SS.NPC._bff = function(o, ip, p, u, pr, ss)//brute force finish
    ret = null
    svc = SS.MD5.connect(o, ip, u, p, pr)
    if T(svc) == "shell" or t(svc) == "ftpshell" then 
        eo = new SS.EO
        eo.map(eo)
        eo.escalate 
        LOG("Task: bf".grey.sys) 
        task = _t(eo, label, target_lan)
        if task != null then
            sumstring = sumstring+NL+"We were able to brute force ".grey
            self.results.push("Completed: Via brute force")
            self.results2.push(sumstring)
            return task
        end if
        ez = _ezb(eo, sumstring, target_lan);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;self.results.push("Completed: Via root bounce");self.results2.push(sumstring);
        return ez;end if;   
    else;LOG("Remote brute force connection failed".sys.grey)
        sumstring = ss+NL+"We were unable to brute force the connection ".grey
    end if
    return null
end function
SS.NPC._ezball = function(eo, lans, rs = null)
    if eo.type != "shell" then return null
    if T(SS.cfg.wf) != "file" then return null
    if not rs then rs = SS.s
    if eo.is != "root" then eo = eo.escalate
    div = eo.o.host_computer.File("/lib/init.so")
    if div then div.rename("init.so"+str(floor(rnd*10)))
    if T(div) == "string" then return null
    drop = rs.scp(SS.cfg.wf.path, "/lib", eo.o)
    wait(0.1)
    if T(drop) == "string" then ; LOG(drop.warning);return null; end if;
    out = []
    if drop != 1 then return null
    SS.BAM.handler(eo.o, SS.CMD.getOne("iget"), ["mx"])
    if not SS.bamres then return null
    _mx = new SS.MX
    _mx.map(eo.o, SS.bamres)
    _mx.l("init.so")
    test = _mx.x.load("/lib/init.so")
    if _mx.libs.len<1 then return null
    for l in lans 
        root = _mx.libs[0].of([[{"exploit":"Bounce"}, {"memory": SS.cfg.wm},{"string": SS.cfg.wa}]], l)
        if root.len < 1 then continue 
        out.push(root)
    end for
    return out
end function
SS.NPC.btn = function(eo, tl)//BOUNCE THROUGH NETWORK
    if T(eo.o) != "shell" then return null
    rs = [] // routers 
    ss = [] // switches
    GET = @SS.CMD.getOne("iget")
    SS.BAM.handler(e.o, GET, ["network", "maplan"])// internal network getter
    int = SS.bamres
    if int == null then return null

    p = int.getRouter(tl)

    SS.BAM.handler(eo.o, GET, ["ns", ])
    // recursively bounce through the routers to get to the same 
    r0 = new SS.NS; r0.map(eo.ip, 0 , "-f"); // router net session
    if (not r0) or (r0.session == null) then return null
    // we need to not only acquire net sessions, we need to reaquire them after a  disable
    // tasks 1.) passing mx from shell to shell 
    // tasks 2.) fw disable task, reacquire network (get_router on dummy addr) 
    // tasks 3.) pivot to machine, repeat pass mx ns etc 



end function
// action: -i: info , collects anything and everything about the network
// action -p: plant , plants an rshell in as many networks as possible
// action -d: destroy . destroy as many systems in 
// flags -n: takes notes on actions taken
// flags -l: logs actions to a txt file
// flags -cmd: command -> user input for a custom command to be dropped on each shell
SS.NPC.label = []// result label
SS.NPC.notes = false
SS.NPC.logs =[]// result logs
SS.NPC.logger = false
SS.NPC.flags = []
SS.NPC.bam = null // bam command string
SS.NPC.nets = []//networks [ {"ip": string, "lans"} ]
SS.NPC.data = {}
SS.NPC.fish = function(action, amount, f1, f2, f3)
    if (not action)or(not amount) then return LOG("Invalid arguments: action amount flags")
    if (T(amount.to_int) != "number") or amount > 200 then amount = 200
    self.flag = [];self.logger = false;self.notes = false;
    if f1 then self.flags.push(f1); if f2 then self.flags.push(f2); if f3 then self.flags.push(f3)
    if flags.indexOf("-n") != null then self.notes = true 
    if flags.indexOf("-l") != null then self.logger = true 
    if flags.indexOf("-cmd") != null then self.bam = INPUT("Specify bam cmd to use on victim shells".prompt) 
    for i in range(0, amount)
        LOG("".fill+"SAILING AWAY".title)
        ip = SS.Utils.random_ip 
        if get_router(ip) == null then 
            self.logs.push(("The network "+ip.white.s+"had an error with get_router").NL)
            continue 
        end if
        ret = {} // primary return object for this network
        ret["ip"] = ip
        ret["pcs"] = [] // target machines, lets try and build a exploit object off each machine, mk?
        ret["data"] = [] // highlights about the network, NPC hidden missions, player alter detected, etc
        net = new SS.Network; net.map(ip); if network == null then continue
        r0 = new SS.NS; r0.map(ip, 0, "-f"); if r0.session == null then continue 
        r_o = self._rloop(r0)
        r_s = null // remote shell
        fwd = [] // fwd port ns
        if r_o.len == 0 then self.notes.push("Router loop returned no results".NL)
        for o in r_o;
            if T(o) == "string" or T(o) == "number" then continue 
            eo = new SS.EO
            eo.map(o)
            if (eo.type == "shell") and (r_s == null) then
                self.notes.push("Obtained a shell on the router".NL)
                eo.escalate
                r_s = eo
            end if 
            if eo.pc != null then 
                if ret["pcs"].hasIndex(eo.lan) == false then 

                end if
            else
                
            end if
        end for
        // weak lib, bounce to every single lan ip 
        l_n = null // local network
        l_m = null // local mx
        if r_s != null then 
            SS.BAM.handler(r_o, SS.CMD.getOne("iget"), ["network", ip])

        end if
        // double back to fwd ports
        if (r_s == null) and (net.services.len == 0) then 
            self.notes.push("No remote shell assigned initially, no fwd ports. Unable to move forward")
            continue
        else if (r_s == null) and (net.services.len > 0) then 
            pwc = 0
            mpw = []//mass password
            rAt = []//rooted at
            for s in net.services
                ns = new SS.NS
                ns.map(ip, s[3], "-a")
                if ns.session == null then continue
                if s[0] == "ssh" then fwd.push(ns)
                objs = ns.mlib.of(null, SS.cfg.unsecure_pw)
                if objs.len == 0 then continue
                for o in objs 
                    if T(o) == "number" then; pw = pw+1; continue; else if T(o) == "string" then; continue; end if
                    eo = new SS.EO; eo.map(o);
                    if (eo.type == "shell") and (eo.is != "root") and (rAt.indexOf(eo.lan) == null) then
                        eo.escalate; rAt.push(eo.lan);
                        if r_s == null then r_s = eo
                    end if 
                    if (eo.pc != null) and (mpw.indexOf(eo.lan) == null) then  
                        eo.mass_pw_change; 
                        self.notes.push(("Performed mass pw change at: "+eo.lan).NL)
                        mpw.push(eo.lan)
                    end if
                end for
            end for
            
            
        end if
        
        
    end for
end function
//////////////////////////////////////////////////////////////  
///====================== MODULES =======================////
////////////////////////////////////////////////////////////
