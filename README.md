FlyFrenzy
=========

A mobile game written in TypeScript using Cordova framework for Android and Windows Phone. Please contact me if you'd like to get access to the private alpha & beta releases.

1/24/2015 - Update: Deployed alpha version 13... added limited number of lifes & golden flies

12/29/2014 - Deployed alpha version 11... added usernames (no password for now) and global high scores

12/10/2014 - Deployed alpha version 10...small bug fixes + visual feedback for location of user clicks

12/5/2014 - Deployed alpha version 0.0.0.9 to the Google Play & Windows Phone Store (added different types of flies)

11/24/2014 - Deployed alpha version 0.0.0.8 to the Google Play & Windows Phone store (added support for in game ads to pay the bills).


COMMANDS:

jake init - must be run before anything else...adds the android & wp8 platforms and all plugins the game depends on

jake android - builds the android release APK and moves it to releaseBuilds/ folder (requires the my-release-key.keystore file)

jake wp8 - builds the wp8 release XAP and moves it to releaseBuilds/ folder

cordova build android - builds a debug android APK

cordova build wp8 - builds a debug wp8 XAP

cordova emulate android - builds an android APK and launches it in emulator

cordova emulate wp8 - builds a wp8 XAP and launches it in emulator