from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema สำหรับสร้าง communication event
class CommunicationEventCreate(BaseModel):
    title: str
    detail: Optional[str] = None
    to_user_id: int
    contact_mechanism_type_id: Optional[int] = None
    communication_event_status_type_id: Optional[int] = None

# Schema สำหรับอัปเดต communication event
class CommunicationEventUpdate(BaseModel):
    title: Optional[str] = None
    detail: Optional[str] = None
    contact_mechanism_type_id: Optional[int] = None
    communication_event_status_type_id: Optional[int] = None
    favorite_flag: Optional[bool] = None

# Schema สำหรับแสดงผล communication event
class CommunicationEventOut(BaseModel):
    id: int
    title: str
    detail: Optional[str] = None
    from_user_id: int
    to_user_id: int
    contact_mechanism_type_id: Optional[int] = None
    communication_event_status_type_id: Optional[int] = None
    favorite_flag: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True