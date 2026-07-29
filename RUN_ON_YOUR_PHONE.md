## Running on a physical Android device (USB)

You can run Open Football Project directly on an Android phone, which is lighter than using the emulator.

### 1. Enable developer mode & USB debugging

On your Android device:

1. Open **Settings** → **About phone**.
2. Tap **Build number** 7 times to enable **Developer options**.
3. Go back to **Settings** → **System** (or **Additional settings**) → **Developer options**.
4. Enable **USB debugging**.

Connect the phone to your machine via USB.

### 2. Verify that `adb` sees the device

From the project root:

```bash

adb devices
```

You should see something like:

```text
List of devices attached
ABCDEF123456    device
```

If it shows `unauthorized`, accept the “Allow USB debugging?” prompt on the phone and run `adb devices` again.

### 3. Build, install, and run on the device

#### Option A: React Native CLI (recommended)

In one terminal (Metro):

```bash
npm start
```

In another terminal:

```bash
npm run android
```

The React Native CLI will:

- Build the debug APK.
- Install it on the connected device.
- Launch the app.

#### Option B: Manual APK install

If you prefer to use the APK directly:

```bash
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
cd ..
```

Then start Metro:

```bash
npm start
```

Open the **Futballero** app from the app drawer on your phone. It will connect to Metro for the JS bundle.

### 4. Dev Menu and Fast Refresh on device

With the app running on the phone:

- Open the React Native Dev Menu:
  - Via ADB:

    ```bash
    adb shell input keyevent 82
    ```

  - Or by shaking the device (varies by device / OS).

- In the Dev Menu, enable **Fast Refresh**.

As long as Metro is running, changes to the source (e.g. `src/App.tsx`) will automatically reload on your physical device.