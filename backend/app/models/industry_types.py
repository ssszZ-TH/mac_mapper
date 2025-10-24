from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.industry_types import IndustryTypeCreate, IndustryTypeUpdate, IndustryTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา industry_type ด้วย ID
async def get_industry_type(industry_type_id: int) -> Optional[IndustryTypeOut]:
    query = "SELECT id, naisc, description FROM industry_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": industry_type_id})
    logger.info(f"Retrieved industry_type: id={industry_type_id}")
    return IndustryTypeOut(**result._mapping) if result else None

# ค้นหา industry_type ด้วย naisc
async def get_industry_type_by_naisc(naisc: str) -> Optional[dict]:
    query = "SELECT id, naisc, description FROM industry_types WHERE naisc = :naisc"
    result = await database.fetch_one(query=query, values={"naisc": naisc})
    logger.info(f"Queried industry_type with naisc {naisc}: {result}")
    return result

# ดึงข้อมูล industry_type ทั้งหมด
async def get_all_industry_types() -> List[IndustryTypeOut]:
    query = "SELECT id, naisc, description FROM industry_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} industry_types")
    return [IndustryTypeOut(**result._mapping) for result in results]

# สร้าง industry_type ใหม่
async def create_industry_type(industry_type: IndustryTypeCreate) -> Optional[IndustryTypeOut]:
    async with database.transaction():
        try:
            existing_industry_type = await get_industry_type_by_naisc(industry_type.naisc)
            if existing_industry_type:
                logger.warning(f"Attempt to create industry_type with existing naisc: {industry_type.naisc}")
                return None
            query = """
                INSERT INTO industry_types (naisc, description)
                VALUES (:naisc, :description)
                RETURNING id, naisc, description
            """
            values = {
                "naisc": industry_type.naisc,
                "description": industry_type.description
            }
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created industry_type: naisc={industry_type.naisc}")
            return IndustryTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating industry_type: {str(e)}")
            raise

# อัปเดตข้อมูล industry_type
async def update_industry_type(industry_type_id: int, industry_type: IndustryTypeUpdate) -> Optional[IndustryTypeOut]:
    async with database.transaction():
        values = {"id": industry_type_id}
        query_parts = []

        if industry_type.naisc is not None and industry_type.naisc != '':
            query_parts.append("naisc = :naisc")
            values["naisc"] = industry_type.naisc
        if industry_type.description is not None and industry_type.description != '':
            query_parts.append("description = :description")
            values["description"] = industry_type.description

        if not query_parts:
            logger.info(f"No fields to update for industry_type id={industry_type_id}")
            return None

        query = f"""
            UPDATE industry_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, naisc, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated industry_type: id={industry_type_id}")
        return IndustryTypeOut(**result._mapping) if result else None

# ลบ industry_type
async def delete_industry_type(industry_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM industry_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": industry_type_id})
        logger.info(f"Deleted industry_type: id={industry_type_id}")
        return result["id"] if result else None