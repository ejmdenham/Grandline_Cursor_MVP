# Grandline Mobile

## Running the app

**Use a development build** (not Expo Go) so the drawer and Reanimated/Worklets work:

```bash
cd apps/mobile && npx expo run:ios
# or
cd apps/mobile && npx expo run:android
```

Expo Go uses a fixed SDK bundle; React Navigation’s drawer depends on react-native-reanimated/Worklets, whose native version must match. A dev build compiles those native modules into the app.

Start Metro from this directory before or in another terminal:

```bash
cd apps/mobile && npx expo start --clear
```

Then run the app from Xcode/Android Studio or use `npx expo run:ios` (which can start the bundler for you).
