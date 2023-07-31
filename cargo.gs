//////////////////////////////////////////////////////////////  
///======================= CARGO =======================///
////////////////////////////////////////////////////////////
globals.debug = true
globals.entry_objects = true
import_code("/home/2NA/src/objects")
globals.entry_util = true
import_code("/home/2NA/src/utils") 
data = get_custom_object()
//MX = data.mx
crypto = data.crypto
Query = @data.query
Format = @data.get_format
// db
DB1 = data.DB1
DB2 = data.DB2
// object cache
SO = data.SO
CO = data.CO
FO = data.FO

data.exports = []

print(init+color.red+"~~~~^~~^~~^~ Dropping Cargo ~^~~^~~^~~~~")
if not data then exit("><> ><> ><>")
eLibs = [] // exploit libs
MX = Utils.mx_crawl(get_shell)
if not MX then exit(warning+"metaxploit was not found")
local_shell = get_shell
pass = null
if params.len == 0 then pass = "pass"
if params.len == 1 then pass = params[0]
print("data: "+pass)
libs = ["libhttp.so", "init.so"]
found_libs = []
for eLib in libs 
    crawled  = null
    crawled = Utils.ml_crawl(local_shell, MX, eLib)
    if crawled then found_libs.push(crawled)
end for
if found_libs.len == 0 then return print(warning+"no libraries found")
hacks = []
for flib in found_libs
    lib = flib.lib_name
	libV = flib.version
	libName = lib+"_v"+libV
    query = Query(lib, libV)
    hacks = []
	if not query then 
        //print(color.grey+"<i>DB query failed: "+libName)
		if user_input(color.white+"Press 1 to manually scan: "+color.cap).to_int != 1 then continue
		dump = MX.scan(flib)
		if not dump then continue
		addresses = MX.scan(dump)
		for mem in addresses
			hack = {}
			values = []
			if globals.debug then print("Address: " + mem)
			data = MX.scan_address(dump, mem)
			strings = data.split("Unsafe check: ")
			for string in strings
				if string == strings[0] then continue
				value = string[string.indexOf("<b>")+3:string.indexOf("</b>")]
				if globals.debug then print(" --> " + value)
				values = values + [value]
			end for
			hack["metalib"] = filename
			hack["memory"] = mem
			hack["string"] = values
			hacks = hacks + [hack] 
		end for
	else
		hacks = Format(query)
	end if
	if hacks.len == 0 then continue
    for hack in hacks
		result = null
		if hack.len < 2 then continue
		result = flib.overflow(hack[1]["memory"], hack[2]["string"], pass)
		type = typeof(result)
		if result == null then
			str = color.white+"overflow result --> "+color.cap+color.red+"FAIL"
			if hack.len > 3 then str = str+"\n"+color.grey+"><> ><> ><>\n"+hack[3]["requirements"]+"\n"+color.grey+"><> ><> ><>"
			print(str)
			continue
		end if
		print(color.white+"<i>overflow resulted in: </i><b>"+color.cap+color.green+type)
		a = null
		if type == "shell" then
			a = new data.so
			a.init(result);
			SO.push([a, "captured"])
		else if type == "computer" then 
			a = new data.co
			a.init(result);
			CO.push([a, "captured"])
		else if type == "file" then 
			a = new data.fo
			a.init(result);
			FO.push([a, "captured"])
		else if type == "string" then 
			continue
		else if type == "number" then
			Others.push(1)
			continue 
		end if
	end for
end for
return data
//////////////////////////////////////////////////////////////  
///======================= CARGO =======================///
////////////////////////////////////////////////////////////
