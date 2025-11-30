# VehicleQ - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at: `http://localhost:8000`

### Step 2: Update Flutter App Configuration

Open `flutter_app/lib/services/api_service.dart` and find this line:

```dart
static const String baseUrl = 'http://192.168.1.100:8000';
```

Replace with your backend URL:
- **Local Network**: Use your machine's IP (e.g., `192.168.1.100:8000`)
- **Android Emulator**: Use `10.0.2.2:8000`
- **iOS Simulator**: Use `localhost:8000`

### Step 3: Start Flutter App

```bash
cd flutter_app
flutter pub get
flutter run
```

✅ App should now connect to your backend!

## 📱 Using the App

### First Time Users

1. **Create Account**
   - Click "Register" on login screen
   - Fill in all fields
   - Click "Register"

2. **Login**
   - Enter your username and password
   - Click "Login"

### Upload a Vehicle

1. Go to "Upload" tab
2. Tap "Camera" or "Gallery" to select vehicle image
3. Enter vehicle number (e.g., ABC-1234)
4. Enter owner name
5. Click "Upload Vehicle"

### View Vehicles

1. Go to "Vehicles" tab
2. Scroll through all uploaded vehicles
3. Click "View" to see full details

### Edit Profile

1. Go to "Profile" tab
2. Click "Edit Profile"
3. Update your information
4. Click "Save"

## 🔧 Default Test Account

After backend starts, create a test account:
- Username: `testuser`
- Email: `test@example.com`
- Password: `test123`
- Full Name: `Test User`
- Phone: `1234567890`

## 📊 API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/register/` | Create new account |
| POST | `/login/` | Login user |
| GET | `/profile/{id}` | Get user profile |
| PUT | `/profile/{id}` | Update profile |
| POST | `/upload/` | Upload vehicle |
| GET | `/vehicles/` | Get all vehicles |
| GET | `/vehicles/{id}` | Get user vehicles |
| GET | `/image/{id}` | Get vehicle image |
| DELETE | `/vehicle/{id}` | Delete vehicle |

## ⚙️ Configuration Options

### Different Server Locations

**Local Machine (Same Network)**
```dart
static const String baseUrl = 'http://192.168.1.100:8000';
```

**Docker Container**
```dart
static const String baseUrl = 'http://host.docker.internal:8000';
```

**Cloud Server**
```dart
static const String baseUrl = 'https://api.example.com';
```

**Local Development**
```dart
// Android Emulator
static const String baseUrl = 'http://10.0.2.2:8000';

// iOS Simulator  
static const String baseUrl = 'http://localhost:8000';

// Android Device (USB)
static const String baseUrl = 'http://YOUR_PC_IP:8000';
```

## 🐛 Common Issues & Solutions

### "Connection Refused"
- Ensure backend is running
- Check if port 8000 is accessible
- Verify firewall settings

### "Image Upload Failed"
- Check camera/gallery permissions
- Ensure image size is reasonable
- Try selecting from gallery first

### "Username Already Exists"
- Username is taken, use a different one
- Or create test account with different username

### "Invalid Credentials"
- Check username and password
- Ensure you registered before login

### Flutter Can't Find Backend
- Update API URL in `api_service.dart`
- Check IP address is correct
- Ping the server: `ping 192.168.1.100`

## 📲 Building for Release

### Android APK
```bash
flutter build apk --release
# APK location: flutter_app/build/app/outputs/flutter-app-release.apk
```

### iOS App
```bash
flutter build ios --release
```

## 🔐 Important Security Notes

⚠️ **This is a development version!**

For production:
- [ ] Implement password hashing
- [ ] Use JWT tokens
- [ ] Enable HTTPS/SSL
- [ ] Add input validation
- [ ] Implement rate limiting
- [ ] Add user authentication timeout
- [ ] Secure sensitive data

## 📝 Database

### Reset Database
To start fresh, delete the database file:
```bash
# In backend directory
rm vehicles.db
```

New database will be created on next run.

## 🎨 Customization

### Change App Theme
Edit `flutter_app/lib/main.dart`:
```dart
theme: ThemeData(
  primarySwatch: Colors.blue,  // Change color
  useMaterial3: true,
),
```

### Change App Name
- Android: `flutter_app/android/app/src/main/AndroidManifest.xml`
- iOS: `flutter_app/ios/Runner/Info.plist`

## 📚 Learn More

- [Flutter Documentation](https://flutter.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 🆘 Need Help?

1. Check logs in console/terminal
2. Review API documentation at `/docs`
3. Check Flutter debug output
4. Try creating a fresh test account

---

**Happy coding! 🎉**
