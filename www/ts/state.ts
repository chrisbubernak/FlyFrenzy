/// <reference path="stateMachine.ts"/>

class State {
	public static Instance(): State {
		alert("Instance() not implemented");
		return new State();
	}

	public Enter(stateMachine: StateMachine): void {
		alert("Enter() not implemented");
	}

	public Exit(stateMachine: StateMachine): void {
		alert("Exit() not implemented");
	}

	public Execute(stateMachine: StateMachine): void {
		alert("Execute() not implemented");
	}
}