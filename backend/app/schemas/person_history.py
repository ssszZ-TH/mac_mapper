from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

# Schema สำหรับแสดงผล person_history
class PersonHistoryOut(BaseModel):
    id: int
    person_id: Optional[int]
    personal_id_number: Optional[str]
    first_name: Optional[str]
    middle_name: Optional[str]
    last_name: Optional[str]
    nick_name: Optional[str]
    birth_date: Optional[date]
    gender_type_id: Optional[int]
    marital_status_type_id: Optional[int]
    country_id: Optional[int]
    height: Optional[int]
    weight: Optional[int]
    racial_type_id: Optional[int]
    income_range_id: Optional[int]
    about_me: Optional[str]
    action: Optional[str]
    action_at: datetime
    action_by: Optional[int]

    class Config:
        from_attributes = True