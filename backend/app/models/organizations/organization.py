from app.config.database import database
from app.config.settings import BCRYPT_SALT
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationOut
from app.models.users.user import create_user, log_user_history, update_user, delete_user, get_user_password
from app.schemas.user import UserCreate, UserUpdate
import bcrypt
import logging
from typing import Optional, List
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา organization ด้วย ID
async def get_organization(organization_id: int) -> Optional[OrganizationOut]:
    query = """
        SELECT u.id, u.username, u.email, o.federal_tax_id, o.name_en, o.name_th, o.organization_type_id, 
               o.industry_type_id, o.employee_count, o.slogan, o.created_at, o.updated_at
        FROM users u
        JOIN organizations o ON u.id = o.id
        WHERE u.id = :id
    """
    result = await database.fetch_one(query=query, values={"id": organization_id})
    logger.info(f"Retrieved organization: id={organization_id}")
    return OrganizationOut(**result._mapping) if result else None

# ค้นหา organization ด้วย federal_tax_id
async def get_organization_by_federal_tax_id(federal_tax_id: str) -> Optional[dict]:
    query = """
        SELECT u.id, u.username, u.email, o.federal_tax_id, o.name_en, o.name_th, o.organization_type_id, 
               o.industry_type_id, o.employee_count, o.slogan, o.created_at, o.updated_at
        FROM users u
        JOIN organizations o ON u.id = o.id
        WHERE o.federal_tax_id = :federal_tax_id
    """
    result = await database.fetch_one(query=query, values={"federal_tax_id": federal_tax_id})
    logger.info(f"Queried organization with federal_tax_id {federal_tax_id}: {result}")
    return result

