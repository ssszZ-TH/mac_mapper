from pydantic import BaseModel
from typing import Optional

# Schema สำหรับสร้าง income_range
class IncomeRangeCreate(BaseModel):
    description: str

# Schema สำหรับอัปเดต income_range
class IncomeRangeUpdate(BaseModel):
    description: Optional[str] = None

# Schema สำหรับแสดงผล income_range
class IncomeRangeOut(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True