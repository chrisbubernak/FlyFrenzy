/// <reference path="fly.ts"/>

class Game {
    static maxLeft: number = window.innerWidth;
    static maxTop: number = window.innerHeight;
    static scoreCounter: number = 0;
    private static fps: number = 20;
    private static flies: Fly[] = [];
    private static numOfFlies: number = 20;

    public static score() {
        Game.scoreCounter++;
        Game.updateScore();
    }

    private static updateScore() {
        document.getElementById("scoreCounter").innerHTML = Game.scoreCounter.toString();
    }

    public static start() {
        for (var f = 0; f < Game.numOfFlies; f++) {
            Game.flies.push(new Fly());
        }

        // Start the game loop
        var intervalId = setInterval(Game.run, 1000 / Game.fps);
        // To stop the game, use the following:
        //clearInterval(Game._intervalId);
    }

    private static run () {
        for (var f = 0; f < Game.flies.length; f++) {
            Game.flies[f].move();
        }

        Game.updateScore();
    }
}
