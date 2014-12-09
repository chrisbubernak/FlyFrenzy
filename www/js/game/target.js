/// <reference path="gameState.ts"/>
var Target = (function () {
    function Target(x, y) {
        this.width = GameState.Instance().maxLeft / 12;
        this.height = this.width;
        this.type = "target";
        this.createTargetDiv(x, y);
    }
    Target.prototype.createTargetDiv = function (x, y) {
        var div = document.createElement("div");
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.top = (y - this.height / 2) + "px";
        div.style.left = (x - this.width / 2) + "px";
        div.classList.add(this.type);
        div.classList.add("gameStateTemporary");
        document.body.appendChild(div);
        return div;
    };
    return Target;
})();
