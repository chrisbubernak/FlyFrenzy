/// <reference path="state.ts"/>
/// <reference path="app.ts"/>

class Home extends State {
	private static instance: Home;

    public static Instance(): Home {
        if (typeof Home.instance === "undefined") {
            Home.instance = new Home();
        }
        return Home.instance;
    }

    public Enter(app: App) {
        var html = document.getElementsByClassName("homeState");
        for (var i = 0; i < html.length; i++) {
            (<HTMLDivElement>html[i]).style.display = "inline";
        }

    }
}