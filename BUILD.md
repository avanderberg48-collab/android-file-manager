# Building File Manager Pro APK

This guide explains how to build an APK file for the File Manager Pro app.

## Prerequisites

Before building, ensure you have:
- Node.js 18 or higher installed
- pnpm package manager
- An Expo account (free)

## Method 1: EAS Build (Recommended - Cloud Build)

This method builds your APK in the cloud without requiring Android Studio.

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account, create one at [expo.dev](https://expo.dev).

### Step 3: Configure Build

```bash
cd android-file-manager
eas build:configure
```

This will create an `eas.json` file (already included in this project).

### Step 4: Build APK

```bash
eas build --platform android --profile preview
```

**What happens:**
1. Your code is uploaded to Expo's servers
2. The app is built in the cloud
3. You'll receive a link to download the APK (usually takes 10-20 minutes)

### Step 5: Download APK

Once the build completes:
1. You'll see a download link in the terminal
2. Or visit your Expo dashboard: https://expo.dev/accounts/[your-username]/projects/android-file-manager/builds
3. Download the APK file
4. Transfer it to your Android device and install

## Method 2: Local Build (Requires Android Studio)

This method builds the APK locally on your machine.

### Prerequisites
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK) 17

### Step 1: Generate Native Android Project

```bash
cd android-file-manager
npx expo prebuild --platform android
```

This creates the `android/` folder with native Android code.

### Step 2: Build APK

```bash
cd android
./gradlew assembleRelease
```

On Windows:
```bash
gradlew.bat assembleRelease
```

### Step 3: Locate APK

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Step 4: Sign APK (Optional but Recommended)

For distribution, you should sign the APK:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

3. Rebuild:
```bash
./gradlew assembleRelease
```

## Method 3: GitHub Actions (Automated)

This project includes a GitHub Actions workflow that automatically builds APKs.

### Setup

1. Go to your repository settings on GitHub
2. Navigate to Secrets and Variables → Actions
3. Add a new secret named `EXPO_TOKEN`:
   - Get your token by running: `eas whoami`
   - Or create one at: https://expo.dev/accounts/[your-username]/settings/access-tokens

### Trigger Build

The workflow runs automatically on:
- Every push to `main` branch
- Pull requests
- Manual trigger from Actions tab

### Download APK

1. Go to the Actions tab in your GitHub repository
2. Click on the latest workflow run
3. Follow the Expo build link in the logs
4. Download the APK from Expo dashboard

## Installing APK on Android Device

### Method 1: Direct Install
1. Transfer the APK to your Android device
2. Open the APK file
3. Allow installation from unknown sources if prompted
4. Tap Install

### Method 2: ADB Install
```bash
adb install path/to/app-release.apk
```

## Troubleshooting

### "Build failed" Error
- Check that all dependencies are installed: `pnpm install`
- Ensure your `app.config.ts` is properly configured
- Check Expo dashboard for detailed error logs

### "Keystore not found" Error
- Make sure the keystore path in `build.gradle` is correct
- Use absolute path if relative path doesn't work

### "SDK not found" Error
- Install Android SDK through Android Studio
- Set `ANDROID_HOME` environment variable

## Build Profiles

The project includes three build profiles in `eas.json`:

1. **preview** - APK for testing (what you want for distribution)
2. **development** - Development build with debugging
3. **production** - App Bundle for Google Play Store

## Publishing to Google Play Store

To publish to the Play Store, build with the production profile:

```bash
eas build --platform android --profile production
```

This creates an AAB (Android App Bundle) file required by Google Play.

## Support

For build issues:
- Check Expo documentation: https://docs.expo.dev/build/setup/
- Visit Expo forums: https://forums.expo.dev/
- Open an issue on GitHub

---

**Recommended:** Use Method 1 (EAS Build) for the easiest experience. It requires no local Android setup and handles all the complexity for you.
