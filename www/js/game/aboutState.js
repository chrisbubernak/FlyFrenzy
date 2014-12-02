/// <reference path="state.ts"/>
/// <reference path="homeState.ts"/>
/// <reference path="app.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AboutState = (function (_super) {
    __extends(AboutState, _super);
    function AboutState() {
        _super.apply(this, arguments);
        this.stateName = "aboutState";
    }
    AboutState.Instance = function () {
        if (typeof AboutState.instance === "undefined") {
            AboutState.instance = new AboutState();
        }
        return AboutState.instance;
    };

    AboutState.prototype.Enter = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }
    };

    AboutState.prototype.Exit = function (app) {
        var html = document.getElementsByClassName(this.stateName);
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "none";
        }
    };

    AboutState.prototype.OnBack = function (app) {
        app.ChangeState(HomeState.Instance());
    };

    AboutState.prototype.OnPause = function (app) {
    };
    return AboutState;
})(State);
