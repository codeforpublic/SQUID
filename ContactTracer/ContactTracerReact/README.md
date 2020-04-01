# ContactTracerReact

Project to bridge the native ContactTracer to React Native with full functionalities.

## Features

```
- [X] Android Bridge
- [ ] iOS Bridge
```

## To run

For Android, simply run:

```
npx react-native run-android
```

## Notes for Android

File to used:

- /src/App.js <-- Main file
- /src/ContactTracerBridge.js
- /src/Permission.js
- /android/app/src/main/java
- /android/app/src/main/res

Mock file should be existed on main project:

- /src/User.js
- /src/nanoid.js

You could find almost everything in `/src/App.js` which everything is splitted in pieces there and very easy to understand.
