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
    }

    public DrawHighScores(scoreArray) {
        var instance = HighScoreState.Instance();        

        // remove the old high scores if they exist for some reason...
        var scoreContainer = document.getElementById(instance.divContainer);
        scoreContainer.innerHTML = "";

        // draw the new ones!
        for (var i = 0; i < scoreArray.length; i++) {
            var div = document.createElement("div");
            div.classList.add("highScore");
            div.classList.add(instance.stateName);

            var rankDiv = document.createElement("div")
            rankDiv.classList.add("highScoreRank");
            rankDiv.innerHTML = String(i + 1);

            var userDiv = document.createElement("div")
            userDiv.classList.add("highScoreName");
            userDiv.innerHTML = scoreArray[i].UserName;

            var scoreDiv = document.createElement("div")
            scoreDiv.classList.add("highScoreScore");
            scoreDiv.innerHTML = scoreArray[i].Level;

            div.appendChild(rankDiv);
            div.appendChild(userDiv);
            div.appendChild(scoreDiv);

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
                Logger.LogError(request.responseText);
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