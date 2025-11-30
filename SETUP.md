# VehicleQ - Vehicle Management App

A Flutter mobile application for managing vehicles with image upload capabilities, user authentication, and vehicle viewing features.

## Features

### Authentication
- **User Registration**: Create new account with username, email, password, full name, and phone
- **User Login**: Secure login with username and password
- **User Profile**: View and edit user profile information
- **Logout**: Secure logout functionality

### Vehicle Management
- **Upload Vehicles**: Add new vehicles with:
  - Vehicle number/plate
  - Owner name
  - Vehicle photo (from camera or gallery)
- **View Vehicles**: Browse all uploaded vehicles with details
- **Image Gallery**: Take photos directly from camera or select from gallery
- **Vehicle Details**: View full vehicle information in detail view

## Project Structure

### Backend (FastAPI)
```
backend/
├── main.py              # FastAPI application with endpoints
├── requirements.txt     # Python dependencies
└── Procfile            # For deployment
```

**Endpoints:**
- `POST /register/` - User registration
- `POST /login/` - User login
- `GET /profile/{user_id}` - Get user profile
- `PUT /profile/{user_id}` - Update user profile
- `POST /upload/` - Upload vehicle with image
- `GET /vehicles/` - Get all vehicles
- `GET /vehicles/{user_id}` - Get user's vehicles
- `GET /image/{vehicle_id}` - Get vehicle image
- `DELETE /vehicle/{vehicle_id}` - Delete vehicle

### Frontend (Flutter)
```
flutter_app/
├── lib/
│   ├── main.dart                           # App entry point
│   ├── models/
│   │   ├── user.dart                       # User model
│   │   └── vehicle.dart                    # Vehicle model
│   ├── services/
│   │   └── api_service.dart               # API communication
│   ├── providers/
│   │   ├── auth_provider.dart             # Authentication state management
│   │   └── vehicle_provider.dart          # Vehicle state management
│   └── screens/
│       ├── login_screen.dart              # Login page
│       ├── register_screen.dart           # Registration page
│       ├── home_screen.dart               # Main home with bottom navigation
│       ├── profile_screen.dart            # User profile page
│       ├── vehicle_list_screen.dart       # Vehicle listing page
│       └── upload_vehicle_screen.dart     # Vehicle upload page
├── pubspec.yaml                           # Flutter dependencies
└── android/ios/                           # Platform specific code
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (optional but recommended):
```bash
python -m venv venv
```

3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## Flutter App Setup

### Prerequisites
- Flutter SDK 3.0+
- Android SDK / Xcode (for iOS)
- A backend server running (see Backend Setup above)

### Installation

1. Navigate to flutter app directory:
```bash
cd flutter_app
```

2. Get dependencies:
```bash
flutter pub get
```

3. **Important**: Update API URL in `lib/services/api_service.dart`

Change this line to match your backend server IP/URL:
```dart
static const String baseUrl = 'http://192.168.1.100:8000'; // Change to your backend URL
```

### Running the App

**For Android:**
```bash
flutter run -d emulator-5554
```

**For iOS:**
```bash
flutter run -d ios
```

## Configuration

### Backend Configuration

The backend stores data in SQLite database. Configuration can be modified in `main.py`:
- `DATABASE_URL`: Database connection string
- `UPLOAD_DIR`: Directory for storing vehicle images
- CORS settings for allowed origins

### Frontend Configuration

Update the API URL in `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'http://YOUR_SERVER_IP:8000';
```

## API Usage Examples

### Register User
```bash
curl -X POST "http://localhost:8000/register/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john&email=john@example.com&password=pass123&full_name=John Doe&phone=1234567890"
```

### Login
```bash
curl -X POST "http://localhost:8000/login/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john&password=pass123"
```

### Upload Vehicle
```bash
curl -X POST "http://localhost:8000/upload/" \
  -F "user_id=1" \
  -F "number=ABC-1234" \
  -F "owner=John Doe" \
  -F "image=@vehicle_photo.jpg"
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username STRING UNIQUE,
  email STRING UNIQUE,
  password STRING,
  full_name STRING,
  phone STRING
)
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id INTEGER PRIMARY KEY,
  number STRING,
  owner STRING,
  image_path STRING,
  timestamp STRING,
  user_id INTEGER
)
```

## Security Notes

⚠️ **Current Implementation**: This application uses simple text-based password storage for demonstration purposes.

⚠️ **For Production**, implement:
- Password hashing (bcrypt, argon2)
- JWT tokens for authentication
- HTTPS/TLS encryption
- Input validation and sanitization
- Rate limiting
- Database backups

## Deployment

### Backend Deployment (Heroku)

1. Create `Procfile` (already included):
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Deploy:
```bash
git push heroku main
```

### Frontend Deployment

Build APK/IPA:
```bash
# Android
flutter build apk --release

# iOS
flutter build ios --release
```

## Troubleshooting

### Connection Issues
- Ensure backend server is running
- Check if API URL is correct in Flutter app
- Verify firewall settings
- Use `http` instead of `https` for local development

### Image Upload Issues
- Check `images/` directory permissions
- Ensure sufficient disk space
- Verify image_picker permissions in Android/iOS manifest

### Database Issues
- Delete `vehicles.db` to reset database
- Check write permissions for database directory

## Development

### Adding New Features

1. Add models in `lib/models/`
2. Add API methods in `lib/services/api_service.dart`
3. Add state management in `lib/providers/`
4. Create UI screens in `lib/screens/`
5. Add navigation routes in `main.dart`

### Code Structure
- Models: Data structures (User, Vehicle)
- Services: API communication
- Providers: State management (ChangeNotifier)
- Screens: UI components

## Dependencies

### Backend
- fastapi - Web framework
- uvicorn - ASGI server
- sqlalchemy - ORM
- python-multipart - Form data parsing
- pillow - Image processing

### Frontend
- flutter - UI framework
- provider - State management
- http - HTTP client
- image_picker - Camera/gallery access
- shared_preferences - Local storage
- intl - Internationalization

## License

This project is for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check Flutter/Dart documentation
4. Review error logs in console

## Future Enhancements

- [ ] Vehicle search/filter functionality
- [ ] Advanced user profiles with profile pictures
- [ ] Vehicle history and analytics
- [ ] Real-time notifications
- [ ] Multiple image support per vehicle
- [ ] Location tracking
- [ ] User-to-user messaging
- [ ] Vehicle QR code generation
- [ ] PDF report generation
- [ ] Dark mode support
