from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง racial_type
class RacialTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต racial_type
class RacialTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล racial_type
class RacialTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True