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
        var scores = FileSystemWrapper.ReadHighScores();
    };

    HighScoreState.prototype.Exit = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }
    };

    HighScoreState.prototype.OnBack = function (app) {
        app.ChangeState(HomeState.Instance());
    };

    HighScoreState.prototype.OnPause = function (app) {
    };
    return HighScoreState;
})(State);
