/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="game.ts"/>

class Home extends State {
	private static instance: Home;
    private stateName: string = "homeState"; 

    public static Instance(): Home {
        if (typeof Home.instance === "undefined") {
            Home.instance = new Home();
        }
        return Home.instance;
    }

    public Enter(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }

        var startButton = <any>document.getElementById("startButton");
        startButton.onclick = function() { app.ChangeState(Game.Instance()); };
    }

    public Exit(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }
    }
}