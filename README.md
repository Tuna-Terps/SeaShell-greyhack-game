 <h1> A collection of scripts written for use in the game grey hack https://store.steampowered.com/app/605230/Grey_Hack/ </h1>
<br>
<small> WIP </small><br>

<b> Acknowledgments </b><br>
// Thank you @github: WyattSL for the GreyHack Game documentation<br>
// Thank you @github: psimonson for https://github.com/psimonson/greyhack-scripts/tree/master/v0.8/scripts<br>
// Thank you to the members of the GreyHack community & discord<br>
<br>
## INSTALL ##

-- Use installer to create the required file structure, (*be sure to launch as home user*) alternatively you can: <br>
*create a folder named src, and place all scripts inside of it via the game code editor <br>
 <br>
-- You can pase the src code from here to the files, then easily compile them all using the installer <br>

-- adjust the paths for the refernce code in main.src and payload.src <br>
ex: import_code("/home/USER/src/utils.src") -- only if done manually !!

-- You will need to compile the following files in this order, name the binary the same as the src<br><br>
1.) objects.src --> ** MUST ALLOW IMPORTS **<br>
2.) binary.src --> ** MUST ALLOW IMPORTS ** --> SENSITIVE FILE, DELETE THE SRC<br>
3.) send.src --> ** MUST ALLOW IMPORTS ** --> SENSITIVE FILE, DELETE THE SRC<br>
4.) eel.src --> SENSITIVE FILE, DELETE THE SRC<br>
5.) payload.src <br>
6.) main.src --> RENAME TO ss 

eel.src --> rshell payload, must define your rshell's IP <br>
binary.src --> contains obfuscated variables for root, users, and your FTP depot server info <br> 
send.src --> references binary.src, for your protection, do not keep src as these can be easily compromised<br>


Once complete, the only required filed are ss, eel, and payload<br>
<br>
<h2> Usage</h2><br>
I have had some questions on how to best utilize in game & Here are some tips; <br>

1.) When capturing and utilizing shell objects, For *Most* commands in surf_mode you must mount; then launch the binaries to run commands on your newly captured machine<br>
2.) Most commands work passed to a computer object, obviously things a shell can do, a computer cannot itself. <br>
3.) File objects are mainly WIP. Use their file permissions, as well as your scope to better strategize other object use<br>
4.) If you are getting errors when it comes to file paths, please first check your permissions, there are some places i might forget<br>
5.) Exploit menu is somewhere between deprecated and redundant, ill let you decide<br>
<br>
Hope you enjoy if you find useful;<br>
"Surf Mode"<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/8ace3ea9-e893-4500-8403-532803dd9d98|width=50)
<br>
port entry<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/5497579a-73ce-410a-8fce-650ba427b51b)
<br>
exploit menu<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/aab42764-d65a-4d3d-9c51-b23d483b7096)
<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/fc0ae38b-00b1-4e5e-a98b-429c71787bf0)
<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/63499508-1dc8-4c17-bee8-bfefd4b6e184)
<br>
global objects<br>
![image](https://github.com/Tuna-Terps/grey-hack-game-scripts/assets/62733984/244a98e5-bd64-4911-9383-a8cd5578e942)
<br>
LAN mappin<br> 
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/482ef634-330e-412c-bbf8-0d58eae222e0)
