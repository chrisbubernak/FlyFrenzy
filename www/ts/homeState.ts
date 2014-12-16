/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="gameState.ts"/>
/// <reference path="aboutState.ts"/>
/// <reference path="highScoreState.ts"/>

class HomeState extends State {
	private static instance: HomeState;
    private stateName: string = "homeState"; 

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
        startButton.addEventListener('touchend', function() { app.ChangeState(GameState.Instance()); }, false);

        var highScoreButton = <any>document.getElementById("highScoreButton");
        highScoreButton.addEventListener('touchend', function() { app.ChangeState(HighScoreState.Instance()); }, false);

        var aboutButton = <any>document.getElementById("aboutButton");
        aboutButton.addEventListener('touchend', function() { app.ChangeState(AboutState.Instance()); }, false);
    }

    public Exit(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }
    }

    public OnBack(app: App) {
        (<any>navigator).app.exitApp();
    }

    public OnPause(app: App) {
        // from the home screen there is really no 
        // sense to pause just exit the app
        (<any>navigator).app.exitApp();
    }
}