/// <reference path="state.ts"/>
/// <reference path="homeState.ts"/>
var App = (function () {
    function App() {
        this.ChangeState(HomeState.Instance());
    }
    App.prototype.ChangeState = function (newState) {
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
    };

    App.prototype.OnPause = function () {
        this.currentState.OnPause(this);
    };

    App.prototype.OnResume = function () {
        this.currentState.OnResume(this);
    };

    App.prototype.OnBack = function () {
        this.currentState.OnBack(this);
    };
    return App;
})();
