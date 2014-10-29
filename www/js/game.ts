/// <reference path="fly.ts"/>

class Game {
    static maxLeft: number = window.innerWidth;
    static maxTop: number = window.innerHeight;
    private static scoreCounter: number = 0;
    private static timeCounter: number = 45;
    private static gameLoopCounter: number = 0;
    private static fps: number = 20;
    private static flies: Fly[] = [];
    private static numOfFlies: number = 20;
    private static scoreDiv: HTMLElement = document.getElementById("scoreCounter");
    private static timeDiv: HTMLElement = document.getElementById("timeCounter");

    public static score() {
        Game.scoreCounter++;
        Game.updateScore();
    }

    public static secondElapse() {
        Game.timeCounter--;
        Game.updateTime();
    }

    private static updateScore() {
        Game.scoreDiv.innerHTML = Game.scoreCounter.toString();
    }

    private static updateTime() {
        Game.timeDiv.innerHTML = Game.timeCounter.toString();
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

        Game.gameLoopCounter++;
        if (Game.gameLoopCounter > Game.fps) {
            Game.gameLoopCounter = 0;
            Game.secondElapse();
        }

    }
}
