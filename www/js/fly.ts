﻿/// <reference path="game.ts"/>

class Fly {
    width: number = Game.maxLeft / 10;
    height: number = this.width;
    totalHealth: number = 4;
    healthRemaining: number;
    div: HTMLDivElement;
    moveSpeed: number = Game.maxLeft / Math.round(30 - Math.random() * 7);
    angle: number;

    constructor() {
        var maxLeft = Game.maxLeft - this.width;
        var maxTop = Game.maxTop - this.height;
        var x = Math.min(Math.max(0, (Math.random() * maxLeft)), maxLeft);
        var y = Math.min(Math.max(0, (Math.random() * maxTop)), maxTop);
        this.healthRemaining = this.totalHealth;

        this.div = this.createFlyDiv(x, y);
    }

    public move() {
        var left = this.div.offsetLeft;
        var width = this.div.offsetWidth;
        var height = this.div.offsetHeight;
        var top = this.div.offsetTop;

        var maxLeft = Game.maxLeft - width;
        var maxTop = Game.maxTop - height;


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

    // todo: move this part out to a helper class for creating divs
    private createFlyDiv(x: number, y: number): HTMLDivElement {
        var div = document.createElement("div");
        div.style.top = y + "px";
        div.style.left = x + "px";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.classList.add("fly");
        var that: Fly = this;
        div.onclick = function () {
            that.healthRemaining--;
            Game.score();
            (<any>navigator).vibrate(50);
        };
        document.body.appendChild(div);
        return div;
    }
} 