/// <reference path="fly.ts"/>
/// <reference path="gameState.ts"/>

class FlyFactory {
	public static CreateFly(level: number): Fly {
		// every 3 levels we decrease the size of the fly (first increase occurs at level 3)
		var width = GameState.Instance().maxLeft / (3 * (Math.floor(level / 3) + 1));
     
     	// every 3 levels we make them move a little faster (first increase occurs at level 2)
        var moveSpeed = (GameState.Instance().maxLeft / 160) * (Math.floor(level + 1) / 3) + 1;

        // every 3 levels we raise the max life of flies (first increase occurs at level 4)
        var totalHealth = Math.round(Math.random() * Math.floor((level - 1) / 3) + 1); 

        var fly = new Fly(width, moveSpeed, totalHealth);
		return fly;
	}	
}