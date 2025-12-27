# Quick Start: Build Your APK in 5 Minutes

The fastest way to get your File Manager Pro APK.

## Option 1: EAS Build (Recommended - No Android Studio Required)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```
*Don't have an account? Create one free at [expo.dev](https://expo.dev)*

### 3. Navigate to project
```bash
cd android-file-manager
```

### 4. Build APK
```bash
eas build --platform android --profile preview
```

### 5. Wait and Download
- Build takes 10-20 minutes
- You'll get a download link in the terminal
- Or check: https://expo.dev → Your Projects → android-file-manager → Builds

### 6. Install on Android
- Download the APK to your phone
- Open it and tap Install
- Allow "Install from unknown sources" if prompted

**Done!** 🎉

---

## Option 2: Local Build (Requires Android Studio)

### Prerequisites
- Android Studio installed
- Android SDK configured

### Steps
```bash
cd android-file-manager
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Need Help?

See [BUILD.md](BUILD.md) for detailed instructions and troubleshooting.

## Repository

GitHub: https://github.com/avanderberg48-collab/android-file-manager
