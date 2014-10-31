/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="game.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        _super.apply(this, arguments);
        this.stateName = "homeState";
    }
    Home.Instance = function () {
        if (typeof Home.instance === "undefined") {
            Home.instance = new Home();
        }
        return Home.instance;
    };

    Home.prototype.Enter = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }

        var startButton = document.getElementById("startButton");
        startButton.onclick = function () {
            app.ChangeState(Game.Instance());
        };
    };

    Home.prototype.Exit = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }
    };
    return Home;
})(State);
