from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง communication_event_status_type
class CommunicationEventStatusTypeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต communication_event_status_type
class CommunicationEventStatusTypeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล communication_event_status_type
class CommunicationEventStatusTypeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True