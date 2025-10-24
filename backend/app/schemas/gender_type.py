from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง gender_type
class GenderTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต gender_type
class GenderTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล gender_type
class GenderTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True