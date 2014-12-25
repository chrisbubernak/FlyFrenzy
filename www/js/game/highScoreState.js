/// <reference path="state.ts"/>
/// <reference path="homeState.ts"/>
/// <reference path="app.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HighScoreState = (function (_super) {
    __extends(HighScoreState, _super);
    function HighScoreState() {
        _super.apply(this, arguments);
        this.stateName = "highScoreState";
        this.temporaryDivsClass = "highScoreStateTemporary";
        this.divContainer = "highScoresContainer";
    }
    HighScoreState.Instance = function () {
        if (typeof HighScoreState.instance === "undefined") {
            HighScoreState.instance = new HighScoreState();
        }
        return HighScoreState.instance;
    };

    HighScoreState.prototype.Enter = function (app) {
        alert('enter high score');
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }

        this.GetHighScores();
    };

    HighScoreState.prototype.Exit = function (app) {
        alert('exit high score');
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }

        var temporaryDivs = document.getElementsByClassName(this.temporaryDivsClass);
        alert(temporaryDivs.length);
        for (var i = temporaryDivs.length - 1; i >= 0; i--) {
            temporaryDivs[i].parentNode.removeChild(temporaryDivs[i]);
        }
    };

    HighScoreState.prototype.DrawHighScores = function (scoreArray) {
        var instance = HighScoreState.Instance();
        var scoreContainer = document.getElementById(instance.divContainer);
        for (var i = 0; i < scoreArray.length; i++) {
            var div = document.createElement("div");
            div.innerHTML = (i + 1) + ". Level " + scoreArray[i].Level + " " + scoreArray[i].UserName;
            div.classList.add("highScore");
            div.classList.add(instance.stateName);
            div.classList.add(instance.temporaryDivsClass);
            scoreContainer.appendChild(div);
        }
    };

    HighScoreState.prototype.GetHighScores = function () {
        var instance = HighScoreState.Instance();
        var request = new XMLHttpRequest();
        request.open('GET', 'https://flyfrenzy.azure-mobile.net/api/HighScore', true);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                instance.DrawHighScores(JSON.parse(request.responseText));
            } else if (request.readyState == 4) {
                window.plugins.toast.showShortBottom("Unable to communicate with game server.");
            }
        };
        request.send();
    };

    HighScoreState.prototype.OnBack = function (app) {
        app.ChangeState(HomeState.Instance());
    };

    HighScoreState.prototype.OnPause = function (app) {
    };
    return HighScoreState;
})(State);
