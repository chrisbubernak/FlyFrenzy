/// <reference path="stateMachine.ts"/>
var State = (function () {
    function State() {
    }
    State.Instance = function () {
        alert("Instance() not implemented");
        return new State();
    };

    State.prototype.Enter = function (stateMachine) {
        alert("Enter() not implemented");
    };

    State.prototype.Exit = function (stateMachine) {
        alert("Exit() not implemented");
    };

    State.prototype.Execute = function (stateMachine) {
        alert("Execute() not implemented");
    };

    State.prototype.OnPause = function (stateMachine) {
        alert("OnPause() not implemented");
    };

    State.prototype.OnResume = function (stateMachine) {
        alert("OnResume() not implemented");
    };

    State.prototype.OnBack = function (stateMachine) {
        alert("OnBack() not implemented");
    };
    return State;
})();
