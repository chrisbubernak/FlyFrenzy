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
        this.scoreCounter = 0;
        this.timeCounter = 45;
        this.gameLoopCounter = 0;
        this.fps = 20;
        this.flies = [];
        this.numOfFlies = 20;
        this.scoreDiv = document.getElementById("scoreCounter");
        this.timeDiv = document.getElementById("timeCounter");
    }
    Game.Instance = function () {
        if (typeof Game.instance === "undefined") {
            Game.instance = new Game();
        }
        return Game.instance;
    };

    Game.Enter = function (app) {
        alert("Game State Entering");
        var instance = Game.Instance();
        for (var f = 0; f < instance.numOfFlies; f++) {
            instance.flies.push(new Fly());
        }

        // Start the game loop
        var intervalId = setInterval(instance.run, 1000 / instance.fps);
        // To stop the game, use the following:
        //clearInterval(Game._intervalId);
    };

    Game.Exit = function (app) {
        alert("Game State Exiting");
    };

    Game.prototype.score = function () {
        this.scoreCounter++;
        this.updateScore();
    };

    Game.prototype.secondElapse = function () {
        this.timeCounter--;
        this.updateTime();
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
