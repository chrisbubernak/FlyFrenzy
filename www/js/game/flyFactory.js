/// <reference path="fly.ts"/>
/// <reference path="gameState.ts"/>
var FlyFactory = (function () {
    function FlyFactory() {
    }
    FlyFactory.CreateFly = function (level) {
        var width = (GameState.Instance().maxLeft / 5) / (.5 * level);
        var moveSpeed = (GameState.Instance().maxLeft / 40) * (.25 * level);
        var totalHealth = Math.round(Math.random() * 2 + 1);
        var fly = new Fly(width, moveSpeed, totalHealth);
        return fly;
    };
    return FlyFactory;
})();
