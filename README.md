# Futballero (React Native)

This is a React Native app built with TypeScript and React Native 0.84.

## Requirements

- Node.js `>= 22.11.0`
- Yarn or npm (examples use `npm`)
- Android Studio (with SDK, platform tools, and at least one AVD)
- Java (JDK compatible with your Android SDK)
- Watchman (optional, but recommended on macOS / Linux)

## Install dependencies

From the project root:

```bash
npm install
```

## Run tests

```bash
npm test
```

## Running on Android with manual APK build + fast refresh

You can build the APK manually, install it on the emulator, and still use Metro bundler with fast refresh (hot reloading).

### 1. Start the Android emulator

This project uses an AVD called `Medium_Phone`.

```bash
emulator -avd Medium_Phone &
```

Verify that the device is connected:

```bash
adb devices
```

You should see one `device` entry.

### 2. Build the debug APK

From the project root:

```bash
cd android
./gradlew assembleDebug
```

The generated APK will be at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Install the APK manually

Still inside `android/`:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

The `-r` flag reinstalls the app if it already exists.

### 4. Start Metro bundler

Open a new terminal and go back to the project root:

```bash
npm start
```

This runs:

```bash
react-native start
```

Metro must be running for the app to load the JavaScript bundle and for fast refresh to work.

### 5. Launch the app on the emulator

The registered app name (from `app.json`) is:

```json
{
  "name": "Futballero",
  "displayName": "Futballero"
}
```

On Android, the Java package will be defined in `android/app/src/main/AndroidManifest.xml`.  
Assuming it is `com.futballero`, you can start the app with:

```bash
adb shell monkey -p com.futballero -c android.intent.category.LAUNCHER 1
```

> If your package name is different, replace `com.futballero` with the actual package from the manifest.

### 6. Enable fast refresh (hot reloading)

With the app running on the emulator:

1. Open the React Native dev menu:
   - On Android emulator: `Ctrl + M`
2. Enable **Fast Refresh**.

Now, any changes you make to the source files (for example `src/App.tsx`) will be reflected automatically without reinstalling the APK, as long as Metro is running.

---

## Alternative: Use React Native CLI to build & run

Instead of building the APK manually, you can let the React Native CLI handle everything:

```bash
npm start          # Terminal 1: start Metro
npm run android    # Terminal 2: build, install, and run on the emulator
```

This will:

- Start Gradle build
- Install the debug build on the connected device/emulator
- Launch the app

Fast refresh works the same way once Metro is running.

---

## Project entry point

- Native entry: `index.js`

  ```js
  import { AppRegistry } from 'react-native';
  import App from './src/App';
  import { name as appName } from './app.json';

  AppRegistry.registerComponent(appName, () => App);
  ```

- Main app component: `src/App.tsx`

`src/App.tsx` currently uses `@react-native/new-app-screen` and `react-native-safe-area-context` with a simple starter layout.