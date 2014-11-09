/// <reference path="state.ts"/>
/// <reference path="homeState.ts"/>

class App implements StateMachine{
	currentState: State;

	constructor() {
		this.ChangeState(HomeState.Instance());
	}

	public ChangeState(newState: State): void {
		if (!newState) {
			alert('Error changing game state');
			return;
		}
		
		if (this.currentState) {
			// we need this because on app start we won't have 
			// a current state and so we don't need to call exit
			this.currentState.Exit(this);
		}

		this.currentState = newState;
		this.currentState.Enter(this);
	}

	public OnPause() {
		this.currentState.OnPause(this);
	}

	public OnResume() {
		this.currentState.OnResume(this);
	}

	public OnBack() {
		this.currentState.OnBack(this);
	}
}