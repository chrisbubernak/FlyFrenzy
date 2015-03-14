/// <reference path="gameState.ts"/>
/// <reference path="logger.ts"/>

class Explosion {
	static width: number = GameState.Instance().maxLeft / 4;
	static type: string = "explosion";
	height: number = Explosion.width;
	private x: number;
	private y: number;
	private radius: number = 0;
	private borderSize: number = Explosion.width / 10;
	private div: HTMLDivElement;
	private timerStart: number = 6; // the number of frames the target is on screen before it disappears
	private timer: number = this.timerStart;
	private expired = false;

	constructor(x: number, y: number) {
		this.createDiv(x, y);
	}

	public update() {
		var ratio = (this.timer/this.timerStart);
		var curWidth = Explosion.width *  (1 - ratio);
		this.div.style.width = curWidth + "px";
		this.div.style.height = curWidth + "px";
		this.radius = curWidth/2;
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

	private createDiv(x: number, y: number){
    	this.x = x;
    	this.y = y;
		var div = document.createElement("div");

		div.style.top = (this.y - this.borderSize) + "px";
        div.style.left = (this.x - this.borderSize) + "px";
        div.style.backgroundColor = "yellow";
        div.style.border = this.borderSize + "px solid red";
        div.style.borderRadius = "50%";

        div.classList.add(Explosion.type);
        div.classList.add("gameStateTemporary");

        document.body.appendChild(div);
        this.div = div;
    }
}