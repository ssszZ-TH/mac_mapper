from app.config.database import database
import logging
from typing import Optional, List
from datetime import datetime
from app.schemas.communication_event import CommunicationEventCreate, CommunicationEventUpdate, CommunicationEventOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# บันทึกประวัติการกระทำของ communication event
async def log_communication_event_history(
    communication_event_id: int,
    title: str,
    detail: Optional[str],
    from_user_id: int,
    to_user_id: int,
    contact_mechanism_type_id: Optional[int],
    communication_event_status_type_id: Optional[int],
    favorite_flag: bool,
    action: str,
    action_by: Optional[int] = None
):
    query = """
        INSERT INTO communication_event_history (
            communication_event_id, title, detail, from_user_id, to_user_id, 
            contact_mechanism_type_id, communication_event_status_type_id, 
            favorite_flag, action, action_by, action_at
        )
        VALUES (:communication_event_id, :title, :detail, :from_user_id, :to_user_id, 
                :contact_mechanism_type_id, :communication_event_status_type_id, 
                :favorite_flag, :action, :action_by, :action_at)
    """
    values = {
        "communication_event_id": communication_event_id,
        "title": title,
        "detail": detail,
        "from_user_id": from_user_id,
        "to_user_id": to_user_id,
        "contact_mechanism_type_id": contact_mechanism_type_id,
        "communication_event_status_type_id": communication_event_status_type_id,
        "favorite_flag": favorite_flag,
        "action": action,
        "action_by": action_by,
        "action_at": datetime.utcnow()
    }
    await database.execute(query=query, values=values)
    logger.info(f"Logged communication_event history: communication_event_id={communication_event_id}, action={action}, action_by={action_by}")

# ค้นหา communication event ด้วย ID
async def get_communication_event(communication_event_id: int) -> Optional[CommunicationEventOut]:
    query = """
        SELECT id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
               communication_event_status_type_id, favorite_flag, created_at, updated_at 
        FROM communication_event 
        WHERE id = :id
    """
    result = await database.fetch_one(query=query, values={"id": communication_event_id})
    logger.info(f"Retrieved communication_event: id={communication_event_id}")
    return CommunicationEventOut(**result._mapping) if result else None

# ดึงข้อมูล communication events ที่เกี่ยวข้องกับ user_id (ทั้งหมด)
async def get_user_communication_events(user_id: int) -> List[CommunicationEventOut]:
    query = """
        SELECT id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
               communication_event_status_type_id, favorite_flag, created_at, updated_at 
        FROM communication_event 
        WHERE from_user_id = :user_id OR to_user_id = :user_id
        ORDER BY created_at DESC
    """
    results = await database.fetch_all(query=query, values={"user_id": user_id})
    logger.info(f"Retrieved {len(results)} communication_events for user_id={user_id}")
    return [CommunicationEventOut(**result._mapping) for result in results]

# ดึงข้อมูล communication events ที่ user_id เป็นผู้รับ (inbox)
async def get_inbox_communication_events(user_id: int) -> List[CommunicationEventOut]:
    query = """
        SELECT id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
               communication_event_status_type_id, favorite_flag, created_at, updated_at 
        FROM communication_event 
        WHERE to_user_id = :user_id
        ORDER BY created_at DESC
    """
    results = await database.fetch_all(query=query, values={"user_id": user_id})
    logger.info(f"Retrieved {len(results)} inbox communication_events for user_id={user_id}")
    return [CommunicationEventOut(**result._mapping) for result in results]

# ดึงข้อมูล communication events ที่ user_id เป็นผู้ส่ง (sent)
async def get_sent_communication_events(user_id: int) -> List[CommunicationEventOut]:
    query = """
        SELECT id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
               communication_event_status_type_id, favorite_flag, created_at, updated_at 
        FROM communication_event 
        WHERE from_user_id = :user_id
        ORDER BY created_at DESC
    """
    results = await database.fetch_all(query=query, values={"user_id": user_id})
    logger.info(f"Retrieved {len(results)} sent communication_events for user_id={user_id}")
    return [CommunicationEventOut(**result._mapping) for result in results]

# ดึงข้อมูล communication events ที่ถูกตั้งค่า favorite_flag = True และเกี่ยวข้องกับ user_id
async def get_favorite_communication_events(user_id: int) -> List[CommunicationEventOut]:
    query = """
        SELECT id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
               communication_event_status_type_id, favorite_flag, created_at, updated_at 
        FROM communication_event 
        WHERE (from_user_id = :user_id OR to_user_id = :user_id) AND favorite_flag = TRUE
        ORDER BY created_at DESC
    """
    results = await database.fetch_all(query=query, values={"user_id": user_id})
    logger.info(f"Retrieved {len(results)} favorite communication_events for user_id={user_id}")
    return [CommunicationEventOut(**result._mapping) for result in results]

