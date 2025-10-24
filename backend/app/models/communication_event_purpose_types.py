from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.communication_event_purpose_types import CommunicationEventPurposeTypeCreate, CommunicationEventPurposeTypeUpdate, CommunicationEventPurposeTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา communication_event_purpose_type ด้วย ID
async def get_communication_event_purpose_type(communication_event_purpose_type_id: int) -> Optional[CommunicationEventPurposeTypeOut]:
    query = "SELECT id, description FROM communication_event_purpose_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": communication_event_purpose_type_id})
    logger.info(f"Retrieved communication_event_purpose_type: id={communication_event_purpose_type_id}")
    return CommunicationEventPurposeTypeOut(**result._mapping) if result else None

# ค้นหา communication_event_purpose_type ด้วย description
async def get_communication_event_purpose_type_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM communication_event_purpose_types WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried communication_event_purpose_type with description {description}: {result}")
    return result

# ดึงข้อมูล communication_event_purpose_type ทั้งหมด
async def get_all_communication_event_purpose_types() -> List[CommunicationEventPurposeTypeOut]:
    query = "SELECT id, description FROM communication_event_purpose_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} communication_event_purpose_types")
    return [CommunicationEventPurposeTypeOut(**result._mapping) for result in results]

# สร้าง communication_event_purpose_type ใหม่
async def create_communication_event_purpose_type(communication_event_purpose_type: CommunicationEventPurposeTypeCreate) -> Optional[CommunicationEventPurposeTypeOut]:
    async with database.transaction():
        try:
            existing_communication_event_purpose_type = await get_communication_event_purpose_type_by_description(communication_event_purpose_type.description)
            if existing_communication_event_purpose_type:
                logger.warning(f"Attempt to create communication_event_purpose_type with existing description: {communication_event_purpose_type.description}")
                return None
            query = """
                INSERT INTO communication_event_purpose_types (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": communication_event_purpose_type.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created communication_event_purpose_type: description={communication_event_purpose_type.description}")
            return CommunicationEventPurposeTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating communication_event_purpose_type: {str(e)}")
            raise

# อัปเดตข้อมูล communication_event_purpose_type
async def update_communication_event_purpose_type(communication_event_purpose_type_id: int, communication_event_purpose_type: CommunicationEventPurposeTypeUpdate) -> Optional[CommunicationEventPurposeTypeOut]:
    async with database.transaction():
        values = {"id": communication_event_purpose_type_id}
        query_parts = []

        if communication_event_purpose_type.description is not None and communication_event_purpose_type.description != '':
            query_parts.append("description = :description")
            values["description"] = communication_event_purpose_type.description

        if not query_parts:
            logger.info(f"No fields to update for communication_event_purpose_type id={communication_event_purpose_type_id}")
            return None

        query = f"""
            UPDATE communication_event_purpose_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated communication_event_purpose_type: id={communication_event_purpose_type_id}")
        return CommunicationEventPurposeTypeOut(**result._mapping) if result else None

# ลบ communication_event_purpose_type
async def delete_communication_event_purpose_type(communication_event_purpose_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM communication_event_purpose_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": communication_event_purpose_type_id})
        logger.info(f"Deleted communication_event_purpose_type: id={communication_event_purpose_type_id}")
        return result["id"] if result else None