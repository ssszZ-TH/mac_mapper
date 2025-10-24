# app/models/mac_text.py
from app.config.database import database
import logging
from typing import Optional, List
from app.schemas.mac_text import MacTextCreate, MacTextUpdate, MacTextOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_mac_text(mac_id: int) -> Optional[MacTextOut]:
    query = "SELECT id, mac_address, description FROM mac_text WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": mac_id})
    return MacTextOut(**result._mapping) if result else None

async def get_mac_text_by_mac(mac_address: str) -> Optional[dict]:
    query = "SELECT id FROM mac_text WHERE mac_address = :mac_address"
    result = await database.fetch_one(query=query, values={"mac_address": mac_address})
    return result

async def get_all_mac_text() -> List[MacTextOut]:
    query = "SELECT id, mac_address, description FROM mac_text ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    return [MacTextOut(**r._mapping) for r in results]

async def create_mac_text(item: MacTextCreate) -> Optional[MacTextOut]:
    async with database.transaction():
        try:
            if await get_mac_text_by_mac(item.mac_address):
                return None
            query = """
                INSERT INTO mac_text (mac_address, description)
                VALUES (:mac_address, :description)
                RETURNING id, mac_address, description
            """
            result = await database.fetch_one(query=query, values=item.dict())
            return MacTextOut(**result._mapping) if result else None
        except Exception as e:
            logger.error(f"Create error: {e}")
            raise

async def update_mac_text(mac_id: int, item: MacTextUpdate) -> Optional[MacTextOut]:
    async with database.transaction():
        values = {"id": mac_id}
        parts = []

        if item.mac_address is not None:
            parts.append("mac_address = :mac_address")
            values["mac_address"] = item.mac_address
        if item.description is not None:
            parts.append("description = :description")
            values["description"] = item.description

        if not parts:
            return None

        query = f"""
            UPDATE mac_text SET {', '.join(parts)}
            WHERE id = :id
            RETURNING id, mac_address, description
        """
        result = await database.fetch_one(query=query, values=values)
        return MacTextOut(**result._mapping) if result else None

async def delete_mac_text(mac_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM mac_text WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": mac_id})
        return result["id"] if result else None
    
# app/models/mac_text.py (เพิ่ม)
async def get_description_by_mac(mac_address: str) -> Optional[str]:
    query = "SELECT description FROM mac_text WHERE mac_address = :mac_address"
    result = await database.fetch_one(query=query, values={"mac_address": mac_address})
    return result["description"] if result else None