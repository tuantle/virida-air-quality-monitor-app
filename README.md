<p align="left">
    <img width="10%" height="10%" style="border-radius: 60px" src="assets/logos/app-logo.png">
    <a style="font-weight: bold; font-size: 250%; margin-left: 10px" href = "https://github.com/tuantle/virida-air-quality-monitor-app">Virida</a>
</p>

#### An air quality monitor app built with [React Native](https://facebook.github.io/react-native/), [Hypertoxin](https://github.com/tuantle/hypertoxin/) & [Hyperflow](https://github.com/tuantle/hyperflow). Source code is open and available to be used for references.

* * *

<p align="center">
   <img width="20%" height="20%" src="/assets/screenshots/iphone-xs-max-1.png">
   <img width="20%" height="20%" src="/assets/screenshots/iphone-xs-max-2.png">
   <img width="20%" height="20%" src="/assets/screenshots/iphone-xs-max-3.png">
   <img width="20%" height="20%" src="/assets/screenshots/iphone-xs-max-4.png">
</p>

* * *

## AppStore

[Checkout Virida on the app store!](https://apps.apple.com/us/app/virida/id1315223443?ls=1)

## About

Every year, millions of people die prematurely from air pollution related deaths, including 1.7 million children. Exposure to poor air quality has been linked to asthma & cardiovascular diseases such as strokes, heart disease, and even cancer. Air pollution is the world's largest single environmental health risk. If reducing air pollution could save our children & millions of lives, why don't we care more?

Introducing project Virida. We want to provide a solution to the world where every person can find out what their surrounding air quality is like and how it impacts them. We need this solution to be affordable, portable, accurate, and integrated with a smart device. There is no such device in the market that successfully adopts all 4 of these principles in order to ensure global widespread adoption. Project Virida aims to drive maximum air quality awareness and the importance of green energy as it applies to our health.
Why do all of this? To connect people & show them directly with tangible evidence why green energy matters on an extremely personal level. Green energy is more than just about reducing climate change or improving economic sustainability. It's about maintaining the health of our communities and the health of our children. If we can successfully bridge this gap, then we all collectively win.

## Features
-   Ability to retrieve air quality summary from [airnow.gov](https://airnow.gov) and [aqicn.org](aqicn.org) for the current region you are in. The regional summary includes overall air quality index score and a list of all major pollutant and their concentration levels.
-   Info on air quality index, pollution types, and actionable tips.
-   Ability to retrieve air quality forecast data for the next 5 days.
-   Can show all air quality monitoring sites on the map from any city around the world.
-   Ability to notify you when air quality is unhealthy and also the daily air quality alert.
-   [Code-push](https://microsoft.github.io/code-push/) for pushing quick app updates.
-   It is open-source!!!

## Dependencies

Virida app depends on the following major packages:
-   [react-native](https://facebook.github.io/react-native/)
-   [react-native-code-push](https://microsoft.github.io/code-push/)
-   [hypertoxin](https://github.com/tuantle/hypertoxin) (react-native component lib)
-   [hyperflow](https://github.com/tuantle/hyperflow) (app state flow management lib)
-   [react-native-app-intro-slider](https://github.com/Jacse/react-native-app-intro-slider)
-   [react-native-background-geolocation](https://github.com/transistorsoft/react-native-background-geolocation)
-   [react-native-collapsible](https://github.com/oblador/react-native-collapsible)
-   [react-native-google-places](https://github.com/tolu360/react-native-google-places)
-   [react-native-maps](https://github.com/react-native-community/react-native-maps)
-   [react-native-push-notification](https://github.com/zo0r/react-native-push-notification)
-   [react-native-svg-charts](https://github.com/JesperLekland/react-native-svg-charts)
-   [react-navigation](https://github.com/react-navigation/react-navigation)


This repo does not have the ios/android build folder. I did not commit these to this open-source repo because the published ios/android build folder contains important API keys (google map dev key, apple dev key, code-push, etc). Send me a message to get more info if you are interested in building this app.

## Licence

This is the archive repo for Virida app. The source code is open and available under [MIT licensed](./LICENSE).
