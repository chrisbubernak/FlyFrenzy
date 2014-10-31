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
    return State;
})();
