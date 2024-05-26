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
SS.NPC.pw = []
SS.NPC.mission = function(o, mission, del = null, notes = null)
    if SS.cfg.mailacct == null then SS.cfg.mailacct = INPUT("Enter mail acct".prompt,true)
    if SS.cfg.mailpw == null then SS.cfg.mailpw = INPUT("Enter mail pw".prompt,true)
    self.fixmekuro = null
    cmd = SS.CMD.getOne("iget")
    bam = SS.BAM.handler(o, cmd, ["mail"])
    if SS.bamres == null then return LOG("An issue occured")
    self.fixmekuro = SS.bamres
    if T(self.fixmekuro) == "string" then return LOG(self.fixmekuro.warning)
    LOG("Analyzing metamail. . .".sys);start = time;
    ret = "";g=0;c=0;
    self.d = false; self.n = false;
    if (del == "-d") or (notes == "-d") then self.d = true 
    if (del == "-n") or (notes == "-n" )then self.n = true 
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
		else if mission == "-f" then 
            if word[5] != "delete"  then continue // delete remote file
			label = "file deletion"
			LOG("NPC: ".grey+"Remote File [delete]")
			LOG(content.split(NL)[3])
		else if mission == "-f" then
            if word[10] != "get" then continue
			label = "file retrieval"
			LOG("NPC:".grey+"Remote File [delete]")
			LOG(content.split(NL)[3])
		end if
        if SS.debug then LOG(word)
        target_ip = detail[7].replace("<b>", "").replace("</b>","")[:-1]
        target_lan = detail[25].replace("<b>", "").replace("</b>","")
        result = null
        result = self.run(id, label, target, target_ip, target_lan)
        reslabel = "FAILED".red.b;c = c+1;
        if result != null then 
            reslabel = "COMPLETE".green.b
            g = g+1
        else 
            if self.d then self.fixmekuro.delete(id)
        end if
        restring = (" ".fill).red+NL+"Mission Tasks Complete".ok+NL+(label.lblue.b+" - "+reslabel).title.NL+" Target ".wrap.cap(target).NL+" IP ".wrap.cap(target_ip).NL+" LAN ".wrap.cap(target_lan).NL+" DAT ".wrap.cap(result)+NL+" SUM ".wrap.cap(self.results[self.results.len-1])
        if self.n then restring = restring.NL+" NOTE ".wrap+NL+self.results2[self.results2.len-1]
        LOG(restring)
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
    LOG("".fill.NL+"Mission(s) Summary".title+("["+"Completion".grey.s+ratio+"%".white+"]")+NL+ret+NL+"passed".wrap.cap(str(g))+NL+"total".wrap.cap(str(c))+NL+"pct".wrap.cap((ratio+"%".white)))
    SS.Date.timer(start)
    self.fixmekuro.fetch
    self.fixmekuro = null
    SS.BAM.handler(o, cmd, ["mail"])
