/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="gameState.ts"/>
/// <reference path="aboutState.ts"/>
/// <reference path="highScoreState.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HomeState = (function (_super) {
    __extends(HomeState, _super);
    function HomeState() {
        _super.apply(this, arguments);
        this.stateName = "homeState";
    }
    HomeState.Instance = function () {
        if (typeof HomeState.instance === "undefined") {
            HomeState.instance = new HomeState();
        }
        return HomeState.instance;
    };

    HomeState.prototype.Enter = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }

        var startButton = document.getElementById("startButton");
        startButton.addEventListener('touchend', function () {
            app.ChangeState(GameState.Instance());
        }, false);

        var highScoreButton = document.getElementById("highScoreButton");
        highScoreButton.addEventListener('touchend', function () {
            app.ChangeState(HighScoreState.Instance());
        }, false);

        var aboutButton = document.getElementById("aboutButton");
        aboutButton.addEventListener('touchend', function () {
            app.ChangeState(AboutState.Instance());
        }, false);
    };

    HomeState.prototype.Exit = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }
    };

    HomeState.prototype.OnBack = function (app) {
        navigator.app.exitApp();
    };

    HomeState.prototype.OnPause = function (app) {
        // from the home screen there is really no
        // sense to pause just exit the app
        navigator.app.exitApp();
    };
    return HomeState;
})(State);
