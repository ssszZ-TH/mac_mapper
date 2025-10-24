from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.income_ranges import create_income_range, get_income_range, update_income_range, delete_income_range, get_all_income_ranges
from app.schemas.income_ranges import IncomeRangeCreate, IncomeRangeUpdate, IncomeRangeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/income_ranges", tags=["income_ranges"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง income_range ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=IncomeRangeOut)
async def create_income_range_endpoint(income_range: IncomeRangeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create income_range by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_income_range(income_range)
    if not result:
        logger.warning(f"Failed to create income_range: {income_range.description}")
        raise HTTPException(status_code=400, detail="Description already exists")
    logger.info(f"Created income_range: id={result.id}")
    return result

# ดึงข้อมูล income_range ตาม ID
@router.get("/{income_range_id}", response_model=IncomeRangeOut)
async def get_income_range_endpoint(income_range_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get income_range by id={income_range_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_income_range(income_range_id)
    if not result:
        logger.warning(f"Income_range not found: id={income_range_id}")
        raise HTTPException(status_code=404, detail="Income range not found")
    logger.info(f"Retrieved income_range: id={income_range_id}")
    return result

# ดึงข้อมูล income_range ทั้งหมด
@router.get("/", response_model=List[IncomeRangeOut])
async def get_all_income_ranges_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all income_ranges by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_income_ranges()
    logger.info(f"Retrieved {len(results)} income_ranges")
    return results

# อัปเดตข้อมูล income_range (basetype_admin เท่านั้น)
@router.put("/{income_range_id}", response_model=IncomeRangeOut)
async def update_income_range_endpoint(income_range_id: int, income_range: IncomeRangeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update income_range by id={income_range_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_income_range(income_range_id, income_range)
    if not result:
        logger.warning(f"Income_range not found for update: id={income_range_id}")
        raise HTTPException(status_code=404, detail="Income range not found")
    logger.info(f"Updated income_range: id={income_range_id}")
    return result

# ลบ income_range (basetype_admin เท่านั้น)
@router.delete("/{income_range_id}")
async def delete_income_range_endpoint(income_range_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete income_range by id={income_range_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_income_range(income_range_id)
    if not result:
        logger.warning(f"Income_range not found for deletion: id={income_range_id}")
        raise HTTPException(status_code=404, detail="Income range not found")
    logger.info(f"Deleted income_range: id={income_range_id}")
    return {"message": "Income range deleted"}