FlyFrenzy
=========

A mobile game written in TypeScript using Cordova framework for Android and Windows Phone. Please contact me if you'd like to get access to the private alpha & beta releases.

12/5/2014 - Update: Deployed alpha version 0.0.0.9 to the Google Play & Windows Phone Store (added different types of flies)

11/24/2014 - Deployed alpha version 0.0.0.8 to the Google Play & Windows Phone store (added support for in game ads to pay the bills).

11/22/2014 - Deployed alpha version 0.0.0.7 to the Google Play & Windows Phone store.

11/18/2014 - This is currently under heavy construction and in what I would (generously) consider alpha stage.


COMMANDS:
jake init - must be run before anything else...adds the android & wp8 platforms and all plugins the game depends on
jake android - builds the android release APK and moves it to releaseBuilds/ folder (requires the my-release-key.keystore file)
jake wp8 - builds the wp8 release XAP and moves it to releaseBuilds/ folder
cordova build android - builds a debug android APK
cordova build wp8 - builds a debug wp8 XAP
cordova emulate android - builds an android APK and launches it in emulator
cordova emulate wp8 - builds a wp8 XAP and launches it in emulator