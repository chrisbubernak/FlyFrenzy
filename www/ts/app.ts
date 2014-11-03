/// <reference path="state.ts"/>
/// <reference path="home.ts"/>

class App implements StateMachine{
	currentState: State;

	constructor() {
		this.ChangeState(Home.Instance());
	}

	public ChangeState(newState: State): void {
		if (!newState) {
			alert('Error changing game state');
			return;
		}
		
		if (this.currentState) {
			// this should only get called during app start up
			// when we go from no state to home state
			this.currentState.Exit(this);
		}

		this.currentState = newState;
		this.currentState.Enter(this);
	}
}