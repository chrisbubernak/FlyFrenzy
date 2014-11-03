var fs = require("fs");

var tsSrc = "www/ts/";
var jsDest = "www/js/";

desc('This is the default task.');
task('default', [], function (params) {
  console.log('This is the default task.');
});

desc('Build Android Release');
task('android', [], function (params) {
  console.log('Building Android Phone Release...');
  console.log('Signing Android Release APK...');
  console.log('Byte Aligning Android Release APK...')
});

desc('Build Release Windows Phone');
task('wp8', [], function (params) {
  console.log('Building Windows Phone Release');
  //console.log(sys.inspect(arguments));
});

desc('Compiles TS files into JS');
task('compile', [], function (params) {
	var path = './www/ts/';
	var dirs = fs.readdirSync(path);
	var cmds = ['tsc ./www/ts/app.ts']; /* b/c of the references everything gets compiled just by compiling this */
	jake.exec(cmds, {printStdout: true}, function () {
		complete();
		var c = ['for /R .\\www\\ts\\ %f in (*.js) do move %f .\\www\\js\\game']; // move all of the ts files into our js folder
		jake.exec(c, {printStdout: true}, function() {
			complete();
			console.log('Successfully compiled and moved files!');
		});
	});  
});