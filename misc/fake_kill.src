// kill - compiled file meant to replace a player's kill command
// if they managed to get a back door on their server,  i can imagine they will fall for this

//command: kill
PID = params[0].to_int
if typeof(PID) != "number" then exit("The PID must be a number\n" + command_info("kill_usage"))
processes = get_shell.host_computer.show_procs
process_list = processes.split("\n")
for process in process_list
	parsed = process.split(" ")
	process_pid = parsed[1]
	process_cmd = parsed[4]
	if PID == process_pid.to_int and process_cmd == "kernel_tasks" then exit("Permission denied. Process protected.")
end for 
output = get_shell.host_computer.close_program(PID)
if output == true then exit("Process " + PID + " closed");
if output then exit(output)
print("Process " + PID + " not found")
