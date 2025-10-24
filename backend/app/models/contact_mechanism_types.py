from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.contact_mechanism_types import ContactMechanismTypeCreate, ContactMechanismTypeUpdate, ContactMechanismTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา contact_mechanism_type ด้วย ID
async def get_contact_mechanism_type(contact_mechanism_type_id: int) -> Optional[ContactMechanismTypeOut]:
    query = "SELECT id, description FROM contact_mechanism_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": contact_mechanism_type_id})
    logger.info(f"Retrieved contact_mechanism_type: id={contact_mechanism_type_id}")
    return ContactMechanismTypeOut(**result._mapping) if result else None

# ค้นหา contact_mechanism_type ด้วย description
async def get_contact_mechanism_type_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM contact_mechanism_types WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried contact_mechanism_type with description {description}: {result}")
    return result

# ดึงข้อมูล contact_mechanism_type ทั้งหมด
async def get_all_contact_mechanism_types() -> List[ContactMechanismTypeOut]:
    query = "SELECT id, description FROM contact_mechanism_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} contact_mechanism_types")
    return [ContactMechanismTypeOut(**result._mapping) for result in results]

# สร้าง contact_mechanism_type ใหม่
async def create_contact_mechanism_type(contact_mechanism_type: ContactMechanismTypeCreate) -> Optional[ContactMechanismTypeOut]:
    async with database.transaction():
        try:
            existing_contact_mechanism_type = await get_contact_mechanism_type_by_description(contact_mechanism_type.description)
            if existing_contact_mechanism_type:
                logger.warning(f"Attempt to create contact_mechanism_type with existing description: {contact_mechanism_type.description}")
                return None
            query = """
                INSERT INTO contact_mechanism_types (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": contact_mechanism_type.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created contact_mechanism_type: description={contact_mechanism_type.description}")
            return ContactMechanismTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating contact_mechanism_type: {str(e)}")
            raise

# อัปเดตข้อมูล contact_mechanism_type
async def update_contact_mechanism_type(contact_mechanism_type_id: int, contact_mechanism_type: ContactMechanismTypeUpdate) -> Optional[ContactMechanismTypeOut]:
    async with database.transaction():
        values = {"id": contact_mechanism_type_id}
        query_parts = []

        if contact_mechanism_type.description is not None and contact_mechanism_type.description != '':
            query_parts.append("description = :description")
            values["description"] = contact_mechanism_type.description

        if not query_parts:
            logger.info(f"No fields to update for contact_mechanism_type id={contact_mechanism_type_id}")
            return None

        query = f"""
            UPDATE contact_mechanism_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated contact_mechanism_type: id={contact_mechanism_type_id}")
        return ContactMechanismTypeOut(**result._mapping) if result else None

# ลบ contact_mechanism_type
async def delete_contact_mechanism_type(contact_mechanism_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM contact_mechanism_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": contact_mechanism_type_id})
        logger.info(f"Deleted contact_mechanism_type: id={contact_mechanism_type_id}")
        return result["id"] if result else None