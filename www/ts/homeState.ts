/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="gameState.ts"/>
/// <reference path="aboutState.ts"/>
/// <reference path="highScoreState.ts"/>

class HomeState extends State {
	private static instance: HomeState;
    private stateName: string = "homeState"; 
    private userName: string;

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

        var instance = HomeState.Instance();
        if(instance.GetUserName() === undefined) {
            if (localStorage.getItem("userName") === null) {
                // make user give us a user name
                navigator.notification.prompt("Please Enter a Username", function (results) {
                    var button = results.buttonIndex;
                    var text = results.input1;
                    if (button === 1) {
                        localStorage.setItem("userName", text);
                        instance.SetUserName(localStorage.getItem("userName"));
                        (<any>window).plugins.toast.showShortBottom("Signed in as " + instance.GetUserName());
                    } else {
                        app.ChangeState(HomeState.Instance());
                    }
                }, 'Sign In', ['OK', 'Exit'], '');

            } else {
                instance.SetUserName(localStorage.getItem("userName"));
                (<any>window).plugins.toast.showShortBottom("Signed in as " + instance.GetUserName());
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

    // instead of removing the event handlers just clone the div
    // and then replace
    private removeEventHandler(id: string) {
        var el = document.getElementById(id),
        elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    }

    public OnBack(app: App) {
        (<any>navigator).app.exitApp();
    }

    public OnPause(app: App) {
        // from the home screen there is really no 
        // sense to pause just exit the app
        (<any>navigator).app.exitApp();
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