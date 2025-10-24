from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.organizations.organization import create_organization, get_organization, update_organization, delete_organization, get_all_organizations
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/organizations", tags=["organizations"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง organization ใหม่ (organization_admin เท่านั้น)
@router.post("/", response_model=OrganizationOut)
async def create_organization_endpoint(organization: OrganizationCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "organization_admin":
        logger.warning(f"Unauthorized attempt to create organization by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Organization admin access required")
    result = await create_organization(organization, action_by=current_user["id"])
    if not result:
        logger.warning(f"Failed to create organization: {organization.email}")
        raise HTTPException(status_code=400, detail="Email or federal tax ID already exists")
    logger.info(f"Created organization: id={result.id}")
    return result

# ดึงข้อมูล organization ตาม ID
@router.get("/{organization_id}", response_model=OrganizationOut)
async def get_organization_endpoint(organization_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["system_admin", "hr_admin", "organization_admin", "organization_user", "person_user"]:
        logger.warning(f"Unauthorized attempt to get organization by id={organization_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to system_admin, hr_admin, organization_admin, organization_user, or person_user")
    result = await get_organization(organization_id)
    if not result:
        logger.warning(f"Organization not found: id={organization_id}")
        raise HTTPException(status_code=404, detail="Organization not found")
    logger.info(f"Retrieved organization: id={organization_id}")
    return result

# ดึงข้อมูล organization ทั้งหมด
@router.get("/", response_model=List[OrganizationOut])
async def get_all_organizations_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["system_admin", "hr_admin", "organization_admin", "organization_user", "person_user"]:
        logger.warning(f"Unauthorized attempt to list all organizations by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Access restricted to system_admin, hr_admin, organization_admin, organization_user, or person_user")
    results = await get_all_organizations()
    logger.info(f"Retrieved {len(results)} organizations")
    return results

# อัปเดตข้อมูล organization (organization_admin เท่านั้น)
@router.put("/{organization_id}", response_model=OrganizationOut)
async def update_organization_endpoint(organization_id: int, organization: OrganizationUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "organization_admin":
        logger.warning(f"Unauthorized attempt to update organization by id={organization_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Organization admin access required")
    result = await update_organization(organization_id, organization, action_by=current_user["id"])
    if not result:
        logger.warning(f"Organization not found for update: id={organization_id}")
        raise HTTPException(status_code=404, detail="Organization not found")
    logger.info(f"Updated organization: id={organization_id}")
    return result

# ลบ organization (organization_admin เท่านั้น)
@router.delete("/{organization_id}")
async def delete_organization_endpoint(organization_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "organization_admin":
        logger.warning(f"Unauthorized attempt to delete organization by id={organization_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Organization admin access required")
    result = await delete_organization(organization_id, action_by=current_user["id"])
    if not result:
        logger.warning(f"Organization not found for deletion: id={organization_id}")
        raise HTTPException(status_code=404, detail="Organization not found")
    logger.info(f"Deleted organization: id={organization_id}")
    return {"message": "Organization deleted"}