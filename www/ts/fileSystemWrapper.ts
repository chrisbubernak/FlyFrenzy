/// <reference path="definitions/cordova/plugins/FileSystem.d.ts"/>

/* expose a nice clean interface to the rest of the app */
module FileSystemWrapper {
	//var storageLocation: string = cordova.file.dataDirectory;

	export function ReadHighScores() {
		//var r = new FileReader();
		//(<any>window).plugins.toast.showLongBottom(cordova.file.dataDirectory);
		var storageLocation: string = cordova.file.dataDirectory;
		window.requestFileSystem(window.PERSISTENT, 
        	1024 * 1024, //1 mb of storage 
        	function(fs: FileSystem) { // success callback
        		var root: DirectoryEntry = fs.root;
        		root.getFile("scores", {create: true},
        			function(entry: FileEntry) {
						entry.file(
							function(file: File){ 
								var reader = new FileReader();
								reader.onloadend = function(e) {
									(<any>window).plugins.toast.showLongBottom(this.result);
								};
								reader.readAsText(file);
							},
        					FileSystemWrapper.ErrorHandler);
        			},
        			FileSystemWrapper.ErrorHandler);
        	}, 
        	FileSystemWrapper.ErrorHandler
        );
	}

	export function AddHighScore(score: number) {
		var storageLocation: string = cordova.file.dataDirectory;
		window.requestFileSystem(window.PERSISTENT, 
        	1024 * 1024, //1 mb of storage 
        	function(fs: FileSystem) { // success callback
        		var root: DirectoryEntry = fs.root;
        		root.getFile("scores", {create: true},
        			function(entry: FileEntry) {
						entry.createWriter(
							function(fileWriter: FileWriter){ 
								fileWriter.seek(fileWriter.length);
								var blob = new Blob([" " + score], {type:'text/plain'});
								fileWriter.write(blob);
								(<any>window).plugins.toast.showLongBottom("Added New High Score!");
							},
        					FileSystemWrapper.ErrorHandler);
        			},
        			FileSystemWrapper.ErrorHandler);
        	}, 
        	FileSystemWrapper.ErrorHandler
        );
	}

	export function ErrorHandler(e) {
		var msg = '';
		switch(e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'Quota Exceeded Error';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'Not Found Error';
				break;
			case FileError.SECURITY_ERR:
				msg = 'Security Error';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'Invalid Modification Error';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'Invalid State Error';
				break;
			default:
				msg = 'Unknown Error';
				break;
		}
		alert(msg);
		//(<any>window).plugins.toast.showShortBottom(msg);
	}


}