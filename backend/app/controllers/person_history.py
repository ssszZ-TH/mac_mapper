from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.person_history import get_person_history, get_all_person_history
from app.schemas.person_history import PersonHistoryOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/person_history", tags=["person_history"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ดึงข้อมูล person_history ตาม ID
@router.get("/{history_id}", response_model=PersonHistoryOut)
async def get_person_history_endpoint(history_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["hr_admin", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get person_history by id={history_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to hr_admin or system_admin")
    result = await get_person_history(history_id)
    if not result:
        logger.warning(f"Person_history not found: id={history_id}")
        raise HTTPException(status_code=404, detail="Person history not found")
    logger.info(f"Retrieved person_history: id={history_id}")
    return result

# ดึงข้อมูล person_history ทั้งหมด
@router.get("/", response_model=List[PersonHistoryOut])
async def get_all_person_history_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["hr_admin", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all person_history by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to hr_admin or system_admin")
    results = await get_all_person_history()
    logger.info(f"Retrieved {len(results)} person_history records")
    return results