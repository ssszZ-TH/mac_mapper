from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.communication_event_status_types import create_communication_event_status_type, get_communication_event_status_type, update_communication_event_status_type, delete_communication_event_status_type, get_all_communication_event_status_types
from app.schemas.communication_event_status_types import CommunicationEventStatusTypeCreate, CommunicationEventStatusTypeUpdate, CommunicationEventStatusTypeOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/communication_event_status_types", tags=["communication_event_status_types"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง communication_event_status_type ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=CommunicationEventStatusTypeOut)
async def create_communication_event_status_type_endpoint(communication_event_status_type: CommunicationEventStatusTypeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create communication_event_status_type by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_communication_event_status_type(communication_event_status_type)
    if not result:
        logger.warning(f"Failed to create communication_event_status_type: {communication_event_status_type.description}")
        raise HTTPException(status_code=400, detail="Description already exists")
    logger.info(f"Created communication_event_status_type: id={result.id}")
    return result

# ดึงข้อมูล communication_event_status_type ตาม ID
@router.get("/{communication_event_status_type_id}", response_model=CommunicationEventStatusTypeOut)
async def get_communication_event_status_type_endpoint(communication_event_status_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get communication_event_status_type by id={communication_event_status_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_communication_event_status_type(communication_event_status_type_id)
    if not result:
        logger.warning(f"Communication_event_status_type not found: id={communication_event_status_type_id}")
        raise HTTPException(status_code=404, detail="Communication event status type not found")
    logger.info(f"Retrieved communication_event_status_type: id={communication_event_status_type_id}")
    return result

# ดึงข้อมูล communication_event_status_type ทั้งหมด
@router.get("/", response_model=List[CommunicationEventStatusTypeOut])
async def get_all_communication_event_status_types_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all communication_event_status_types by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_communication_event_status_types()
    logger.info(f"Retrieved {len(results)} communication_event_status_types")
    return results

# อัปเดตข้อมูล communication_event_status_type (basetype_admin เท่านั้น)
@router.put("/{communication_event_status_type_id}", response_model=CommunicationEventStatusTypeOut)
async def update_communication_event_status_type_endpoint(communication_event_status_type_id: int, communication_event_status_type: CommunicationEventStatusTypeUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update communication_event_status_type by id={communication_event_status_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_communication_event_status_type(communication_event_status_type_id, communication_event_status_type)
    if not result:
        logger.warning(f"Communication_event_status_type not found for update: id={communication_event_status_type_id}")
        raise HTTPException(status_code=404, detail="Communication event status type not found")
    logger.info(f"Updated communication_event_status_type: id={communication_event_status_type_id}")
    return result

# ลบ communication_event_status_type (basetype_admin เท่านั้น)
@router.delete("/{communication_event_status_type_id}")
async def delete_communication_event_status_type_endpoint(communication_event_status_type_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete communication_event_status_type by id={communication_event_status_type_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_communication_event_status_type(communication_event_status_type_id)
    if not result:
        logger.warning(f"Communication_event_status_type not found for deletion: id={communication_event_status_type_id}")
        raise HTTPException(status_code=404, detail="Communication event status type not found")
    logger.info(f"Deleted communication_event_status_type: id={communication_event_status_type_id}")
    return {"message": "Communication event status type deleted"}