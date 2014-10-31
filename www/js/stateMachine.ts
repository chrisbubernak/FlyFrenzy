/// <reference path="state.ts"/>

interface StateMachine {
	currentState: State;
	ChangeState(newState: State): void;
}