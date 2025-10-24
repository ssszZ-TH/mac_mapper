from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง contact_mechanism_type
class ContactMechanismTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต contact_mechanism_type
class ContactMechanismTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล contact_mechanism_type
class ContactMechanismTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True