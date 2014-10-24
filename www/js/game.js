/// <reference path="fly.ts"/>
var Game = (function () {
    function Game() {
    }
    Game.score = function () {
        Game.scoreCounter++;
        Game.updateScore();
    };

    Game.updateScore = function () {
        document.getElementById("scoreCounter").innerHTML = Game.scoreCounter.toString();
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
    };
    Game.maxLeft = window.innerWidth;
    Game.maxTop = window.innerHeight;
    Game.scoreCounter = 0;
    Game.fps = 20;
    Game.flies = [];
    Game.numOfFlies = 20;
    return Game;
})();
