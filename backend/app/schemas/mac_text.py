# backend/app/schemas/mac_text.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MacTextCreate(BaseModel):
    mac_address: str
    sensor_code: str
    sensor_name: str

class MacTextUpdate(BaseModel):
    mac_address: Optional[str] = None
    sensor_code: Optional[str] = None
    sensor_name: Optional[str] = None

class MacTextOut(BaseModel):
    id: int
    mac_address: str
    sensor_code: str
    sensor_name: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        
class MacLookupRequest(BaseModel):
    mac_address: str

class MacLookupResponse(BaseModel):
    sensor_name: str
    sensor_code: str
    token: str