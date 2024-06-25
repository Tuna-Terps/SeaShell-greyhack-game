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
1.) Use installer to create the required file structure <br>
Installer tutorial + SeaShell demo --> https://www.youtube.com/watch?v=rGP8ajRrfPs <br>
MANUALLY: <br>
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
# WEAK LIB # (MP only)<br>
The script makes use of a WEAK LIBRARY to perform major operations<br>
Currently it is utilizing init.so version _ hosted in game on www.google.com labelled as init.weak.so<br>
Donwload this file to /path/to/cache/ss.libs/weak and rename it as init.so , see -h rn

DELETE ALL SRC FILES ONCE YOU HAVE SUCCESFULLY RAN SS<br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/3cb07e0a-6208-4a4e-a55c-0f2ed79f4669" width=50% height=50%>
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

<br> 1.) Your most utilized command will be "entry" simply use a ip/domain as a command name to begin !
<br> 2.) The help menu if your friend ! Use command -h commandName to see usage
<br> 3.) crab is a prefix for all seashell commands to allow local functions to be executed on remote hosts without needing to upload seashell
<br> 4.) mx is a command to dynamically load and unload metaxploit to those systems
<br>
Hope you enjoy if you find useful;<br>
<br><h2>"Surf Mode"</h2><br><br>
<!-- <img src="" width=50% height=50%> -->
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/9b0994c8-7295-4aea-befc-d757811156bf" width=50% height=50%>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/a3fe0f5a-5715-4c7c-8a1d-d746d03fecf3" width=50% height=50%>

<br><h2>C.R.A.B command relay access bridge</h2><br><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/727c626b-d84d-479c-85fe-4c821c1893b2" width=50% height=50%>
<br><h3>command chaining</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/ffb9b890-deaf-4b9f-9af6-8b4466bb0c0a" width=50% height=50%>

<br>
<br><h3>port entry</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/87e1e9a3-3e8b-48db-b314-485a58a8b556" width=50% height=50%>
<br>
<br><h3>netsession menu</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/af2855ea-bb92-485c-862e-1217bc16186b" width=50% height=50%>
<br>
<br><h3>exploit selection + chaining</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/8d5311e3-f6ea-41a6-9656-5220f1ffcd4a" width=50% height=50%>
<br>
<br><h3>global objects</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/b52e1e63-5d55-4838-b583-bda08da07e5b" width=50% height=50%>
<br>
<br><h3>LAN mappin</h3><br> 
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/a88ce523-f7f7-4339-af45-683718b700fa" width=50% height=50%>
<br><h3>File Editor</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/24437577-3760-440a-84fd-d875bbff6dfd" width=50% height=50%>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/9ab82362-e0d7-456a-bcfc-c041bc774689" width=50% height=50%>
<br><br>
<br><h3>WiFi all in one</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/f5f2f2b9-019a-438c-a199-3bfe6cd0eec5" width=50% height=50%>
<br>
<br><h3>R.A.F.T remote assignment fulfillment tool</h3><br>
<img src="https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/1673ebf9-d53d-40ff-aa45-13f475b24201" width=50% height=50%>
