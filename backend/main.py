from fastapi import HTTPException, FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import shutil, os
from datetime import datetime
import pytz

app = FastAPI()

# Enable CORS for Flutter app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./vehicles.db"
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
    image_path = Column(String)
    timestamp = Column(String)
    user_id = Column(Integer)

Base.metadata.create_all(bind=engine)

UPLOAD_DIR = "images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "VehicleQ API is running!"}

@app.get("/health")
async def health_check():
    """Health check endpoint for uptime monitoring"""
    return {"status": "healthy", "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()}

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
    file_location = f"{UPLOAD_DIR}/{image.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    db = SessionLocal()
    # Convert current time to IST (India Standard Time)
    ist = pytz.timezone('Asia/Kolkata')
    timestamp = datetime.now(ist).strftime('%Y-%m-%d %H:%M:%S')
    vehicle = Vehicle(number=number, owner=owner, image_path=file_location, timestamp=timestamp, user_id=user_id)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    db.close()
    return {"id": vehicle.id, "number": number, "owner": owner, "image_path": file_location, "timestamp": timestamp}

@app.get("/vehicles/")
def get_vehicles():
    db = SessionLocal()
    # Sort by timestamp descending (latest first)
    vehicles = db.query(Vehicle).order_by(Vehicle.timestamp.desc()).all()
    db.close()
    return [{"id": v.id, "number": v.number, "owner": v.owner, "image_path": v.image_path, "timestamp": v.timestamp} for v in vehicles]

@app.get("/vehicles/{user_id}")
def get_user_vehicles(user_id: int):
    db = SessionLocal()
    # Sort by timestamp descending (latest first)
    vehicles = db.query(Vehicle).filter(Vehicle.user_id == user_id).order_by(Vehicle.timestamp.desc()).all()
    db.close()
    return [{"id": v.id, "number": v.number, "owner": v.owner, "image_path": v.image_path, "timestamp": v.timestamp} for v in vehicles]

@app.get("/image/{vehicle_id}")
def get_image(vehicle_id: int):
    db = SessionLocal()
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    db.close()
    if vehicle:
        return FileResponse(vehicle.image_path)
    return {"error": "Image not found"}

@app.delete("/vehicle/{vehicle_id}")
def delete_vehicle(vehicle_id: int):
    db = SessionLocal()
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        db.close()
        raise HTTPException(status_code=404, detail="Vehicle not found")
    # Attempt to remove the image file from disk if it exists.
    image_path = vehicle.image_path
    image_removed = False
    try:
        if image_path and os.path.exists(image_path):
            try:
                os.remove(image_path)
                image_removed = True
            except Exception:
                # If file deletion fails, continue to remove DB row.
                image_removed = False
    except Exception:
        # Defensive: if os.path.exists fails for any reason, ignore and continue.
        image_removed = False

    db.delete(vehicle)
    db.commit()
    db.close()
    return {"message": "Vehicle deleted", "image_removed": image_removed}