/// <reference path="fly.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>

class GameState extends State{
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
    private static instance: GameState;
    private intervalId: any;
    private app: App;

    public static Instance(): GameState {
        if (typeof GameState.instance === "undefined") {
            GameState.instance = new GameState();
        }
        return GameState.instance;
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

        var instance = GameState.Instance();
        instance.app = app;
        for (var f = 0; f < instance.numOfFlies; f++) {
            instance.flies.push(new Fly());
        }

        instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
    }

    public Exit(app: App) {
        var instance = GameState.Instance();
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

    public OnPause(app: App) {
        var instance = GameState.Instance();
        clearInterval(instance.intervalId);
    }

    public OnResume(app: App) {
        var instance = GameState.Instance();
        if (this.timeCounter > 0) {
            instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
        }
    }

    public OnBack(app: App) {
        app.ChangeState(HomeState.Instance());
    }

    public score() {
        this.scoreCounter++;
        this.updateScore();
    }

    public secondElapse() {
        this.timeCounter--;
        this.updateTime();

        if(this.timeCounter === 0) {
            this.app.ChangeState(HomeState.Instance());
        }
    }

    private updateScore() {
        this.scoreDiv.innerHTML = this.scoreCounter.toString();
    }

    private updateTime() {
        this.timeDiv.innerHTML = this.timeCounter.toString();
    }

    private run () {
        var instance = GameState.Instance();
        var deadFlies: number = 0;
        for (var f = instance.flies.length - 1; f >= 0; f--) {
            var fly = instance.flies[f];
            if (fly.healthRemaining > 0) { 
                fly.move();
            } else {
                instance.score();
                fly.die();
                instance.flies[f] = new Fly();
            }
        }

        instance.updateScore();

        instance.gameLoopCounter++;
        if (instance.gameLoopCounter > instance.fps) {
            instance.gameLoopCounter = 0;
            instance.secondElapse();
        }

    }
}
