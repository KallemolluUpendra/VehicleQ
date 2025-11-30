# 📍 VehicleQ - File Reference Guide

## Quick Navigation

### 📖 Documentation Files
```
c:\Users\kalle\VehicleQ\
├── PROJECT_SUMMARY.md           ← Start here! Project overview
├── QUICKSTART.md                ← 5-minute setup guide
├── SETUP.md                     ← Detailed setup & deployment
├── ARCHITECTURE.md              ← Technical documentation
├── README.md                    ← Original project file
└── .gitignore                   ← Git ignore rules
```

### 🔧 Backend Files
```
c:\Users\kalle\VehicleQ\backend\
├── main.py                      ← FastAPI application
│                                  - User endpoints
│                                  - Vehicle endpoints
│                                  - Database models
├── requirements.txt             ← Python dependencies
├── Procfile                     ← For Heroku deployment
├── vehicles.db                  ← SQLite database (auto-created)
└── images/                      ← Vehicle images directory (auto-created)
```

### 📱 Flutter App Files
```
c:\Users\kalle\VehicleQ\flutter_app\
├── pubspec.yaml                 ← Flutter dependencies
├── CONFIG.md                    ← Configuration guide
└── lib/
    ├── main.dart                ← App entry point
    ├── models/
    │   ├── user.dart            ← User model
    │   └── vehicle.dart         ← Vehicle model
    ├── services/
    │   └── api_service.dart     ← Backend API communication
    │                              ⚠️ UPDATE baseUrl HERE
    ├── providers/
    │   ├── auth_provider.dart   ← Authentication state
    │   └── vehicle_provider.dart ← Vehicle state
    └── screens/
        ├── main.dart            ← App root with navigation
        ├── login_screen.dart    ← Login page
        ├── register_screen.dart ← Registration page
        ├── home_screen.dart     ← Home with bottom nav
        ├── profile_screen.dart  ← User profile page
        ├── vehicle_list_screen.dart    ← Vehicle listing
        └── upload_vehicle_screen.dart  ← Upload page
```

## 🔑 Important Files to Edit

### 1. API Configuration (MUST DO)
**File**: `flutter_app/lib/services/api_service.dart`
**Line**: 7
**Change**: Update `baseUrl` to your backend server

```dart
// BEFORE (Local IP example)
static const String baseUrl = 'http://192.168.1.100:8000';

// AFTER (Your actual IP)
static const String baseUrl = 'http://YOUR_IP:8000';
```

### 2. Backend Database (Optional)
**File**: `backend/main.py`
**Line**: 22
**Change**: Modify database URL if needed

```python
DATABASE_URL = "sqlite:///./vehicles.db"
```

### 3. Upload Directory (Optional)
**File**: `backend/main.py`
**Line**: 48-49
**Change**: Change image storage location

```python
UPLOAD_DIR = "images"
```

## 📊 File Descriptions

### Backend

#### main.py (151 lines)
- **Lines 1-8**: Imports
- **Lines 10-20**: CORS configuration
- **Lines 22-26**: Database setup
- **Lines 28-43**: Database models (User, Vehicle)
- **Lines 52-55**: Root endpoint
- **Lines 57-73**: Register endpoint
- **Lines 75-84**: Login endpoint
- **Lines 86-97**: Get profile endpoint
- **Lines 99-111**: Update profile endpoint
- **Lines 113-122**: Upload vehicle endpoint
- **Lines 124-131**: Get all vehicles endpoint
- **Lines 133-140**: Get user vehicles endpoint
- **Lines 142-149**: Get vehicle image endpoint
- **Lines 151+**: Delete vehicle endpoint

### Frontend

#### Models
- **user.dart** (18 lines): User data structure
- **vehicle.dart** (18 lines): Vehicle data structure

#### Services
- **api_service.dart** (204 lines): All API endpoints
  - Registration, login, profile
  - Vehicle upload, retrieval, deletion

