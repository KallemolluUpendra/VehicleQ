@echo off
echo ========================================
echo VehicleQ - Build APK
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building Angular app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Step 3: Preparing for Capacitor...
cd dist\angular_app\browser
copy index.csr.html index.html
cd ..\..\..

echo.
echo Step 4: Syncing with Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build prepared successfully!
echo ========================================
echo.
echo Opening Android Studio...
echo.
echo In Android Studio:
echo 1. Wait for Gradle sync to complete
echo 2. Click Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 3. Find APK at: android\app\build\outputs\apk\debug\app-debug.apk
echo.

call npx cap open android

echo.
pause
