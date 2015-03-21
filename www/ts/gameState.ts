/// <reference path="fly.ts"/>
/// <reference path="target.ts"/>
/// <reference path="explosion.ts"/>
/// <reference path="flyFactory.ts"/>
/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
/// <reference path="utilities.ts"/>
/// <reference path="cordovaWrapper.ts"/>

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
    private explosions: Explosion[];
    private touchList: any[];
    private remainingToKill: number;
    private timeDiv: HTMLElement = document.getElementById("timeCounter");
    private levelDiv: HTMLElement = document.getElementById("levelCounter");
    private startLives: number = 3;
    private currentLives: number;
    
    // classname for divs that need to be destroyed 
    // during exit (instead of just hidden)
    private temporaryDivsClass: string = "gameStateTemporary";
    private static instance: GameState;
    private intervalId: any;
    private app: App;
    private scoreGuid: string;

    // boolean that we use as a locking mechanism to not show multiple menus
    private canLock: boolean = true; 

    constructor() {
        super();
        this.stateName = "gameState";
    }

    public static Instance(): GameState {
        if (typeof GameState.instance === "undefined") {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }

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
        backgroundDiv.addEventListener('click', this.handleTouch, false);

        instance.currentLives = instance.startLives;
        instance.canLock = true;
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
        backgroundDiv.removeEventListener("click", this.handleTouch);
    }

    private StartLevel() {
        var instance = GameState.Instance();
        instance.timeCounter = this.startTime;
        instance.gameLoopCounter = 0;
        instance.targets = [];
        instance.touchList = [];
        instance.explosions = [];
        
        instance.flies = FlyFactory.CreateFliesForLevel(instance.currentLevel);
        instance.remainingToKill = instance.flies.length;
        // figure out how many flies actually need to be killed to beat the level
        // poisoned ones don't count!
        for (var i = 0; i < instance.flies.length; i++) {
            if (!instance.flies[i].needToKill) {
                instance.remainingToKill--;
            }
        }

        instance.updateTime();
        instance.updateLives();


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

        // use instance.canLock to make sure we arean't locked in a dialog
        if (this.timeCounter > 0 && instance.canLock) {
            instance.intervalId = setInterval(instance.run, 1000 / instance.fps);
        } else if (!instance.canLock) {
            Logger.LogInfo("unable to get lock");
        }
    }

    public OnBack(app: App) {
        app.ChangeState(HomeState.Instance());
    }

    public handleTouch(e){
        var posx = 0;
        var posy = 0;
        if (!e) {return;}
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        e.x = posx;
        e.y = posy;
        e.radius = Target.radius();
        GameState.Instance().touchList.push(e);
        GameState.Instance().targets.push(new Target(posx, posy));
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

        instance.canLock = true;
    }


    private gameOverDialog(index: number) {
        var instance = GameState.Instance();
        // the game is over...no matter what they do go back to home state
        instance.app.ChangeState(HomeState.Instance());
        instance.canLock = true;
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

        instance.canLock = true;
    }

    public secondElapse() {
        this.timeCounter--;
        this.updateTime();
        var instance = GameState.Instance();
        if(this.timeCounter === 0 && this.flies.length > 0 && instance.canLock) {
            instance.canLock = false;    
            clearInterval(instance.intervalId);
            instance.currentLives--;
            if (instance.currentLives > 0) {
                CordovaWrapper.confirm(
                    instance.remainingFlies() + " flies remaining." ,
                    this.levelFailedDialog,
                    "Try Again?",            
                    ["Yes", "No"]  
                );
            } else {
                CordovaWrapper.confirm(
                    "You ran out of time!",
                    instance.gameOverDialog,
                    "Game Over!",            
                    ["Exit"]  
                );                
            }
        } else if (!instance.canLock) {
            Logger.LogInfo("unable to get lock");
        }
    }

    private remainingFlies() {
        return this.remainingToKill;
    }

    private updateTime() {
        this.timeDiv.innerHTML = this.timeCounter.toString();
    }

    private updateLives() {
        var instance = GameState.Instance();
        var container = document.getElementById("livesContainer");
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        } else {
            container = document.createElement("div");
            container.setAttribute("id", "livesContainer");
        }
        for (var l = 0; l < instance.currentLives; l++) {
            var div = document.createElement("div");
            div.classList.add("life");
            div.classList.add("gameStateTemporary");
            container.appendChild(div);
        }
        // append all the divs to the ui in one batch
        document.body.appendChild(container);
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
        var url = 'https://flyfrenzy.azure-mobile.net/api/' + this.app.GetAPIVersion() + '?' +
            "level=" + level + 
            "&userName=" + userName +
            "&clientGuid=" + clientGuid +
            "&scoreGuid=" + scoreGuid + 
            "&version=" + this.app.GetAppVersion();
        request.open('POST', url, true);
        request.onreadystatechange = function() {
            if(request.readyState === 4 && request.status === 200) {
                if (JSON.parse(request.responseText).newHighScore) {
                    CordovaWrapper.toastShortBottom("New High Score!");
                }
            } else if (request.readyState == 4 ){
                CordovaWrapper.toastShortBottom("Error: " + request.responseText);
            }
        }
        request.send();
    }

    private GetScoreGuid() {
        return this.scoreGuid;
    }

    private createExplosion(fly: Fly) {
        var x: number = parseInt(fly.div.style.left) + fly.width / 2;
        var y: number = parseInt(fly.div.style.top) + fly.height / 2;
        var instance = GameState.Instance();
        instance.explosions.push(new Explosion(x, y));
    }

    private run () {
        var instance = GameState.Instance();

        // go through all the touches that have happened in the last game frame and check them vs all flies 
        // O(flyCount*touchCount) runtime which isn't ideal...but might be ok for now

        // also go through all explosions and do the same
        var touches = instance.touchList;
        var explosions = instance.explosions;
        var deadFlies: number = 0;
        for (var f = instance.flies.length - 1; f >= 0; f--) {
            var fly = instance.flies[f];

            for (var t = 0; t < touches.length; t++) {
                if (instance.collides(touches[t], fly)) {
                    fly.clicked();
                }
            }

            for (var e = 0; e < explosions.length; e++) {
                if (instance.collides(explosions[e], fly)) {
                    fly.clicked();
                }
            }

            if (fly.healthRemaining > 0) { 
                fly.move();
            } else {

                if(fly.type === "goldFly") {
                    instance.currentLives++;
                    instance.updateLives();
                    CordovaWrapper.toastShortBottom("You gained an extra life!");
                }

                if(fly.type === "explosiveFly") {
                    instance.createExplosion(fly);
                }

                fly.die();
                instance.flies.splice(f, 1);
                if (fly.needToKill) {
                    instance.remainingToKill--;
                }
                if (fly.type === "poisonFly" && instance.canLock) {
                    instance.canLock = false;

                    instance.currentLives--;
                    clearInterval(instance.intervalId);

                    if (instance.currentLives > 0) {
                        CordovaWrapper.confirm(
                            "You got poisoned!",
                            instance.levelFailedDialog,
                            "Try Again?",            
                            ["Yes", "No"]  
                        );
                    } else {
                        CordovaWrapper.confirm(
                            "You got poisoned!",
                            instance.gameOverDialog,
                            "Game Over!",            
                            ["Exit"]  
                        );
                    }
                    return;
                } else if (!instance.canLock) {
                    Logger.LogInfo("unable to get lock");
                }
            }
        }

        var e = instance.explosions.length;
        while (e--) {
            var explosion = instance.explosions[e];
            explosion.update();
            if (explosion.isExpired()) {
                instance.explosions[e].destroy();
                instance.explosions.splice(e, 1);
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

        if (instance.remainingFlies() === 0 && instance.canLock) {
            instance.canLock = false;
            clearInterval(instance.intervalId);
            CordovaWrapper.confirm(
                "Level Completed",
                instance.levelCompleteDialog,
                "Great Job!",            
                ["Next Level", "Exit"]  
            );
        } else if (!instance.canLock) {
            Logger.LogInfo("unable to get lock");
        }

        instance.gameLoopCounter++;
        if (instance.gameLoopCounter > instance.fps) {
            instance.gameLoopCounter = 0;
            instance.secondElapse();
        }
        instance.touchList = [];
    }
}
