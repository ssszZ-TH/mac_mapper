from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.contact_mechanism_types import create_contact_mechanism_type, get_contact_mechanism_type, update_contact_mechanism_type, delete_contact_mechanism_type, get_all_contact_mechanism_types
from app.schemas.contact_mechanism_types import ContactMechanismTypeCreate, ContactMechanismTypeUpdate, ContactMechanismTypeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact_mechanism_types", tags=["contact_mechanism_types"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง contact_mechanism_type ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=ContactMechanismTypeOut)
async def create_contact_mechanism_type_endpoint(contact_mechanism_type: ContactMechanismTypeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create contact_mechanism_type by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_contact_mechanism_type(contact_mechanism_type)
    if not result:
        logger.warning(f"Failed to create contact_mechanism_type: {contact_mechanism_type.description}")
        raise HTTPException(status_code=400, detail="Description already exists")
    logger.info(f"Created contact_mechanism_type: id={result.id}")
    return result

# ดึงข้อมูล contact_mechanism_type ตาม ID
@router.get("/{contact_mechanism_type_id}", response_model=ContactMechanismTypeOut)
async def get_contact_mechanism_type_endpoint(contact_mechanism_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get contact_mechanism_type by id={contact_mechanism_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_contact_mechanism_type(contact_mechanism_type_id)
    if not result:
        logger.warning(f"Contact_mechanism_type not found: id={contact_mechanism_type_id}")
        raise HTTPException(status_code=404, detail="Contact mechanism type not found")
    logger.info(f"Retrieved contact_mechanism_type: id={contact_mechanism_type_id}")
    return result

# ดึงข้อมูล contact_mechanism_type ทั้งหมด
@router.get("/", response_model=List[ContactMechanismTypeOut])
async def get_all_contact_mechanism_types_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all contact_mechanism_types by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_contact_mechanism_types()
    logger.info(f"Retrieved {len(results)} contact_mechanism_types")
    return results

# อัปเดตข้อมูล contact_mechanism_type (basetype_admin เท่านั้น)
@router.put("/{contact_mechanism_type_id}", response_model=ContactMechanismTypeOut)
async def update_contact_mechanism_type_endpoint(contact_mechanism_type_id: int, contact_mechanism_type: ContactMechanismTypeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update contact_mechanism_type by id={contact_mechanism_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_contact_mechanism_type(contact_mechanism_type_id, contact_mechanism_type)
    if not result:
        logger.warning(f"Contact_mechanism_type not found for update: id={contact_mechanism_type_id}")
        raise HTTPException(status_code=404, detail="Contact mechanism type not found")
    logger.info(f"Updated contact_mechanism_type: id={contact_mechanism_type_id}")
    return result

# ลบ contact_mechanism_type (basetype_admin เท่านั้น)
@router.delete("/{contact_mechanism_type_id}")
async def delete_contact_mechanism_type_endpoint(contact_mechanism_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete contact_mechanism_type by id={contact_mechanism_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_contact_mechanism_type(contact_mechanism_type_id)
    if not result:
        logger.warning(f"Contact_mechanism_type not found for deletion: id={contact_mechanism_type_id}")
        raise HTTPException(status_code=404, detail="Contact mechanism type not found")
    logger.info(f"Deleted contact_mechanism_type: id={contact_mechanism_type_id}")
    return {"message": "Contact mechanism type deleted"}