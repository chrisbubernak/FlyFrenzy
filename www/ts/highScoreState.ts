/// <reference path="state.ts"/>
/// <reference path="homeState.ts"/>
/// <reference path="app.ts"/>

class HighScoreState extends State {
	private static instance: HighScoreState;
    private stateName: string = "highScoreState"; 
    private divContainer: string = "highScoresContainer";

    public static Instance(): HighScoreState {
        if (typeof HighScoreState.instance === "undefined") {
            HighScoreState.instance = new HighScoreState();
        }
        return HighScoreState.instance;
    }

    public Enter(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }
        this.DrawHighScores("2 4 5 6");
        //FileSystemWrapper.ReadHighScores();
    }

    public Exit(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }
    }

    public DrawHighScores(scores) {
        var instance = HighScoreState.Instance();
        var scoreArray = scores.split(" ");
        var scoreContainer = document.getElementById(instance.divContainer);
        for (var i = 0; i < scoreArray.length; i++) {
            var div = document.createElement("div");
            div.innerHTML = (i+1) + ". Level " + scoreArray[i] + " 12/22/2014";
            div.classList.add("highScore");
            div.classList.add(instance.stateName);
            scoreContainer.appendChild(div);
        }
        (<any>window).plugins.toast.showLongBottom(scoreArray);
    }

    public OnBack(app: App) {
        app.ChangeState(HomeState.Instance());
    }

    public OnPause(app: App) {
    }
}