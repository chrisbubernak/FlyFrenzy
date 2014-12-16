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
        this.touchList = [];

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

        /*backgroundDiv.onclick = function (event) {
        instance.ClickHandler(event);
        };*/
        backgroundDiv.addEventListener('touchstart', this.handleTouch, false);
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

        //backgroundDiv.onclick = null;
        backgroundDiv.removeEventListener("touchstart", this.handleTouch);
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
        //alert(event.x + " " + event.y);
        GameState.Instance().targets.push(new Target(event.x, event.y));
    };

    GameState.prototype.handleTouch = function (e) {
        var evt = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY,
            width: e.changedTouches[0].radiusX * 2 || Target.radius(),
            height: e.changedTouches[0].radiusY * 2 || Target.radius() };
        GameState.Instance().ClickHandler(evt);
        GameState.Instance().touchList.push(evt);
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

    GameState.prototype.collides = function (obj1, flyObj) {
        var width = flyObj.width;
        var height = flyObj.height;
        var x1 = flyObj.div.offsetLeft + width / 2;
        var y1 = flyObj.div.offsetTop + height / 2;
        ;

        var obj2 = { x: x1, y: y1, width: width, height: height };

        //alert(obj1.x + " " + obj1.y + " " + obj1.width + " " + obj1.height);
        //alert(obj2.x + " " + obj2.y + " " + obj2.width + " " + obj2.height);
        // crude collision detection
        var r1 = (obj1.width + obj1.height) / 4;
        var r2 = (obj2.width + obj2.height) / 4;
        var r = r1 + r2;
        var x = obj1.x - obj2.x;
        var y = obj1.y - obj2.y;
        var r = r1 + r2;
        if ((x * x) + (y * y) < r * r) {
            return true;
        }
        return false;
    };

    GameState.prototype.run = function () {
        var instance = GameState.Instance();

        // go through all the touches that have happened in the last game frame and check them vs all flies
        // O(flyCount*touchCount) runtime which isn't ideal...but might be ok for now
        var touches = instance.touchList;
        var deadFlies = 0;
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
        instance.touchList = [];
    };
    return GameState;
})(State);
