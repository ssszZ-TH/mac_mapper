from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema สำหรับสร้าง organization
class OrganizationCreate(BaseModel):
    username: str
    email: str
    password: str
    federal_tax_id: Optional[str] = None
    name_en: str
    name_th: Optional[str] = None
    organization_type_id: Optional[int] = None
    industry_type_id: Optional[int] = None
    employee_count: Optional[int] = None
    slogan: Optional[str] = None

# Schema สำหรับอัปเดต organization
class OrganizationUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    federal_tax_id: Optional[str] = None
    name_en: Optional[str] = None
    name_th: Optional[str] = None
    organization_type_id: Optional[int] = None
    industry_type_id: Optional[int] = None
    employee_count: Optional[int] = None
    slogan: Optional[str] = None

# Schema สำหรับแสดงผล organization
class OrganizationOut(BaseModel):
    id: int
    username: str
    email: str
    federal_tax_id: Optional[str] = None
    name_en: str
    name_th: Optional[str] = None
    organization_type_id: Optional[int] = None
    industry_type_id: Optional[int] = None
    employee_count: Optional[int] = None
    slogan: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True