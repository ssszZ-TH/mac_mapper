from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.communication_event import create_communication_event, get_communication_event, update_communication_event, delete_communication_event, get_user_communication_events, get_inbox_communication_events, get_sent_communication_events, get_favorite_communication_events
from app.schemas.communication_event import CommunicationEventCreate, CommunicationEventUpdate, CommunicationEventOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/communication_events", tags=["communication_events"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง communication event ใหม่ (ทุก role ที่มี JWT สามารถใช้งานได้)
@router.post("/", response_model=CommunicationEventOut)
async def create_communication_event_endpoint(communication_event: CommunicationEventCreate, current_user: dict = Depends(get_current_user)):
    # อนุญาตให้ทุก role ที่ผ่านการ authenticate สร้าง communication event ได้
    result = await create_communication_event(communication_event, action_by=current_user["id"])
    if not result:
        logger.warning(f"Failed to create communication_event: title={communication_event.title}")
        raise HTTPException(status_code=400, detail="Invalid data or referenced IDs not found")
    logger.info(f"Created communication_event: id={result.id}, from_user_id={current_user['id']}")
    return result

# ดึงข้อมูล communication events ที่เกี่ยวข้องกับ current_user (ทั้งหมด)
@router.get("/", response_model=List[CommunicationEventOut])
async def get_user_communication_events_endpoint(current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี from_user_id หรือ to_user_id ตรงกับ current_user
    results = await get_user_communication_events(current_user["id"])
    logger.info(f"Retrieved {len(results)} communication_events for user: id={current_user['id']}")
    return results

# ดึงข้อมูล communication events ที่ current_user เป็นผู้รับ (inbox)
@router.get("/inbox", response_model=List[CommunicationEventOut])
async def get_inbox_communication_events_endpoint(current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี to_user_id ตรงกับ current_user
    results = await get_inbox_communication_events(current_user["id"])
    logger.info(f"Retrieved {len(results)} inbox communication_events for user: id={current_user['id']}")
    return results

# ดึงข้อมูล communication events ที่ current_user เป็นผู้ส่ง (sent)
@router.get("/sent", response_model=List[CommunicationEventOut])
async def get_sent_communication_events_endpoint(current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี from_user_id ตรงกับ current_user
    results = await get_sent_communication_events(current_user["id"])
    logger.info(f"Retrieved {len(results)} sent communication_events for user: id={current_user['id']}")
    return results

# ดึงข้อมูล communication events ที่ถูกตั้งค่า favorite_flag = True และเกี่ยวข้องกับ current_user
@router.get("/favorites", response_model=List[CommunicationEventOut])
async def get_favorite_communication_events_endpoint(current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี from_user_id หรือ to_user_id ตรงกับ current_user และ favorite_flag = True
    results = await get_favorite_communication_events(current_user["id"])
    logger.info(f"Retrieved {len(results)} favorite communication_events for user: id={current_user['id']}")
    return results

# ดึงข้อมูล communication event ตาม ID (อนุญาตเฉพาะ from_user_id หรือ to_user_id เท่ากับ current_user)
@router.get("/{communication_event_id:int}", response_model=CommunicationEventOut)
async def get_communication_event_endpoint(communication_event_id: int, current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี from_user_id หรือ to_user_id ตรงกับ current_user
    result = await get_communication_event(communication_event_id)
    if not result:
        logger.warning(f"Communication event not found: id={communication_event_id}")
        raise HTTPException(status_code=404, detail="Communication event not found")
    if result.from_user_id != current_user["id"] and result.to_user_id != current_user["id"]:
        logger.warning(f"Unauthorized attempt to get communication_event id={communication_event_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to sender or recipient")
    logger.info(f"Retrieved communication_event: id={communication_event_id}")
    return result

# อัปเดตข้อมูล communication event (อนุญาตเฉพาะ from_user_id หรือ to_user_id เท่ากับ current_user)
@router.put("/{communication_event_id:int}", response_model=CommunicationEventOut)
async def update_communication_event_endpoint(communication_event_id: int, communication_event: CommunicationEventUpdate, current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี from_user_id หรือ to_user_id ตรงกับ current_user
    existing_event = await get_communication_event(communication_event_id)
    if not existing_event:
        logger.warning(f"Communication event not found for update: id={communication_event_id}")
        raise HTTPException(status_code=404, detail="Communication event not found")
    if existing_event.from_user_id != current_user["id"] and existing_event.to_user_id != current_user["id"]:
        logger.warning(f"Unauthorized attempt to update communication_event id={communication_event_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to sender or recipient")
    result = await update_communication_event(communication_event_id, communication_event, action_by=current_user["id"])
    if not result:
        logger.warning(f"Failed to update communication_event: id={communication_event_id}")
        raise HTTPException(status_code=400, detail="Invalid data or referenced IDs not found")
    logger.info(f"Updated communication_event: id={communication_event_id}")
    return result

# ลบ communication event (อนุญาตเฉพาะ from_user_id หรือ to_user_id เท่ากับ current_user)
@router.delete("/{communication_event_id:int}")
async def delete_communication_event_endpoint(communication_event_id: int, current_user: dict = Depends(get_current_user)):
    # อนุญาตทุก role ที่มี from_user_id หรือ to_user_id ตรงกับ current_user
    existing_event = await get_communication_event(communication_event_id)
    if not existing_event:
        logger.warning(f"Communication event not found for deletion: id={communication_event_id}")
        raise HTTPException(status_code=404, detail="Communication event not found")
    if existing_event.from_user_id != current_user["id"] and existing_event.to_user_id != current_user["id"]:
        logger.warning(f"Unauthorized attempt to delete communication_event id={communication_event_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to sender or recipient")
    result = await delete_communication_event(communication_event_id, action_by=current_user["id"])
    if not result:
        logger.warning(f"Communication event not found for deletion: id={communication_event_id}")
        raise HTTPException(status_code=404, detail="Communication event not found")
    logger.info(f"Deleted communication_event: id={communication_event_id}")
    return {"message": "Communication event deleted"}