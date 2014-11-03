/// <reference path="state.ts"/>
/// <reference path="home.ts"/>
var App = (function () {
    function App() {
        this.ChangeState(Home.Instance());
    }
    App.prototype.ChangeState = function (newState) {
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
    };
    return App;
})();
