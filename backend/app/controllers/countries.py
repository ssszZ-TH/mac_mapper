from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.countries import create_country, get_country, update_country, delete_country, get_all_countries
from app.schemas.countries import CountryCreate, CountryUpdate, CountryOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/countries", tags=["countries"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง country ใหม่ (basetype_admin เท่านั้น)
@router.post("/", response_model=CountryOut)
async def create_country_endpoint(country: CountryCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to create country by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await create_country(country)
    if not result:
        logger.warning(f"Failed to create country: {country.iso_code}")
        raise HTTPException(status_code=400, detail="ISO code already exists")
    logger.info(f"Created country: id={result.id}")
    return result

# ดึงข้อมูล country ตาม ID
@router.get("/{country_id}", response_model=CountryOut)
async def get_country_endpoint(country_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to get country by id={country_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    result = await get_country(country_id)
    if not result:
        logger.warning(f"Country not found: id={country_id}")
        raise HTTPException(status_code=404, detail="Country not found")
    logger.info(f"Retrieved country: id={country_id}")
    return result

# ดึงข้อมูล country ทั้งหมด
@router.get("/", response_model=List[CountryOut])
async def get_all_countries_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["basetype_admin", "organization_admin", "organization_user", "hr_admin", "person_user", "system_admin"]:
        logger.warning(f"Unauthorized attempt to list all countries by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to basetype_admin, organization_admin, organization_user, hr_admin, person_user, or system_admin")
    results = await get_all_countries()
    logger.info(f"Retrieved {len(results)} countries")
    return results

# อัปเดตข้อมูล country (basetype_admin เท่านั้น)
@router.put("/{country_id}", response_model=CountryOut)
async def update_country_endpoint(country_id: int, country: CountryUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to update country by id={country_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await update_country(country_id, country)
    if not result:
        logger.warning(f"Country not found for update: id={country_id}")
        raise HTTPException(status_code=404, detail="Country not found")
    logger.info(f"Updated country: id={country_id}")
    return result

# ลบ country (basetype_admin เท่านั้น)
@router.delete("/{country_id}")
async def delete_country_endpoint(country_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "basetype_admin":
        logger.warning(f"Unauthorized attempt to delete country by id={country_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Basetype admin access required")
    result = await delete_country(country_id)
    if not result:
        logger.warning(f"Country not found for deletion: id={country_id}")
        raise HTTPException(status_code=404, detail="Country not found")
    logger.info(f"Deleted country: id={country_id}")
    return {"message": "Country deleted"}