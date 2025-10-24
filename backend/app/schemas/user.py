from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Schema สำหรับสร้างผู้ใช้
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = None

# Schema สำหรับอัปเดตผู้ใช้
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None

# Schema สำหรับแสดงผลผู้ใช้
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schema สำหรับล็อกอิน
class UserLogin(BaseModel):
    email: EmailStr
    password: str