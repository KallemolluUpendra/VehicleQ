# 🖥️ VehicleQ - Windows Desktop Setup Guide

## ✅ Status Update

Your VehicleQ application is now **ready to run on Windows Desktop**!

### What Has Been Set Up

✅ **Windows Desktop Platform** - Enabled for Flutter
✅ **Backend API Server** - Running on `http://localhost:8000`
✅ **Frontend Configuration** - Updated to use localhost
✅ **API Endpoint** - Pointing to `http://localhost:8000`

---

## 🚀 Running the Application

### Terminal 1: Start Backend (Already Running)

The backend is currently running on:
```
http://0.0.0.0:8000
```

**API Documentation available at**: `http://localhost:8000/docs`

### Terminal 2: Start Flutter App

Run this command to start the Flutter app on Windows:

```bash
cd c:\Users\kalle\VehicleQ\flutter_app
flutter run -d windows
```

**Expected Output:**
```
Launching lib\main.dart on Windows in debug mode...
[After a few seconds, a Windows app window will open]
```

---

## 🎮 Using the Application

Once the app window opens on Windows:

### 1. **Create an Account** (First Time)
   - Click "Register" button
   - Fill in:
     - Username: `testuser`
     - Email: `test@example.com`
     - Password: `test123`
     - Full Name: `Test User`
     - Phone: `1234567890`
   - Click "Register"

### 2. **Login**
   - Use your created credentials
   - Click "Login"

### 3. **Upload a Vehicle**
   - Go to "Upload" tab
   - Click "Gallery" button (Camera option may not work on desktop)
   - Select an image file
   - Enter Vehicle Number: `ABC-1234`
   - Enter Owner Name: `Test Owner`
   - Click "Upload Vehicle"

### 4. **View Vehicles**
   - Go to "Vehicles" tab
   - See all uploaded vehicles with images
   - Click "View" to see details

### 5. **Edit Profile**
   - Go to "Profile" tab
   - Click "Edit Profile"
   - Update Full Name and Phone
   - Click "Save"

---

## 🔧 Configuration Files

### Backend Configuration
**File**: `backend/main.py`
- **Database**: `vehicles.db` (SQLite - auto-created)
- **Images**: `images/` folder (auto-created)
- **Port**: `8000`

### Frontend Configuration
**File**: `flutter_app/lib/services/api_service.dart`
- **Line 7**: `baseUrl = 'http://localhost:8000'`

---

## 📊 What's Running

```
┌─────────────────────────────────────────────────────┐
│         Your Computer (Windows)                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │    Flutter Desktop App Window               │  │
│  │    (Running on Windows - what you see!)     │  │
│  └─────────────────────────────────────────────┘  │
│           ↕ (HTTP requests)                        │
│  ┌─────────────────────────────────────────────┐  │
│  │    FastAPI Backend Server                   │  │
│  │    (Running on http://localhost:8000)      │  │
│  │                                             │  │
│  │    ├─ SQLite Database (vehicles.db)       │  │
│  │    └─ Image Storage (images/ folder)      │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

All working on your local machine:

| Endpoint | URL |
|----------|-----|
| API Docs | http://localhost:8000/docs |
| Register | POST http://localhost:8000/register/ |
| Login | POST http://localhost:8000/login/ |
| Profile | GET/PUT http://localhost:8000/profile/{id} |
| Vehicles | GET http://localhost:8000/vehicles/ |
| Upload | POST http://localhost:8000/upload/ |

---

## 🎨 Hot Reload

While the app is running on Windows, you can make code changes and reload:

Press **`r`** in the terminal to hot reload the app
Press **`R`** in the terminal to hot restart the app

---

## 📱 Testing Features

### ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Flutter app opens on Windows
- [ ] Login screen displays
- [ ] Can create new account
- [ ] Can login with account
- [ ] Can navigate to Upload tab
- [ ] Can select image from gallery
- [ ] Can upload vehicle
- [ ] Can see vehicle in list
- [ ] Can view vehicle details
- [ ] Can edit profile
- [ ] Can logout and login again

---

## 🐛 Troubleshooting

### Issue: "No supported devices connected"
**Solution**: Use `flutter run -d windows` (Windows is already supported)

### Issue: App doesn't connect to backend
**Solution**: 
1. Verify backend is running on port 8000
2. Check `baseUrl` in `api_service.dart` is `http://localhost:8000`
3. Try `http://localhost:8000/docs` in browser to verify API

