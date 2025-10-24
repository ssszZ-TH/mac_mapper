# app/controllers/mac_text.py
from fastapi import APIRouter, HTTPException
from typing import List
import logging
from app.models.mac_text import (
    create_mac_text, get_mac_text, update_mac_text,
    delete_mac_text, get_all_mac_text
)
from app.schemas.mac_text import MacTextCreate, MacTextUpdate, MacTextOut
from backend.app.schemas import mac_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mac-text", tags=["mac-text"])

@router.post("/", response_model=MacTextOut)
async def create(item: MacTextCreate):
    result = await create_mac_text(item)
    if not result:
        raise HTTPException(status_code=400, detail="MAC address already exists")
    return result

@router.get("/{mac_id}", response_model=MacTextOut)
async def read(mac_id: int):
    result = await get_mac_text(mac_id)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result

@router.get("/", response_model=List[MacTextOut])
async def list_all():
    return await get_all_mac_text()

@router.put("/{mac_id}", response_model=MacTextOut)
async def update(mac_id: int, item: MacTextUpdate):
    result = await update_mac_text(mac_id, item)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result

@router.delete("/{mac_id}")
async def delete(mac_id: int):
    result = await delete_mac_text(mac_id)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}