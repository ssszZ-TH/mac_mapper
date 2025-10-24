# app/schemas/mac_text.py
from pydantic import BaseModel
from typing import Optional

class MacTextCreate(BaseModel):
    mac_address: str
    description: str

class MacTextUpdate(BaseModel):
    mac_address: Optional[str] = None
    description: Optional[str] = None

class MacTextOut(BaseModel):
    id: int
    mac_address: str
    description: str

    class Config:
        from_attributes = True
        
class MacLookupRequest(BaseModel):
    mac_address: str

class MacLookupResponse(BaseModel):
    description: str