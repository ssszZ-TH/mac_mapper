from app.config.database import database
import logging
from typing import List
from app.schemas.users_history import UsersHistoryOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ดึงข้อมูล users_history ตาม ID
async def get_users_history(history_id: int) -> UsersHistoryOut:
    query = """
        SELECT id, user_id, username, password, email, role, action, action_at, action_by 
        FROM users_history 
        WHERE id = :id
    """
    result = await database.fetch_one(query=query, values={"id": history_id})
    logger.info(f"Retrieved users_history: id={history_id}")
    return UsersHistoryOut(**result._mapping) if result else None

# ดึงข้อมูล users_history ทั้งหมด
async def get_all_users_history() -> List[UsersHistoryOut]:
    query = """
        SELECT id, user_id, username, password, email, role, action, action_at, action_by 
        FROM users_history 
        ORDER BY action_at DESC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} users_history records")
    return [UsersHistoryOut(**result._mapping) for result in results]