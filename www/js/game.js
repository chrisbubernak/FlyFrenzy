/// <reference path="fly.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.apply(this, arguments);
        this.maxLeft = window.innerWidth;
        this.maxTop = window.innerHeight;
        this.startScore = 0;
        this.startTime = 20;
        this.scoreCounter = this.startScore;
        this.timeCounter = this.startTime;
        this.gameLoopCounter = 0;
        this.fps = 20;
        this.numOfFlies = 10;
        this.scoreDiv = document.getElementById("scoreCounter");
        this.timeDiv = document.getElementById("timeCounter");
        this.stateName = "gameState";
        // classname for divs that need to be destroyed
        // during exit (instead of just hidden)
        this.temporaryDivsClass = "gameStateTemporary";
    }
    Game.Instance = function () {
        if (typeof Game.instance === "undefined") {
            Game.instance = new Game();
        }
        return Game.instance;
    };

    Game.prototype.Enter = function (app) {
        this.scoreCounter = this.startScore;
        this.timeCounter = this.startTime;
        this.gameLoopCounter = 0;
        this.flies = [];

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }

        this.updateScore();
        this.updateTime();

        var instance = Game.Instance();
        instance.app = app;
        for (var f = 0; f < instance.numOfFlies; f++) {
            instance.flies.push(new Fly());
        }

        instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
    };

    Game.prototype.Exit = function (app) {
        var instance = Game.Instance();
        clearInterval(instance.intervalId);

        alert("Final Score: " + instance.scoreCounter);

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }

        var temporaryDivs = document.getElementsByClassName(this.temporaryDivsClass);
        for (var i = temporaryDivs.length - 1; i >= 0; i--) {
            temporaryDivs[i].parentNode.removeChild(temporaryDivs[i]);
        }
    };

    Game.prototype.score = function () {
        this.scoreCounter++;
        this.updateScore();
    };

    Game.prototype.secondElapse = function () {
        this.timeCounter--;
        this.updateTime();

        if (this.timeCounter === 0) {
            this.app.ChangeState(Home.Instance());
        }
    };

    Game.prototype.updateScore = function () {
        this.scoreDiv.innerHTML = this.scoreCounter.toString();
    };

    Game.prototype.updateTime = function () {
        this.timeDiv.innerHTML = this.timeCounter.toString();
    };

    Game.prototype.run = function () {
        var instance = Game.Instance();
        for (var f = 0; f < instance.flies.length; f++) {
            instance.flies[f].move();
        }

        instance.updateScore();

        instance.gameLoopCounter++;
        if (instance.gameLoopCounter > instance.fps) {
            instance.gameLoopCounter = 0;
            instance.secondElapse();
        }
    };
    return Game;
})(State);
