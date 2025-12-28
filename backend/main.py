from fastapi import HTTPException, FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sqlalchemy
import shutil, os
from datetime import datetime
import pytz
from PIL import Image
import io
import uuid

app = FastAPI()

# Enable CORS for Flutter app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration - Use PostgreSQL for both production and local development
# Default local PostgreSQL connection
DEFAULT_LOCAL_DB = "postgresql://postgres:postgres@localhost:5432/vehicleq"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_LOCAL_DB)

# Render provides DATABASE_URL with postgres:// scheme, but SQLAlchemy needs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Log database being used
print("🐘 Using PostgreSQL database with image storage.")
print(f"   Database: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'local'}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    full_name = Column(String)
    phone = Column(String)

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, index=True)
    owner = Column(String, index=True)
    image_path = Column(String)  # Deprecated - kept for backward compatibility
    image_data = Column(LargeBinary)  # Store image as binary data
    timestamp = Column(String)
    user_id = Column(Integer)

Base.metadata.create_all(bind=engine)

# Manual migration: Add image_data column if it doesn't exist
try:
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(
            sqlalchemy.text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name='vehicles' AND column_name='image_data'"
            )
        )
        if not result.fetchone():
            print("Adding image_data column to vehicles table...")
            conn.execute(sqlalchemy.text("ALTER TABLE vehicles ADD COLUMN image_data BYTEA"))
            conn.commit()
            print("✅ Column added successfully")
        else:
            print("✅ image_data column already exists")
except Exception as e:
    print(f"Migration check: {e}")

# Image optimization settings
MAX_IMAGE_SIZE = (1920, 1080)  # Max resolution
JPEG_QUALITY = 85  # Compression quality (1-100)

