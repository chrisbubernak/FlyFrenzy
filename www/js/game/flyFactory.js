/// <reference path="fly.ts"/>
/// <reference path="gameState.ts"/>
var FlyFactory = (function () {
    function FlyFactory() {
    }
    FlyFactory.CreateFliesForLevel = function (level) {
        var flies = [];
        for (var i = 0; i < 8; i++) {
            flies.push(FlyFactory.CreateRegularFly());
        }

        for (var i = 0; i < Math.floor((level + 1) / 3); i++) {
            flies.push(FlyFactory.CreateFastFly());
        }

        for (var i = 0; i < (Math.floor((level) / 3)); i++) {
            flies.push(FlyFactory.CreatePoisonFly());
        }

        for (var i = 0; i < (Math.floor((level - 1) / 3)); i++) {
            flies.push(FlyFactory.CreateBigFly());
        }

        return flies;
    };

    FlyFactory.CreateExplosiveFly = function () {
        var width = GameState.Instance().maxLeft / 6;
        var moveSpeed = GameState.Instance().maxLeft / 100;
        var fly = new Fly(width, moveSpeed, 1, "explosiveFly");
        return fly;
    };

    FlyFactory.CreateFastFly = function () {
        var width = GameState.Instance().maxLeft / 6;
        var moveSpeed = GameState.Instance().maxLeft / 40;
        var fly = new Fly(width, moveSpeed, 1, "fastFly");
        return fly;
    };

    FlyFactory.CreatePoisonFly = function () {
        var width = GameState.Instance().maxLeft / 5.5;
        var moveSpeed = GameState.Instance().maxLeft / 80;
        var fly = new Fly(width, moveSpeed, 1, "poisonFly");
        return fly;
    };

    FlyFactory.CreateBigFly = function () {
        var width = GameState.Instance().maxLeft / 4;
        var moveSpeed = GameState.Instance().maxLeft / 120;
        var fly = new Fly(width, moveSpeed, 3, "bigFly");
        return fly;
    };

    FlyFactory.CreateRegularFly = function () {
        var width = GameState.Instance().maxLeft / 6;
        var moveSpeed = GameState.Instance().maxLeft / 80;
        var fly = new Fly(width, moveSpeed, 1, "fly");
        return fly;
    };
    return FlyFactory;
})();
