/// <reference path="state.ts"/>
/// <reference path="homeState.ts"/>
/// <reference path="app.ts"/>

class HighScoreState extends State {
	private static instance: HighScoreState;
    private stateName: string = "highScoreState"; 
    private temporaryDivsClass: string = "highScoreStateTemporary";
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

        this.GetHighScores();
    }

    public Exit(app: App) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }

        var temporaryDivs = document.getElementsByClassName(this.temporaryDivsClass);
        for (var i = temporaryDivs.length-1; i >= 0; i--) {
            (<HTMLDivElement>temporaryDivs[i]).parentNode.removeChild(temporaryDivs[i]);
        }
    }

    public DrawHighScores(scoreArray) {
        var instance = HighScoreState.Instance();
        var scoreContainer = document.getElementById(instance.divContainer);
        for (var i = 0; i < scoreArray.length; i++) {
            var div = document.createElement("div");
            div.innerHTML = (i+1) + ". Level " + scoreArray[i].Level + " " + scoreArray[i].UserName;
            div.classList.add("highScore");
            div.classList.add(instance.stateName);
            div.classList.add(instance.temporaryDivsClass);
            scoreContainer.appendChild(div);
        }
    }

    public GetHighScores() {
        var instance = HighScoreState.Instance();
        var request = new XMLHttpRequest();
        request.open('GET', 'https://flyfrenzy.azure-mobile.net/api/HighScore', true);
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                instance.DrawHighScores(JSON.parse(request.responseText));
            } else if (request.readyState == 4 ){
                (<any>window).plugins.toast.showShortBottom("Unable to communicate with game server.");
            }
        }
        request.send();
    }

    public OnBack(app: App) {
        app.ChangeState(HomeState.Instance());
    }

    public OnPause(app: App) {
    }
}