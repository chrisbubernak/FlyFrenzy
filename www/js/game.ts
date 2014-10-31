/// <reference path="fly.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>

class Game extends State{
    public maxLeft: number = window.innerWidth;
    public maxTop: number = window.innerHeight;
    private startScore: number = 0;
    private startTime: number = 20;
    private scoreCounter: number = this.startScore;
    private timeCounter: number = this.startTime;
    private gameLoopCounter: number = 0;
    private fps: number = 20;
    private flies: Fly[];
    private numOfFlies: number = 10;
    private scoreDiv: HTMLElement = document.getElementById("scoreCounter");
    private timeDiv: HTMLElement = document.getElementById("timeCounter");
    private stateName: string = "gameState";
    // classname for divs that need to be destroyed 
    // during exit (instead of just hidden)
    private temporaryDivsClass: string = "gameStateTemporary";
    private static instance: Game;
    private intervalId: any;
    private app: App;

    public static Instance(): Game {
        if (typeof Game.instance === "undefined") {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public Enter(app: App) {
        this.scoreCounter = this.startScore;
        this.timeCounter = this.startTime;
        this.gameLoopCounter = 0;
        this.flies = [];

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }

        this.updateScore();
        this.updateTime();

        var instance = Game.Instance();
        instance.app = app;
        for (var f = 0; f < instance.numOfFlies; f++) {
            instance.flies.push(new Fly());
        }

        instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
    }

    public Exit(app: App) {
        var instance = Game.Instance();
        clearInterval(instance.intervalId);

        alert("Final Score: " + instance.scoreCounter);

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }

        var temporaryDivs = document.getElementsByClassName(this.temporaryDivsClass);
        for (var i = temporaryDivs.length-1; i >= 0; i--) {
            (<HTMLDivElement>temporaryDivs[i]).parentNode.removeChild(temporaryDivs[i]);
        }
    }

    public score() {
        this.scoreCounter++;
        this.updateScore();
    }

    public secondElapse() {
        this.timeCounter--;
        this.updateTime();

        if(this.timeCounter === 0) {
            this.app.ChangeState(Home.Instance());
        }
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
