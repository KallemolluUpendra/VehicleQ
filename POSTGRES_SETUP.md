# PostgreSQL Local Setup Guide

## Prerequisites
You need PostgreSQL installed on your Windows machine.

## Installation

### Option 1: PostgreSQL Installer (Recommended)
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Default settings:
   - Port: 5432
   - Username: postgres
   - Password: (choose a password, default in our config is 'postgres')

### Option 2: Using Docker
```powershell
docker run --name vehicleq-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vehicleq -p 5432:5432 -d postgres:15
```

## Database Setup

### 1. Create the Database

**Using psql (PostgreSQL command line):**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vehicleq;

# Exit psql
\q
```

**Using pgAdmin (GUI):**
1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name: `vehicleq`
4. Click "Save"

### 2. Configure Backend

Create a `.env` file in the `backend` folder (copy from `.env.example`):

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vehicleq
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 3. Test Connection

```powershell
cd backend
python -m uvicorn main:app --reload
```

You should see:
```
🐘 Using PostgreSQL database with image storage
   Database: localhost:5432/vehicleq
✅ image_data column already exists
```

## Troubleshooting

### Error: "could not connect to server"
- Make sure PostgreSQL service is running
- Check Windows Services: `services.msc` → Look for "postgresql-x64-15"
- Start it if stopped

### Error: "password authentication failed"
- Update your `.env` file with the correct password
- Default password in our config is 'postgres'

### Error: "database 'vehicleq' does not exist"
- Create the database using psql or pgAdmin (see step 1 above)

## Verify Setup

1. Start the backend:
   ```powershell
   cd backend
   python -m uvicorn main:app --reload
   ```

2. Check the database:
   ```powershell
   psql -U postgres -d vehicleq -c "\dt"
   ```
   
   You should see tables: `users` and `vehicles`

## Migration from SQLite (if needed)

If you have existing data in SQLite that you want to migrate:

1. Export data from the admin panel (http://localhost:4200/admin)
   - Login with admin credentials
   - Click "Export All Data"
   
2. Switch to PostgreSQL (follow setup above)

3. Import data through the admin panel
   - Click "Import Data"
   - Select the exported JSON file

## Database Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Examples:
- Local: `postgresql://postgres:postgres@localhost:5432/vehicleq`
- Render: `postgresql://user:pass@oregon-postgres.render.com/dbname`
