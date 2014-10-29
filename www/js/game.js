/// <reference path="fly.ts"/>
var Game = (function () {
    function Game() {
    }
    Game.score = function () {
        Game.scoreCounter++;
        Game.updateScore();
    };

    Game.secondElapse = function () {
        Game.timeCounter--;
        Game.updateTime();
    };

    Game.updateScore = function () {
        Game.scoreDiv.innerHTML = Game.scoreCounter.toString();
    };

    Game.updateTime = function () {
        Game.timeDiv.innerHTML = Game.timeCounter.toString();
    };

    Game.start = function () {
        for (var f = 0; f < Game.numOfFlies; f++) {
            Game.flies.push(new Fly());
        }

        // Start the game loop
        var intervalId = setInterval(Game.run, 1000 / Game.fps);
        // To stop the game, use the following:
        //clearInterval(Game._intervalId);
    };

    Game.run = function () {
        for (var f = 0; f < Game.flies.length; f++) {
            Game.flies[f].move();
        }

        Game.updateScore();

        Game.gameLoopCounter++;
        if (Game.gameLoopCounter > Game.fps) {
            Game.gameLoopCounter = 0;
            Game.secondElapse();
        }
    };
    Game.maxLeft = window.innerWidth;
    Game.maxTop = window.innerHeight;
    Game.scoreCounter = 0;
    Game.timeCounter = 45;
    Game.gameLoopCounter = 0;
    Game.fps = 20;
    Game.flies = [];
    Game.numOfFlies = 20;
    Game.scoreDiv = document.getElementById("scoreCounter");
    Game.timeDiv = document.getElementById("timeCounter");
    return Game;
})();
