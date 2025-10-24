from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.industry_types import create_industry_type, get_industry_type, update_industry_type, delete_industry_type, get_all_industry_types
from app.schemas.industry_types import IndustryTypeCreate, IndustryTypeUpdate, IndustryTypeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/industry_types", tags=["industry_types"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง industry_type ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=IndustryTypeOut)
async def create_industry_type_endpoint(industry_type: IndustryTypeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create industry_type by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_industry_type(industry_type)
    if not result:
        logger.warning(f"Failed to create industry_type: {industry_type.naisc}")
        raise HTTPException(status_code=400, detail="NAICS code already exists")
    logger.info(f"Created industry_type: id={result.id}")
    return result

# ดึงข้อมูล industry_type ตาม ID
@router.get("/{industry_type_id}", response_model=IndustryTypeOut)
async def get_industry_type_endpoint(industry_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get industry_type by id={industry_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_industry_type(industry_type_id)
    if not result:
        logger.warning(f"Industry_type not found: id={industry_type_id}")
        raise HTTPException(status_code=404, detail="Industry type not found")
    logger.info(f"Retrieved industry_type: id={industry_type_id}")
    return result

# ดึงข้อมูล industry_type ทั้งหมด
@router.get("/", response_model=List[IndustryTypeOut])
async def get_all_industry_types_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all industry_types by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_industry_types()
    logger.info(f"Retrieved {len(results)} industry_types")
    return results

# อัปเดตข้อมูล industry_type (basetype_admin เท่านั้น)
@router.put("/{industry_type_id}", response_model=IndustryTypeOut)
async def update_industry_type_endpoint(industry_type_id: int, industry_type: IndustryTypeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update industry_type by id={industry_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_industry_type(industry_type_id, industry_type)
    if not result:
        logger.warning(f"Industry_type not found for update: id={industry_type_id}")
        raise HTTPException(status_code=404, detail="Industry type not found")
    logger.info(f"Updated industry_type: id={industry_type_id}")
    return result

# ลบ industry_type (basetype_admin เท่านั้น)
@router.delete("/{industry_type_id}")
async def delete_industry_type_endpoint(industry_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete industry_type by id={industry_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_industry_type(industry_type_id)
    if not result:
        logger.warning(f"Industry_type not found for deletion: id={industry_type_id}")
        raise HTTPException(status_code=404, detail="Industry type not found")
    logger.info(f"Deleted industry_type: id={industry_type_id}")
    return {"message": "Industry type deleted"}