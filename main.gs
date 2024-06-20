//////////////////////////////////////////////////////////////  
///==================== SEASHELL ========================////
////////////////////////////////////////////////////////////
// ><> ><> ><> 1.0.7a
// - major revision to the codebase
// - user config + new data cache
// - chain multiple commands in surf mode using ;
// - chain multiple commands launching seashell using ,
// - all commands can be executed remotely using crab
// - predefined module strings can be executed using crab
// - R.A.F.T NPC mission completion now makes use of CRAB 
// added corruption missions; file deletion and retrieval wip
// - Net Sessions can be exploited manually or with the old 
// "hack on rails" entry method
// - Local exploits scan / exploit / save 1-1 with net session
// - exploit payloads can be selected and chained together
// - file object TLC, removed functions specifically for files and added
// compatibility for core surf mode functions
// - fs command with a range of flags to find files, inject content into them, etc
// - improved file editor with insert option, paste wip
// - metaxploit and crypto libs can be loaded and unloaded based on the host
// - spearfish command designed specifically to target players on wifi using the weak lib

// ><> ><> ><> 1.7.1
// - script build update; versioning will reflect this and not game
// - Added a few new key files and directories in the cache
// 1.) ss.aliases --> aliases file to shorthand commands
// 2.) ss.libs --> strong and weak folders for future additions
// - Rshell interface completed, added log corruption option
// - the following commands got some bug fixes
// - secure , ezwifi , wibounce , 
// - WIP:
// - User macros
// - Remote Server + API
///====================== INIT =========================////
import_code("/home/2NA/src/utils")
import_code("/home/2NA/src/core")
import_code("/home/2NA/src/modules")
// auth_pass auth_user mail_acct mail_pw rshell_ip unsecure_pw salt_key
// * LEAVING AUTH_PASS empty will disable password use for seashell
// * LEAVING MAIL AND MAILPW EMPTY, WILL PROMPT FOR LOGIN EACH TIME
// * SALT_KEY --> MP select numbers 
SS.init("", "root", "", "", "1.1.1.1", "f1shb0wl", "ASecureToken")
//////////////////////////////////////////////////////////////  
///==================== SEASHELL ========================////
////////////////////////////////////////////////////////////