# ดึงข้อมูล organization ทั้งหมด
async def get_all_organizations() -> List[OrganizationOut]:
    query = """
        SELECT u.id, u.username, u.email, o.federal_tax_id, o.name_en, o.name_th, o.organization_type_id, 
               o.industry_type_id, o.employee_count, o.slogan, o.created_at, o.updated_at
        FROM users u
        JOIN organizations o ON u.id = o.id
        ORDER BY u.id ASC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} organizations")
    return [OrganizationOut(**result._mapping) for result in results]

# บันทึกประวัติการกระทำของ organization
async def log_organization_history(organization_id: int, federal_tax_id: Optional[str], name_en: str, 
                                  name_th: Optional[str], organization_type_id: Optional[int], 
                                  industry_type_id: Optional[int], employee_count: Optional[int], 
                                  slogan: Optional[str], action: str, action_by: Optional[int] = None):
    query = """
        INSERT INTO organization_history (organization_id, federal_tax_id, name_en, name_th, organization_type_id, 
                                        industry_type_id, employee_count, slogan, action, action_by, action_at)
        VALUES (:organization_id, :federal_tax_id, :name_en, :name_th, :organization_type_id, 
                :industry_type_id, :employee_count, :slogan, :action, :action_by, :action_at)
    """
    values = {
        "organization_id": organization_id,
        "federal_tax_id": federal_tax_id,
        "name_en": name_en,
        "name_th": name_th,
        "organization_type_id": organization_type_id,
        "industry_type_id": industry_type_id,
        "employee_count": employee_count,
        "slogan": slogan,
        "action": action,
        "action_by": action_by,
        "action_at": datetime.utcnow()
    }
    await database.execute(query=query, values=values)
    logger.info(f"Logged organization history: organization_id={organization_id}, action={action}, action_by={action_by}")

# สร้าง organization ใหม่
async def create_organization(organization: OrganizationCreate, action_by: Optional[int]) -> Optional[OrganizationOut]:
    async with database.transaction():
        try:
            user = UserCreate(username=organization.username, email=organization.email, password=organization.password, role="organization_user")
            user_result = await create_user(user, action_by)
            if not user_result:
                logger.warning(f"Failed to create user for organization: {organization.email}")
                return None

            if organization.federal_tax_id:
                existing_organization = await get_organization_by_federal_tax_id(organization.federal_tax_id)
                if existing_organization:
                    logger.warning(f"Attempt to create organization with existing federal_tax_id: {organization.federal_tax_id}")
                    return None

            query = """
                INSERT INTO organizations (id, federal_tax_id, name_en, name_th, organization_type_id, industry_type_id, 
                                         employee_count, slogan, created_at)
                VALUES (:id, :federal_tax_id, :name_en, :name_th, :organization_type_id, :industry_type_id, 
                        :employee_count, :slogan, :created_at)
                RETURNING id, federal_tax_id, name_en, name_th, organization_type_id, industry_type_id, 
                          employee_count, slogan, created_at, updated_at
            """
            values = {
                "id": user_result.id,
                "federal_tax_id": organization.federal_tax_id,
                "name_en": organization.name_en,
                "name_th": organization.name_th,
                "organization_type_id": organization.organization_type_id,
                "industry_type_id": organization.industry_type_id,
                "employee_count": organization.employee_count,
                "slogan": organization.slogan,
                "created_at": datetime.utcnow()
            }
            result = await database.fetch_one(query=query, values=values)
            if result:
                await log_organization_history(
                    organization_id=user_result.id,
                    federal_tax_id=organization.federal_tax_id,
                    name_en=organization.name_en,
                    name_th=organization.name_th,
                    organization_type_id=organization.organization_type_id,
                    industry_type_id=organization.industry_type_id,
                    employee_count=organization.employee_count,
                    slogan=organization.slogan,
                    action="create",
                    action_by=action_by
                )
                logger.info(f"Created organization: id={user_result.id}")
                return OrganizationOut(
                    username=user_result.username,
                    email=user_result.email,
                    **result._mapping
                )
            return None
        except Exception as e:
            logger.error(f"Error creating organization: {str(e)}")
            raise

# อัปเดตข้อมูล organization
async def update_organization(organization_id: int, organization: OrganizationUpdate, action_by: Optional[int]) -> Optional[OrganizationOut]:
    async with database.transaction():
        values = {"id": organization_id, "updated_at": datetime.utcnow()}
        query_parts = []

        if organization.federal_tax_id is not None and organization.federal_tax_id != '':
            query_parts.append("federal_tax_id = :federal_tax_id")
            values["federal_tax_id"] = organization.federal_tax_id
        if organization.name_en is not None and organization.name_en != '':
            query_parts.append("name_en = :name_en")
            values["name_en"] = organization.name_en
        if organization.name_th is not None:
            query_parts.append("name_th = :name_th")
            values["name_th"] = organization.name_th
        if organization.organization_type_id is not None:
            query_parts.append("organization_type_id = :organization_type_id")
            values["organization_type_id"] = organization.organization_type_id
        if organization.industry_type_id is not None:
            query_parts.append("industry_type_id = :industry_type_id")
            values["industry_type_id"] = organization.industry_type_id
        if organization.employee_count is not None:
            query_parts.append("employee_count = :employee_count")
            values["employee_count"] = organization.employee_count
        if organization.slogan is not None:
            query_parts.append("slogan = :slogan")
            values["slogan"] = organization.slogan

        # Update user table if username, email, or password is provided
        user_values = {"id": organization_id}
        user_query_parts = []
        if organization.username is not None and organization.username != '':
            user_query_parts.append("username = :username")
            user_values["username"] = organization.username
        if organization.email is not None and organization.email != '':
            user_query_parts.append("email = :email")
            user_values["email"] = organization.email
        if organization.password is not None and organization.password != '':
            user_query_parts.append("password = :password")
            user_values["password"] = organization.password

        old_data = await get_organization(organization_id)
        if not old_data:
            return None

        user_result = None
        if user_query_parts:
            user_update = UserUpdate(
                username=organization.username if organization.username and organization.username != '' else None,
                email=organization.email if organization.email and organization.email != '' else None,
                password=organization.password if organization.password and organization.password != '' else None,
                role=None
            )
            user_result = await update_user(organization_id, user_update, action_by)
            if not user_result:
                logger.warning(f"Failed to update user for organization: id={organization_id}")
                return None

        if not query_parts and not user_query_parts:
            logger.info(f"No fields to update for organization id={organization_id}")
            return None

        if query_parts:
            query = f"""
                UPDATE organizations
                SET {', '.join(query_parts)}, updated_at = :updated_at
                WHERE id = :id
                RETURNING id, federal_tax_id, name_en, name_th, organization_type_id, industry_type_id, 
                          employee_count, slogan, created_at, updated_at
            """
            result = await database.fetch_one(query=query, values=values)
        else:
            result = old_data

        if result:
            await log_organization_history(
                organization_id=organization_id,
                federal_tax_id=organization.federal_tax_id if organization.federal_tax_id is not None and organization.federal_tax_id != '' else old_data.federal_tax_id,
                name_en=organization.name_en if organization.name_en and organization.name_en != '' else old_data.name_en,
                name_th=organization.name_th if organization.name_th is not None else old_data.name_th,
                organization_type_id=organization.organization_type_id if organization.organization_type_id is not None else old_data.organization_type_id,
                industry_type_id=organization.industry_type_id if organization.industry_type_id is not None else old_data.industry_type_id,
                employee_count=organization.employee_count if organization.employee_count is not None else old_data.employee_count,
                slogan=organization.slogan if organization.slogan is not None else old_data.slogan,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated organization: id={organization_id}")
            return OrganizationOut(
                username=old_data.username if not user_result else user_result.username,
                email=old_data.email if not user_result else user_result.email,
                **result._mapping
            )
        return None

# ลบ organization
async def delete_organization(organization_id: int, action_by: Optional[int]) -> Optional[int]:
    async with database.transaction():
        old_data = await get_organization(organization_id)
        if not old_data:
            return None

        # Log history before deleting the organization
        await log_organization_history(
            organization_id=organization_id,
            federal_tax_id=old_data.federal_tax_id,
            name_en=old_data.name_en,
            name_th=old_data.name_th,
            organization_type_id=old_data.organization_type_id,
            industry_type_id=old_data.industry_type_id,
            employee_count=old_data.employee_count,
            slogan=old_data.slogan,
            action="delete",
            action_by=action_by
        )
        old_user_data = await database.fetch_one(query="SELECT username, email, password, role FROM users WHERE id = :id", values={"id": organization_id})
        await log_user_history(
            user_id=organization_id,
            username=old_user_data["username"],
            email=old_user_data["email"],
            password=old_user_data["password"],
            role=old_user_data["role"],
            action="delete",
            action_by=action_by
        )

        # Delete from users table (supertype) to cascade to organizations table
        result = await delete_user(organization_id, action_by)
        if result:
            logger.info(f"Deleted organization: id={organization_id}")
            return result
        return None