from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.marital_status_types import MaritalStatusTypeCreate, MaritalStatusTypeUpdate, MaritalStatusTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา marital_status_type ด้วย ID
async def get_marital_status_type(marital_status_type_id: int) -> Optional[MaritalStatusTypeOut]:
    query = "SELECT id, description FROM marital_status_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": marital_status_type_id})
    logger.info(f"Retrieved marital_status_type: id={marital_status_type_id}")
    return MaritalStatusTypeOut(**result._mapping) if result else None

# ค้นหา marital_status_type ด้วย description
async def get_marital_status_type_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM marital_status_types WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried marital_status_type with description {description}: {result}")
    return result

# ดึงข้อมูล marital_status_type ทั้งหมด
async def get_all_marital_status_types() -> List[MaritalStatusTypeOut]:
    query = "SELECT id, description FROM marital_status_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} marital_status_types")
    return [MaritalStatusTypeOut(**result._mapping) for result in results]

# สร้าง marital_status_type ใหม่
async def create_marital_status_type(marital_status_type: MaritalStatusTypeCreate) -> Optional[MaritalStatusTypeOut]:
    async with database.transaction():
        try:
            existing_marital_status_type = await get_marital_status_type_by_description(marital_status_type.description)
            if existing_marital_status_type:
                logger.warning(f"Attempt to create marital_status_type with existing description: {marital_status_type.description}")
                return None
            query = """
                INSERT INTO marital_status_types (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": marital_status_type.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created marital_status_type: description={marital_status_type.description}")
            return MaritalStatusTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating marital_status_type: {str(e)}")
            raise

# อัปเดตข้อมูล marital_status_type
async def update_marital_status_type(marital_status_type_id: int, marital_status_type: MaritalStatusTypeUpdate) -> Optional[MaritalStatusTypeOut]:
    async with database.transaction():
        values = {"id": marital_status_type_id}
        query_parts = []

        if marital_status_type.description is not None and marital_status_type.description != '':
            query_parts.append("description = :description")
            values["description"] = marital_status_type.description

        if not query_parts:
            logger.info(f"No fields to update for marital_status_type id={marital_status_type_id}")
            return None

        query = f"""
            UPDATE marital_status_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated marital_status_type: id={marital_status_type_id}")
        return MaritalStatusTypeOut(**result._mapping) if result else None

# ลบ marital_status_type
async def delete_marital_status_type(marital_status_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM marital_status_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": marital_status_type_id})
        logger.info(f"Deleted marital_status_type: id={marital_status_type_id}")
        return result["id"] if result else None