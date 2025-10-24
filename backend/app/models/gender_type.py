from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.gender_type import GenderTypeCreate, GenderTypeUpdate, GenderTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา gender_type ด้วย ID
async def get_gender_type(gender_type_id: int) -> Optional[GenderTypeOut]:
    query = "SELECT id, description FROM gender_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": gender_type_id})
    logger.info(f"Retrieved gender_type: id={gender_type_id}")
    return GenderTypeOut(**result._mapping) if result else None

# ค้นหา gender_type ด้วย description
async def get_gender_type_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM gender_types WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried gender_type with description {description}: {result}")
    return result

# ดึงข้อมูล gender_type ทั้งหมด
async def get_all_gender_types() -> List[GenderTypeOut]:
    query = "SELECT id, description FROM gender_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} gender_types")
    return [GenderTypeOut(**result._mapping) for result in results]

# สร้าง gender_type ใหม่
async def create_gender_type(gender_type: GenderTypeCreate) -> Optional[GenderTypeOut]:
    async with database.transaction():
        try:
            existing_gender_type = await get_gender_type_by_description(gender_type.description)
            if existing_gender_type:
                logger.warning(f"Attempt to create gender_type with existing description: {gender_type.description}")
                return None
            query = """
                INSERT INTO gender_types (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": gender_type.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created gender_type: description={gender_type.description}")
            return GenderTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating gender_type: {str(e)}")
            raise

# อัปเดตข้อมูล gender_type
async def update_gender_type(gender_type_id: int, gender_type: GenderTypeUpdate) -> Optional[GenderTypeOut]:
    async with database.transaction():
        values = {"id": gender_type_id}
        query_parts = []

        if gender_type.description is not None and gender_type.description != '':
            query_parts.append("description = :description")
            values["description"] = gender_type.description

        if not query_parts:
            logger.info(f"No fields to update for gender_type id={gender_type_id}")
            return None

        query = f"""
            UPDATE gender_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated gender_type: id={gender_type_id}")
        return GenderTypeOut(**result._mapping) if result else None

# ลบ gender_type
async def delete_gender_type(gender_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM gender_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": gender_type_id})
        logger.info(f"Deleted gender_type: id={gender_type_id}")
        return result["id"] if result else None