#### Providers
- **auth_provider.dart** (112 lines): Authentication state
- **vehicle_provider.dart** (68 lines): Vehicle state

#### Screens
- **main.dart** (42 lines): App initialization
- **home_screen.dart** (45 lines): Main screen with navigation
- **login_screen.dart** (79 lines): Login page
- **register_screen.dart** (117 lines): Registration page
- **profile_screen.dart** (123 lines): Profile page
- **vehicle_list_screen.dart** (111 lines): Vehicle listing
- **upload_vehicle_screen.dart** (145 lines): Upload page

#### Configuration
- **pubspec.yaml**: Dependencies
- **CONFIG.md**: Configuration options

## 🚀 Quick Commands

### Backend Commands
```bash
# Start server
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# View API docs
http://localhost:8000/docs

# Reset database
rm backend/vehicles.db
```

### Flutter Commands
```bash
# Setup
cd flutter_app
flutter pub get

# Run on device/emulator
flutter run

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

## 📋 Checklist for Getting Started

- [ ] Read PROJECT_SUMMARY.md
- [ ] Read QUICKSTART.md
- [ ] Update API baseUrl in api_service.dart
- [ ] Install backend dependencies
- [ ] Start backend server
- [ ] Install Flutter dependencies
- [ ] Run Flutter app
- [ ] Create test account
- [ ] Test upload vehicle
- [ ] Test view vehicles
- [ ] Test profile editing

## 🔗 File Dependencies

### Backend Dependencies
```
main.py
├── fastapi (HTTP framework)
├── sqlalchemy (Database ORM)
├── sqlite (Database)
└── python-multipart (Form parsing)
```

### Frontend Dependencies
```
main.dart
├── auth_provider.dart
├── vehicle_provider.dart
├── login_screen.dart
├── register_screen.dart
├── home_screen.dart
│   ├── vehicle_list_screen.dart
│   ├── upload_vehicle_screen.dart
│   └── profile_screen.dart
├── api_service.dart
│   ├── user.dart (model)
│   └── vehicle.dart (model)
└── pubspec.yaml
```

## 💾 Data Flow Files

### User Registration Flow
```
register_screen.dart
    ↓
auth_provider.dart (register method)
    ↓
api_service.dart (registerUser method)
    ↓
backend/main.py (@app.post("/register/"))
    ↓
SQLite users table
```

### Vehicle Upload Flow
```
upload_vehicle_screen.dart
    ↓
vehicle_provider.dart (uploadVehicle method)
    ↓
api_service.dart (uploadVehicle method)
    ↓
backend/main.py (@app.post("/upload/"))
    ↓
SQLite vehicles table
    ↓
backend/images/ directory
```

## 📞 Where to Make Changes

### Add New Backend Endpoint
Edit: `backend/main.py`

### Add New Screen
Create: `flutter_app/lib/screens/new_screen.dart`
Update: `flutter_app/lib/main.dart` (navigation)

### Change Database
Edit: `backend/main.py` line 22

### Change API URL
Edit: `flutter_app/lib/services/api_service.dart` line 7

### Add New Dependencies (Backend)
Edit: `backend/requirements.txt`
Run: `pip install -r requirements.txt`

### Add New Dependencies (Frontend)
Edit: `flutter_app/pubspec.yaml`
Run: `flutter pub get`

## 🎯 Next Steps

1. **Immediate**: Read QUICKSTART.md
2. **Setup**: Follow backend and frontend setup
3. **Test**: Create account and upload vehicle
4. **Customize**: Edit colors and features
5. **Deploy**: Use SETUP.md for deployment

## 📞 Need Help?

1. Check the relevant documentation file
2. Review code comments
3. Check Flutter/FastAPI official docs
4. Look at error messages in console

---

**File Structure Last Updated**: November 2024
**Total Lines of Code**: ~1000+ (backend + frontend)
**Documentation Files**: 5 comprehensive guides
