var fs = require('fs');
var exec = require('child_process').exec;

var basecommands = new Array();
var hosts = new Array();
var scancommands = new Array();
var cmdindx = 0;
var hostindx = 0;
var scancmdindx = 0;
var lasthost = "";



function getconfig(){
	console.log("getconfig");
	fs.readFile("./commands.txt", 'utf8', function(err, data) {
		basecommands = data.split("\n");
		fs.readFile("./scan/commands.txt", 'utf8', function(err, data) {
			scancommands = data.split("\n");
			fs.readFile("./scan/hosts.txt", 'utf8', function(err, data) {
				hosts = data.split("\n");
				startbasecommands();
			});
		});
	});
}

function runcommand(cmd){
	console.log("runcommand");
	var child;
	child = exec(cmd,
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
				cmdindx++;
				startbasecommands();
			});
}

function startbasecommands(){
	console.log("startbasecommands");
	if(cmdindx < basecommands.length-1){
		var command = basecommands[cmdindx].trim();
		if(command.length > 0){
			runcommand(command);
		}else{
			cmdindx++;
			startbasecommands();
		}
	}else{
		cmdindx = 0;
		hostindx = 0;
		scancmdindx = 0;
		startscan();
	}
}

function startscan(){
	console.log("startscan");
	if(hostindx < hosts.length-1){
		var thost = hosts[hostindx].trim();
		if(thost.length > 0){
			cmdindx = 0;
			lasthost = thost;
			scanhost();
		}else{
			hostindx++;
			startscan();
		}
	}else{
		cmdindx++;
		startbasecommands();
	}
}

function savescanlog(cmd,host,dlog){
	console.log("savescanlog");
	var dcmd = cmd.split(" ")[0];
	var hostfolder = host;//.split("/")[2].replace(".","");
	var dir = './scan/logs/' + hostfolder;

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	fs.writeFile(dir + "/" + dcmd, dlog, function(err) {

		if(err) {
			return console.log(err);
		}

		console.log("The command " + dcmd + " for " + hostfolder + " was saved!");
		cmdindx++;
		scanhost();
	});
}

function runcommandhost(cmd,host){
	console.log("runcommandhost - "+cmd+" - "+host);
	var child;
	child = exec(cmd,
			function (error, stdout, stderr) {
				var dlog = 'stdout: ' + stdout + "\n";
				dlog += 'stderr: ' + stderr + "\n";
				if (error !== null) {
					dlog += 'exec error: ' + error + "\n";
				}
				savescanlog(cmd,host,dlog);
			});
}

function scanhost(){
	console.log("scanhost");
	if(cmdindx < scancommands.length-1){
		var command = scancommands[cmdindx].trim();
		if(command.length > 0){
			command = command.replace("host",lasthost);
			runcommandhost(command,lasthost);
		}else{
			cmdindx++;
			scanhost();
		}
	}else{
		
		hostindx++;
		if(hostindx < hosts.length-1){
			cmdindx = 0;
		}else{
			hostindx = 0;
			cmdindx = 0;
		}
		startscan();
	}
}

getconfig();