def optimize_image(image_file: UploadFile) -> bytes:
    """Optimize and compress uploaded image, return as bytes"""
    # Read image data
    image_data = image_file.file.read()
    
    # Open image with PIL
    img = Image.open(io.BytesIO(image_data))
    
    # Convert RGBA to RGB if necessary
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
        img = background
    
    # Resize if image is too large
    if img.size[0] > MAX_IMAGE_SIZE[0] or img.size[1] > MAX_IMAGE_SIZE[1]:
        img.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
    
    # Save optimized image to bytes
    output = io.BytesIO()
    img.save(output, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return output.getvalue()

@app.get("/")
async def root():
    return {"message": "VehicleQ API is running!"}

@app.get("/health")
async def health_check():
    """Health check endpoint for uptime monitoring"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat(),
        "version": "1.1.0"
    }

@app.get("/health/db")
async def health_check_db():
    """Health check that also pings the database (keeps DB connection warm)."""
    try:
        with engine.connect() as conn:
            conn.execute(sqlalchemy.text("SELECT 1"))
        return {
            "status": "healthy",
            "db": "ok",
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat(),
            "version": "1.1.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database health check failed: {e}")

# User Authentication Endpoints
@app.post("/register/")
def register_user(username: str = Form(...), email: str = Form(...), password: str = Form(...), full_name: str = Form(...), phone: str = Form(...)):
    db = SessionLocal()
    existing_user = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user = User(username=username, email=email, password=password, full_name=full_name, phone=phone)
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return {"id": user.id, "username": user.username, "email": user.email, "full_name": user.full_name, "phone": user.phone}

@app.post("/login/")
def login_user(username: str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if not user or user.password != password:
        db.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    db.close()
    return {"id": user.id, "username": user.username, "email": user.email, "full_name": user.full_name, "phone": user.phone}

@app.get("/profile/{user_id}")
def get_profile(user_id: int):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "username": user.username, "email": user.email, "full_name": user.full_name, "phone": user.phone}

@app.put("/profile/{user_id}")
def update_profile(user_id: int, full_name: str = Form(...), phone: str = Form(...)):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
    user.full_name = full_name
    user.phone = phone
    db.commit()
    db.refresh(user)
    db.close()
    return {"id": user.id, "username": user.username, "email": user.email, "full_name": user.full_name, "phone": user.phone}



@app.post("/upload/")
def upload_vehicle(user_id: int = Form(...), number: str = Form(...), owner: str = Form(...), image: UploadFile = File(...)):
    # Validate file type
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Optimize image and get bytes
    image_bytes = optimize_image(image)
    
    db = SessionLocal()
    # Convert current time to IST (India Standard Time)
    ist = pytz.timezone('Asia/Kolkata')
    timestamp = datetime.now(ist).strftime('%Y-%m-%d %H:%M:%S')
    vehicle = Vehicle(number=number, owner=owner, image_data=image_bytes, timestamp=timestamp, user_id=user_id)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    db.close()
    return {"id": vehicle.id, "number": number, "owner": owner, "timestamp": timestamp}

@app.get("/vehicles/")
def get_vehicles():
    db = SessionLocal()
    # Sort by timestamp descending (latest first)
    vehicles = db.query(Vehicle).order_by(Vehicle.timestamp.desc()).all()
    db.close()
    return [{"id": v.id, "number": v.number, "owner": v.owner, "timestamp": v.timestamp} for v in vehicles]

@app.get("/vehicles/{user_id}")
def get_user_vehicles(user_id: int):
    db = SessionLocal()
    # Sort by timestamp descending (latest first)
    vehicles = db.query(Vehicle).filter(Vehicle.user_id == user_id).order_by(Vehicle.timestamp.desc()).all()
    db.close()
    return [{"id": v.id, "number": v.number, "owner": v.owner, "timestamp": v.timestamp} for v in vehicles]

@app.get("/image/{vehicle_id}")
def get_image(vehicle_id: int):
    db = SessionLocal()
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    db.close()
    if vehicle and vehicle.image_data:
        return Response(content=vehicle.image_data, media_type="image/jpeg")
    raise HTTPException(status_code=404, detail="Image not found")

@app.delete("/vehicle/{vehicle_id}")
def delete_vehicle(vehicle_id: int):
    db = SessionLocal()
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        db.close()
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(vehicle)
    db.commit()
    db.close()
    return {"message": "Vehicle deleted successfully"}

# Admin Endpoints
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

@app.post("/admin/login/")
def admin_login(username: str = Form(...), password: str = Form(...)):
    """Admin authentication endpoint"""
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return {"success": True, "message": "Admin login successful"}
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

@app.get("/admin/vehicles/")
def get_all_vehicles_admin():
    """Get all vehicles from all users (admin only)"""
    db = SessionLocal()
    vehicles = db.query(Vehicle).order_by(Vehicle.timestamp.desc()).all()
    
    result = []
    for v in vehicles:
        user = db.query(User).filter(User.id == v.user_id).first()
        result.append({
            "id": v.id,
            "number": v.number,
            "owner": v.owner,
            "timestamp": v.timestamp,
            "user_id": v.user_id,
            "username": user.username if user else "Unknown",
            "user_email": user.email if user else "Unknown"
        })
    
    db.close()
    return result

@app.delete("/admin/vehicle/{vehicle_id}")
def admin_delete_vehicle(vehicle_id: int):
    """Delete any vehicle (admin only)"""
    db = SessionLocal()
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        db.close()
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(vehicle)
    db.commit()
    db.close()
    return {"message": "Vehicle deleted successfully"}

@app.get("/admin/export/")
def export_all_data():
    """Export all data as JSON (admin only)"""
    import base64
    db = SessionLocal()
    
    # Export users
    users = db.query(User).all()
    users_data = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "password": u.password,
        "full_name": u.full_name,
        "phone": u.phone
    } for u in users]
    
    # Export vehicles with images as base64
    vehicles = db.query(Vehicle).all()
    vehicles_data = [{
        "id": v.id,
        "number": v.number,
        "owner": v.owner,
        "timestamp": v.timestamp,
        "user_id": v.user_id,
        "image_data": base64.b64encode(v.image_data).decode('utf-8') if v.image_data else None
    } for v in vehicles]
    
    db.close()
    
    return {
        "export_date": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat(),
        "users": users_data,
        "vehicles": vehicles_data
    }

@app.post("/admin/import/")
def import_data(data: dict):
    """Import data from JSON export (admin only)"""
    import base64
    db = SessionLocal()
    
    try:
        # Import users
        if "users" in data:
            for user_data in data["users"]:
                # Check if user already exists
                existing = db.query(User).filter(User.username == user_data["username"]).first()
                if not existing:
                    user = User(**{k: v for k, v in user_data.items() if k != "id"})
                    db.add(user)
        
        # Import vehicles
        if "vehicles" in data:
            for vehicle_data in data["vehicles"]:
                # Decode base64 image
                image_data_b64 = vehicle_data.pop("image_data", None)
                image_bytes = base64.b64decode(image_data_b64) if image_data_b64 else None
                
                vehicle = Vehicle(
                    number=vehicle_data["number"],
                    owner=vehicle_data["owner"],
                    timestamp=vehicle_data["timestamp"],
                    user_id=vehicle_data["user_id"],
                    image_data=image_bytes
                )
                db.add(vehicle)
        
        db.commit()
        db.close()
        return {"message": "Data imported successfully"}
    except Exception as e:
        db.rollback()
        db.close()
        raise HTTPException(status_code=400, detail=f"Import failed: {str(e)}")