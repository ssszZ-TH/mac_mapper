from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.users_history import get_users_history, get_all_users_history
from app.schemas.users_history import UsersHistoryOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users_history", tags=["users_history"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ดึงข้อมูล users_history ตาม ID
@router.get("/{history_id}", response_model=UsersHistoryOut)
async def get_users_history_endpoint(history_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["system_admin"]:
        logger.warning(f"Unauthorized attempt to get users_history by id={history_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to system_admin")
    result = await get_users_history(history_id)
    if not result:
        logger.warning(f"Users_history not found: id={history_id}")
        raise HTTPException(status_code=404, detail="Users history not found")
    logger.info(f"Retrieved users_history: id={history_id}")
    return result

# ดึงข้อมูล users_history ทั้งหมด
@router.get("/", response_model=List[UsersHistoryOut])
async def get_all_users_history_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["system_admin"]:
        logger.warning(f"Unauthorized attempt to list all users_history by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to system_admin")
    results = await get_all_users_history()
    logger.info(f"Retrieved {len(results)} users_history records")
    return results