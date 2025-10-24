from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง country
class CountryCreate(BaseModel):
    iso_code: str
    name_en: str
    name_th: Optional[str] = None

# Schema สำหรับอัปเดต country
class CountryUpdate(BaseModel):
    iso_code: Optional[str] = None
    name_en: Optional[str] = None
    name_th: Optional[str] = None

# Schema สำหรับแสดงผล country
class CountryOut(BaseModel):
    id: int
    iso_code: str
    name_en: str
    name_th: Optional[str] = None

    class Config:
        from_attributes = True