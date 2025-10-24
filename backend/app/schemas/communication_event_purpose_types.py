from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง communication_event_purpose_type
class CommunicationEventPurposeTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต communication_event_purpose_type
class CommunicationEventPurposeTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล communication_event_purpose_type
class CommunicationEventPurposeTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True