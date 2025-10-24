from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.organization_types import create_organization_type, get_organization_type, update_organization_type, delete_organization_type, get_all_organization_types
from app.schemas.organization_types import OrganizationTypeCreate, OrganizationTypeUpdate, OrganizationTypeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/organization_types", tags=["organization_types"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง organization_type ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=OrganizationTypeOut)
async def create_organization_type_endpoint(organization_type: OrganizationTypeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create organization_type by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_organization_type(organization_type)
    if not result:
        logger.warning(f"Failed to create organization_type: {organization_type.description}")
        raise HTTPException(status_code=400, detail="Description already exists")
    logger.info(f"Created organization_type: id={result.id}")
    return result

# ดึงข้อมูล organization_type ตาม ID
@router.get("/{organization_type_id}", response_model=OrganizationTypeOut)
async def get_organization_type_endpoint(organization_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get organization_type by id={organization_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_organization_type(organization_type_id)
    if not result:
        logger.warning(f"Organization_type not found: id={organization_type_id}")
        raise HTTPException(status_code=404, detail="Organization type not found")
    logger.info(f"Retrieved organization_type: id={organization_type_id}")
    return result

# ดึงข้อมูล organization_type ทั้งหมด
@router.get("/", response_model=List[OrganizationTypeOut])
async def get_all_organization_types_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all organization_types by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_organization_types()
    logger.info(f"Retrieved {len(results)} organization_types")
    return results

# อัปเดตข้อมูล organization_type (basetype_admin เท่านั้น)
@router.put("/{organization_type_id}", response_model=OrganizationTypeOut)
async def update_organization_type_endpoint(organization_type_id: int, organization_type: OrganizationTypeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update organization_type by id={organization_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_organization_type(organization_type_id, organization_type)
    if not result:
        logger.warning(f"Organization_type not found for update: id={organization_type_id}")
        raise HTTPException(status_code=404, detail="Organization type not found")
    logger.info(f"Updated organization_type: id={organization_type_id}")
    return result

# ลบ organization_type (basetype_admin เท่านั้น)
@router.delete("/{organization_type_id}")
async def delete_organization_type_endpoint(organization_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete organization_type by id={organization_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_organization_type(organization_type_id)
    if not result:
        logger.warning(f"Organization_type not found for deletion: id={organization_type_id}")
        raise HTTPException(status_code=404, detail="Organization type not found")
    logger.info(f"Deleted organization_type: id={organization_type_id}")
    return {"message": "Organization type deleted"}