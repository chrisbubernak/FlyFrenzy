/// <reference path="fly.ts"/>
/// <reference path="gameState.ts"/>

class FlyFactory {

	public static CreateFliesForLevel(level: number): Fly[] {
		var flies = [];

		for (var i = 0; i < 8; i++) {
			flies.push(FlyFactory.CreateRegularFly());
		}

		for (var i = 0; i < Math.floor((level + 1)/ 3); i++) {
			flies.push(FlyFactory.CreateFastFly());
		}

		for (var i = 0; i < (Math.floor((level) / 3)); i++) {
			flies.push(FlyFactory.CreatePoisonFly());

		}

		for (var i = 0; i < (Math.floor((level - 1) / 3)); i++) {
			flies.push(FlyFactory.CreateBigFly());
		}

		for (var i = 0; i < (Math.floor((level) / 3)) - 1; i++) {
			flies.push(FlyFactory.CreateExplosiveFly());
		}

		if (Math.random() > .9) {
			flies.push(FlyFactory.CreateGoldFly());
		}

		return flies;
	}

	public static CreateExplosiveFly(): Fly {
        var width = GameState.Instance().maxLeft / 6;
		var moveSpeed = GameState.Instance().maxLeft / 100;
		var fly = new Fly(width, moveSpeed, 1, "explosiveFly", true);
		fly.bleeds = false;
		return fly;
	}

	public static CreateFastFly(): Fly {
		var width = GameState.Instance().maxLeft / 6;
		var moveSpeed = GameState.Instance().maxLeft / 40;
		var fly = new Fly(width, moveSpeed, 1, "fastFly", true);
		return fly;
	}

	public static CreatePoisonFly(): Fly {
		var width = GameState.Instance().maxLeft / 5.5;	
		var moveSpeed = GameState.Instance().maxLeft / 80;
		var fly = new Fly(width, moveSpeed, 1, "poisonFly", false);
		return fly;
	}

	public static CreateBigFly(): Fly {
		var width = GameState.Instance().maxLeft / 4;
		var moveSpeed = GameState.Instance().maxLeft / 120;
		var fly = new Fly(width, moveSpeed, 3, "bigFly",  true);
		return fly;
	}

	public static CreateRegularFly(): Fly {
		var width = GameState.Instance().maxLeft / 6;
		var moveSpeed = GameState.Instance().maxLeft / 80;
		var fly = new Fly(width, moveSpeed, 1, "fly", true);
		return fly;
	}

	public static CreateGoldFly(): Fly {
		var width = GameState.Instance().maxLeft / 8;
		var moveSpeed = GameState.Instance().maxLeft / 37;
		var fly = new Fly(width, moveSpeed, 1, "goldFly", false);
		return fly;
	}
}