### Issue: Image upload fails
**Solution**:
1. Make sure `images/` folder exists in backend directory
2. Check folder permissions
3. Try with smaller image file

### Issue: "Address already in use"
**Solution**: Backend port 8000 is already in use
- Kill existing process: `lsof -ti:8000 | xargs kill -9` (Linux/Mac)
- Or use different port: `uvicorn main:app --port 8001`

### Issue: Flutter app crashes
**Solution**:
1. Check terminal for error messages
2. Make sure backend is running
3. Try `flutter clean` and `flutter pub get`
4. Then `flutter run -d windows`

---

## 📂 File Locations

**Backend**
```
c:\Users\kalle\VehicleQ\backend\
├── main.py              (Application)
├── requirements.txt     (Dependencies)
├── vehicles.db         (Database - auto-created)
└── images/             (Vehicle photos - auto-created)
```

**Frontend**
```
c:\Users\kalle\VehicleQ\flutter_app\
├── lib/
│   ├── main.dart
│   ├── screens/        (6 screens)
│   ├── providers/      (State management)
│   ├── services/       (API calls)
│   └── models/         (Data models)
├── pubspec.yaml
└── windows/            (Desktop configuration)
```

---

## 🔄 Development Workflow

### Making Changes to Frontend

1. Edit Flutter code in `lib/` folder
2. Save file
3. Press **`r`** in terminal to hot reload
4. Changes appear instantly in app

### Making Changes to Backend

1. Edit `backend/main.py`
2. Save file
3. Backend automatically reloads (uvicorn `--reload` flag)
4. Restart Flutter app or press **`R`** to see changes

---

## 📊 Database Management

### View Database Contents

Open terminal and run:
```bash
cd c:\Users\kalle\VehicleQ\backend
sqlite3 vehicles.db
```

Then try commands:
```sql
.schema users                  -- See users table structure
SELECT * FROM users;          -- See all users
SELECT * FROM vehicles;       -- See all vehicles
.quit                         -- Exit sqlite3
```

### Reset Database

Delete the database file:
```bash
del c:\Users\kalle\VehicleQ\backend\vehicles.db
```

New database will be created on next backend run.

---

## 🎯 Next Steps

1. **Start Backend**: Already running ✅
2. **Start Frontend**: Run `flutter run -d windows`
3. **Test Login**: Create account and login
4. **Test Upload**: Upload a vehicle
5. **Test Gallery**: View vehicles and details
6. **Make Changes**: Edit code and hot reload
7. **Deploy**: Later, follow SETUP.md

---

## 💡 Tips

- **Keep terminal windows visible** so you can see errors
- **Check backend logs** if app can't connect (terminal 1)
- **Check Flutter logs** if app crashes (terminal 2)
- **Use hot reload** (press `r`) for faster development
- **Test API manually** at `http://localhost:8000/docs` in browser
- **Save all changes** before hot reload
- **Keep backend running** while developing frontend

---

## 🖼️ What You'll See

### Login Screen
```
┌──────────────────────────────────────────┐
│         VehicleQ                         │
│                                          │
│    [VehicleQ Icon]                       │
│                                          │
│    Username: [________________]          │
│    Password: [________________]          │
│                                          │
│    [Login Button]                        │
│                                          │
│    Don't have account? Register          │
└──────────────────────────────────────────┘
```

### Home Screen (After Login)
```
┌──────────────────────────────────────────┐
│    Vehicles                              │
├──────────────────────────────────────────┤
│                                          │
│  [Vehicle List with Images]              │
│                                          │
├──────────────────────────────────────────┤
│ 🚗 Vehicles  ➕ Upload  👤 Profile     │
└──────────────────────────────────────────┘
```

---

## 🚀 Ready to Go!

Your application is fully set up and ready to develop:

✅ **Backend**: Running at `http://localhost:8000`
✅ **Frontend**: Ready to run on Windows with `flutter run -d windows`
✅ **Database**: SQLite (auto-creates on first run)
✅ **Configuration**: Already set to localhost

**Next**: Run `flutter run -d windows` to see it in action!

---

**Happy developing! 🎉**
