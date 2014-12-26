var fs = require("fs");

var tsSrc = "www/ts/";
var jsDest = "www/js/";

var releaseFolder = "releaseBuilds\\"
var wp8Build = "FlyFrenzy.xap";
var androidBuild = "FlyFrenzy.apk";

var pluginCmds = [
	'cordova plugin add com.google.admobsdk',
	'cordova plugin add com.google.playservices',
	'cordova plugin add com.rjfun.cordova.plugin.admob',
	'cordova plugin add org.apache.cordova.dialogs',
	'cordova plugin add org.apache.cordova.vibration',
	'cordova plugin add org.apache.cordova.file',
	'cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git'
];


desc('This is the default task.');
task('default', [], function (params) {
  console.log('No Default task defined');
});

desc('Initializes the project.');
task('init', [], function(params) {
	console.log("Deleting old folders");
	var deleteCmds = [
		'if exist platforms rmdir /s /q platforms',
		'if exist plugins rmdir /s /q plugins',
		'if exist releaseBuilds rmdir /s /q releaseBuilds'
	];
	jake.exec(deleteCmds, {printStdout: true}, function () {
		complete();
		console.log('adding platforms...');
		var androidPlatform = "cordova platform add android";
		var wp8Platform = "cordova platform add wp8";
		var platformCmds = [androidPlatform, wp8Platform];
		jake.exec(platformCmds, {printStdout: true}, function () {
			complete();
			console.log('adding plugins...');
			jake.exec(pluginCmds, {printStdout: true}, function () {
				complete();
			});
		});

		var cmd = ['mkdir releaseBuilds'];
		console.log('creating release build folder...');
		jake.exec(cmd, {printStdout: true}, function () {
			complete();
		});	
	});
});

desc('Build Android Release');
task('android', [], function (params) {
	var path = ".\\platforms\\android\\ant-build\\CordovaApp-release-unsigned.apk";
	var alignedPath = ".\\platforms\\android\\ant-build\\" + androidBuild;

	console.log("Deleting old build");
	var cmd = ['if exist ' + releaseFolder + androidBuild + ' del ' + releaseFolder + androidBuild];
	jake.exec(cmd, {printStdout: true}, function () {
		complete();
	});

	console.log('Building Android Phone Release...');
	var cmd = ['cordova build --release android'];
  	jake.exec(cmd, {printStdout: true}, function () {
  		complete();
  		console.log('Signing APK: Please enter password...');
  		var cmd = ['jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore ' + path + ' alias_name'];
    	jake.exec(cmd, {printStdout: true}, function() {
	  		complete();
	  		console.log('Byte Aligning APK');
	  		var cmd = ['zipalign -v 4 ' + path + ' FlyFrenzy.apk'];
	  		jake.exec(cmd, {printStdout: true}, function() {
	  			complete();
	  			console.log('Moving APK');
	  			var cmd = ['move ' + androidBuild + ' ' + releaseFolder];
	  			jake.exec(cmd, {printStdout: true}, function() {
	  				complete();
	  				console.log('Successfully built, signed, aligned, and moved APK to release folder!');
	  			});
	  		});
		});
  	}); 
});

desc('Build Release Windows Phone');
task('wp8', [], function (params) {
	console.log('Building Windows Phone Release');
	var path = ".\\platforms\\wp8\\Bin\\Release\\CordovaAppProj_Release_AnyCPU.xap";
	var cmd = ['cordova build --release wp8'];
  	jake.exec(cmd, {printStdout: true}, function () {
  		complete();
  		var cmd = ['move ' + path + ' ' + releaseFolder + wp8Build];
    	jake.exec(cmd, {printStdout: true}, function() {
	  		complete();
	  		console.log('Successfully compiled and moved XAP package to release folder!');
		});
  	}); 
});

desc('Compiles TS files into JS');
task('compile', [], function (params) {
	var path = './www/ts/';
	var dirs = fs.readdirSync(path);
	/* b/c of the references everything gets compiled just by compiling this */
	var cmds = ['if not exist .\\www\\js\\game mkdir .\\www\\js\\game', 'tsc ./www/ts/app.ts']; 
	jake.exec(cmds, {printStdout: true}, function () {
		complete();
		// move all of the ts files into our js folder
		var c = ['for /R .\\www\\ts\\ %f in (*.js) do move %f .\\www\\js\\game\\']; 
		jake.exec(c, {printStdout: true}, function() {
			complete();
			console.log('Successfully compiled and moved files!');
		});
	});  
});