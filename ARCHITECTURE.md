# VehicleQ Project - Complete Implementation Guide

## 📋 Project Overview

VehicleQ is a complete vehicle management application with:
- **Backend**: FastAPI REST API with SQLite database
- **Frontend**: Flutter mobile application with Provider state management
- **Features**: User authentication, vehicle upload with images, vehicle viewing, profile management

## 🏗️ Architecture

### Backend Architecture (FastAPI)

```
FastAPI Server (Port 8000)
│
├── User Authentication Module
│   ├── Register endpoint
│   ├── Login endpoint
│   ├── Profile management
│   └── Session handling
│
├── Vehicle Management Module
│   ├── Upload vehicle with image
│   ├── Retrieve vehicles
│   ├── Delete vehicle
│   └── Image serving
│
└── Database Layer (SQLite)
    ├── Users table
    └── Vehicles table
```

**Key Components:**
- **Models**: SQLAlchemy ORM (User, Vehicle)
- **Database**: SQLite (vehicles.db)
- **Image Storage**: Local filesystem (images/)
- **CORS**: Enabled for all origins

### Frontend Architecture (Flutter)

```
Flutter App
│
├── State Management (Provider)
│   ├── AuthProvider (login, register, profile)
│   └── VehicleProvider (vehicle list, upload)
│
├── Services
│   └── ApiService (HTTP communication)
│
├── Models
│   ├── User (user data)
│   └── Vehicle (vehicle data)
│
└── UI Screens
    ├── LoginScreen
    ├── RegisterScreen
    ├── HomeScreen (bottom navigation)
    ├── ProfileScreen
    ├── VehicleListScreen
    └── UploadVehicleScreen
```

## 🔄 Data Flow

### User Registration Flow

```
User Input (RegisterScreen)
    ↓
AuthProvider.register()
    ↓
ApiService.registerUser()
    ↓
HTTP POST /register/
    ↓
FastAPI handler
    ↓
SQLite: Insert into users
    ↓
Return user data
    ↓
Save to SharedPreferences
    ↓
Navigate to HomeScreen
```

### Vehicle Upload Flow

```
User selects image + fills form (UploadVehicleScreen)
    ↓
VehicleProvider.uploadVehicle()
    ↓
ApiService.uploadVehicle()
    ↓
HTTP POST /upload/ with multipart data
    ↓
FastAPI handler receives file
    ↓
Save image to images/
    ↓
SQLite: Insert into vehicles
    ↓
Return vehicle data
    ↓
Update vehicle list
```

## 💾 Database Schema

### Users Table
```sql
id          INTEGER (Primary Key)
username    STRING (Unique)
email       STRING (Unique)
password    STRING (Plain text)
full_name   STRING
phone       STRING
```

### Vehicles Table
```sql
id          INTEGER (Primary Key)
number      STRING (Vehicle plate)
owner       STRING (Owner name)
image_path  STRING (File path to image)
timestamp   STRING (Upload time)
user_id     INTEGER (Foreign key to users)
```

## 🔌 API Endpoints

### Authentication Endpoints

