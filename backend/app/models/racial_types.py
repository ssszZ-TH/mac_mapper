from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.racial_types import RacialTypeCreate, RacialTypeUpdate, RacialTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา racial_type ด้วย ID
async def get_racial_type(racial_type_id: int) -> Optional[RacialTypeOut]:
    query = "SELECT id, description FROM racial_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": racial_type_id})
    logger.info(f"Retrieved racial_type: id={racial_type_id}")
    return RacialTypeOut(**result._mapping) if result else None

# ค้นหา racial_type ด้วย description
async def get_racial_type_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM racial_types WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried racial_type with description {description}: {result}")
    return result

# ดึงข้อมูล racial_type ทั้งหมด
async def get_all_racial_types() -> List[RacialTypeOut]:
    query = "SELECT id, description FROM racial_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} racial_types")
    return [RacialTypeOut(**result._mapping) for result in results]

# สร้าง racial_type ใหม่
async def create_racial_type(racial_type: RacialTypeCreate) -> Optional[RacialTypeOut]:
    async with database.transaction():
        try:
            existing_racial_type = await get_racial_type_by_description(racial_type.description)
            if existing_racial_type:
                logger.warning(f"Attempt to create racial_type with existing description: {racial_type.description}")
                return None
            query = """
                INSERT INTO racial_types (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": racial_type.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created racial_type: description={racial_type.description}")
            return RacialTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating racial_type: {str(e)}")
            raise

# อัปเดตข้อมูล racial_type
async def update_racial_type(racial_type_id: int, racial_type: RacialTypeUpdate) -> Optional[RacialTypeOut]:
    async with database.transaction():
        values = {"id": racial_type_id}
        query_parts = []

        if racial_type.description is not None and racial_type.description != '':
            query_parts.append("description = :description")
            values["description"] = racial_type.description

        if not query_parts:
            logger.info(f"No fields to update for racial_type id={racial_type_id}")
            return None

        query = f"""
            UPDATE racial_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated racial_type: id={racial_type_id}")
        return RacialTypeOut(**result._mapping) if result else None

# ลบ racial_type
async def delete_racial_type(racial_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM racial_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": racial_type_id})
        logger.info(f"Deleted racial_type: id={racial_type_id}")
        return result["id"] if result else None