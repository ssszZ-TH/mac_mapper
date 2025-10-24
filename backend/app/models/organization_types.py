from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.organization_types import OrganizationTypeCreate, OrganizationTypeUpdate, OrganizationTypeOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา organization_type ด้วย ID
async def get_organization_type(organization_type_id: int) -> Optional[OrganizationTypeOut]:
    query = "SELECT id, description FROM organization_types WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": organization_type_id})
    logger.info(f"Retrieved organization_type: id={organization_type_id}")
    return OrganizationTypeOut(**result._mapping) if result else None

# ค้นหา organization_type ด้วย description
async def get_organization_type_by_description(description: str) -> Optional[dict]:
    query = "SELECT id, description FROM organization_types WHERE description = :description"
    result = await database.fetch_one(query=query, values={"description": description})
    logger.info(f"Queried organization_type with description {description}: {result}")
    return result

# ดึงข้อมูล organization_type ทั้งหมด
async def get_all_organization_types() -> List[OrganizationTypeOut]:
    query = "SELECT id, description FROM organization_types ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} organization_types")
    return [OrganizationTypeOut(**result._mapping) for result in results]

# สร้าง organization_type ใหม่
async def create_organization_type(organization_type: OrganizationTypeCreate) -> Optional[OrganizationTypeOut]:
    async with database.transaction():
        try:
            existing_organization_type = await get_organization_type_by_description(organization_type.description)
            if existing_organization_type:
                logger.warning(f"Attempt to create organization_type with existing description: {organization_type.description}")
                return None
            query = """
                INSERT INTO organization_types (description)
                VALUES (:description)
                RETURNING id, description
            """
            values = {"description": organization_type.description}
            result = await database.fetch_one(query=query, values=values)
            logger.info(f"Created organization_type: description={organization_type.description}")
            return OrganizationTypeOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Error creating organization_type: {str(e)}")
            raise

# อัปเดตข้อมูล organization_type
async def update_organization_type(organization_type_id: int, organization_type: OrganizationTypeUpdate) -> Optional[OrganizationTypeOut]:
    async with database.transaction():
        values = {"id": organization_type_id}
        query_parts = []

        if organization_type.description is not None and organization_type.description != '':
            query_parts.append("description = :description")
            values["description"] = organization_type.description

        if not query_parts:
            logger.info(f"No fields to update for organization_type id={organization_type_id}")
            return None

        query = f"""
            UPDATE organization_types
            SET {', '.join(query_parts)}
            WHERE id = :id
            RETURNING id, description
        """
        result = await database.fetch_one(query=query, values=values)
        logger.info(f"Updated organization_type: id={organization_type_id}")
        return OrganizationTypeOut(**result._mapping) if result else None

# ลบ organization_type
async def delete_organization_type(organization_type_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM organization_types WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": organization_type_id})
        logger.info(f"Deleted organization_type: id={organization_type_id}")
        return result["id"] if result else None