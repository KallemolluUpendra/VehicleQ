# VehicleQ Angular Migration - Quick Start Guide

## ⚡ Quick Commands

### Development
```bash
cd c:\Users\kalle\VehicleQ\angular_app
npm start
# App runs at http://localhost:4200
```

### Build APK
```bash
cd c:\Users\kalle\VehicleQ\angular_app

# 1. Build and prepare for mobile
npm run build:mobile

# 2. Open in Android Studio
npx cap open android

# 3. In Android Studio:
#    Build → Build Bundle(s) / APK(s) → Build APK(s)
#    
# APK Location: angular_app/android/app/build/outputs/apk/debug/app-debug.apk
```

## 📁 What Changed from Flutter

| Flutter | Angular + Capacitor |
|---------|-------------------|
| `lib/main.dart` | `src/app/app.ts` |
| `lib/models/*.dart` | `src/app/models/*.model.ts` |
| `lib/services/api_service.dart` | `src/app/services/api.service.ts` |
| `lib/providers/auth_provider.dart` | `src/app/services/auth.service.ts` |
| `lib/providers/vehicle_provider.dart` | `src/app/services/vehicle.service.ts` |
| `lib/screens/*.dart` | `src/app/components/*/` |
| `image_picker` package | `@capacitor/camera` |
| `pubspec.yaml` | `package.json` |
| `flutter build apk` | `npm run build:mobile` + Android Studio |

## 🎯 Core Features Implemented

✅ User Authentication (Login/Register)
✅ Vehicle List with Image Preview
✅ Vehicle Upload with Camera/Gallery
✅ User Profile Management
✅ Protected Routes with Auth Guard
✅ State Management with RxJS
✅ Native Camera Access via Capacitor
✅ Material Design UI

## 🔧 Important Files

**Configuration:**
- `capacitor.config.ts` - Capacitor settings (app ID, name)
- `src/app/app.config.ts` - Angular app configuration
- `src/app/app.routes.ts` - Routing configuration

**Services (Business Logic):**
- `src/app/services/api.service.ts` - Backend API calls
- `src/app/services/auth.service.ts` - Authentication logic
- `src/app/services/vehicle.service.ts` - Vehicle management

**Components (UI):**
- `src/app/components/login/` - Login screen
- `src/app/components/register/` - Registration screen
- `src/app/components/home/` - Main screen with bottom navigation
- `src/app/components/vehicle-list/` - Vehicle list and lightbox
- `src/app/components/upload-vehicle/` - Upload with camera
- `src/app/components/profile/` - User profile editor

## 🚀 Install on Device

### Method 1: USB Debugging
1. Enable Developer Mode on Android device
2. Enable USB Debugging
3. Connect to PC
4. Run: `npx cap run android`

### Method 2: APK Transfer
1. Build APK (see commands above)
2. Transfer `app-debug.apk` to phone
3. Install (may need to allow "Install from unknown sources")

## 🌐 Backend

App connects to: `https://vehicleq.onrender.com`

To change: Edit `src/app/services/api.service.ts`

## 💡 Tips

- Use `npm start` for rapid development in browser
- Use Chrome DevTools to debug mobile features
- Camera plugin only works in native mobile environment
- For production APK: Build → Generate Signed Bundle / APK in Android Studio

## 📞 Common Issues

**"Cannot find module '@capacitor/camera'"**
```bash
npm install @capacitor/camera
```

**"index.html not found"**
```bash
npm run build:mobile
# This creates index.html from index.csr.html
```

**Gradle build fails**
- Check Java JDK is installed (version 17)
- Set JAVA_HOME environment variable
- In Android Studio: File → Invalidate Caches / Restart

## ✨ Next Steps

1. Test the app: `npm start`
2. Build APK: `npm run build:mobile` → Android Studio
3. Install on device
4. Customize as needed!

---

**Your Flutter app is now Angular + Capacitor! 🎉**
