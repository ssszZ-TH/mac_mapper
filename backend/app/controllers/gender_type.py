from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.gender_type import create_gender_type, get_gender_type, update_gender_type, delete_gender_type, get_all_gender_types
from app.schemas.gender_type import GenderTypeCreate, GenderTypeUpdate, GenderTypeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gender_types", tags=["gender_types"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง gender_type ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=GenderTypeOut)
async def create_gender_type_endpoint(gender_type: GenderTypeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create gender_type by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_gender_type(gender_type)
    if not result:
        logger.warning(f"Failed to create gender_type: {gender_type.description}")
        raise HTTPException(status_code=400, detail="Description already exists")
    logger.info(f"Created gender_type: id={result.id}")
    return result

# ดึงข้อมูล gender_type ตาม ID
@router.get("/{gender_type_id}", response_model=GenderTypeOut)
async def get_gender_type_endpoint(gender_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get gender_type by id={gender_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_gender_type(gender_type_id)
    if not result:
        logger.warning(f"Gender_type not found: id={gender_type_id}")
        raise HTTPException(status_code=404, detail="Gender type not found")
    logger.info(f"Retrieved gender_type: id={gender_type_id}")
    return result

# ดึงข้อมูล gender_type ทั้งหมด
@router.get("/", response_model=List[GenderTypeOut])
async def get_all_gender_types_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all gender_types by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_gender_types()
    logger.info(f"Retrieved {len(results)} gender_types")
    return results

# อัปเดตข้อมูล gender_type (basetype_admin เท่านั้น)
@router.put("/{gender_type_id}", response_model=GenderTypeOut)
async def update_gender_type_endpoint(gender_type_id: int, gender_type: GenderTypeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update gender_type by id={gender_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_gender_type(gender_type_id, gender_type)
    if not result:
        logger.warning(f"Gender_type not found for update: id={gender_type_id}")
        raise HTTPException(status_code=404, detail="Gender type not found")
    logger.info(f"Updated gender_type: id={gender_type_id}")
    return result

# ลบ gender_type (basetype_admin เท่านั้น)
@router.delete("/{gender_type_id}")
async def delete_gender_type_endpoint(gender_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete gender_type by id={gender_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_gender_type(gender_type_id)
    if not result:
        logger.warning(f"Gender_type not found for deletion: id={gender_type_id}")
        raise HTTPException(status_code=404, detail="Gender type not found")
    logger.info(f"Deleted gender_type: id={gender_type_id}")
    return {"message": "Gender type deleted"}