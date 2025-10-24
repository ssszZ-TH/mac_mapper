from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง industry_type
class IndustryTypeCreate(BaseModel):
    naisc: str
    description: str

# Schema สำหรับอัปเดต industry_type
class IndustryTypeUpdate(BaseModel):
    naisc: Optional[str] = None
    description: Optional[str] = None

# Schema สำหรับแสดงผล industry_type
class IndustryTypeOut(BaseModel):
    id: int
    naisc: str
    description: str

    class Config:
        from_attributes = True