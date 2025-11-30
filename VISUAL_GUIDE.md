# 🎯 VehicleQ - Getting Started Visual Guide

## 📺 Application Flow

```
┌─────────────────────────────────────────────────┐
│         START APP                               │
│  ↓                                              │
│  Check if user logged in?                       │
│  │                                              │
│  ├─→ YES → HomeScreen (Bottom Nav with 3 tabs) │
│  │         ├─ Vehicles Tab                      │
│  │         ├─ Upload Tab                        │
│  │         └─ Profile Tab                       │
│  │                                              │
│  └─→ NO → LoginScreen                           │
│           ├─ Login Button → HomeScreen          │
│           └─ Register Link → RegisterScreen     │
│                             ↓                   │
│                        RegisterScreen           │
│                             ↓                   │
│                        HomeScreen               │
└─────────────────────────────────────────────────┘
```

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Flutter Mobile App                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    UI Screens (6)                        │  │
│  │  • LoginScreen      • ProfileScreen                      │  │
│  │  • RegisterScreen   • VehicleListScreen                  │  │
│  │  • HomeScreen       • UploadVehicleScreen                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         State Management (Provider)                      │  │
│  │  ├─ AuthProvider (Login, Register, Profile)             │  │
│  │  └─ VehicleProvider (Upload, View, Delete)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           API Service (HTTP Client)                      │  │
│  │  Communicates with FastAPI Backend                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Local Storage (SharedPreferences)                 │  │
│  │  • user_id  • username                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP)
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             REST API Endpoints (9)                       │  │
│  │  • /register/  • /login/  • /profile/{id}  • /upload/    │  │
│  │  • /vehicles/  • /image/{id}  • /delete/                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        SQLAlchemy ORM Models (2)                         │  │
│  │  ├─ User (id, username, email, password, etc)           │  │
│  │  └─ Vehicle (id, number, owner, image_path, etc)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         SQLite Database                                  │  │
│  │  ├─ users table                                          │  │
│  │  └─ vehicles table                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         File Storage                                     │  │
│  │  images/ (Vehicle photos)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 User Registration Flow

```
User Opens App
        ↓
  LoginScreen
        ↓
  Click "Register"
        ↓
  RegisterScreen
        ↓
  Enter: Username, Email, Password, Name, Phone
        ↓
  Click "Register"
        ↓
  [AuthProvider.register() called]
        ↓
  [ApiService.registerUser() sends HTTP POST]
        ↓
  [Backend receives /register/ request]
        ↓
  [Backend validates & creates User in database]
        ↓
  [Returns user data]
        ↓
  [App saves user_id to SharedPreferences]
        ↓
  HomeScreen
        ↓
  User logged in & ready to upload vehicles
```

## 📸 Vehicle Upload Flow

```
User in Upload Tab
        ↓
  UploadVehicleScreen
        ↓
  Click "Camera" or "Gallery"
        ↓
  [ImagePicker.pickImage() called]
        ↓
  Select Image
        ↓
  Image displayed in preview
        ↓
  Enter Vehicle Number & Owner Name
        ↓
  Click "Upload Vehicle"
        ↓
  [VehicleProvider.uploadVehicle() called]
        ↓
  [ApiService.uploadVehicle() sends multipart request]
        ↓
  [Backend receives /upload/ request with file]
        ↓
  [Backend saves image to images/ directory]
        ↓
  [Backend creates Vehicle record in database]
        ↓
  [Returns vehicle data]
        ↓
  [App updates vehicle list]
        ↓
  Success message shown
        ↓
  User can upload another or view in Vehicles tab
```

## 📊 Data Model

```
User Model
├── id (int)
├── username (string, unique)
├── email (string, unique)
├── password (string)
├── full_name (string)
└── phone (string)

Vehicle Model
├── id (int)
├── number (string)
├── owner (string)
├── image_path (string)
├── timestamp (string)
└── user_id (int, foreign key)
```

## 🔌 API Communication

```
Request Format:
POST /register/ HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=john&email=john@example.com&password=pass123&...

Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "full_name": "John Doe",
  "phone": "1234567890"
}
```

## 🎨 UI Navigation Hierarchy

```
                    HomeScreen
                    (Bottom Navigation Bar)
                    /        |        \
                   /         |         \
           Vehicles Tab  Upload Tab  Profile Tab
                |             |           |
                ↓             ↓           ↓
         VehicleListScreen  Upload    ProfileScreen
                |         VehicleScreen    |
                |             |           |
         View Details   Image Preview   Edit Profile
         (Dialog)       (Image Picker)   (Save/Cancel)
```

## 📲 Screen Wireframe

```
┌─────────────────────────────────────────────┐
│            AppBar / Header                  │
├─────────────────────────────────────────────┤
│                                             │
│            Main Content Area                │
│            (Changes based on tab)           │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ [🚗 Vehicles] [➕ Upload] [👤 Profile]    │
│  Bottom Navigation Bar                      │
└─────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
App Start
    ↓
Check SharedPreferences for user_id
    ↓
    ├─ Found → Load AuthProvider with user
    │          Show HomeScreen
    │
    └─ Not Found → Show LoginScreen
                   ↓
                   User enters credentials
                   ↓
                   /login/ endpoint validation
                   ↓
                   ├─ Valid → Save user_id & show HomeScreen
                   └─ Invalid → Show error message

Logout:
    ↓
Clear SharedPreferences
    ↓
Show LoginScreen
```

## 📈 Data Persistence

```
Volatile (Memory - Lost on app restart):
├─ Vehicle list in VehicleProvider
└─ Auth state in AuthProvider

Persistent (Local Storage):
├─ user_id (SharedPreferences)
└─ username (SharedPreferences)

Persistent (Backend Database):
├─ User credentials
├─ Vehicle information
└─ Image files
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         User's Device                   │
│     (Flutter APK/IPA)                   │
└─────────────────────────────────────────┘
           ↕ (Internet)
┌─────────────────────────────────────────┐
│    Production Server                    │
│    (Heroku / DigitalOcean / AWS)        │
│    ├─ FastAPI Application               │
│    ├─ SQLite Database                   │
│    └─ Images Storage                    │
└─────────────────────────────────────────┘
```

## ✅ Checklist for First Time Use

```
Pre-Setup
─────────
□ Python 3.8+ installed
□ Flutter SDK installed
□ Backend and Flutter folders ready

Backend Setup
─────────────
□ cd backend
□ pip install -r requirements.txt
□ uvicorn main:app --reload

Flutter Setup
─────────────
□ Update baseUrl in api_service.dart
□ cd flutter_app
□ flutter pub get
□ flutter run

First Test
──────────
□ See LoginScreen
□ Click Register
□ Create test account
□ Login successfully
□ Upload a vehicle
□ View vehicle in list
□ Edit profile
□ Logout
□ Login again to verify session
```

## 🎯 Key Technical Decisions

```
Frontend State Management
├─ Why Provider?
│  ✓ Lightweight
│  ✓ Easy to learn
│  ✓ Built-in with Flutter
│  └─ Good for medium-sized apps

Backend Database
├─ Why SQLite?
│  ✓ No server setup needed
│  ✓ Good for development
│  ✓ Can migrate to PostgreSQL later
│  └─ File-based = Easy backup

Authentication
├─ Why Simple?
│  ✓ As requested - keep simple
│  ✓ Easy to understand
│  ✓ Easy to enhance later
│  └─ Good for learning
```

---

This visual guide helps understand how all pieces work together!
