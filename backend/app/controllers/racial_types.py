from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.racial_types import create_racial_type, get_racial_type, update_racial_type, delete_racial_type, get_all_racial_types
from app.schemas.racial_types import RacialTypeCreate, RacialTypeUpdate, RacialTypeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/racial_types", tags=["racial_types"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง racial_type ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=RacialTypeOut)
async def create_racial_type_endpoint(racial_type: RacialTypeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create racial_type by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_racial_type(racial_type)
    if not result:
        logger.warning(f"Failed to create racial_type: {racial_type.description}")
        raise HTTPException(status_code=400, detail="Description already exists")
    logger.info(f"Created racial_type: id={result.id}")
    return result

# ดึงข้อมูล racial_type ตาม ID
@router.get("/{racial_type_id}", response_model=RacialTypeOut)
async def get_racial_type_endpoint(racial_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get racial_type by id={racial_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_racial_type(racial_type_id)
    if not result:
        logger.warning(f"Racial_type not found: id={racial_type_id}")
        raise HTTPException(status_code=404, detail="Racial type not found")
    logger.info(f"Retrieved racial_type: id={racial_type_id}")
    return result

# ดึงข้อมูล racial_type ทั้งหมด
@router.get("/", response_model=List[RacialTypeOut])
async def get_all_racial_types_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all racial_types by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_racial_types()
    logger.info(f"Retrieved {len(results)} racial_types")
    return results

# อัปเดตข้อมูล racial_type (basetype_admin เท่านั้น)
@router.put("/{racial_type_id}", response_model=RacialTypeOut)
async def update_racial_type_endpoint(racial_type_id: int, racial_type: RacialTypeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update racial_type by id={racial_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_racial_type(racial_type_id, racial_type)
    if not result:
        logger.warning(f"Racial_type not found for update: id={racial_type_id}")
        raise HTTPException(status_code=404, detail="Racial type not found")
    logger.info(f"Updated racial_type: id={racial_type_id}")
    return result

# ลบ racial_type (basetype_admin เท่านั้น)
@router.delete("/{racial_type_id}")
async def delete_racial_type_endpoint(racial_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete racial_type by id={racial_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_racial_type(racial_type_id)
    if not result:
        logger.warning(f"Racial_type not found for deletion: id={racial_type_id}")
        raise HTTPException(status_code=404, detail="Racial type not found")
    logger.info(f"Deleted racial_type: id={racial_type_id}")
    return {"message": "Racial type deleted"}