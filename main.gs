//////////////////////////////////////////////////////////////  
///==================== SEASHELL ========================////
////////////////////////////////////////////////////////////
// 1.0.7a
// - major revision to the codebase
// - chain multiple commands in surf mode using ;
// - chain multiple commands launching seashell using ,
// - all commands can be executed remotely using crab
// - predefined module strings can be executed using crab
// - NPC mission completion (raft) now makes use of crab, added corruption missions
// - Net Sessions can be exploited manually or with the old 
// "hack on rails" entry method
// - exploit payloads can be selected and chained together
// - file object TLC, removed functions specifically for files and added
// compatibility for core surf mode functions
// - user config + new data cache

// - WIP:
// - Extended rshell menu, mostly done but needs a few functions done
// - Local exploits scan / exploit / save 1-1 with net session
// - User macros
// - VIM like file editor
// - Remote Server + API
///====================== INIT =========================////
import_code("/home/2NA/src/utils")
import_code("/home/2NA/src/core")
import_code("/home/2NA/src/modules")
// auth_pass auth_user mail_acct mail_pw rshell_ip unsecure_pw
// * LEAVING MAIL AND OR MAILPW EMPTY, WILL PROMPT FOR LOGIN EACH TIME
// * CHOOSING PASSWORD AS "" WILL SKIP AUTHORIZATION ON LAUNCH
SS.init("++++++++", "2NA", "", "", "1.1.1.1", "f1shb0wl", "ASecureToken")
//////////////////////////////////////////////////////////////  
///==================== SEASHELL ========================////
////////////////////////////////////////////////////////////
