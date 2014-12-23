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
        this.divContainer = "highScoresContainer";
    }
    HighScoreState.Instance = function () {
        if (typeof HighScoreState.instance === "undefined") {
            HighScoreState.instance = new HighScoreState();
        }
        return HighScoreState.instance;
    };

    HighScoreState.prototype.Enter = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }
        this.DrawHighScores("2 4 5 6");
        //FileSystemWrapper.ReadHighScores();
    };

    HighScoreState.prototype.Exit = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }
    };

    HighScoreState.prototype.DrawHighScores = function (scores) {
        var instance = HighScoreState.Instance();
        var scoreArray = scores.split(" ");
        var scoreContainer = document.getElementById(instance.divContainer);
        for (var i = 0; i < scoreArray.length; i++) {
            var div = document.createElement("div");
            div.innerHTML = (i + 1) + ". Level " + scoreArray[i] + " 12/22/2014";
            div.classList.add("highScore");
            div.classList.add(instance.stateName);
            scoreContainer.appendChild(div);
        }
        window.plugins.toast.showLongBottom(scoreArray);
    };

    HighScoreState.prototype.OnBack = function (app) {
        app.ChangeState(HomeState.Instance());
    };

    HighScoreState.prototype.OnPause = function (app) {
    };
    return HighScoreState;
})(State);