**POST /register/**
```
Request:
  username: str (required, unique)
  email: str (required, unique)
  password: str (required, plain text)
  full_name: str (required)
  phone: str (required)

Response (200):
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "1234567890"
  }

Error (400):
  {"detail": "Username or email already exists"}
```

**POST /login/**
```
Request:
  username: str (required)
  password: str (required)

Response (200):
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "1234567890"
  }

Error (401):
  {"detail": "Invalid username or password"}
```

**GET /profile/{user_id}**
```
Response (200):
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "1234567890"
  }

Error (404):
  {"detail": "User not found"}
```

**PUT /profile/{user_id}**
```
Request:
  full_name: str (required)
  phone: str (required)

Response (200):
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "1234567890"
  }
```

### Vehicle Endpoints

**POST /upload/**
```
Request (multipart/form-data):
  user_id: int (required)
  number: str (required, vehicle plate)
  owner: str (required, owner name)
  image: File (required, vehicle image)

Response (200):
  {
    "id": 1,
    "number": "ABC-1234",
    "owner": "John Doe",
    "image_path": "images/vehicle_photo.jpg",
    "timestamp": "2024-01-15 10:30:45"
  }
```

**GET /vehicles/**
```
Response (200):
  [
    {
      "id": 1,
      "number": "ABC-1234",
      "owner": "John Doe",
      "image_path": "images/vehicle_photo.jpg",
      "timestamp": "2024-01-15 10:30:45"
    },
    ...
  ]
```

**GET /vehicles/{user_id}**
```
Response (200):
  [All vehicles uploaded by user]
```

**GET /image/{vehicle_id}**
```
Response: Vehicle image file (JPG/PNG)
Error (404): {"error": "Image not found"}
```

**DELETE /vehicle/{vehicle_id}**
```
Response (200):
  {"message": "Vehicle deleted"}

Error (404):
  {"detail": "Vehicle not found"}
```

## 🎯 State Management with Provider

### AuthProvider

**State Variables:**
- `_user`: Current logged-in user
- `_isLoggedIn`: Login status
- `_isLoading`: Loading indicator
- `_error`: Error messages

**Methods:**
- `register()`: Create new account
- `login()`: Login user
- `logout()`: Logout and clear session
- `updateProfile()`: Update user information
- `refreshProfile()`: Fetch latest profile data

**Data Persistence:**
- Uses SharedPreferences to save user_id and username
- Automatically loads user on app restart

### VehicleProvider

**State Variables:**
- `_vehicles`: List of vehicles
- `_isLoading`: Loading indicator
- `_error`: Error messages

**Methods:**
- `fetchVehicles()`: Load all vehicles
- `uploadVehicle()`: Add new vehicle
- `deleteVehicle()`: Remove vehicle

## 📱 UI/UX Flow

### Navigation Flow

```
Splash/Check Auth
    ↓
    ├─→ [if logged in] Home Screen
    │   ├─ Vehicles Tab → VehicleListScreen
    │   ├─ Upload Tab → UploadVehicleScreen
    │   └─ Profile Tab → ProfileScreen
    │
    └─→ [if not logged in] Login Screen
        ├─ Login → Home Screen
        └─ Register → RegisterScreen → Home Screen
```

### Screen Components

**LoginScreen**
- Username input
- Password input with toggle
- Login button
- Register link

**RegisterScreen**
- Username input
- Email input
- Password input with toggle
- Full name input
- Phone input
- Register button
- Login link

**HomeScreen**
- Bottom navigation bar (3 tabs)
- Displays selected screen

**VehicleListScreen**
- RefreshIndicator
- Vehicle card list
  - Vehicle image
  - Vehicle number
  - Owner name
  - Upload timestamp
  - View details button

**UploadVehicleScreen**
- Image preview area
- Camera button
- Gallery button
- Vehicle number input
- Owner name input
- Upload button

**ProfileScreen**
- User avatar
- Profile card with:
  - Username (read-only)
  - Email (read-only)
  - Full name (editable)
  - Phone (editable)
- Edit/Save buttons
- Logout button

## 🔐 Security Considerations

### Current Implementation (Development)
- Plain text password storage
- No password hashing
- No JWT tokens
- No HTTPS
- No input validation

### Required for Production

**Backend Security:**
```python
# Password hashing
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT tokens
from fastapi.security import HTTPBearer
from datetime import timedelta
import jwt

# Input validation
from pydantic import BaseModel, validator

# HTTPS/SSL
# Use ngrok or Heroku for HTTPS
```

**Frontend Security:**
```dart
// Secure token storage
import 'flutter_secure_storage/flutter_secure_storage.dart';

// SSL pinning
import 'package:http/http.dart' as http;

// Input validation
RegExp(r'^[a-zA-Z0-9_-]{3,16}$').hasMatch(username);
```

## 📦 Dependencies

### Backend (Python)

| Package | Purpose |
|---------|---------|
| fastapi | Web framework |
| uvicorn | ASGI server |
| sqlalchemy | ORM |
| python-multipart | Form parsing |
| pillow | Image handling |

### Frontend (Dart)

| Package | Purpose |
|---------|---------|
| flutter | UI framework |
| provider | State management |
| http | HTTP client |
| image_picker | Camera/gallery access |
| shared_preferences | Local storage |
| intl | Internationalization |

## 🚀 Deployment Strategies

### Backend Deployment Options

1. **Heroku (Free/Paid)**
   - Push to git repository
   - Automatic deployment
   - Procfile included

2. **Railway**
   - Similar to Heroku
   - Good free tier

3. **DigitalOcean**
   - More control
   - Affordable pricing

4. **AWS Lambda**
   - Serverless
   - Pay per use

### Frontend Deployment Options

1. **Google Play Store** (Android)
   - Build APK/AAB
   - Upload to Play Store
   - Review process

2. **Apple App Store** (iOS)
   - Build IPA
   - Requires Apple Developer account
   - More strict review

3. **Internal Distribution**
   - APK direct install
   - TestFlight for beta

## 🔄 CI/CD Considerations

```yaml
# GitHub Actions example
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pip install -r backend/requirements.txt
      - name: Run tests
        run: pytest
      - name: Deploy
        run: git push heroku main
```

## 📊 Performance Optimization

### Backend
- Add database indexing on frequently queried columns
- Implement pagination for vehicle list
- Cache vehicle images
- Use database connection pooling

### Frontend
- Lazy load images
- Implement virtual scrolling for large lists
- Cache API responses
- Use image compression

## 🔍 Error Handling

### Backend Error Codes
```
200: Success
400: Bad request (invalid data)
401: Unauthorized (wrong credentials)
404: Not found (resource doesn't exist)
500: Server error
```

### Frontend Error Handling
- Try-catch blocks in all async functions
- User-friendly error messages
- Retry mechanisms for failed requests
- Offline mode detection

## 📝 Testing Strategy

### Backend Testing
```python
# pytest examples
def test_register_user():
    response = client.post("/register/", data={...})
    assert response.status_code == 200

def test_login_user():
    response = client.post("/login/", data={...})
    assert response.status_code == 200
```

### Frontend Testing
```dart
// Flutter test examples
testWidgets('Login screen renders', (tester) async {
  await tester.pumpWidget(MyApp());
  expect(find.text('Login'), findsOneWidget);
});
```

## 🎓 Learning Resources

- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Flutter Course](https://flutter.dev/learn)
- [Provider Package](https://pub.dev/packages/provider)
- [REST API Best Practices](https://restfulapi.net/)

---

This implementation provides a solid foundation for vehicle management. Future enhancements can be built on top of this architecture.
