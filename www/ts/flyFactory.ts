/// <reference path="fly.ts"/>
/// <reference path="gameState.ts"/>

class FlyFactory {
	public static CreateFly(level: number): Fly {
		var width = (GameState.Instance().maxLeft / 5) / (.5 * level);
        var moveSpeed = (GameState.Instance().maxLeft / 40) * (.25 * level);
        var totalHealth = Math.round(Math.random() * 2 + 1); // totalHealth = 1 - 3
        var fly = new Fly(width, moveSpeed, totalHealth);
		return fly;
	}	
}