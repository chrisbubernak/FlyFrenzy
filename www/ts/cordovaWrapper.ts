/// <reference path="definitions/cordova/cordova.d.ts"/>
/// <reference path="definitions/cordova/plugins/Dialogs.d.ts"/>

class CordovaWrapper {
	public static runningInBrowser: boolean = false;

	public static confirm(message: string, confirmCallback, title: string, buttonLabels: Array<string>) {
		if (CordovaWrapper.runningInBrowser) {
			var result = confirm("Title: " + title + " Message: " + message);
			var buttonIndex = result ? 1 : 0;
			confirmCallback(buttonIndex);
			return;
		}

		navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
	}

	public static prompt(message: string, promptCallback, title: string, buttonLabels: Array<string>, defaultText: string) {
		if (CordovaWrapper.runningInBrowser) {
			var result = prompt("Title: " + title + " Message: " + message);
			promptCallback({buttonIndex: 1, input1: result});
			return;
		}

		navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);
	}

	public static toastShortBottom(message: string) {
		if (CordovaWrapper.runningInBrowser) {
			Logger.LogInfo("TOAST SHORT BOTTOM: " + message);
			return;
		}

		(<any>window).plugins.toast.showShortBottom(message);
	}

	public static vibrate(milliseconds: number) {
		if (CordovaWrapper.runningInBrowser) {
			Logger.LogInfo("VIBRATE: " + milliseconds);
			return;
		}

		(<any>navigator).vibrate(milliseconds);
	}

	public static exitApp() {
		if (CordovaWrapper.runningInBrowser) {
			Logger.LogInfo("EXIT APP!");
			return;
		}

		(<any>navigator).app.exitApp();
	}

	public static initAds() {
		if (CordovaWrapper.runningInBrowser) {
			Logger.LogInfo("INIT ADDS!")
			return;
		}

    	var android = "ca-app-pub-8670772325508169/8169230735";
        var wp8 = "ca-app-pub-8670772325508169/4310780735";
        var ios = ""; // just in case we support ios some day...
        var bannerId = "";
        if( /(android)/i.test(navigator.userAgent) ) {
            bannerId = android;
        } else if(/(iphone|ipad)/i.test(navigator.userAgent)) {
            bannerId = ios;
        } else {
            bannerId = wp8;
        }
        (<any>window).plugins.AdMob.setOptions( {
            publisherId: bannerId,
            bannerAtTop: false, // set to true, to put banner at top
            overlap: true, // set to true, to allow banner overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: false, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });
        (<any>window).plugins.AdMob.createBannerView();
	}
}