from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง marital_status_type
class MaritalStatusTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต marital_status_type
class MaritalStatusTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล marital_status_type
class MaritalStatusTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True