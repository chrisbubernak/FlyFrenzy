/// <reference path="gameState.ts"/>

class Fly {
    static count: number = 0;
    id: number;
    type: string;
    width: number;
    height: number;
    totalHealth: number;
    healthRemaining: number;
    div: HTMLDivElement;
    moveSpeed: number;
    angle: number;

    constructor(width: number, moveSpeed: number, totalHealth: number, type: string) {
        this.id = Fly.count;
        Fly.count++;

        this.type = type;
        this.width = width;
        this.height = this.width;
        this.moveSpeed = moveSpeed;
        this.totalHealth = totalHealth;
        this.healthRemaining = this.totalHealth;

        var maxLeft = GameState.Instance().maxLeft - this.width;
        var maxTop = GameState.Instance().maxTop - this.height;
        var x = Math.min(Math.max(0, (Math.random() * maxLeft)), maxLeft);
        var y = Math.min(Math.max(0, (Math.random() * maxTop)), maxTop);

        this.div = this.createFlyDiv(x, y);
    }

    public move() {
        var left = this.div.offsetLeft;
        var width = this.div.offsetWidth;
        var height = this.div.offsetHeight;
        var top = this.div.offsetTop;

        var maxLeft = GameState.Instance().maxLeft - width;
        var maxTop = GameState.Instance().maxTop - height;


        if (this.angle === undefined || Math.random() >= .90) {
            this.angle = Math.random() * 2 * Math.PI;
        }

        var xChange = Math.cos(this.angle) * this.moveSpeed;
        var yChange = Math.sin(this.angle) * this.moveSpeed;

        // make sure we don't get stuck on walls...
        if ((left + xChange) < 0 || (left + xChange) > maxLeft) {
            xChange *= -1;
            this.angle += Math.PI;
        }
        if ((top + yChange) < 0 || (top + yChange) > maxTop) {
            yChange *= -1;
            this.angle += Math.PI;
        }

        var newLeft = Math.min(Math.max(0, (left + xChange)), maxLeft);
        var newTop = Math.min(Math.max(0, (top + yChange)), maxTop);

        this.div.style.left = newLeft + "px";
        this.div.style.top = newTop + "px";
    }


    public die(): void {
        var x = this.div.offsetLeft;
        var y = this.div.offsetTop;
        // create blood splat div
        var div = document.createElement("div");
        div.style.top = y + "px";
        div.style.left = x + "px";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.classList.add("splat");
        div.classList.add(this.type);
        div.classList.add("gameStateTemporary");
        document.body.appendChild(div);

        // remove the html element
        (<HTMLDivElement>this.div).parentNode.removeChild(this.div); 
        (<any>navigator).vibrate(150);
    }

    // todo: move this part out to a helper class for creating divs
    private createFlyDiv(x: number, y: number): HTMLDivElement {
        var div = document.createElement("div");
        div.style.top = y + "px";
        div.style.left = x + "px";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.classList.add(this.type);
        div.classList.add("gameStateTemporary");
        var that: Fly = this;

        // todo: are these event listeners getting cleaned up??? need to investigate
        div.addEventListener("touchstart", GameState.Instance().handleTouch, false);

        document.body.appendChild(div);
        return div;
    }

    public clicked() {
        this.healthRemaining--;
        (<any>navigator).vibrate(50);
    }
} 