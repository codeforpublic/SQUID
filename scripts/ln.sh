#!/bin/sh

rm -rf node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation/TSLocationManager.framework
ln -s ~/workspace/react/background-geolocation/react-native-background-geolocation-android/ios/RNBackgroundGeolocation/TSLocationManager.framework node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation/TSLocationManager.framework
