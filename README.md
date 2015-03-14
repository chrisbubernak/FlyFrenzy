FlyFrenzy
=========

A mobile game written in TypeScript using Cordova framework for Android and Windows Phone. Please contact me if you'd like to get access to the private alpha & beta releases.

## Releases

3/14/2015 - Deployed alpha version 15... added exploding flies to the game!

2/18/2015 - Deployed alpha version 14... mostly just some UI fixes to to the menu screens

1/24/2015 - Deployed alpha version 13... added limited number of lifes & golden flies

12/29/2014 - Deployed alpha version 11... added usernames (no password for now) and global high scores

12/10/2014 - Deployed alpha version 10...small bug fixes + visual feedback for location of user clicks

12/5/2014 - Deployed alpha version 0.0.0.9 to the Google Play & Windows Phone Store (added different types of flies)

## Setup

* Clone the Repo
* install [win phone 8 sdk](http://dev.windows.com/en-us/develop/download-phone-sdk)
* install [android sdk](http://developer.android.com/sdk/installing/index.html?pkg=tools)
* launch the sdk tools and install version 19
* npm install cordova -g
* npm install jake -g
* npm install
* jake init
* jake compile
* ...now you can go build, emulate, deploy!
Note: depending on your setup you might need add a few locations to your path for everything to work right

## Commands

* jake init - must be run before anything else...adds the android & wp8 platforms and all plugins the game depends on

* jake android - builds the android release APK and moves it to releaseBuilds/ folder (requires the my-release-key.keystore file)

* jake wp8 - builds the wp8 release XAP and moves it to releaseBuilds/ folder

* cordova build android - builds a debug android APK

* cordova build wp8 - builds a debug wp8 XAP

* cordova emulate android - builds an android APK and launches it in emulator

* cordova emulate wp8 - builds a wp8 XAP and launches it in emulator