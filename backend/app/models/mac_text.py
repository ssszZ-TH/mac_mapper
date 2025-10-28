# backend/app/models/mac_text.py
from app.config.database import database
from app.config.settings import SECRET_KEY, ALGORITHM
import logging
from typing import Optional, List
from app.schemas.mac_text import MacTextCreate, MacTextUpdate, MacTextOut
from jose import jwt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_mac_text(mac_id: int) -> Optional[MacTextOut]:
    query = """
        SELECT id, mac_address, sensor_code, sensor_name, created_at, updated_at 
        FROM mac_text WHERE id = :id
    """
    result = await database.fetch_one(query=query, values={"id": mac_id})
    return MacTextOut(**result._mapping) if result else None

async def get_mac_text_by_mac(mac_address: str) -> Optional[dict]:
    query = "SELECT id FROM mac_text WHERE mac_address = :mac_address"
    result = await database.fetch_one(query=query, values={"mac_address": mac_address})
    return result

async def get_mac_text_by_sensor_code(sensor_code: str) -> Optional[dict]:
    query = "SELECT id FROM mac_text WHERE sensor_code = :sensor_code"
    result = await database.fetch_one(query=query, values={"sensor_code": sensor_code})
    return result

async def get_all_mac_text() -> List[MacTextOut]:
    query = """
        SELECT id, mac_address, sensor_code, sensor_name, created_at, updated_at 
        FROM mac_text 
        ORDER BY sensor_code ASC
    """
    results = await database.fetch_all(query=query)
    return [MacTextOut(**r._mapping) for r in results]

async def create_mac_text(item: MacTextCreate) -> Optional[MacTextOut]:
    async with database.transaction():
        try:
            if await get_mac_text_by_mac(item.mac_address):
                return None
            if await get_mac_text_by_sensor_code(item.sensor_code):
                return None
            
            query = """
                INSERT INTO mac_text (mac_address, sensor_code, sensor_name)
                VALUES (:mac_address, :sensor_code, :sensor_name)
                RETURNING id, mac_address, sensor_code, sensor_name, created_at, updated_at
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
        if item.sensor_code is not None:
            parts.append("sensor_code = :sensor_code")
            values["sensor_code"] = item.sensor_code
        if item.sensor_name is not None:
            parts.append("sensor_name = :sensor_name")
            values["sensor_name"] = item.sensor_name

        if not parts:
            return None

        parts.append("updated_at = NOW() AT TIME ZONE 'Asia/Bangkok'")
        
        query = f"""
            UPDATE mac_text 
            SET {', '.join(parts)}
            WHERE id = :id
            RETURNING id, mac_address, sensor_code, sensor_name, created_at, updated_at
        """
        result = await database.fetch_one(query=query, values=values)
        return MacTextOut(**result._mapping) if result else None

async def delete_mac_text(mac_id: int) -> Optional[int]:
    async with database.transaction():
        query = "DELETE FROM mac_text WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": mac_id})
        return result["id"] if result else None

async def get_sensor_info_by_mac(mac_address: str) -> Optional[dict]:
    query = "SELECT sensor_name, sensor_code FROM mac_text WHERE mac_address = :mac_address"
    result = await database.fetch_one(query=query, values={"mac_address": mac_address})
    return result

def generate_token_from_mac(mac_address: str) -> str:
    payload = {"mac": mac_address}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)