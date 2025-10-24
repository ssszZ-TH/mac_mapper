from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.organization_history import get_organization_history, get_all_organization_history
from app.schemas.organization_history import OrganizationHistoryOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/organization_history", tags=["organization_history"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ดึงข้อมูล organization_history ตาม ID
@router.get("/{history_id}", response_model=OrganizationHistoryOut)
async def get_organization_history_endpoint(history_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["organization_admin", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get organization_history by id={history_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to organization_admin or system_admin")
    result = await get_organization_history(history_id)
    if not result:
        logger.warning(f"Organization_history not found: id={history_id}")
        raise HTTPException(status_code=404, detail="Organization history not found")
    logger.info(f"Retrieved organization_history: id={history_id}")
    return result

# ดึงข้อมูล organization_history ทั้งหมด
@router.get("/", response_model=List[OrganizationHistoryOut])
async def get_all_organization_history_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["organization_admin", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all organization_history by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to organization_admin or system_admin")
    results = await get_all_organization_history()
    logger.info(f"Retrieved {len(results)} organization_history records")
    return results