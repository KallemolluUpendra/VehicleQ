# 🚗 VehicleQ - Vehicle Management System

A complete mobile and backend application for managing vehicles with user authentication, image uploads, and vehicle tracking.

## 🎯 Overview

VehicleQ consists of:
- **FastAPI Backend** - REST API for user and vehicle management
- **Flutter Frontend** - Mobile app for iOS and Android
- **SQLite Database** - Lightweight data storage
- **Image Handling** - Camera/gallery integration

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- Python 3.8+
- Flutter SDK 3.0+
- Any mobile device/emulator

### Setup

1. **Start Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Update Flask App Configuration**
- Open `flutter_app/lib/services/api_service.dart`
- Update line 7: `baseUrl` to your backend IP
- Example: `'http://192.168.1.100:8000'`

3. **Run Flutter App**
```bash
cd flutter_app
flutter pub get
flutter run
```

**That's it!** You should see the login screen.

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **PROJECT_SUMMARY.md** | Overview of what was built |
| **QUICKSTART.md** | 5-minute setup guide (START HERE) |
| **SETUP.md** | Detailed setup & deployment |
| **ARCHITECTURE.md** | Technical deep-dive |
| **FILE_REFERENCE.md** | File locations & navigation |

## ✨ Features

### User Authentication ✅
- User registration with email validation
- Secure login
- Profile view and edit
- Session persistence
- Logout

### Vehicle Management ✅
- Upload vehicles with images
- Pick from camera or gallery
- View all vehicles
- View vehicle details
- Delete vehicles

### User Interface ✅
- Bottom navigation (3 tabs)
- Image preview and loading
- Error handling
- Loading states
- Pull-to-refresh

## 📁 Project Structure

```
VehicleQ/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── requirements.txt     # Dependencies
│   └── Procfile             # For deployment
└── flutter_app/
    ├── lib/
    │   ├── main.dart        # App entry
    │   ├── models/          # Data models
    │   ├── services/        # API calls
    │   ├── providers/       # State management
    │   └── screens/         # UI screens
    └── pubspec.yaml         # Dependencies
```

## 🔌 API Endpoints

```
POST   /register/        - Create account
POST   /login/           - Login user
GET    /profile/{id}     - Get profile
PUT    /profile/{id}     - Update profile
POST   /upload/          - Upload vehicle
GET    /vehicles/        # Get all vehicles
GET    /vehicles/{id}    - Get user vehicles
GET    /image/{id}       - Get vehicle image
DELETE /vehicle/{id}     - Delete vehicle
```

## 🛠️ Technology Stack

### Backend
- FastAPI - Web framework
- SQLAlchemy - ORM
- SQLite - Database
- Uvicorn - Server

### Frontend
- Flutter - UI framework
- Provider - State management
- HTTP - API client
- image_picker - Camera/Gallery
- shared_preferences - Local storage

## 🔐 Security

⚠️ **Development Version**: Uses plain text passwords

For production:
- Implement password hashing
- Add JWT tokens
- Use HTTPS
- Add rate limiting
- Input validation

See SETUP.md for security details.

## 🚀 Deployment

### Backend
- Heroku: Push to git repository
- Railway: Simple deployment
- DigitalOcean: VPS hosting
- AWS Lambda: Serverless

### Frontend
- Google Play Store (Android)
- Apple App Store (iOS)
- Internal distribution

See SETUP.md for detailed deployment.

## 🐛 Troubleshooting

**Can't connect to backend?**
- Verify backend is running
- Check API URL in api_service.dart
- Use correct IP address

**Image upload not working?**
- Check camera/gallery permissions
- Verify images/ directory exists
- Check disk space

**Login issues?**
- Verify username/password
- Check if account exists
- Look at backend console for errors

See SETUP.md for more help.

## 📊 Database

### Users Table
- id, username, email, password, full_name, phone

### Vehicles Table
- id, number, owner, image_path, timestamp, user_id

Reset database: Delete `vehicles.db` in backend folder

## 🎨 Customization

**Change App Color**
- Edit `primarySwatch` in `main.dart`

**Change API URL**
- Edit `baseUrl` in `api_service.dart`

**Modify Database**
- Edit `DATABASE_URL` in `main.py`

**Add Features**
- Create new endpoints in `main.py`
- Create new screens in `flutter_app/lib/screens/`
- Add state in providers

## 📱 Screenshots Flow

```
Login Screen
    ↓
Register Screen
    ↓
Home Screen (Bottom Navigation)
    ├─ Vehicles Tab (View all vehicles)
    ├─ Upload Tab (Add new vehicle)
    └─ Profile Tab (View/Edit profile)
```

## 🎓 Learning Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Flutter Docs](https://flutter.dev/docs)
- [Provider Package](https://pub.dev/packages/provider)
- [SQLAlchemy](https://docs.sqlalchemy.org/)

## 📝 Future Enhancements

- Vehicle search/filter
- Advanced analytics
- Real-time notifications
- Multiple images per vehicle
- GPS tracking
- User messaging
- QR codes
- Dark mode

## 🤝 Contributing

1. Read the documentation
2. Make changes in separate branch
3. Test thoroughly
4. Create pull request

## 📄 License

Educational project - Free to use and modify

## 🆘 Support

1. Check documentation files
2. Review code comments
3. Check error logs
4. Read official framework docs

## 🎉 Ready to Start?

1. **Read**: PROJECT_SUMMARY.md
2. **Setup**: Follow QUICKSTART.md
3. **Configure**: Update API URL
4. **Run**: Start backend and app
5. **Test**: Create account and upload vehicle

---

**Happy coding! 🚀**

For questions or issues, check the documentation files or review the code comments.
