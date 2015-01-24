/// <reference path="stateMachine.ts"/>
/// <reference path="logger.ts"/>

class State {
	public static Instance(): State {
		Logger.LogError("Instance() not implemented");
		return new State();
	}

	public Enter(stateMachine: StateMachine): void {
		Logger.LogError("Enter() not implemented");
	}

	public Exit(stateMachine: StateMachine): void {
		Logger.LogError("Exit() not implemented");
	}

	public Execute(stateMachine: StateMachine): void {
		Logger.LogError("Execute() not implemented");
	}

	public OnPause(stateMachine: StateMachine): void {
		Logger.LogError("OnPause() not implemented");
	}

	public OnResume(stateMachine: StateMachine): void {
		Logger.LogError("OnResume() not implemented");
	}

	public OnBack(stateMachine: StateMachine): void {
		Logger.LogError("OnBack() not implemented");
	}
}