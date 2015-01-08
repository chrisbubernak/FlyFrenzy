/// <reference path="fly.ts"/>
/// <reference path="target.ts"/>
/// <reference path="flyFactory.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="utilities.ts"/>
/// <reference path="definitions/cordova/cordova.d.ts"/>
/// <reference path="definitions/cordova/plugins/Dialogs.d.ts"/>

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
    private scoreGuid: string;

    public static Instance(): GameState {
        if (typeof GameState.instance === "undefined") {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }

    // todo: need to separate logic for Entering game state and starting a new level
    // the enter code should call start game but we don't want to exit and enter game state
    // every time we beat a level
    // this way in Enter we can do things like...set the ScoreGuid
    public Enter(app: App) {
        this.currentLevel = this.startLevel;
        this.scoreGuid = Utilities.GUID();
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }

        var instance = GameState.Instance();
        instance.app = app;

        var backgroundDiv = document.getElementById("gameStateBackground");
        backgroundDiv.addEventListener('touchstart', this.handleTouch, false);

        instance.StartLevel();
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
        backgroundDiv.removeEventListener("touchstart", this.handleTouch);
    }

    private StartLevel() {
        var instance = GameState.Instance();
        instance.timeCounter = this.startTime;
        instance.gameLoopCounter = 0;
        instance.targets = [];
        instance.touchList = [];
        
        instance.flies = FlyFactory.CreateFliesForLevel(instance.currentLevel);
        instance.remainingToKill = instance.flies.length;
        // figure out how many flies actually need to be killed to beat the level
        // poisoned ones don't count!
        for (var i = 0; i < instance.flies.length; i++) {
            if (instance.flies[i].type === "poisonFly") {
                instance.remainingToKill--;
            }
        }

        instance.updateTime();


        instance.levelDiv.innerHTML = instance.currentLevel.toString();

        instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
    }

    public EndLevel() {
        var instance = GameState.Instance();
        clearInterval(instance.intervalId);

        var temporaryDivs = document.getElementsByClassName(instance.temporaryDivsClass);
        for (var i = temporaryDivs.length-1; i >= 0; i--) {
            (<HTMLDivElement>temporaryDivs[i]).parentNode.removeChild(temporaryDivs[i]);
        }
        instance.StartLevel(); // start the next level!
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
        GameState.Instance().targets.push(new Target(event.x, event.y));
    }

    public handleTouch(e){
        var evt = {x: (<any>e).changedTouches[0].pageX,
            y: (<any>e).changedTouches[0].pageY,
            radius: Target.radius()};
        GameState.Instance().ClickHandler(evt);
        GameState.Instance().touchList.push(evt); 
    }

    private levelFailedDialog(index: number) {
        //index 1 = Try Again, 2 = Exit, 0 = no button
        var instance = GameState.Instance();
        if (index === 1) {
            // re-try the level
            instance.EndLevel();
        } else if (index === 2) {
            instance.app.ChangeState(HomeState.Instance());
        } else {
            // lets just let user re-try the level
            instance.EndLevel();        
        }
    }

    private levelCompleteDialog(index: number) {
        var instance = GameState.Instance();
        
        // update the level
        instance.currentLevel++;
        // send current score to server
        instance.saveHighScore();

        // index 1 = Next Level, 2 = Exit
        var instance = GameState.Instance();
        if (index === 1) {
            instance.EndLevel();        
        } else if (index === 2) {
            instance.app.ChangeState(HomeState.Instance());
        } else {
            // assume user wants the next level
            instance.EndLevel();        
        }   
    }

    public secondElapse() {
        this.timeCounter--;
        this.updateTime();

        if(this.timeCounter === 0 && this.flies.length > 0) {
            var instance = GameState.Instance();
            clearInterval(instance.intervalId);
            navigator.notification.confirm(
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

    private collides(touchObj, flyObj): boolean {
        // todo: game objects should have a uniform interface so that we can just check collisions
        // between objects instead of this special cased touchObj v flyObj check
        var x = touchObj.x - (flyObj.div.offsetLeft + flyObj.width/2);
        var y = touchObj.y - (flyObj.div.offsetTop + flyObj.height/2);
        var r = touchObj.radius + (flyObj.width + flyObj.height)/4;

        if ((x* x) + (y * y) < r * r ) {
            return true;
        }
        return false;
    }

    private saveHighScore() {
        var instance = GameState.Instance();
        var level = instance.currentLevel;
        var userName = instance.app.GetUserName();
        var scoreGuid = instance.GetScoreGuid();
        var clientGuid = instance.app.GetClientGuid();

        // todo: write the score to local storage first
        // then try and write to the server, if server write fails
        // then we can try and write the high score at a later time

        var request = new XMLHttpRequest();
        // todo: remove hardcoded url here....also use flyfrenzy.bubernak.com 
        var url = 'https://flyfrenzy.azure-mobile.net/api/HighScore?' +
            "level=" + level + 
            "&userName=" + userName +
            "&clientGuid=" + clientGuid +
            "&scoreGuid=" + scoreGuid;
        request.open('POST', url, true);
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                if (JSON.parse(request.responseText).newHighScore) {
                    (<any>window).plugins.toast.showShortBottom("New High Score!");
                }
            } else if (request.readyState == 4 ){
                (<any>window).plugins.toast.showShortBottom("Error: " + request.responseText);
            }
        }
        request.send();
    }

    private GetScoreGuid() {
        return this.scoreGuid;
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
                        navigator.notification.confirm(
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
            navigator.notification.confirm(
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
