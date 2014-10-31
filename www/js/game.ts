/// <reference path="fly.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>

class Game extends State{
    public maxLeft: number = window.innerWidth;
    public maxTop: number = window.innerHeight;
    private scoreCounter: number = 0;
    private timeCounter: number = 45;
    private gameLoopCounter: number = 0;
    private fps: number = 20;
    private flies: Fly[] = [];
    private numOfFlies: number = 20;
    private scoreDiv: HTMLElement = document.getElementById("scoreCounter");
    private timeDiv: HTMLElement = document.getElementById("timeCounter");

    private static instance: Game;

    public static Instance(): Game {
        if (typeof Game.instance === "undefined") {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public static Enter(app: App) {
        alert("Game State Entering");
        var instance = Game.Instance();
        for (var f = 0; f < instance.numOfFlies; f++) {
            instance.flies.push(new Fly());
        }

        // Start the game loop
        var intervalId = setInterval(instance.run, 1000 / instance.fps);
        // To stop the game, use the following:
        //clearInterval(Game._intervalId);
    }

    public static Exit(app: App) {
        alert("Game State Exiting");
    }

    public score() {
        this.scoreCounter++;
        this.updateScore();
    }

    public secondElapse() {
        this.timeCounter--;
        this.updateTime();
    }


    private updateScore() {
        this.scoreDiv.innerHTML = this.scoreCounter.toString();
    }

    private updateTime() {
        this.timeDiv.innerHTML = this.timeCounter.toString();
    }

    private run () {
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

    }
}
