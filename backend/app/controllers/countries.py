# app/controllers/countries.py
from fastapi import APIRouter, HTTPException
from typing import List
import logging
from app.models.countries import create_country, get_country, update_country, delete_country, get_all_countries
from app.schemas.countries import CountryCreate, CountryUpdate, CountryOut

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/countries", tags=["countries"])

# สร้าง country ใหม่ (ไม่ต้อง auth)
@router.post("/", response_model=CountryOut)
async def create_country_endpoint(country: CountryCreate):
    result = await create_country(country)
    if not result:
        logger.warning(f"Failed to create country: {country.iso_code}")
        raise HTTPException(status_code=400, detail="ISO code already exists")
    logger.info(f"Created country: id={result.id}")
    return result

# ดึงข้อมูล country ตาม ID
@router.get("/{country_id}", response_model=CountryOut)
async def get_country_endpoint(country_id: int):
    result = await get_country(country_id)
    if not result:
        logger.warning(f"Country not found: id={country_id}")
        raise HTTPException(status_code=404, detail="Country not found")
    logger.info(f"Retrieved country: id={country_id}")
    return result

# ดึงข้อมูล country ทั้งหมด
@router.get("/", response_model=List[CountryOut])
async def get_all_countries_endpoint():
    results = await get_all_countries()
    logger.info(f"Retrieved {len(results)} countries")
    return results

# อัปเดตข้อมูล country
@router.put("/{country_id}", response_model=CountryOut)
async def update_country_endpoint(country_id: int, country: CountryUpdate):
    result = await update_country(country_id, country)
    if not result:
        logger.warning(f"Country not found for update: id={country_id}")
        raise HTTPException(status_code=404, detail="Country not found")
    logger.info(f"Updated country: id={country_id}")
    return result

# ลบ country
@router.delete("/{country_id}")
async def delete_country_endpoint(country_id: int):
    result = await delete_country(country_id)
    if not result:
        logger.warning(f"Country not found for deletion: id={country_id}")
        raise HTTPException(status_code=404, detail="Country not found")
    logger.info(f"Deleted country: id={country_id}")
    return {"message": "Country deleted"}