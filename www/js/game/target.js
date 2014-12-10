/// <reference path="gameState.ts"/>
var Target = (function () {
    function Target(x, y) {
        this.width = GameState.Instance().maxLeft / 12;
        this.height = this.width;
        this.borderSize = this.width / 10;
        this.type = "target";
        this.timerStart = 10;
        this.timer = this.timerStart;
        this.createTargetDiv(x, y);
    }
    Target.prototype.update = function () {
        var ratio = (this.timer / this.timerStart);
        this.div.style.opacity = ratio.toString();
        var curWidth = this.width * (1 - ratio);
        this.div.style.width = curWidth + "px";
        this.div.style.height = curWidth + "px";
        this.div.style.top = (this.y - curWidth / 2 - this.borderSize) + "px";
        this.div.style.left = (this.x - curWidth / 2 - this.borderSize) + "px";
        this.timer--;
    };

    Target.prototype.isExpired = function () {
        return this.timer === 0;
    };

    Target.prototype.destroy = function () {
        this.div.parentNode.removeChild(this.div); // remove the html element
    };

    Target.prototype.createTargetDiv = function (x, y) {
        this.x = x;
        this.y = y;

        var div = document.createElement("div");

        div.style.border = this.borderSize + "px solid #B01E00";
        div.style.borderRadius = "50%";

        div.classList.add(this.type);
        div.classList.add("gameStateTemporary");
        document.body.appendChild(div);

        // todo: we need the click event to still go through to the background div
        // however this doesn't happen with absolutely positioned divs so we have to
        // add this...there should be a better way tho!
        div.onclick = function (event) {
            GameState.Instance().ClickHandler(event);
        };

        this.div = div;
    };
    return Target;
})();
