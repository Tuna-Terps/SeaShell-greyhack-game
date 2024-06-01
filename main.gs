//////////////////////////////////////////////////////////////  
///==================== SEASHELL ========================////
////////////////////////////////////////////////////////////
// 1.0.7a
// - Major revision to the codebase
// - Chain multiple commands in surf mode using ;
// - Chain multiple commands launching seashell using ,
// - All commands can be executed remotely using crab (Command.Relay.Access.Bridge)
// - Predefined module strings can be executed using crab, preload them in ss before compilation
// - NPC mission completion (Remote.Assignment.Fulfillment.Tool) now makes use of crab, 
// added corruption missions, and made vast improvements to completion rates
// - Net sessions can be exploited manually or with the old 
// "hack on rails" entry method, use an ip/domain as a command to begin !
// - Exploit payloads can be selected and chained together
// - File object TLC, removed functions specifically for files and added
// compatibility for core surf mode functions
// - User config + new data cache, 
// - Exploit database can grow exponentially, improvements to hash table times

// - WIP:
// - Extended rshell menu, mostly done but needs a few functions done
// - Local exploits scan / exploit / save 1-1 with net session
// - User macros
// - VIM like file editor
// - Server clusters for when your exploit database grows exponentially
///====================== INIT =========================////
import_code("/home/2NA/src/utils")
import_code("/home/2NA/src/modules")
import_code("/home/2NA/src/core")
// auth_pass auth_user mail_acct mail_pw rshell_ip unsecure_pw
SS.init("password", "2NA", "mail@bolds.net", "mail", "1.1.1.1", "f1shb0wl") // CHANGE ME
//////////////////////////////////////////////////////////////  
///==================== SEASHELL ========================////
////////////////////////////////////////////////////////////
