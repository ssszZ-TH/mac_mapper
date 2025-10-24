from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.income_ranges import IncomeRangeCreate, IncomeRangeUpdate, IncomeRangeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา income_range ด้วย ID
async def get_income_range(income_range_id: int) -> Optional[IncomeRangeOut]:
    query = "SELECT id, description FROM income_ranges WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": income_range_id})
    logger.info(f"Retrieved income_range: id={income_range_id}")
    return IncomeRangeOut(**result._mapping) if result else None

# ค้นหา income_range ด้วย description
async def get_income_range_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM income_ranges WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried income_range with description {description}: {result}")
    return result

# ดึงข้อมูล income_range ทั้งหมด
async def get_all_income_ranges() -> List[IncomeRangeOut]:
    query = "SELECT id, description FROM income_ranges ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} income_ranges")
    return [IncomeRangeOut(**result._mapping) for result in results]

# สร้าง income_range ใหม่
async def create_income_range(income_range: IncomeRangeCreate) -> Optional[IncomeRangeOut]:
    async with database.transaction():
        try:
            existing_income_range = await get_income_range_by_description(income_range.description)
            if existing_income_range:
                logger.warning(f"Attempt to create income_range with existing description: {income_range.description}")
                return None
            query = """
                INSERT INTO income_ranges (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": income_range.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created income_range: description={income_range.description}")
            return IncomeRangeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating income_range: {str(e)}")
            raise

# อัปเดตข้อมูล income_range
async def update_income_range(income_range_id: int, income_range: IncomeRangeUpdate) -> Optional[IncomeRangeOut]:
    async with database.transaction():
        values = {"id": income_range_id}
        query_parts = []

        if income_range.description is not None and income_range.description != '':
            query_parts.append("description = :description")
            values["description"] = income_range.description

        if not query_parts:
            logger.info(f"No fields to update for income_range id={income_range_id}")
            return None

        query = f"""
            UPDATE income_ranges
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated income_range: id={income_range_id}")
        return IncomeRangeOut(**result._mapping) if result else None

# ลบ income_range
async def delete_income_range(income_range_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM income_ranges WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": income_range_id})
        logger.info(f"Deleted income_range: id={income_range_id}")
        return result["id"] if result else None