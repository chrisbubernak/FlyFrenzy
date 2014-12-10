/// <reference path="fly.ts"/>
/// <reference path="target.ts"/>
/// <reference path="flyFactory.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        _super.apply(this, arguments);
        this.maxLeft = window.innerWidth;
        this.maxTop = window.innerHeight;
        this.startLevel = 1;
        this.currentLevel = this.startLevel;
        this.startTime = 20;
        this.timeCounter = this.startTime;
        this.gameLoopCounter = 0;
        this.fps = 20;
        this.timeDiv = document.getElementById("timeCounter");
        this.levelDiv = document.getElementById("levelCounter");
        this.stateName = "gameState";
        // classname for divs that need to be destroyed
        // during exit (instead of just hidden)
        this.temporaryDivsClass = "gameStateTemporary";
    }
    GameState.Instance = function () {
        if (typeof GameState.instance === "undefined") {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    };

    GameState.prototype.Enter = function (app) {
        this.timeCounter = this.startTime;
        this.gameLoopCounter = 0;
        this.flies = [];
        this.targets = [];

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }

        this.updateTime();

        var instance = GameState.Instance();
        instance.app = app;

        instance.flies = FlyFactory.CreateFliesForLevel(instance.currentLevel);
        this.remainingToKill = instance.flies.length;

        for (var i = 0; i < instance.flies.length; i++) {
            if (instance.flies[i].type === "poisonFly") {
                this.remainingToKill--;
            }
        }

        this.levelDiv.innerHTML = this.currentLevel.toString();

        instance.intervalId = setInterval(instance.run, 1000 / instance.fps);

        var backgroundDiv = document.getElementById("gameStateBackground");
        backgroundDiv.onclick = function (event) {
            instance.ClickHandler(event);
        };
    };

    GameState.prototype.Exit = function (app) {
        // clear this if it hasn't been yet
        var instance = GameState.Instance();
        clearInterval(instance.intervalId);

        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }

        var temporaryDivs = document.getElementsByClassName(this.temporaryDivsClass);
        for (var i = temporaryDivs.length - 1; i >= 0; i--) {
            temporaryDivs[i].parentNode.removeChild(temporaryDivs[i]);
        }

        var backgroundDiv = document.getElementById("gameStateBackground");
        backgroundDiv.onclick = null;
    };

    GameState.prototype.OnPause = function (app) {
        var instance = GameState.Instance();
        clearInterval(instance.intervalId);
    };

    GameState.prototype.OnResume = function (app) {
        var instance = GameState.Instance();
        if (this.timeCounter > 0) {
            instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
        }
    };

    GameState.prototype.OnBack = function (app) {
        app.ChangeState(HomeState.Instance());
    };

    GameState.prototype.ClickHandler = function (event) {
        GameState.Instance().targets.push(new Target(event.x, event.y));
    };

    GameState.prototype.levelFailedDialog = function (index) {
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
    };

    GameState.prototype.levelCompleteDialog = function (index) {
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
    };

    GameState.prototype.secondElapse = function () {
        this.timeCounter--;
        this.updateTime();

        if (this.timeCounter === 0 && this.flies.length > 0) {
            var instance = GameState.Instance();
            clearInterval(instance.intervalId);
            navigator.notification.confirm(instance.remainingFlies() + " flies remaining.", this.levelFailedDialog, "Game Over", ["Try Again", "Exit"]);
        }
    };

    GameState.prototype.remainingFlies = function () {
        return this.remainingToKill;
    };

    GameState.prototype.updateTime = function () {
        this.timeDiv.innerHTML = this.timeCounter.toString();
    };

    GameState.prototype.run = function () {
        var instance = GameState.Instance();
        var deadFlies = 0;
        for (var f = instance.flies.length - 1; f >= 0; f--) {
            var fly = instance.flies[f];
            if (fly.healthRemaining > 0) {
                fly.move();
            } else {
                fly.die();
                instance.flies.splice(f, 1);
                instance.remainingToKill--;
                if (fly.type === "poisonFly") {
                    clearInterval(instance.intervalId);
                    navigator.notification.confirm("You got poisoned!", instance.levelFailedDialog, "Game Over!", ["Try Again", "Exit"]);
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
            navigator.notification.confirm("Level Completed", instance.levelCompleteDialog, "Great Job!", ["Next Level", "Exit"]);
        }

        instance.gameLoopCounter++;
        if (instance.gameLoopCounter > instance.fps) {
            instance.gameLoopCounter = 0;
            instance.secondElapse();
        }
    };
    return GameState;
})(State);
