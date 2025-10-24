from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema สำหรับแสดงผล communication_event_history
class CommunicationEventHistoryOut(BaseModel):
    id: int
    communication_event_id: Optional[int]
    title: Optional[str]
    detail: Optional[str]
    from_user_id: Optional[int]
    to_user_id: Optional[int]
    contact_mechanism_type_id: Optional[int]
    communication_event_status_type_id: Optional[int]
    favorite_flag: bool
    action: Optional[str]
    action_at: datetime
    action_by: Optional[int]

    class Config:
        from_attributes = True