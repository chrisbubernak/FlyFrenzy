/// <reference path="state.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="homeState.ts"/>
/// <reference path="cordovaWrapper.ts"/>

class App implements StateMachine{
	private appVersion: string = "0.1.6";
	private apiVersion: string = "v1";

	currentState: State;
	private userName: string;
	private clientGuid: string;

	constructor() {
		var that = this;
		document.addEventListener("backbutton", function() { that.OnBack(); }, false);
        document.addEventListener("pause", function() { that.OnPause(); }, false);
        document.addEventListener("resume", function() { that.OnResume; }, false);
        CordovaWrapper.initAds();
		this.ChangeState(HomeState.Instance());
	}

	public ChangeState(newState: State): void {
		if (!newState) {
			Logger.LogError('Error changing game state');
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

	public SignOut() {
		if (this.currentState.StateName() === HomeState.Instance().StateName()) {
			(<HomeState>this.currentState).SignOut(this);
		} else {
			Logger.LogError("Signout was called from outside of HometState");
		}
	}

	public GetUserName(): string {
		return this.userName;
	}

	public SetUserName(userName: string): void {
		this.userName = userName;
	}

	public GetClientGuid(): string {
		return this.clientGuid;
	}

	public SetClientGuid(clientGuid: string): void {
		this.clientGuid = clientGuid;
	}

	public GetAppVersion() {
		return this.appVersion;
	}
	public GetAPIVersion() {
		return this.apiVersion;
	}
}