# สร้าง communication event ใหม่
async def create_communication_event(communication_event: CommunicationEventCreate, action_by: Optional[int] = None) -> Optional[CommunicationEventOut]:
    async with database.transaction():
        try:
            query = """
                INSERT INTO communication_event (title, detail, from_user_id, to_user_id, 
                                                contact_mechanism_type_id, communication_event_status_type_id, favorite_flag)
                VALUES (:title, :detail, :from_user_id, :to_user_id, :contact_mechanism_type_id, 
                        :communication_event_status_type_id, :favorite_flag)
                RETURNING id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
                          communication_event_status_type_id, favorite_flag, created_at, updated_at
            """
            values = {
                "title": communication_event.title,
                "detail": communication_event.detail,
                "from_user_id": action_by,
                "to_user_id": communication_event.to_user_id,
                "contact_mechanism_type_id": communication_event.contact_mechanism_type_id,
                "communication_event_status_type_id": communication_event.communication_event_status_type_id,
                "favorite_flag": False
            }
            result = await database.fetch_one(query=query, values=values)
            if result:
                await log_communication_event_history(
                    communication_event_id=result.id,
                    title=communication_event.title,
                    detail=communication_event.detail,
                    from_user_id=action_by,
                    to_user_id=communication_event.to_user_id,
                    contact_mechanism_type_id=communication_event.contact_mechanism_type_id,
                    communication_event_status_type_id=communication_event.communication_event_status_type_id,
                    favorite_flag=False,
                    action="create",
                    action_by=action_by
                )
                logger.info(f"Created communication_event: id={result['id']}")
                return CommunicationEventOut(**result._mapping)
            return None
        except Exception as e:
            logger.error(f"Error creating communication_event: {str(e)}")
            raise

# อัปเดตข้อมูล communication event
async def update_communication_event(communication_event_id: int, communication_event: CommunicationEventUpdate, action_by: Optional[int] = None) -> Optional[CommunicationEventOut]:
    async with database.transaction():
        old_data = await get_communication_event(communication_event_id)
        if not old_data:
            logger.warning(f"Communication event not found for update: id={communication_event_id}")
            return None

        values = {"id": communication_event_id}
        query_parts = []

        if communication_event.title is not None and communication_event.title != '':
            query_parts.append("title = :title")
            values["title"] = communication_event.title
        if communication_event.detail is not None:
            query_parts.append("detail = :detail")
            values["detail"] = communication_event.detail
        if communication_event.contact_mechanism_type_id is not None:
            query_parts.append("contact_mechanism_type_id = :contact_mechanism_type_id")
            values["contact_mechanism_type_id"] = communication_event.contact_mechanism_type_id
        if communication_event.communication_event_status_type_id is not None:
            query_parts.append("communication_event_status_type_id = :communication_event_status_type_id")
            values["communication_event_status_type_id"] = communication_event.communication_event_status_type_id
        if communication_event.favorite_flag is not None:
            query_parts.append("favorite_flag = :favorite_flag")
            values["favorite_flag"] = communication_event.favorite_flag

        if not query_parts:
            logger.info(f"No fields to update for communication_event id={communication_event_id}")
            return None

        query = f"""
            UPDATE communication_event
            SET {', '.join(query_parts)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, 
                      communication_event_status_type_id, favorite_flag, created_at, updated_at
        """
        result = await database.fetch_one(query=query, values=values)
        if result:
            await log_communication_event_history(
                communication_event_id=communication_event_id,
                title=communication_event.title if communication_event.title and communication_event.title != '' else old_data.title,
                detail=communication_event.detail if communication_event.detail is not None else old_data.detail,
                from_user_id=old_data.from_user_id,
                to_user_id=old_data.to_user_id,
                contact_mechanism_type_id=communication_event.contact_mechanism_type_id if communication_event.contact_mechanism_type_id is not None else old_data.contact_mechanism_type_id,
                communication_event_status_type_id=communication_event.communication_event_status_type_id if communication_event.communication_event_status_type_id is not None else old_data.communication_event_status_type_id,
                favorite_flag=communication_event.favorite_flag if communication_event.favorite_flag is not None else old_data.favorite_flag,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated communication_event: id={communication_event_id}")
            return CommunicationEventOut(**result._mapping)
        return None

# ลบ communication event
async def delete_communication_event(communication_event_id: int, action_by: Optional[int] = None) -> Optional[int]:
    async with database.transaction():
        old_data = await get_communication_event(communication_event_id)
        if not old_data:
            logger.warning(f"Communication event not found for deletion: id={communication_event_id}")
            return None

        await log_communication_event_history(
            communication_event_id=communication_event_id,
            title=old_data.title,
            detail=old_data.detail,
            from_user_id=old_data.from_user_id,
            to_user_id=old_data.to_user_id,
            contact_mechanism_type_id=old_data.contact_mechanism_type_id,
            communication_event_status_type_id=old_data.communication_event_status_type_id,
            favorite_flag=old_data.favorite_flag,
            action="delete",
            action_by=action_by
        )

        query = "DELETE FROM communication_event WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": communication_event_id})
        logger.info(f"Deleted communication_event: id={communication_event_id}")
        return result["id"] if result else None