from app.config.database import database
import logging
from typing import List
from app.schemas.communication_event_history import CommunicationEventHistoryOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ดึงข้อมูล communication_event_history ตาม ID
async def get_communication_event_history(history_id: int) -> CommunicationEventHistoryOut:
    query = """
        SELECT id, communication_event_id, title, detail, from_user_id, to_user_id, 
               contact_mechanism_type_id, communication_event_status_type_id, favorite_flag, 
               action, action_at, action_by 
        FROM communication_event_history 
        WHERE id = :id
    """
    result = await database.fetch_one(query=query, values={"id": history_id})
    logger.info(f"Retrieved communication_event_history: id={history_id}")
    return CommunicationEventHistoryOut(**result._mapping) if result else None

# ดึงข้อมูล communication_event_history ทั้งหมด
async def get_all_communication_event_history() -> List[CommunicationEventHistoryOut]:
    query = """
        SELECT id, communication_event_id, title, detail, from_user_id, to_user_id, 
               contact_mechanism_type_id, communication_event_status_type_id, favorite_flag, 
               action, action_at, action_by 
        FROM communication_event_history 
        ORDER BY action_at DESC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} communication_event_history records")
    return [CommunicationEventHistoryOut(**result._mapping) for result in results]