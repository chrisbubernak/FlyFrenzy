/// <reference path="gameState.ts"/>

class Target {
	width: number = GameState.Instance().maxLeft / 12;
	height: number = this.width;
	type: string = "target";

	constructor(x: number, y: number) {
	   this.createTargetDiv(x, y);
	}

    private createTargetDiv(x: number, y: number): HTMLDivElement {
        var div = document.createElement("div");
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.top = (y - this.height / 2) + "px";
        div.style.left = (x - this.width / 2) + "px";
        div.classList.add(this.type);
        div.classList.add("gameStateTemporary");
        document.body.appendChild(div);
        return div;
    }
}