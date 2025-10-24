from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema สำหรับแสดงผล organization_history
class OrganizationHistoryOut(BaseModel):
    id: int
    organization_id: Optional[int]
    federal_tax_id: Optional[str]
    name_en: Optional[str]
    name_th: Optional[str]
    organization_type_id: Optional[int]
    industry_type_id: Optional[int]
    employee_count: Optional[int]
    slogan: Optional[str]
    action: Optional[str]
    action_at: datetime
    action_by: Optional[int]

    class Config:
        from_attributes = True