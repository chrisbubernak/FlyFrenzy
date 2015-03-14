/// <reference path="gameState.ts"/>

class Target {
	static width: number = GameState.Instance().maxLeft / 12;
	static type: string = "target";
	height: number = Target.width;
	borderSize: number = Target.width / 10;
	timerStart: number = 10; // the number of frames the target is on screen before it disappears
	timer: number = this.timerStart;
	div: HTMLDivElement;
	x: number;
	y: number;

	constructor(x: number, y: number) {
	   this.createTargetDiv(x, y);
	}

	public static radius() {
		return Target.width/2; 
	}

	public update() {
		var ratio = (this.timer/this.timerStart);
		this.div.style.opacity = ratio.toString();
		var curWidth = Target.width *  (1 - ratio);
		this.div.style.width = curWidth + "px";
		this.div.style.height = curWidth + "px";
		this.div.style.top = (this.y - curWidth / 2 - this.borderSize) + "px";
        this.div.style.left = (this.x - curWidth / 2 - this.borderSize) + "px";
		this.timer--;
	}

	public isExpired() {
		return this.timer === 0; 
	}

	public destroy() {
		(<HTMLDivElement>this.div).parentNode.removeChild(this.div); // remove the html element
	}

    private createTargetDiv(x: number, y: number){
    	this.x = x;
    	this.y = y;
		var div = document.createElement("div");

		div.style.top = (this.y - this.borderSize) + "px";
        div.style.left = (this.x - this.borderSize) + "px";
        div.style.border = this.borderSize + "px solid #B01E00";
        div.style.borderRadius = "50%";

        div.classList.add(Target.type);
        div.classList.add("gameStateTemporary");

        document.body.appendChild(div);

        // todo: we need the click event to still go through to the background div
        // however this doesn't happen with absolutely positioned divs so we have to
        // add this...there should be a better way tho!
        div.onclick = function (event) {
            GameState.Instance().handleTouch(event);
        };

        this.div = div;
    }
}