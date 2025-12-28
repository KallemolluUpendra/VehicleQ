# VehicleQ Admin Panel Documentation

## Overview
The VehicleQ Admin Panel provides administrative access to manage all vehicles across all users, with import/export capabilities for data backup and migration.

## Access
- **URL**: Navigate to `/admin-login` from the main application
- **Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **Access Link**: Available on the login page under "Admin Access"

## Features

### 1. Admin Login
- Dedicated admin login page separate from user login
- Credentials stored in backend environment variables (can be changed via env vars)
- Secure authentication with session management

### 2. Dashboard Overview
The admin dashboard displays:
- **Total Vehicles Count**: Quick stat showing all vehicles in the system
- **Vehicles Table**: Complete list of all vehicles from all users

### 3. Vehicle Management
Each vehicle entry shows:
- Vehicle ID
- Vehicle Number
- Owner Name
- User ID (who uploaded it)
- Timestamp (when uploaded)

**Available Actions**:
- **View Button**: Opens a popup modal showing:
  - Full vehicle image
  - Complete vehicle details
  - Owner information
  
- **Delete Button**: 
  - Removes vehicle from database
  - Requires confirmation before deletion
  - Shows loading state during deletion

### 4. Data Export
**Purpose**: Backup all data before Render's 90-day database cleanup

**How to Export**:
1. Click "Export JSON" button in the top navigation
2. System downloads a JSON file named: `vehicleq-export-YYYY-MM-DD.json`

**Export Contents**:
```json
{
  "export_date": "2025-12-28T...",
  "users": [
    {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com",
      "password": "hashed_password",
      "full_name": "Full Name",
      "phone": "1234567890"
    }
  ],
  "vehicles": [
    {
      "id": 1,
      "number": "AP01AB1234",
      "owner": "Owner Name",
      "timestamp": "2025-12-28 10:30:00",
      "user_id": 1,
      "image_data": "base64_encoded_image_data..."
    }
  ]
}
```

**Features**:
- All images are base64-encoded for portability
- Complete user and vehicle data
- Timestamped for version tracking
- Can be re-imported to any database

### 5. Data Import
**Purpose**: Restore data to a new database after migration

**How to Import**:
1. Click "Import JSON" button in the top navigation
2. Select previously exported JSON file
3. System validates and imports the data
4. Dashboard refreshes to show imported vehicles

**Import Behavior**:
- Skips existing users (based on username)
- Adds all new vehicles
- Decodes base64 images and stores in database
- Maintains user-vehicle relationships

### 6. Logout
- Click "Logout" button to end admin session
- Redirects to admin login page
- Clears admin authentication token

## Backend API Endpoints

### Admin Authentication
```
POST /admin/login/
Body: username, password (form-data)
Response: { "success": true, "message": "Admin login successful" }
```

### Get All Vehicles
```
GET /admin/vehicles/
Response: Array of vehicle objects with user_id
```

### Delete Vehicle
```
DELETE /admin/vehicle/{vehicle_id}
Response: { "message": "Vehicle deleted successfully" }
```

### Export Data
```
GET /admin/export/
Response: JSON with users and vehicles (images as base64)
```

### Import Data
```
POST /admin/import/
Body: JSON export data
Response: { "message": "Data imported successfully" }
```

## Security Notes
- Admin credentials should be changed via environment variables in production
- Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file
- Admin session is stored in localStorage
- All admin endpoints should be additionally secured in production (JWT tokens, etc.)

## Usage Workflow for Database Migration

### Before Render's 90-day limit:
1. Login to admin panel
2. Click "Export JSON"
3. Save the downloaded file securely
4. Keep multiple backups

### After setting up new database:
1. Deploy application with new database
2. Login to admin panel
3. Click "Import JSON"
4. Select your backup file
5. Verify all data is imported correctly

## Troubleshooting

### Cannot login as admin
- Verify credentials: `admin` / `admin123`
- Check browser console for errors
- Ensure backend is running

### Export/Import fails
- Check file format is valid JSON
- Verify backend endpoint is accessible
- Check browser console for detailed errors
- Ensure sufficient storage space

### Vehicle images not showing
- Verify image data is in database
- Check image endpoint: `/image/{vehicle_id}`
- Clear browser cache

## Development Notes
- Admin service: `angular_app/src/app/services/admin.service.ts`
- Admin guard: `angular_app/src/app/guards/admin.guard.ts`
- Admin login: `angular_app/src/app/components/admin-login/`
- Admin dashboard: `angular_app/src/app/components/admin-dashboard/`
- Backend endpoints: `backend/main.py` (lines 223-344)
