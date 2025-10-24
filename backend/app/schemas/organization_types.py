from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง organization_type
class OrganizationTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต organization_type
class OrganizationTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล organization_type
class OrganizationTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True