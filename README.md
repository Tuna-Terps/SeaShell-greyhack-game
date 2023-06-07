# grey-hack-game-scripts
grey hack - game scripts

A collection of scripts written for use in the game grey hack https://store.steampowered.com/app/605230/Grey_Hack/
// Thank you @github: WyattSL for the GreyHack Game documentation
// Thank you @github: psimonson for https://github.com/psimonson/greyhack-scripts/tree/master/v0.8/scripts

## INSTALL ##

-- create a folder named src, and place all scripts inside of it via the game code editor

-- adjust the paths for the refernce code in main.src and autolocal.src 
ex: import_code("/home/USER/src/utils.src")

-- You will need to compile the following files in this order, name the binary the same as the src
1.) shellobj.src --> ** MUST ALLOW IMPORTS ** <br>
2.) compobj.src --> ** MUST ALLOW IMPORTS **<br>
3.) fileobj.src --> ** MUST ALLOW IMPORTS **<br>
4.) binary.src --> ** MUST ALLOW IMPORTS ** --> SENSITIVE FILE, DELETE THE SRC<br>
5.) send.src --> ** MUST ALLOW IMPORTS ** --> SENSITIVE FILE, DELETE THE SRC<br>
6.) eel.src --> SENSITIVE FILE, DELETE THE SRC<br>
6.) payload.src <br>
7.) wipe.src  <br>
8.) main.src --> RENAME TO ss 

eel.src --> rshell payload, must define your rshell's IP 
binary.src --> contains obfuscated variables for root, users, and your FTP depot server info
send.src --> references binary.src, for your protection, do not keep src as these can be easily compromised


