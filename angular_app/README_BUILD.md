# VehicleQ - Angular + Capacitor Mobile App

This is the Angular + Capacitor version of the VehicleQ mobile application, migrated from Flutter.

## 🚀 Features

- **User Authentication** - Login and registration with secure backend
- **Vehicle Management** - Upload, view, and manage vehicle records
- **Image Capture** - Take photos using device camera or select from gallery
- **Profile Management** - Update user profile information
- **Responsive UI** - Beautiful Material Design-inspired interface

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Java JDK** (version 17 recommended)

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd VehicleQ/angular_app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🏗️ Building the Application

### For Web Development

To run the app in a browser for development:

```bash
npm start
```

Then open http://localhost:4200 in your browser.

### For Mobile (Android APK)

Follow these steps to build an APK:

#### Step 1: Build the Angular app and sync with Capacitor

```bash
npm run build:mobile
```

This command does three things:
1. Builds the Angular app for production
2. Copies the index file that Capacitor needs
3. Syncs the build with the Android project

#### Step 2: Open the project in Android Studio

```bash
npx cap open android
```

This will launch Android Studio with your project.

#### Step 3: Build the APK in Android Studio

Once Android Studio opens:

1. Wait for Gradle sync to complete (this may take a few minutes on first run)
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for the build to complete
4. Click the **locate** link in the notification to find your APK

The APK will be located at:
```
angular_app/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Step 4: Install the APK

**On a Physical Device:**
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect your device to your computer
4. Transfer the APK to your device and install it
   
   OR use adb:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

**On an Emulator:**
1. Start an Android emulator from Android Studio
2. Drag and drop the APK onto the emulator window

## 🔧 Configuration

### Backend URL

The app connects to the backend at `https://vehicleq.onrender.com`. To change this:

Edit `src/app/services/api.service.ts`:
```typescript
private baseUrl = 'YOUR_BACKEND_URL';
```

### App Details

To change app name or ID, edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.vehicleq.app',  // Change this
  appName: 'VehicleQ',         // Change this
  webDir: 'dist/angular_app/browser'
};
```

## 📱 Testing on Device

### Using Android Studio

1. Open the project: `npx cap open android`
2. Connect your Android device via USB (with USB debugging enabled)
3. Click the **Run** button (green triangle) in Android Studio
4. Select your device from the list
5. The app will be installed and launched automatically

### Using Capacitor CLI

```bash
# Build and sync
npm run build:mobile

# Run on connected device
npx cap run android
```

## 🎨 Project Structure

```
angular_app/
├── src/
│   ├── app/
│   │   ├── components/      # UI Components
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── home/
│   │   │   ├── profile/
│   │   │   ├── vehicle-list/
│   │   │   └── upload-vehicle/
│   │   ├── services/        # Business Logic
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── vehicle.service.ts
│   │   ├── models/          # Data Models
│   │   │   ├── user.model.ts
│   │   │   └── vehicle.model.ts
│   │   └── guards/          # Route Guards
│   │       └── auth.guard.ts
│   └── index.html
├── android/                 # Capacitor Android Platform
├── capacitor.config.ts     # Capacitor Configuration
└── package.json

```

## 🔑 Key Technologies

- **Angular 21** - Modern web framework
- **Capacitor 7** - Native mobile wrapper
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **@capacitor/camera** - Native camera access

## 🐛 Troubleshooting

### Build Fails

If the build fails, try:
```bash
# Clean the build
rm -rf dist
npm run build
```

### Gradle Issues

If Gradle sync fails in Android Studio:
1. File → Invalidate Caches / Restart
2. Tools → SDK Manager → Update SDK tools
3. Make sure JAVA_HOME is set correctly

### App Crashes on Launch

Check that:
1. You ran `npm run build:mobile` before opening in Android Studio
2. The backend URL is accessible from your device
3. Camera permissions are granted (for upload feature)

## 📄 License

This project is part of the VehicleQ application suite.

## 🤝 Contributing

For any issues or improvements, please contact the development team.

---

**Happy Coding! 🚗💨**
