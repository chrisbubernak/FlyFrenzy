/// <reference path="fly.ts"/>
/// <reference path="target.ts"/>
/// <reference path="flyFactory.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="definitions/cordova/cordova.d.ts"/>
/// <reference path="definitions/cordova/plugins/Dialogs.d.ts"/>
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
        backgroundDiv.addEventListener('touchstart', this.handleTouch, false);

        instance.saveHighScore();
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
        GameState.Instance().targets.push(new Target(event.x, event.y));
    };

    GameState.prototype.handleTouch = function (e) {
        var evt = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY,
            radius: Target.radius() };
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

        GameState.Instance().saveHighScore();

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

    GameState.prototype.collides = function (touchObj, flyObj) {
        // todo: game objects should have a uniform interface so that we can just check collisions
        // between objects instead of this special cased touchObj v flyObj check
        var x = touchObj.x - (flyObj.div.offsetLeft + flyObj.width / 2);
        var y = touchObj.y - (flyObj.div.offsetTop + flyObj.height / 2);
        var r = touchObj.radius + (flyObj.width + flyObj.height) / 4;

        if ((x * x) + (y * y) < r * r) {
            return true;
        }
        return false;
    };

    GameState.prototype.saveHighScore = function () {
        // todo: use real values for username, scoreguid, and clientguid
        var level = GameState.Instance().currentLevel;
        var userName = "Chris";
        var scoreGuid = "1111-2222-3333-4444";
        var clientGuid = "1234-5678-9101112";

        // todo: write the score to local storage first
        // then try and write to the server, if server write fails
        // then we can try and write the high score at a later time
        var request = new XMLHttpRequest();
        request.open('POST', 'https://flyfrenzy.azure-mobile.net/api/HighScore?' + "level=" + level + "&userName=" + userName + "&clientGuid=" + clientGuid + "&scoreGuid=" + scoreGuid, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                if (JSON.parse(request.responseText).newHighScore) {
                    window.plugins.toast.showShortBottom("New High Score!");
                }
            } else if (request.readyState == 4) {
                window.plugins.toast.showShortBottom("Unable to communicate with game server.");
            }
        };
        request.send();
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
