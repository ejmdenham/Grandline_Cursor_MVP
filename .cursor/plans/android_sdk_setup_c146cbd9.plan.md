---
name: Android SDK setup
overview: "The Android error occurs because the Android SDK is not installed or ANDROID_HOME is not set. The plan gives two paths: install the SDK and set env vars, or test without the SDK using Expo Go on a physical device."
todos: []
isProject: false
---

# Android "Failed to resolve the Android SDK path" — Fix or workaround

## Cause

Expo (and React Native) need the **Android SDK** and **adb** to run the app on an emulator or a device via USB. Your shell cannot find them because:

1. The default path `/Users/e.denham/Library/Android/sdk` does not exist (Android Studio / SDK not installed there, or not installed at all), or
2. **ANDROID_HOME** is not set, so the tools do not know where the SDK is.

`spawn adb ENOENT` means the `adb` binary is not on your PATH.

---

## Option A: Fix Android development on this machine

**1. Install Android Studio (includes the SDK)**  

- Download from [developer.android.com/studio](https://developer.android.com/studio).  
- Run the installer and complete setup.  
- In Android Studio: **Settings/Preferences → Appearance & Behavior → System Settings → Android SDK**. Note the **Android SDK Location** (e.g. `~/Library/Android/sdk`).

**2. Set ANDROID_HOME and PATH**  

- In your shell config (e.g. `~/.zshrc`):
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  export PATH=$PATH:$ANDROID_HOME/emulator
  ```
- If Android Studio installed the SDK elsewhere, use that path for `ANDROID_HOME`.  
- Run `source ~/.zshrc` (or open a new terminal).

**3. Create an Android Virtual Device (AVD)**  

- In Android Studio: **Tools → Device Manager**, create a virtual device.  
- Then from the project: `cd apps/mobile && npx expo start`, then press **a** for Android.

---

## Option B: Test without the Android SDK (no code changes)

You can still run and test the app without installing the SDK:

- **Expo Go on a physical Android device**  
  1. Install **Expo Go** from the Play Store.
  2. In the project: `cd apps/mobile && npx expo start`.
  3. Scan the QR code with your Android phone (Expo Go will open the project).
  No `ANDROID_HOME` or emulator needed.
- **iOS Simulator (if you’re on macOS)**  
  - From the same Expo dev server, press **i** to open the iOS simulator.  
  - Requires Xcode (and Command Line Tools) installed.

---

## Optional: Document for the repo

To help others (or yourself later), you can add a short **Development setup** section to the root README or a `docs/setup.md` that states:

- To run on **Android emulator**: install Android Studio, set `ANDROID_HOME` to the SDK path, and add `platform-tools` (and optionally `emulator`) to `PATH`.  
- To run without SDK: use **Expo Go** on a device and scan the QR code from `npx expo start`.

No code or config changes are required for Option A or B; only environment setup (and optionally docs).