<h1 style="font-size: 28px;">SeaShell 1.0.7a</h1>
<h1> A collection of scripts written for use in the game grey hack https://store.steampowered.com/app/605230/Grey_Hack/ </h1>
<br>
<small> **Nightly** not available yet </small><br>

<b> Acknowledgments </b><br>
// Thank you @github: WyattSL for the GreyHack Game documentation<br>
// Thank you @github: psimonson for https://github.com/psimonson/greyhack-scripts/tree/master/v0.8/scripts<br>
// Thank you to the members of the GreyHack community & discord<br>
<br>
## INSTALL ##
# FILESYSTEM #<br>
1.) Use installer to create the required file structure, (*be sure to launch as home user*) alternatively you can: <br>
*create a folder named src, and place all scripts inside of it via the game code editor <br>
 <br>
-- You can pass the src code from here to the files, then easily compile them all using the installer <br>
-- adjust the paths for the refernce code in main.src and payload.src <br>
ex: import_code("/home/USER/src/utils.src") -- only if done manually !!
# MANUAL COMPILE #<br>
-- You will need to compile the following files in this order, name the binary the same as the src<br><br>
<br> MAIN PROGRAM <br><br>
1.) utils.src --> ** MUST ALLOW IMPORTS **<br>
2.) core.src --> ** MUST ALLOW IMPORTS **<br>
3.) modules.src --> ** MUST ALLOW IMPORTS **<br>
4.) main.src --> RENAME TO ss <br>
<br> ESSENTIAL COMMANDS <br><br>
1.) -cfg -ccd --> builds entire user cache
Once complete, the only required filed are ss 
# LOCAL DB # (NPC PW hashes)<br>
1.) Youll need the dictionary files from https://github.com/linuxgruven/dictionary<br>
2.) The script will ask you to paste the contents into the script, using CTRL+SHIFT+V copy the correspnding.src to the terminal running installer.<br>
3.) You will be prompted for your user in order for the builder script to build the hashes <br>
4. The installer script can be ran in stages, or provides a full installation. 

DELETE ALL SRC FILES ONCE YOU HAVE SUCCESFULLY RAN SS<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/1ebbffd3-c5ea-49ae-baf6-8945e32bd47e)
<h1>SeaShell Features </h1><br>
1.) Manage multiple objects in a sandbox environment<br>
2.) Capture net sessions remotely, return exploit objects from launched binaries<br>
3.) Internal & External LAN bouncing <br>
4.) Extensive surf mode which intends to replicate all vanilla commands<br>
5.) Extended rshell-interface and commands<br>
6.) FileSystem browser, editor, deleter ;)<br>
7.) Service Manager & Site Builder<br>
& More !<br>
<br>
<br>
<h2> Usage</h2><br>
I have had some questions on how to best utilize in game & Here are some tips; <br>

1.) <br> Your most utilized command will be "entry" simply use a ip/domain as a command name to begin !
2.) <br> The help menu if your friend ! Use command -h commandName to see usage
3.) <br> crab is a prefix for all seashell commands to allow local functions to be executed on remote hosts without needing to upload seashell
4.) <br> mx is a command to dynamically load and unload metaxploit to those systems
<br>
Hope you enjoy if you find useful;<br>
"Surf Mode"<br>

command chaining<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/ffb9b890-deaf-4b9f-9af6-8b4466bb0c0a=250x250)
<br>
port entry<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/87e1e9a3-3e8b-48db-b314-485a58a8b556)
<br>
netsession menu<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/af2855ea-bb92-485c-862e-1217bc16186b)
<br>
exploit selection + chaining<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/8d5311e3-f6ea-41a6-9656-5220f1ffcd4a)
<br>
global objects<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/b52e1e63-5d55-4838-b583-bda08da07e5b)
<br>
LAN mappin<br> 

File Editor<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/24437577-3760-440a-84fd-d875bbff6dfd)
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/9ab82362-e0d7-456a-bcfc-c041bc774689)
<br>
WiFi all in one
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/f5f2f2b9-019a-438c-a199-3bfe6cd0eec5)
<br>
R.A.F.T remote assignment fulfillment tool
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/1673ebf9-d53d-40ff-aa45-13f475b24201)


