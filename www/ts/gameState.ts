﻿/// <reference path="fly.ts"/>
/// <reference path="target.ts"/>
/// <reference path="flyFactory.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>

class GameState extends State{
    public maxLeft: number = window.innerWidth;
    public maxTop: number = window.innerHeight;
    private startLevel: number = 1;
    private currentLevel: number = this.startLevel;
    private startTime: number = 20;
    private timeCounter: number = this.startTime;
    private gameLoopCounter: number = 0;
    private fps: number = 20;
    private flies: Fly[];
    private targets: Target[];
    private touchList: any[];
    private remainingToKill: number;
    private timeDiv: HTMLElement = document.getElementById("timeCounter");
    private levelDiv: HTMLElement = document.getElementById("levelCounter");
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
        this.timeCounter = this.startTime;
        this.gameLoopCounter = 0;
        this.flies = [];
        this.targets = [];
        this.touchList = [];

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }

        this.updateTime();

        var instance = GameState.Instance();
        instance.app = app;

        instance.flies = FlyFactory.CreateFliesForLevel(instance.currentLevel);
        this.remainingToKill = instance.flies.length;
        // figure out how many flies actually need to be killed to beat the level
        // poisoned ones don't count!
        for (var i = 0; i < instance.flies.length; i++) {
            if (instance.flies[i].type === "poisonFly") {
                this.remainingToKill--;
            }
        }

        this.levelDiv.innerHTML = this.currentLevel.toString();

        instance.intervalId = setInterval(instance.run, 1000 / instance.fps);

        var backgroundDiv = document.getElementById("gameStateBackground");
        /*backgroundDiv.onclick = function (event) {
            instance.ClickHandler(event);
        };*/
        backgroundDiv.addEventListener('touchstart', this.handleTouch, false);
    }

    public Exit(app: App) {
        // clear this if it hasn't been yet
        var instance = GameState.Instance();
        clearInterval(instance.intervalId);

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "none";
        }

        var temporaryDivs = document.getElementsByClassName(this.temporaryDivsClass);
        for (var i = temporaryDivs.length-1; i >= 0; i--) {
            (<HTMLDivElement>temporaryDivs[i]).parentNode.removeChild(temporaryDivs[i]);
        }


        var backgroundDiv = document.getElementById("gameStateBackground");
        //backgroundDiv.onclick = null;
        backgroundDiv.removeEventListener("touchstart", this.handleTouch);
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

    public ClickHandler(event) {
        //alert(event.x + " " + event.y);
        GameState.Instance().targets.push(new Target(event.x, event.y));
    }

    public handleTouch(e){
        var evt = {x: (<any>e).changedTouches[0].pageX,
            y: (<any>e).changedTouches[0].pageY,
            width: (<any>e).changedTouches[0].radiusX * 2 || Target.radius(),
            height: (<any>e).changedTouches[0].radiusY * 2 || Target.radius()};
        GameState.Instance().ClickHandler(evt);
        GameState.Instance().touchList.push(evt); 
    }

    private levelFailedDialog(index: number) {
        //index 1 = Try Again, 2 = Exit, 0 = no button
        var instance = GameState.Instance();
        if (index === 1) {
            // re-try the level
            this.app.ChangeState(GameState.Instance());
        } else if (index === 2) {
            this.app.ChangeState(HomeState.Instance());
        } else {
            // lets just let user re-try the level
            this.app.ChangeState(GameState.Instance());
        }
    }

    private levelCompleteDialog(index: number) {
        // update the level
        GameState.instance.currentLevel++;

        // index 1 = Next Level, 2 = Exit
        var instance = GameState.Instance();
        if (index === 1) {
            this.app.ChangeState(GameState.Instance());
        } else if (index === 2) {
            this.app.ChangeState(HomeState.Instance());
        } else {
            // assume user wants the next level
            this.app.ChangeState(GameState.Instance());
        }   
    }

    public secondElapse() {
        this.timeCounter--;
        this.updateTime();

        if(this.timeCounter === 0 && this.flies.length > 0) {
            var instance = GameState.Instance();
            clearInterval(instance.intervalId);
            (<any>navigator).notification.confirm(
                instance.remainingFlies() + " flies remaining." ,
                this.levelFailedDialog,
                "Game Over",            
                ["Try Again", "Exit"]  
            );
        }
    }

    private remainingFlies() {
        return this.remainingToKill;
    }

    private updateTime() {
        this.timeDiv.innerHTML = this.timeCounter.toString();
    }

    private collides(obj1, flyObj): boolean {
        var width: number = flyObj.width;
        var height: number = flyObj.height;
        var x1: number = flyObj.div.offsetLeft + width/2;
        var y1: number = flyObj.div.offsetTop + height/2;;
        
        var obj2 = {x: x1, y: y1, width: width, height: height};
        //alert(obj1.x + " " + obj1.y + " " + obj1.width + " " + obj1.height);
        //alert(obj2.x + " " + obj2.y + " " + obj2.width + " " + obj2.height);
        // crude collision detection
        var r1 = (obj1.width + obj1.height) / 4;
        var r2 = (obj2.width + obj2.height) / 4;
        var r = r1 + r2; 
        var x = obj1.x - obj2.x;
        var y = obj1.y - obj2.y;
        var r = r1 + r2;
        if ((x* x) + (y * y) < r * r ) {
            return true;
        }
        return false;
    }

    private run () {
        var instance = GameState.Instance();

        // go through all the touches that have happened in the last game frame and check them vs all flies 
        // O(flyCount*touchCount) runtime which isn't ideal...but might be ok for now
        var touches = instance.touchList;
        var deadFlies: number = 0;
        for (var f = instance.flies.length - 1; f >= 0; f--) {
            var fly = instance.flies[f];

            for (var t = 0; t < touches.length; t++) {
                if (instance.collides(touches[t], fly)) {
                    fly.clicked();
                }
            }

            if (fly.healthRemaining > 0) { 
                fly.move();
            } else {
                fly.die();
                instance.flies.splice(f, 1);
                instance.remainingToKill--;
                if (fly.type === "poisonFly") {
                    clearInterval(instance.intervalId);
                        (<any>navigator).notification.confirm(
                        "You got poisoned!",
                        instance.levelFailedDialog,
                        "Game Over!",            
                        ["Try Again", "Exit"]  
                    );
                    return;
                }
            }
        }

        for (var t = instance.targets.length - 1; t >= 0; t--) {
            var target = instance.targets[t];
            target.update();
            if (target.isExpired()) {
                instance.targets[t].destroy();
                instance.targets.splice(t, 1);
            }
        }

        if (instance.remainingFlies() === 0) {
            clearInterval(instance.intervalId);
            (<any>navigator).notification.confirm(
                "Level Completed",
                instance.levelCompleteDialog,
                "Great Job!",            
                ["Next Level", "Exit"]  
            );
        } 

        instance.gameLoopCounter++;
        if (instance.gameLoopCounter > instance.fps) {
            instance.gameLoopCounter = 0;
            instance.secondElapse();
        }
        instance.touchList = [];
    }
}
