/// <reference path="state.ts"/>
/// <reference path="app.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        _super.apply(this, arguments);
    }
    Home.Instance = function () {
        if (typeof Home.instance === "undefined") {
            Home.instance = new Home();
        }
        return Home.instance;
    };

    Home.prototype.Enter = function (app) {
        var html = document.getElementsByClassName("homeState");
        for (var i = 0; i < html.length; i++) {
            html[i].style.display = "inline";
        }
    };
    return Home;
})(State);
