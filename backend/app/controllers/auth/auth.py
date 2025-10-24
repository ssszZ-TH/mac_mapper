from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta
from app.config.settings import SECRET_KEY, BCRYPT_SALT, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import bcrypt
import logging
from app.schemas.user import UserCreate, UserLogin
from app.models.users.user import create_user, get_user_by_email, verify_user_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])  # กำหนด router สำหรับ auth

# สร้าง JWT access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoint สำหรับ login
@router.post("/login")
async def login(user: UserLogin):
    db_user = await get_user_by_email(user.email)
    if not db_user:
        logger.warning(f"Login failed: User not found for email {user.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    is_valid = await verify_user_password(db_user["id"], user.password)
    if not is_valid:
        logger.warning(f"Login failed: Invalid password for email {user.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": str(db_user["id"]), "role": db_user["role"]})
    logger.info(f"User logged in: email={user.email}, id={db_user['id']}")
    return {"access_token": token, "token_type": "bearer"}

# Endpoint สำหรับ register (ไม่ต้องใช้ token)
@router.post("/register")
async def register(user: UserCreate):
    valid_roles = ["system_admin", "hr_admin", "organization_admin"]
    if user.role is not None and user.role not in valid_roles:
        logger.warning(f"Invalid role provided: {user.role}")
        raise HTTPException(status_code=422, detail=f"Role must be one of {valid_roles}")
    
    result = await create_user(user, action_by=None)
    if not result:
        logger.warning(f"Failed to register user: {user.email}")
        raise HTTPException(status_code=400, detail="Email already exists")
    
    logger.info(f"Registered user: {user.email}, role={result.role}")
    return result