from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema สำหรับแสดงผล users_history
class UsersHistoryOut(BaseModel):
    id: int
    user_id: Optional[int]
    username: Optional[str]
    password: Optional[str]
    email: Optional[str]
    role: Optional[str]
    action: Optional[str]
    action_at: datetime
    action_by: Optional[int]

    class Config:
        from_attributes = True