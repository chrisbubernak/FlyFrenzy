/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="gameState.ts"/>
/// <reference path="aboutState.ts"/>
/// <reference path="highScoreState.ts"/>
/// <reference path="utilities.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="cordovaWrapper.ts"/>

class HomeState extends State {
	private static instance: HomeState;
    private userName: string;

    constructor() {
        super();
        this.stateName = "homeState";
    }

    public static Instance(): HomeState {
        if (typeof HomeState.instance === "undefined") {
            HomeState.instance = new HomeState();
        }
        return HomeState.instance;
    }

    public Enter(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }

        var startButton = <any>document.getElementById("startButton");
        startButton.addEventListener('click', function() { app.ChangeState(GameState.Instance()); }, false);

        var highScoreButton = <any>document.getElementById("highScoreButton");
        highScoreButton.addEventListener('click', function() { app.ChangeState(HighScoreState.Instance()); }, false);

        var aboutButton = <any>document.getElementById("aboutButton");
        aboutButton.addEventListener('click', function() { app.ChangeState(AboutState.Instance()); }, false);

        if(app.GetClientGuid() === undefined) {
        	if (!localStorage) {
        		Logger.LogError("No Local Storage Available...");
        		var guid = Utilities.GUID();
                app.SetClientGuid(guid);
        	}
            else if (localStorage.getItem("clientGuid") === null) {
                var guid = Utilities.GUID();
                localStorage.setItem("clientGuid", guid);
                app.SetClientGuid(guid);
            } else {
                app.SetClientGuid(localStorage.getItem("clientGuid"));
            }
        }

        if(app.GetUserName() === undefined) {
        	if (!localStorage) {
        		Logger.LogError("No Local Storage Available...");
        		// make user give us a user name
                CordovaWrapper.prompt("Please Enter a Username", function (results) {
                    var button = results.buttonIndex;
                    var text = results.input1;
                    if (button === 1) {
                        app.SetUserName(text);
                        CordovaWrapper.toastShortBottom("Signed in as " + app.GetUserName());
                    } else {
                        app.ChangeState(HomeState.Instance());
                    }
                }, 'Sign In', ['OK', 'Exit'], '');
        	}
            else if (localStorage.getItem("userName") === null) {
                // make user give us a user name
                CordovaWrapper.prompt("Please Enter a Username", function (results) {
                    var button = results.buttonIndex;
                    var text = results.input1;
                    if (button === 1) {
                        localStorage.setItem("userName", text);
                        app.SetUserName(localStorage.getItem("userName"));
                        CordovaWrapper.toastShortBottom("Signed in as " + app.GetUserName());
                    } else {
                        app.ChangeState(HomeState.Instance());
                    }
                }, 'Sign In', ['OK', 'Exit'], '');

            } else {
                app.SetUserName(localStorage.getItem("userName"));
                CordovaWrapper.toastShortBottom("Signed in as " + app.GetUserName());
            }
        }
    }

    public Exit(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }
        var instance = HomeState.Instance();
        instance.removeEventHandler('startButton');
        instance.removeEventHandler('highScoreButton');
        instance.removeEventHandler('aboutButton');
    }

    public SignOut(app: App) {
        // clear everything then change state back to home to get the prompt to sign in
        localStorage.removeItem("userName");
        app.SetUserName(undefined);
        app.ChangeState(HomeState.Instance());
    }

    // instead of removing the event handlers just clone the div
    // and then replace
    private removeEventHandler(id: string) {
        var el = document.getElementById(id),
        elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    }

    public OnBack(app: App) {
        CordovaWrapper.exitApp();
    }

    public OnPause(app: App) {
        // from the home screen there is really no 
        // sense to pause just exit the app
        CordovaWrapper.exitApp();
    }

    public GetUserName(): string {
        var instance = HomeState.Instance();
        return instance.userName;
    }

    public SetUserName(userName: string) {
        var instance = HomeState.Instance();
        instance.userName = userName;   
    }
}