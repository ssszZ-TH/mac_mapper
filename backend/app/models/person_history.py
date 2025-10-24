from app.config.database import database
import logging
from typing import List
from app.schemas.person_history import PersonHistoryOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ดึงข้อมูล person_history ตาม ID
async def get_person_history(history_id: int) -> PersonHistoryOut:
    query = """
        SELECT id, person_id, personal_id_number, first_name, middle_name, last_name, 
               nick_name, birth_date, gender_type_id, marital_status_type_id, country_id, 
               height, weight, racial_type_id, income_range_id, about_me, action, action_at, action_by 
        FROM person_history 
        WHERE id = :id
    """
    result = await database.fetch_one(query=query, values={"id": history_id})
    logger.info(f"Retrieved person_history: id={history_id}")
    return PersonHistoryOut(**result._mapping) if result else None

# ดึงข้อมูล person_history ทั้งหมด
async def get_all_person_history() -> List[PersonHistoryOut]:
    query = """
        SELECT id, person_id, personal_id_number, first_name, middle_name, last_name, 
               nick_name, birth_date, gender_type_id, marital_status_type_id, country_id, 
               height, weight, racial_type_id, income_range_id, about_me, action, action_at, action_by 
        FROM person_history 
        ORDER BY action_at DESC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} person_history records")
    return [PersonHistoryOut(**result._mapping) for result in results]