 <h1> A collection of scripts written for use in the game grey hack https://store.steampowered.com/app/605230/Grey_Hack/ </h1>
<br>
<small> WIP </small><br>

<b> Acknowledgments </b><br>
// Thank you @github: WyattSL for the GreyHack Game documentation<br>
// Thank you @github: psimonson for https://github.com/psimonson/greyhack-scripts/tree/master/v0.8/scripts<br>
<br>
## INSTALL ##

-- create a folder named src, and place all scripts inside of it via the game code editor ** These paths have changed, please refer to main.src

-- adjust the paths for the refernce code in main.src and autolocal.src <br>
ex: import_code("/home/USER/src/utils.src")

-- You will need to compile the following files in this order, name the binary the same as the src<br><br>
1.) objects.src --> ** MUST ALLOW IMPORTS **
2.) binary.src --> ** MUST ALLOW IMPORTS ** --> SENSITIVE FILE, DELETE THE SRC<br>
3.) send.src --> ** MUST ALLOW IMPORTS ** --> SENSITIVE FILE, DELETE THE SRC<br>
4.) eel.src --> SENSITIVE FILE, DELETE THE SRC<br>
5.) payload.src <br>
6.) main.src --> RENAME TO ss 

eel.src --> rshell payload, must define your rshell's IP <br>
binary.src --> contains obfuscated variables for root, users, and your FTP depot server info <br> 
send.src --> references binary.src, for your protection, do not keep src as these can be easily compromised<br>



Once complete, the only required filed are ss, eel, and payload<br>
Hope you enjoy if you find useful;<br>
![image](https://github.com/Tuna-Terps/grey-hack-game-scripts/assets/62733984/0ac8a1f3-e4e1-4c42-8c60-8d3d429b74a2)
<br>
Some commands available in surf mode;<br>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/bd2220d6-f0b2-4144-bcca-bc8fc4baf417)
<br>
<small>port entry</small><br>
 ![image](https://github.com/Tuna-Terps/grey-hack-game-scripts/assets/62733984/5cda8245-88db-447b-9bd2-257a7f247a34)
<br>
<small>exploit menu - modular functions before using surf mode</small><br>
![image](https://github.com/Tuna-Terps/grey-hack-game-scripts/assets/62733984/f6c00f90-0542-46a0-aa86-9513150677bb)
<br>
<small>global objects <br> </small>
![image](https://github.com/Tuna-Terps/grey-hack-game-scripts/assets/62733984/244a98e5-bd64-4911-9383-a8cd5578e942)
<br>
<small>LAN mapping <br> </small>
![image](https://github.com/Tuna-Terps/SeaShell-greyhack-game/assets/62733984/482ef634-330e-412c-bbf8-0d58eae222e0)