end function
//TODO: find the missing end if, im almost positive there is one
SS.NPC.run = function (id, label, target, target_ip, target_lan)
    LOG("".fill+"MISSION START".b.title.b+NL+"ID: ".white+id.NL+"TYPE: ".white+label.NL+"TARGET: ".white+ target.NL+"IP: ".white+ target_ip.NL+"LAN: ".white+ target_lan.NL+"".fill)
    sumstring = "*Mission Log*"
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
    sh = false
    dat_sw = SS.cfg.unsecure_pw//data switch
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
            if (eo.pc != null) and( pw != null) and self.pw_changes.indexOf(eo.pc.local_ip) == null then self.pw_changes.push(eo.pc.local_ip)
            if (ns.lib == "kernel_router.so") and (eo.type =="computer") and (eo.is == "root") then LOG("ROOT PC BOUNCE DETECTED".ok)
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
    _ezb = function(eo, ss)
        LOG(eo)
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
                LOG("Root computer bounce obtained".red.ok) 
                eo = new SS.EO
                eo.map(root[0])
                task = _t(eo, label, target_lan)
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
        sumstring = sumstring+NL+"Router objects found".grey
        for o in r_obj
            if o.type == "shell"  then
                sumstring = sumstring+NL+"Router had a shell".grey
                if o.is != "root" then o.escalate
                r0shell = o
                ez = _ezb(o, sumstring)
                if ez != null then
                    self.results.push("Completed: Via router bounce")
                    self.results2.push(sumstring) 
                    return ez
                end if
            end if
            LOG("halp? c122")
            task = _t(o, label, target_lan)
            if task != null then
                self.results.push("Completed: Via router objects")
                self.results2.push(sumstring)       
                return task
            end if
            if self.u.len > 0 then continue
            if o.lan != target_lan then continue
            self.u.push(o.users)
        end for
    end if
    if network.services.len == 0 and r0shell == null then// no open ports found, how do we move forward?
        sumstring = sumstring+NL+"No forwarded ports, and was unable to get a remote shell".grey
        LOG("No shells or fwd ports, unable to move forward".warning)
        self.results.push("Failed: No forwarded ports, and unable to etablish an inital shell") 
        self.results2.push(sumstring)
        return null
    end if 
    if network.services.len > 0 then
        sumstring = sumstring+NL+"Forwarded ports found".grey
        LOG("Checking forwarded ports...".sys)
        // if we have fwd ports, we sort and work from there
        for net in network.services
            if net[4] == target_lan then prime_ports.push(net)
            if net[4] != target_lan then fwd_ports.push(net)            
        end for
        // =============== POST INITIAL MAPPING
        if prime_ports.len > 0 then
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
                for o in objects
                    if T(o) == "number" then hn = true 
                    if T(o) == "string" or T(o) == "number" then continue 
                    eo = new SS.EO
                    eo.map(o)
                    eo.escalate
                    if eo.type == "shell" then
                        r0shell = eo
                        if hn and self.pw_changes.indexOf(eo.lan) == null then
                            sumstring = sumstring+NL+("PW change detected at "+eo.lan).grey 
                            self.pw_changes.push(eo.lan)
                        end if
                        ez = _ezb(eo, sumstring)
                        if ez != null then
                            sumstring = sumstring+NL+"Root bounce via prime object".grey 
                            return ez
                        end if
                    end if
                    p_r_obj.push(eo)
                    if not eo.pc then continue
                    if (hn != null) and (self.pw_changes.indexOf(eo.pc.local_ip) == null) then self.pw_changes.push(eo.pc.local_ip)
                end for
            end for
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
                    if T(o) == "string" or T(o) == "number" then continue 
                    eo = new SS.EO
                    eo.map(o)
                    eo.escalate
                    if eo.type == "shell" then
                        if r0shell == null then r0shell = eo
                        ez = _ezb(eo, sumstring)
                        if ez != null then
                            sumstring = sumstring+NL+"Root bounce via mids object".grey 
                            return ez
                        end if
                        sumstring = sumstring+NL+("Remote shell was assigned: "+r0shell.o.host_computer.local_ip.white).grey   
                        r0shell = eo
                        if hn != null and self.pw_changes.indexOf(eo.lan) == null then
                            sumstring = sumstring+NL+("PW change detected at "+eo.lan).grey 
                            self.pw_changes.push(eo.lan)
                        end if
                    end if
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
                    ez = _ezb(p, sumstring)
                    if ez != null then
                        sumstring = sumstring+NL+"Root bounce via prime object".grey 
                        return ez
                    end if
                    sumstring = sumstring+NL+"Remote shell reassigned to target shell".grey 
                    r0shell = p // replace our old eo with a better one
                end if 
                LOG("halp? c16")   
                completed = _t(p, label, target_lan)
                if not h_w then; SS.Utils.wipe_logs(p.o); h_w = true; end if;
                if completed != null then
                    self.results.push("Completed via prime remote object")
                    self.results2.push(sumstring) 
                    return completed
                end if
            end for
        else;LOG("No prime objects found, checking other objects".grey.sys);
            sumstring = sumstring+NL+"No prime objects were found".grey
        end if
        // =============== REMOTE OBJECTS, AT THIS POINT ANY SHELL ANYWHERE WORKS
        if (r_obj.len > 0) and (r0shell == null) then
            sumstring = sumstring+NL+"Remote objects found, and mission needed a shell".grey
            if r0shell == null then LOG("Mission still needs a shell".grey.sys);
            // local mapping, push to prime_local, local_ports, and l_obj
            h_w = null
            for o in r_obj
                if not h_w then; SS.Utils.wipe_logs(o.o); h_w = true; end if; 
                if o.type == "shell" then
                    ez = _ezb(o, sumstring)
                    if ez != null then
                        sumstring = sumstring+NL+"Root bounce via prime object".grey 
                        return ez
                    end if 
                    if not r0shell then r0shell = o; break;
                end if
            end for
        else;LOG("No remote objects found, we have a shell".grey.sys);
            sumstring = sumstring+NL+"Remote objects didnt finish the job, a shell is detected".grey
            ez = _ezb(r0shell, sumstring)
            if ez != null then
                sumstring = sumstring+NL+"Root bounce via prime object".grey 
                return ez
            end if 
            if not r0shell then r0shell = o; break;
        end if
    end if

    // =============== LOCAL NETWORK GET
    if r0shell != null then // router map
        sumstring = sumstring+NL+("We had a launch shell at "+r0shell.o.host_computer.local_ip.white).grey
        LOG("Remote shell found, ready to map network".sys);
        SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["network", target_lan])
        l0 = SS.bamres
        SS.Utils.wipe_logs(r0shell.o)
    else;LOG("No remote shell obtained".grey.sys);
        sumstring = sumstring+NL+"We did not get a remote shell initially".grey
    end if
    // local network full mapping and pivot
    if l0 != null then
        LOG("Local network has been mapped".ok)
        SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["mx"])
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
                                eo.escalate
                                if eo.type == "shell" then 
                                    ez = _ezb(eo, sumstring)
                                    if ez != null then
                                        self.results.push("Completed: Via prime local object bounce")
                                        self.results2.push(sumstring)  
                                        sumstring = sumstring+NL+"Root bounce via local object".grey 
                                        return ez
                                    end if
                                end if
                                LOG("halp? c15")
                                task = _t(eo, label, target_lan)
                                if task != null then
                                    self.results.push("Completed: Via prime local object")
                                    self.results2.push(sumstring)  
                                    return task
                                end if
                                ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                p_l_obj.push(eo)
                            end for
                        else;LOG("No local objects returned, looking for a tsunami. . .".grey.sys)
                        end if
                        // simple bf since dict seemingly takes, FOREVER 
                        if ((p.lib == "libssh.so") or (p.lib == "libftp.so")) then
                            sumstring = sumstring+NL+"Detected SSH/FTP running locally".grey   
                            if self.pw_changes.len > 0 then
                                LOG("Attempting simple connection. . .".green.sys) 
                                rooted = r0shell.o.connect_service(target_lan, p.port, "root", SS.cfg.unsecure_pw, p.lib.replace("lib","").replace(".so",""))
                                if T(rooted) == "shell" or T(rooted) == "ftpshell" then
                                    sumstring = sumstring+NL+"We detected a pw change, and defaulted to a simple connection as root".grey    
                                    LOG(("Root".red+" connection established").ok)
                                    eo = new SS.EO
                                    eo.map(rooted)
                                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                    LOG("halp? c14")  
                                    task = _t(eo, label, target_lan)
                                    if task != null then
                                        self.results.push("Completed: PW change brute force ROOT local connection")
                                        self.results2.push(sumstring)   
                                        return task
                                    end if
                                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                else
                                    LOG("Root connection failed, moving to regular users. . .".grey.sys)
                                    for i in r0shell.users
                                        svc = null 
                                        rooted = r0shell.o.connect_service(target_lan, p.port, i, SS.cfg.unsecure_pw, p.lib.replace("lib","").replace(".so",""))
                                        if T(rooted) == "shell" or T(rooted) == "ftpshell" then
                                            sumstring = sumstring+NL+("We detected a pw change, and defaulted a connection as "+i.white+" and escalated to root").grey     
                                            LOG("User connection established".ok)
                                            eo = new SS.EO
                                            eo.map(svc)
                                            LOG("halp? c13")  
                                            task = _t(eo, label, target_lan)
                                            if task != null then
                                                self.results.push("Completed: PW change brute force USER -> ROOT local connection")    
                                                self.results2.push(sumstring)      
                                                return task
                                            end if
                                            ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                        else if T(svc) == "string" then
                                            if (svc == "Remote host is down") and (label == "system corruption") then return true// pretty sure we dont even capture this, so
                                            LOG("simple connect: ".warning+svc)
                                        end if
                                    end for 
                                end if   
                            else 
                                LOG("Launching tsunami. . .".grey.sys)
                                SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["rcon", target_lan, "root", p.port, p.lib.replace("lib","").replace(".so","")])
                                if T(SS.bamres) == "shell" then
                                    eo = new SS.EO
                                    eo.map(SS.bamres)
                                    LOG("halp? c12")  
                                    task = _t(eo, label, target_lan)
                                    if task != null then
                                        sumstring = sumstring+NL+"We brute forced a local connection using tsunami".grey    
                                        self.results.push("Completed: Brute force local connection from tsunami")
                                        self.results2.push(sumstring)     
                                        return task
                                    end if
                                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                else;LOG("Internal brute force failed")
                                end if
                            end if
                        end if
                    end for
                    // STILL NOT DONE?! LOCAL LIB BOUNCE HOUSE!
                    if p_l_obj.len > 0 then
                        sumstring = sumstring+NL+"Moved onto local objects".grey    
                        for p in p_l_obj
                            if T(p.o) == "shell" then
                                p.escalate
                                LOG("halp? c11")  
                                task = _t(p, label, target_lan)
                                if task != null then
                                    sumstring = sumstring+NL+"Completed mission with a NS shell object".grey     
                                    self.results.push("Completed: Via exploiting a local service")
                                    self.results2.push(sumstring)     
                                    return task
                                end if
                                ez = _ezb(p, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
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
                                            if T(l) == "number" or T(l) == "string" then continue 
                                            eo = new SS.EO
                                            eo.map(l, target_ip, target_lan)
                                            // TODO:
                                            if eo.type == "computer" and eo.is == "root" then LOG(("ROOT COMPUTER DETECTED".green).sys)
                                            eo.escalate
                                            task = _t(eo, label, target_lan)
                                            if task != null then
                                                sumstring = sumstring+NL+"Completed mission with a local ML object".grey     
                                                self.results.push("Completed: Via exploiting a local library")
                                                self.results2.push(sumstring)      
                                                return task
                                            end if
                                            ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                        end for 
                                    end for
                                else;LOG("MX was not loaded on the target machine".grey.sys)
                                    sumstring = sumstring+NL+"We were unable to load MX onto our remote shell".grey     
                                end if 
                            else 
                                LOG("halp? c1") 
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
            else
                LOG("No internal services found, exploiting local libraries. . .".grey.sys);
                l_mx.l("-a")
                if l_mx.libs.len > 0 then
                    sumstring = sumstring+NL+"We had no local services, so we tried a local library bounce".grey      
                    for lib in l_mx.libs 
                        lh = lib.of(null, target_lan)
                        if lh.len == 0 then continue 
                        for o in lh
                            LOG(o)
                            if not o then continue 
                            if (T(o) == "number") or (T(o) == "string") then continue 
                            eo = new SS.EO
                            eo.map(o)
                            LOG(eo)
                            wait(0.1)
                            //ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;  
                            LOG("halp? c10")
                            task = _t(eo, label, target_lan)
                            if task != null then
                                SS.NPC.results.push("Completed: Via exploiting a local library")
                                SS.NPC.results2.push(sumstring)       
                                return task
                            end if
                            // we need to do something with gco, maybe
                        end for
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
                    LOG("NON exploitable service, moving on".grey.sys); 
                    LOG("Launching tsunami. . .".grey.sys)
                    SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["rcon", target_lan, "root", l[3], l[0]])
                    if T(SS.bamres) == "shell" or T(SS.bamres) == "ftpshell" then
                        eo = new SS.EO
                        eo.map(SS.bamres)
                        LOG("halp? c9") 
                        task = _t(eo, label, target_lan)
                        if task != null then; return task;else;LOG("Internal brute force failed".grey.sys);end if
                        ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    end if
                end for
            else;LOG("MX not loaded on network & No internal services to brute force".grey.sys)
                sumstring = sumstring+NL+"Unable to find a viable local port to connect to".grey       
            end if 
        end if
    else
        LOG("Local network was not mapped, rechecking remote. . .".grey.sys)
        sumstring = sumstring+NL+"Local network not mapped initially".grey       
        if prime_ports.len > 0 then 
            sumstring = sumstring+NL+"Ports were found on the target machine".grey       
            //remote brute force
            for p in prime_ports
                if (p[0] != "ssh") or (p[0] != "ftp") then continue
                if self.u.len > 0 and self.pw_changes.indexOf(target_lan) != null then 
                    isu = null
                    for i in self.u 
                        
                        svc = SS.s.connect_service(target_ip)

                    end for
                end if
                sumstring = sumstring+NL+("We found ports to connect to "+p[1]).grey        
                LOG("We have prime ports to try".green.sys)
                svc = SS.MD5.connect(SS.s, target_ip, "root", s[3], s[0])
                if T(svc) == "shell" or t(svc) == "ftpshell" then 
                    eo = new SS.EO
                    eo.map(eo)
                    eo.escalate 
                    LOG("halp? c8") 
                    task = _t(eo, label, target_lan)
                    if task != null then
                        sumstring = sumstring+NL+"We were able to brute force a forwarded port ".grey
                        self.results.push("Completed: Via connecting to a prime fwd port")
                        self.results2.push(sumstring)      
                        return task
                    end if
                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
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
                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    r0shell = eo; 
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
                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                    r0shell = eo; 
                    break;
                else;LOG("Remote brute force connection failed".sys.grey)
                end if
            end for
            if r0shell != null then
                sumstring = sumstring+NL+("We got a shell at "+r0shell.o.host_computer.local_ip.white).grey
                LOG("Remote shell finally found, ready to map network".sys);
                SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["network", target_lan])
                l0 = SS.bamres
                SS.BAM.handler(r0shell.o,SS.CMD.getOne("iget"), ["mx"])
                l_mx = SS.bamres
                SS.Utils.wipe_logs(r0shell.o)
                ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                if T(l0) == "map" and T(l_mx) == "MetaxploitLib" then 
                // router bounce and local hacks
                if l0 == null then; LOG("Unable to map the local network".sys.grey);end if;
                if l_mx == null then; LOG("Unable to get a local MX".sys.grey);end if;
                if l0 and l_mx != null then
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
                            sumstring = sumstring+NL+"We didnt find internal services, we had the chance to router bounce, but we didnt!".grey   
                            // local router bounce
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
                                    if pw != null then LOG("addme")
                                    eo.escalate
                                    if eo.lan == target_lan then r0shell = eo // reassign out r0shell
                                    LOG("halp? c7") 
                                    task = _t(eo, label, target_lan)
                                    if task != null then
                                        self.results.push("Completed: Via exploiting a local library after leveraging fwd ports")
                                        self.results2.push(sumstring)        
                                        return task
                                    end if
                                    ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                    p_l_obj.push(eo)
                                end for
                            else;LOG("No local objects returned, looking for a tsunami. . .".grey.sys)
                            end if
                            // simple bf since dict seemingly takes, FOREVER 
                            if ((p.lib == "libssh.so") or (p.lib == "libftp.so")) then
                                if self.pw_changes.len > 0 then
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
                                        ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
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
                                                LOG("halp? c5") 
                                                task = _t(eo, label, target_lan)
                                                if task != null then
                                                    self.results.push("Completed: Via PW change -> simple brute force using local services *escalated to root from user*")
                                                    self.results2.push(sumstring)          
                                                    return task
                                                end if
                                                ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                            else if T(svc) == "string" then
                                                if (svc == "Remote host is down") and (label == "system corruption") then return true
                                                LOG("simple connect: ".warning+svc)
                                            end if
                                        end for 
                                    end if   
                                else 
                                    LOG("Launching tsunami. . .".grey.sys)
                                    SS.BAM.handler(r0shell.o, SS.CMD.getOne("iget"), ["rcon", target_lan, "root", p.port, p.lib.replace("lib","").replace(".so","")])
                                    if T(SS.bamres) == "shell" then
                                        eo = new SS.EO
                                        eo.map(SS.bamres)
                                        //eo.escalate 
                                        LOG("halp? c4") 
                                        task = _t(eo, label, target_lan)
                                        if task != null then 
                                            self.results.push("Completed: Via tsunami -> brute force using local services")
                                            self.results2.push(sumstring)          
                                            return task
                                        end if
                                        ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                    else;LOG("Internal brute force failed")
                                    end if
                                end if
                            end if
                        end for
                        // STILL NOT DONE?! LOCAL LIB BOUNCE HOUSE!
                        if p_l_obj.len > 0 then
                            sumstring = sumstring+NL+"We found objects on the target machine".grey    
                            for p in p_l_obj
                                if T(p.o) == "shell" then
                                    p.escalate
                                    LOG("halp? c3") 
                                    task = _t(p, label, target_lan)
                                    if task != null then
                                        sumstring = sumstring+NL+"We were able to leverage local NS object".grey    
                                        self.results.push("Completed: Via exploiting prime local shell")
                                        self.results2.push(sumstring)           
                                        return task
                                    end if
                                    ez = _ezb(eo, sumstring);
                                    if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                    SS.BAM.handler(p.o, SS.CMD.getOne("iget"), ["mx"]) 
                                    if SS.bamres != null then
                                        sumstring = sumstring+NL+("We loaded MX onto the system as "+p.is.white).grey      
                                        LOG(("Local "+T(SS.bamres).red+" obtained on "+"TARGET".green+" shell. . .").sys) 
                                        mx = new SS.MX
                                        mx.map(p.o, SS.bamres)
                                        LOG(T(mx.x))
                                        mx.l("-a")
                                        for lib in mx.libs 
                                            local_hacks = lib.of(null, target_lan)
                                            if local_hacks.len == 0 then continue
                                            for l in local_hacks
                                                if T(l) == "number" or T(l) == "string" then continue  
                                                eo = new SS.EO
                                                eo.map(l)
                                                eo.escalate
                                                LOG("halp? c2")  
                                                task = _t(eo, label, target_lan)
                                                if task != null then
                                                    sumstring = sumstring+NL+"We locally exploited the target machine".grey      
                                                    self.results.push("Completed: Via exploiting prime local objects' local libraries")      
                                                    self.results2.push(sumstring)      
                                                    return task
                                                end if
                                                ez = _ezb(eo, sumstring);if ez != null then;sumstring = sumstring+NL+"Root bounce via local object".grey;return ez;end if;
                                            end for
                                        end for 
                                    else;LOG("MX was not loaded on the target machine".grey.sys)
                                        sumstring = sumstring+NL+"Unable to load mx on the system".grey      
                                    end if 
                                else 
                                    LOG("halp? c1") 
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
                    sumstring = sumstring+NL+"Failed to load local mx".grey      
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
    self.results.push("Failed: Our efforts were futile")
    self.results2.push(sumstring)      
    return result
end function
//////////////////////////////////////////////////////////////  
///====================== MODULES =======================////
////////////////////////////////////////////////////////////
