from app.config.database import database
import logging
from typing import List
from app.schemas.organization_history import OrganizationHistoryOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ดึงข้อมูล organization_history ตาม ID
async def get_organization_history(history_id: int) -> OrganizationHistoryOut:
    query = """
        SELECT id, organization_id, federal_tax_id, name_en, name_th, organization_type_id, 
               industry_type_id, employee_count, slogan, action, action_at, action_by 
        FROM organization_history 
        WHERE id = :id
    """
    result = await database.fetch_one(query=query, values={"id": history_id})
    logger.info(f"Retrieved organization_history: id={history_id}")
    return OrganizationHistoryOut(**result._mapping) if result else None

# ดึงข้อมูล organization_history ทั้งหมด
async def get_all_organization_history() -> List[OrganizationHistoryOut]:
    query = """
        SELECT id, organization_id, federal_tax_id, name_en, name_th, organization_type_id, 
               industry_type_id, employee_count, slogan, action, action_at, action_by 
        FROM organization_history 
        ORDER BY action_at DESC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} organization_history records")
    return [OrganizationHistoryOut(**result._mapping) for result in results]