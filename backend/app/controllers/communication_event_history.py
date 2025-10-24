from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.communication_event_history import get_communication_event_history, get_all_communication_event_history
from app.schemas.communication_event_history import CommunicationEventHistoryOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/communication_event_history", tags=["communication_event_history"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ดึงข้อมูล communication_event_history ตาม ID
@router.get("/{history_id:int}", response_model=CommunicationEventHistoryOut)
async def get_communication_event_history_endpoint(history_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["system_admin", "hr_admin", "organization_admin"]:
        logger.warning(f"Unauthorized attempt to get communication_event_history by id={history_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to system_admin, hr_admin, or organization_admin")
    result = await get_communication_event_history(history_id)
    if not result:
        logger.warning(f"Communication_event_history not found: id={history_id}")
        raise HTTPException(status_code=404, detail="Communication event history not found")
    logger.info(f"Retrieved communication_event_history: id={history_id}")
    return result

# ดึงข้อมูล communication_event_history ทั้งหมด
@router.get("/", response_model=List[CommunicationEventHistoryOut])
async def get_all_communication_event_history_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["system_admin", "hr_admin", "organization_admin"]:
        logger.warning(f"Unauthorized attempt to list all communication_event_history by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to system_admin, hr_admin, or organization_admin")
    results = await get_all_communication_event_history()
    logger.info(f"Retrieved {len(results)} communication_event_history records")
    return results