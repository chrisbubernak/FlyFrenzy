/// <reference path="fly.ts"/>
/// <reference path="gameState.ts"/>

class FlyFactory {

	/* currently deprecated */
	/*public static CreateFly(level: number): Fly {
		// every 3 levels we decrease the size of the fly (first increase occurs at level 3)
		var width = GameState.Instance().maxLeft / (3 * (Math.floor(level / 3) + 1));
     
     	// every 3 levels we make them move a little faster (first increase occurs at level 2)
        var moveSpeed = (GameState.Instance().maxLeft / 160) * (Math.floor(level + 1) / 3) + 1;

        // every 3 levels we raise the max life of flies (first increase occurs at level 4)
        var totalHealth = Math.round(Math.random() * Math.floor((level - 1) / 3) + 1); 

        var fly = new Fly(width, moveSpeed, totalHealth, "fly");
		return fly;
	}*/

	public static CreateFliesForLevel(level: number): Fly[] {
		var flies = [];
		for (var i = 0; i < 3; i++) {
			flies.push(FlyFactory.CreateFastFly());
			flies.push(FlyFactory.CreateRegularFly());
			flies.push(FlyFactory.CreatePoisonFly());
			flies.push(FlyFactory.CreateBigFly());
		}
		return flies;
	}

	public static CreateExplosiveFly(): Fly {
        var width = GameState.Instance().maxLeft / 6;
		var moveSpeed = GameState.Instance().maxLeft / 100;
		var fly = new Fly(width, moveSpeed, 1, "explosiveFly");
		return fly;
	}

	public static CreateFastFly(): Fly {
		var width = GameState.Instance().maxLeft / 6;
		var moveSpeed = GameState.Instance().maxLeft / 60;
		var fly = new Fly(width, moveSpeed, 1, "fastFly");
		return fly;
	}

	public static CreatePoisonFly(): Fly {
		var width = GameState.Instance().maxLeft / 6;	
		var moveSpeed = GameState.Instance().maxLeft / 80;
		var fly = new Fly(width, moveSpeed, 1, "poisonFly");
		return fly;
	}

	public static CreateBigFly(): Fly {
		var width = GameState.Instance().maxLeft / 4;
		var moveSpeed = GameState.Instance().maxLeft / 120;
		var fly = new Fly(width, moveSpeed, 3, "bigFly");
		return fly;
	}

	public static CreateRegularFly(): Fly {
		var width = GameState.Instance().maxLeft / 6;
		var moveSpeed = GameState.Instance().maxLeft / 80;
		var fly = new Fly(width, moveSpeed, 1, "fly");
		return fly;
	}
}