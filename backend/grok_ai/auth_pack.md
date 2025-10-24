<xaiArtifact artifact_id="4bb04411-5b73-4cfb-a2b2-554b91cd3542" artifact_version_id="33ee6e2e-fc0d-4724-afd7-2bf1d034c7c2" title="test_plan.md" contentType="text/markdown">

# Test Plan for User Management API

## Objective
To ensure the User Management API endpoints function correctly according to the specified requirements, covering authentication, authorization, and CRUD operations for different user roles.

## Test Environment
- **Backend**: FastAPI application
- **Database**: PostgreSQL
- **Testing Tools**: Postman, pytest, or equivalent HTTP client
- **Authentication**: JWT-based OAuth2
- **Base URL**: `{{backend}}`

## Test Scope
- Endpoints: `/users`, `/persons`, `/organizations`, `/me`
- Roles: `system_admin`, `hr_admin`, `organization_admin`, `person_user`, `organization_user`
- Operations: Create, Read, Update, Delete (CRUD) with role-based access control

## Prerequisites
1. PostgreSQL database is running with the required schema.
2. The application is deployed and accessible at `{{backend}}`.
3. JWT tokens for each role (`system_admin`, `hr_admin`, `organization_admin`, `person_user`, `organization_user`) are prepared.
4. Test data:
   - Sample users for each role.
   - Sample person and organization data.

## Test Cases

### 1. Authentication and Authorization
#### 1.1 Test JWT Token Validation
- **Endpoint**: `/me`
- **Method**: GET
- **Steps**:
  1. Send GET request to `/me` without a token.
     - **Expected**: 401 Unauthorized, `detail: "Invalid token"`
  2. Send GET request to `/me` with an invalid token.
     - **Expected**: 401 Unauthorized, `detail: "Invalid token"`
  3. Send GET request to `/me` with a valid token for each role (`system_admin`, `hr_admin`, `organization_admin`, `person_user`, `organization_user`).
     - **Expected**: 200 OK, returns respective user data matching the token's `sub` (user ID).

#### 1.2 Test Role-Based Access Control
- **Endpoints**: All endpoints requiring specific roles
- **Steps**:
  1. For each endpoint requiring `system_admin`, test with tokens of other roles (`hr_admin`, `organization_admin`, `person_user`, `organization_user`).
     - **Expected**: 403 Forbidden, `detail: "System admin access required"`
  2. For each endpoint requiring `hr_admin`, test with tokens of `person_user`, `organization_user`, `organization_admin`.
     - **Expected**: 403 Forbidden, `detail: "HR admin access required"`
  3. For each endpoint requiring `organization_admin`, test with tokens of `person_user`, `hr_admin`, `organization_user`.
     - **Expected**: 403 Forbidden, `detail: "Organization admin access required"`
  4. Test `person_user` and `organization_user` attempting to access `/me` with their own tokens.
     - **Expected**: 200 OK, returns their own data.

### 2. User Management (`/users`)
#### 2.1 Create User (`POST /users`)
- **Steps**:
  1. As `system_admin`, send POST request with valid `UserCreate` payload for `hr_admin`, `organization_admin`, `system_admin`.
     - **Expected**: 200 OK, returns `UserOut` with created user data.
  2. As `system_admin`, send POST request with existing email.
     - **Expected**: 400 Bad Request, `detail: "Email already exists"`.
  3. As `system_admin`, send POST request with invalid role (e.g., `invalid_role`).
     - **Expected**: 422 Unprocessable Entity, `detail: "Role must be one of [system_admin, hr_admin, organization_admin]"`.
  4. As non-`system_admin` roles, attempt to create a user.
     - **Expected**: 403 Forbidden, `detail: "System admin access required"`.

#### 2.2 Get User by ID (`GET /users/{user_id}`)
- **Steps**:
  1. As `system_admin`, send GET request for existing `hr_admin`, `organization_admin`, `system_admin` IDs.
     - **Expected**: 200 OK, returns `UserOut` with user data.
  2. As `system_admin`, send GET request for non-existing user ID.
     - **Expected**: 404 Not Found, `detail: "User not found"`.
  3. As non-`system_admin` roles, attempt to get a user.
     - **Expected**: 403 Forbidden, `detail: "System admin access required"`.

#### 2.3 Get All Users (`GET /users`)
- **Steps**:
  1. As `system_admin`, send GET request.
     - **Expected**: 200 OK, returns list of `UserOut` for users with roles `system_admin`, `hr_admin`, `organization_admin`.
  2. As non-`system_admin` roles, attempt to get all users.
     - **Expected**: 403 Forbidden, `detail: "System admin access required"`.

#### 2.4 Update User (`PUT /users/{user_id}`)
- **Steps**:
  1. As `system_admin`, send PUT request with valid `UserUpdate` payload for `hr_admin`, `organization_admin`, `system_admin`.
     - **Expected**: 200 OK, returns updated `UserOut`.
  2. As `system_admin`, send PUT request with no fields to update.
     - **Expected**: 404 Not Found, `detail: "User not found"` or no update performed.
  3. As `system_admin`, send PUT request for non-existing user ID.
     - **Expected**: 404 Not Found, `detail: "User not found"`.
  4. As non-`system_admin` roles, attempt to update a user.
     - **Expected**: 403 Forbidden, `detail: "System admin access required"`.

#### 2.5 Delete User (`DELETE /users/{user_id}`)
- **Steps**:
  1. As `system_admin`, send DELETE request for existing `hr_admin`, `organization_admin`, `system_admin`.
     - **Expected**: 200 OK, `message: "User deleted"`.
  2. As `system_admin`, send DELETE request for non-existing user ID.
     - **Expected**: 404 Not Found, `detail: "User not found"`.
  3. As non-`system_admin` roles, attempt to delete a user.
     - **Expected**: 403 Forbidden, `detail: "System admin access required"`.

### 3. Person Management (`/persons`)
#### 3.1 Create Person (`POST /persons`)
- **Steps**:
  1. As `hr_admin`, send POST request with valid `PersonCreate` payload.
     - **Expected**: 200 OK, returns `PersonOut` with created person data.
  2. As `hr_admin`, send POST request with existing email or `personal_id_number`.
     - **Expected**: 400 Bad Request, `detail: "Email or personal ID number already exists"`.
  3. As non-`hr_admin` roles, attempt to create a person.
     - **Expected**: 403 Forbidden, `detail: "HR admin access required"`.

#### 3.2 Get Person by ID (`GET /persons/{person_id}`)
- **Steps**:
  1. As `hr_admin`, send GET request for existing `person_user` ID.
     - **Expected**: 200 OK, returns `PersonOut` with person data.
  2. As `hr_admin`, send GET request for non-existing person ID.
     - **Expected**: 404 Not Found, `detail: "Person not found"`.
  3. As non-`hr_admin` roles, attempt to get a person.
     - **Expected**: 403 Forbidden, `detail: "HR admin access required"`.

#### 3.3 Get All Persons (`GET /persons`)
- **Steps**:
  1. As `hr_admin`, send GET request.
     - **Expected**: 200 OK, returns list of `PersonOut`.
  2. As non-`hr_admin` roles, attempt to get all persons.
     - **Expected**: 403 Forbidden, `detail: "HR admin access required"`.

#### 3.4 Update Person (`PUT /persons/{person_id}`)
- **Steps**:
  1. As `hr_admin`, send PUT request with valid `PersonUpdate` payload.
     - **Expected**: 200 OK, returns updated `PersonOut`.
  2. As `hr_admin`, send PUT request with no fields to update.
     - **Expected**: 404 Not Found, `detail: "Person not found"` or no update performed.
  3. As `hr_admin`, send PUT request for non-existing person ID.
     - **Expected**: 404 Not Found, `detail: "Person not found"`.
  4. As `person_user`, attempt to update their own or another person’s data.
     - **Expected**: 403 Forbidden, `detail: "HR admin access required"`.

#### 3.5 Delete Person (`DELETE /persons/{person_id}`)
- **Steps**:
  1. As `hr_admin`, send DELETE request for existing `person_user`.
     - **Expected**: 200 OK, `message: "Person deleted"`.
  2. As `hr_admin`, send DELETE request for non-existing person ID.
     - **Expected**: 404 Not Found, `detail: "Person not found"`.
  3. As `person_user`, attempt to delete their own or another person’s data.
     - **Expected**: 403 Forbidden, `detail: "HR admin access required"`.

### 4. Organization Management (`/organizations`)
#### 4.1 Create Organization (`POST /organizations`)
- **Steps**:
  1. As `organization_admin`, send POST request with valid `OrganizationCreate` payload.
     - **Expected**: 200 OK, returns `OrganizationOut` with created organization data.
  2. As `organization_admin`, send POST request with existing email or `federal_tax_id`.
     - **Expected**: 400 Bad Request, `detail: "Email or federal tax ID already exists"`.
  3. As non-`organization_admin` roles, attempt to create an organization.
     - **Expected**: 403 Forbidden, `detail: "Organization admin access required"`.

#### 4.2 Get Organization by ID (`GET /organizations/{organization_id}`)
- **Steps**:
  1. As `organization_admin`, send GET request for existing `organization_user` ID.
     - **Expected**: 200 OK, returns `OrganizationOut` with organization data.
  2. As `organization_admin`, send GET request for non-existing organization ID.
     - **Expected**: 404 Not Found, `detail: "Organization not found"`.
  3. As non-`organization_admin` roles, attempt to get an organization.
     - **Expected**: 403 Forbidden, `detail: "Organization admin access required"`.

#### 4.3 Get All Organizations (`GET /organizations`)
- **Steps**:
  1. As `organization_admin`, send GET request.
     - **Expected**: 200 OK, returns list of `OrganizationOut`.
  2. As non-`organization_admin` roles, attempt to get all organizations.
     - **Expected**: 403 Forbidden, `detail: "Organization admin access required"`.

#### 4.4 Update Organization (`PUT /organizations/{organization_id}`)
- **Steps**:
  1. As `organization_admin`, send PUT request with valid `OrganizationUpdate` payload.
     - **Expected**: 200 OK, returns updated `OrganizationOut`.
  2. As `organization_admin`, send PUT request with no fields to update.
     - **Expected**: 404 Not Found, `detail: "Organization not found"` or no update performed.
  3. As `organization_admin`, send PUT request for non-existing organization ID.
     - **Expected**: 404 Not Found, `detail: "Organization not found"`.
  4. As `organization_user`, attempt to update their own or another organization’s data.
     - **Expected**: 403 Forbidden, `detail: "Organization admin access required"`.

#### 4.5 Delete Organization (`DELETE /organizations/{organization_id}`)
- **Steps**:
  1. As `organization_admin`, send DELETE request for existing `organization_user`.
     - **Expected**: 200 OK, `message: "Organization deleted"`.
  2. As `organization_admin`, send DELETE request for non-existing organization ID.
     - **Expected**: 404 Not Found, `detail: "Organization not found"`.
  3. As `organization_user`, attempt to delete their own or another organization’s data.
     - **Expected**: 403 Forbidden, `detail: "Organization admin access required"`.

### 5. Self Data Access (`/me`)
#### 5.1 Get Self Data (`GET /me`)
- **Steps**:
  1. As `person_user`, send GET request to `/me`.
     - **Expected**: 200 OK, returns `PersonOut` with their own data.
  2. As `organization_user`, send GET request to `/me`.
     - **Expected**: 200 OK, returns `OrganizationOut` with their own data.
  3. As `system_admin`, `hr_admin`, `organization_admin`, send GET request to `/me`.
     - **Expected**: 200 OK, returns `UserOut` with their own data.

### 6. Database Consistency
#### 6.1 Test Transaction Integrity
- **Steps**:
  1. As `hr_admin`, create a person and verify `users` and `persons` tables are updated.
     - **Expected**: Both tables have consistent data; `users_history` and `person_history` have `create` entries.
  2. As `organization_admin`, create an organization and verify `users` and `organizations` tables.
     - **Expected**: Both tables have consistent data; `users_history` and `organization_history` have `create` entries.
  3. Simulate a failure during `create_person` (e.g., database disconnection) and verify rollback.
     - **Expected**: No partial data in `users` or `persons` tables.

#### 6.2 Test History Logging
- **Steps**:
  1. Perform CRUD operations as respective admin roles and verify history tables (`users_history`, `person_history`, `organization_history`).
     - **Expected**: Each operation logs an entry with correct `action`, `action_by`, and `action_at`.

### 7. Edge Cases
- **Steps**:
  1. Send invalid data types in payloads (e.g., string for `height` instead of int).
     - **Expected**: 422 Unprocessable Entity with validation error details.
  2. Test empty payloads for `PUT` requests.
     - **Expected**: No update performed or appropriate error response.
  3. Test large payloads or long strings for fields like `about_me`.
     - **Expected**: Database constraints enforced or appropriate error response.
  4. Test concurrent requests for the same user/person/organization.
     - **Expected**: Transactions handle concurrency correctly without data corruption.

## Test Execution Steps
1. **Setup**:
   - Deploy the application and database.
   - Prepare JWT tokens for all roles.
   - Clear database or use a fresh test database.
2. **Run Authentication Tests**:
   - Execute tests under section 1.1 and 1.2.
3. **Run User Management Tests**:
   - Execute tests under section 2 in order: Create, Read, Update, Delete.
4. **Run Person Management Tests**:
   - Execute tests under section 3 in order: Create, Read, Update, Delete.
5. **Run Organization Management Tests**:
   - Execute tests under section 4 in order: Create, Read, Update, Delete.
6. **Run Self Data Tests**:
   - Execute tests under section 5.
7. **Run Database Consistency Tests**:
   - Execute tests under section 6.
8. **Run Edge Case Tests**:
   - Execute tests under section 7.
9. **Cleanup**:
   - Clear test data from the database.
   - Log test results and any defects.

## Expected Outcomes
- All endpoints enforce correct role-based access control.
- CRUD operations succeed only for authorized roles.
- `person_user` and `organization_user` can only view their own data via `/me`.
- Database transactions maintain consistency.
- History logs capture all actions accurately.

## Defect Reporting
- Log defects with:
  - Endpoint and method
  - Request payload and token
  - Expected vs. actual response
  - Steps to reproduce
- Prioritize fixing authorization and transaction-related defects first.

</xaiArtifact>

<xaiArtifact artifact_id="0f23d630-4d0f-4d21-aeab-e8be1f0a7401" artifact_version_id="bdfec0ae-c1f7-4759-9560-10b861e21690" title="schemas/person.py" contentType="text/python">

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

# Schema สำหรับสร้าง person
class PersonCreate(BaseModel):
    username: str
    email: str
    password: str
    personal_id_number: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    nick_name: Optional[str] = None
    birth_date: date
    gender_type_id: Optional[int] = None
    marital_status_type_id: Optional[int] = None
    country_id: Optional[int] = None
    height: int
    weight: int
    racial_type_id: Optional[int] = None
    income_range_id: Optional[int] = None
    about_me: Optional[str] = None

# Schema สำหรับอัปเดต person
class PersonUpdate(BaseModel):
    personal_id_number: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    nick_name: Optional[str] = None
    birth_date: Optional[date] = None
    gender_type_id: Optional[int] = None
    marital_status_type_id: Optional[int] = None
    country_id: Optional[int] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    racial_type_id: Optional[int] = None
    income_range_id: Optional[int] = None
    about_me: Optional[str] = None

# Schema สำหรับแสดงผล person
class PersonOut(BaseModel):
    id: int
    username: str
    email: str
    personal_id_number: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    nick_name: Optional[str] = None
    birth_date: date
    gender_type_id: Optional[int] = None
    marital_status_type_id: Optional[int] = None
    country_id: Optional[int] = None
    height: int
    weight: int
    racial_type_id: Optional[int] = None
    income_range_id: Optional[int] = None
    about_me: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

</xaiArtifact>

<xaiArtifact artifact_id="69aae26e-c1ab-43c5-b52b-123c57c5edf6" artifact_version_id="5f0fbf0b-49c2-4baf-97ab-804ce9384ab0" title="schemas/organization.py" contentType="text/python">

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema สำหรับสร้าง organization
class OrganizationCreate(BaseModel):
    username: str
    email: str
    password: str
    federal_tax_id: Optional[str] = None
    name_en: str
    name_th: Optional[str] = None
    organization_type_id: Optional[int] = None
    industry_type_id: Optional[int] = None
    employee_count: Optional[int] = None
    slogan: Optional[str] = None

# Schema สำหรับอัปเดต organization
class OrganizationUpdate(BaseModel):
    federal_tax_id: Optional[str] = None
    name_en: Optional[str] = None
    name_th: Optional[str] = None
    organization_type_id: Optional[int] = None
    industry_type_id: Optional[int] = None
    employee_count: Optional[int] = None
    slogan: Optional[str] = None

# Schema สำหรับแสดงผล organization
class OrganizationOut(BaseModel):
    id: int
    username: str
    email: str
    federal_tax_id: Optional[str] = None
    name_en: str
    name_th: Optional[str] = None
    organization_type_id: Optional[int] = None
    industry_type_id: Optional[int] = None
    employee_count: Optional[int] = None
    slogan: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

</xaiArtifact>

<xaiArtifact artifact_id="04e6ecbe-bbcf-43a5-86dd-50e1f9300615" artifact_version_id="8e8bbe53-5b90-43fc-996e-30c3e37bd95c" title="schemas/user.py" contentType="text/python">

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Schema สำหรับสร้างผู้ใช้
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = None

# Schema สำหรับอัปเดตผู้ใช้
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None

# Schema สำหรับแสดงผลผู้ใช้
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schema สำหรับล็อกอิน
class UserLogin(BaseModel):
    email: EmailStr
    password: str

</xaiArtifact>

<xaiArtifact artifact_id="d7a12ad2-4ee2-4c66-b5a8-67aa373f7113" artifact_version_id="84eb0f73-1216-4b60-98d2-07369483a360" title="models/persons/person.py" contentType="text/python">

from app.config.database import database
from app.config.settings import BCRYPT_SALT
from app.schemas.person import PersonCreate, PersonUpdate, PersonOut
from app.models.users.user import create_user, log_user_history
from app.schemas.user import UserCreate
import bcrypt
import logging
from typing import Optional, List
from datetime import datetime, date

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา person ด้วย ID
async def get_person(person_id: int) -> Optional[PersonOut]:
    query = """
        SELECT u.id, u.username, u.email, p.personal_id_number, p.first_name, p.middle_name, p.last_name, 
               p.nick_name, p.birth_date, p.gender_type_id, p.marital_status_type_id, p.country_id, 
               p.height, p.weight, p.racial_type_id, p.income_range_id, p.about_me, p.created_at, p.updated_at
        FROM users u
        JOIN persons p ON u.id = p.id
        WHERE u.id = :id
    """
    result = await database.fetch_one(query=query, values={"id": person_id})
    logger.info(f"Retrieved person: id={person_id}")
    return PersonOut(**result._mapping) if result else None

# ค้นหา person ด้วย personal_id_number
async def get_person_by_personal_id(personal_id_number: str) -> Optional[dict]:
    query = """
        SELECT u.id, u.username, u.email, p.personal_id_number, p.first_name, p.middle_name, p.last_name, 
               p.nick_name, p.birth_date, p.gender_type_id, p.marital_status_type_id, p.country_id, 
               p.height, p.weight, p.racial_type_id, p.income_range_id, p.about_me, p.created_at, p.updated_at
        FROM users u
        JOIN persons p ON u.id = p.id
        WHERE p.personal_id_number = :personal_id_number
    """
    result = await database.fetch_one(query=query, values={"personal_id_number": personal_id_number})
    logger.info(f"Queried person with personal_id_number {personal_id_number}: {result}")
    return result

# ดึงข้อมูล person ทั้งหมด
async def get_all_persons() -> List[PersonOut]:
    query = """
        SELECT u.id, u.username, u.email, p.personal_id_number, p.first_name, p.middle_name, p.last_name, 
               p.nick_name, p.birth_date, p.gender_type_id, p.marital_status_type_id, p.country_id, 
               p.height, p.weight, p.racial_type_id, p.income_range_id, p.about_me, p.created_at, p.updated_at
        FROM users u
        JOIN persons p ON u.id = p.id
        ORDER BY u.id ASC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} persons")
    return [PersonOut(**result._mapping) for result in results]

# บันทึกประวัติการกระทำของ person
async def log_person_history(person_id: int, personal_id_number: str, first_name: str, middle_name: Optional[str], 
                             last_name: str, nick_name: Optional[str], birth_date: date, gender_type_id: Optional[int], 
                             marital_status_type_id: Optional[int], country_id: Optional[int], height: int, 
                             weight: int, racial_type_id: Optional[int], income_range_id: Optional[int], 
                             about_me: Optional[str], action: str, action_by: Optional[int] = None):
    query = """
        INSERT INTO person_history (person_id, personal_id_number, first_name, middle_name, last_name, nick_name, 
                                   birth_date, gender_type_id, marital_status_type_id, country_id, height, weight, 
                                   racial_type_id, income_range_id, about_me, action, action_by, action_at)
        VALUES (:person_id, :personal_id_number, :first_name, :middle_name, :last_name, :nick_name, 
                :birth_date, :gender_type_id, :marital_status_type_id, :country_id, :height, :weight, 
                :racial_type_id, :income_range_id, :about_me, :action, :action_by, :action_at)
    """
    values = {
        "person_id": person_id,
        "personal_id_number": personal_id_number,
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "nick_name": nick_name,
        "birth_date": birth_date,
        "gender_type_id": gender_type_id,
        "marital_status_type_id": marital_status_type_id,
        "country_id": country_id,
        "height": height,
        "weight": weight,
        "racial_type_id": racial_type_id,
        "income_range_id": income_range_id,
        "about_me": about_me,
        "action": action,
        "action_by": action_by,
        "action_at": datetime.utcnow()
    }
    await database.execute(query=query, values=values)
    logger.info(f"Logged person history: person_id={person_id}, action={action}, action_by={action_by}")

# สร้าง person ใหม่
async def create_person(person: PersonCreate, action_by: Optional[int]) -> Optional[PersonOut]:
    async with database.transaction():
        try:
            user = UserCreate(username=person.username, email=person.email, password=person.password, role="person_user")
            user_result = await create_user(user, action_by)
            if not user_result:
                logger.warning(f"Failed to create user for person: {person.email}")
                return None

            existing_person = await get_person_by_personal_id(person.personal_id_number)
            if existing_person:
                logger.warning(f"Attempt to create person with existing personal_id_number: {person.personal_id_number}")
                return None

            query = """
                INSERT INTO persons (id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, 
                                    gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, 
                                    income_range_id, about_me, created_at)
                VALUES (:id, :personal_id_number, :first_name, :middle_name, :last_name, :nick_name, :birth_date, 
                        :gender_type_id, :marital_status_type_id, :country_id, :height, :weight, :racial_type_id, 
                        :income_range_id, :about_me, :created_at)
                RETURNING id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, 
                          gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, 
                          income_range_id, about_me, created_at, updated_at
            """
            values = {
                "id": user_result.id,
                "personal_id_number": person.personal_id_number,
                "first_name": person.first_name,
                "middle_name": person.middle_name,
                "last_name": person.last_name,
                "nick_name": person.nick_name,
                "birth_date": person.birth_date,
                "gender_type_id": person.gender_type_id,
                "marital_status_type_id": person.marital_status_type_id,
                "country_id": person.country_id,
                "height": person.height,
                "weight": person.weight,
                "racial_type_id": person.racial_type_id,
                "income_range_id": person.income_range_id,
                "about_me": person.about_me,
                "created_at": datetime.utcnow()
            }
            result = await database.fetch_one(query=query, values=values)
            if result:
                await log_person_history(
                    person_id=user_result.id,
                    personal_id_number=person.personal_id_number,
                    first_name=person.first_name,
                    middle_name=person.middle_name,
                    last_name=person.last_name,
                    nick_name=person.nick_name,
                    birth_date=person.birth_date,
                    gender_type_id=person.gender_type_id,
                    marital_status_type_id=person.marital_status_type_id,
                    country_id=person.country_id,
                    height=person.height,
                    weight=person.weight,
                    racial_type_id=person.racial_type_id,
                    income_range_id=person.income_range_id,
                    about_me=person.about_me,
                    action="create",
                    action_by=action_by
                )
                logger.info(f"Created person: id={user_result.id}")
                return PersonOut(
                    username=user_result.username,
                    email=user_result.email,
                    **result._mapping
                )
            return None
        except Exception as e:
            logger.error(f"Error creating person: {str(e)}")
            raise

# อัปเดตข้อมูล person
async def update_person(person_id: int, person: PersonUpdate, action_by: Optional[int]) -> Optional[PersonOut]:
    async with database.transaction():
        values = {"id": person_id, "updated_at": datetime.utcnow()}
        query_parts = []

        if person.personal_id_number is not None:
            query_parts.append("personal_id_number = :personal_id_number")
            values["personal_id_number"] = person.personal_id_number
        if person.first_name is not None:
            query_parts.append("first_name = :first_name")
            values["first_name"] = person.first_name
        if person.middle_name is not None:
            query_parts.append("middle_name = :middle_name")
            values["middle_name"] = person.middle_name
        if person.last_name is not None:
            query_parts.append("last_name = :last_name")
            values["last_name"] = person.last_name
        if person.nick_name is not None:
            query_parts.append("nick_name = :nick_name")
            values["nick_name"] = person.nick_name
        if person.birth_date is not None:
            query_parts.append("birth_date = :birth_date")
            values["birth_date"] = person.birth_date
        if person.gender_type_id is not None:
            query_parts.append("gender_type_id = :gender_type_id")
            values["gender_type_id"] = person.gender_type_id
        if person.marital_status_type_id is not None:
            query_parts.append("marital_status_type_id = :marital_status_type_id")
            values["marital_status_type_id"] = person.marital_status_type_id
        if person.country_id is not None:
            query_parts.append("country_id = :country_id")
            values["country_id"] = person.country_id
        if person.height is not None:
            query_parts.append("height = :height")
            values["height"] = person.height
        if person.weight is not None:
            query_parts.append("weight = :weight")
            values["weight"] = person.weight
        if person.racial_type_id is not None:
            query_parts.append("racial_type_id = :racial_type_id")
            values["racial_type_id"] = person.racial_type_id
        if person.income_range_id is not None:
            query_parts.append("income_range_id = :income_range_id")
            values["income_range_id"] = person.income_range_id
        if person.about_me is not None:
            query_parts.append("about_me = :about_me")
            values["about_me"] = person.about_me

        if not query_parts:
            logger.info(f"No fields to update for person id={person_id}")
            return None

        old_data = await get_person(person_id)
        if not old_data:
            return None

        query = f"""
            UPDATE persons
            SET {', '.join(query_parts)}, updated_at = :updated_at
            WHERE id = :id
            RETURNING id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, 
                      gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, 
                      income_range_id, about_me, created_at, updated_at
        """
        result = await database.fetch_one(query=query, values=values)
        if result:
            await log_person_history(
                person_id=person_id,
                personal_id_number=old_data.personal_id_number,
                first_name=old_data.first_name,
                middle_name=old_data.middle_name,
                last_name=old_data.last_name,
                nick_name=old_data.nick_name,
                birth_date=old_data.birth_date,
                gender_type_id=old_data.gender_type_id,
                marital_status_type_id=old_data.marital_status_type_id,
                country_id=old_data.country_id,
                height=old_data.height,
                weight=old_data.weight,
                racial_type_id=old_data.racial_type_id,
                income_range_id=old_data.income_range_id,
                about_me=old_data.about_me,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated person: id={person_id}")
            return PersonOut(
                username=old_data.username,
                email=old_data.email,
                **result._mapping
            )
        return None

# ลบ person
async def delete_person(person_id: int, action_by: Optional[int]) -> Optional[int]:
    async with database.transaction():
        old_data = await get_person(person_id)
        if not old_data:
            return None

        query = "DELETE FROM persons WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": person_id})
        if result:
            await log_person_history(
                person_id=person_id,
                personal_id_number=old_data.personal_id_number,
                first_name=old_data.first_name,
                middle_name=old_data.middle_name,
                last_name=old_data.last_name,
                nick_name=old_data.nick_name,
                birth_date=old_data.birth_date,
                gender_type_id=old_data.gender_type_id,
                marital_status_type_id=old_data.marital_status_type_id,
                country_id=old_data.country_id,
                height=old_data.height,
                weight=old_data.weight,
                racial_type_id=old_data.racial_type_id,
                income_range_id=old_data.income_range_id,
                about_me=old_data.about_me,
                action="delete",
                action_by=action_by
            )
            logger.info(f"Deleted person: id={person_id}")
            return result["id"]
        return None

</xaiArtifact>

<xaiArtifact artifact_id="c6896457-a43c-44c5-bf9e-1187d468f1ad" artifact_version_id="be4063cf-f057-4e5b-8030-498a3ea552b3" title="models/organizations/organization.py" contentType="text/python">

from app.config.database import database
from app.config.settings import BCRYPT_SALT
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationOut
from app.models.users.user import create_user, log_user_history
from app.schemas.user import UserCreate
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

        if organization.federal_tax_id is not None:
            query_parts.append("federal_tax_id = :federal_tax_id")
            values["federal_tax_id"] = organization.federal_tax_id
        if organization.name_en is not None:
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

        if not query_parts:
            logger.info(f"No fields to update for organization id={organization_id}")
            return None

        old_data = await get_organization(organization_id)
        if not old_data:
            return None

        query = f"""
            UPDATE organizations
            SET {', '.join(query_parts)}, updated_at = :updated_at
            WHERE id = :id
            RETURNING id, federal_tax_id, name_en, name_th, organization_type_id, industry_type_id, 
                      employee_count, slogan, created_at, updated_at
        """
        result = await database.fetch_one(query=query, values=values)
        if result:
            await log_organization_history(
                organization_id=organization_id,
                federal_tax_id=old_data.federal_tax_id,
                name_en=old_data.name_en,
                name_th=old_data.name_th,
                organization_type_id=old_data.organization_type_id,
                industry_type_id=old_data.industry_type_id,
                employee_count=old_data.employee_count,
                slogan=old_data.slogan,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated organization: id={organization_id}")
            return OrganizationOut(
                username=old_data.username,
                email=old_data.email,
                **result._mapping
            )
        return None

# ลบ organization
async def delete_organization(organization_id: int, action_by: Optional[int]) -> Optional[int]:
    async with database.transaction():
        old_data = await get_organization(organization_id)
        if not old_data:
            return None

        query = "DELETE FROM organizations WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": organization_id})
        if result:
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
            logger.info(f"Deleted organization: id={organization_id}")
            return result["id"]
        return None

</xaiArtifact>

<xaiArtifact artifact_id="4e1dd63b-ea65-4414-ad0e-9a24ebfdae3b" artifact_version_id="f30f50d3-de36-4608-855b-3f6ea99e3edb" title="models/users/user.py" contentType="text/python">

from app.config.database import database
from app.config.settings import BCRYPT_SALT
from app.schemas.user import UserCreate, UserUpdate, UserOut
import bcrypt
import logging
from typing import Optional, List
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหาผู้ใช้ด้วยอีเมล
async def get_user_by_email(email: str) -> Optional[dict]:
    query = "SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE email = :email"
    result = await database.fetch_one(query=query, values={"email": email})
    logger.info(f"Queried user with email {email}: {result}")
    return result

# บันทึกประวัติการกระทำของผู้ใช้
async def log_user_history(user_id: int, username: str, email: str, password: str, role: str, action: str, action_by: Optional[int] = None):
    query = """
        INSERT INTO users_history (user_id, username, email, password, role, action, action_by, action_at)
        VALUES (:user_id, :username, :email, :password, :role, :action, :action_by, :action_at)
    """
    values = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "password": password,
        "role": role,
        "action": action,
        "action_by": action_by,
        "action_at": datetime.utcnow()
    }
    await database.execute(query=query, values=values)
    logger.info(f"Logged history: user_id={user_id}, action={action}, action_by={action_by}")

# สร้างผู้ใช้ใหม่
async def create_user(user: UserCreate, action_by: Optional[int]) -> Optional[UserOut]:
    async with database.transaction():
        try:
            existing_user = await get_user_by_email(user.email)
            if existing_user:
                logger.warning(f"Attempt to create user with existing email: {user.email}")
                return None
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), BCRYPT_SALT.encode('utf-8')).decode('utf-8')
            now = datetime.utcnow()
            query = """
                INSERT INTO users (username, email, password, role, created_at)
                VALUES (:username, :email, :password, :role, :created_at)
                RETURNING id, username, email, role, created_at, updated_at
            """
            values = {
                "username": user.username,
                "email": user.email,
                "password": hashed_password,
                "role": user.role or "hr_admin",
                "created_at": now
            }
            result = await database.fetch_one(query=query, values=values)
            if result:
                await log_user_history(
                    user_id=result["id"],
                    username=user.username,
                    email=user.email,
                    password=hashed_password,
                    role=user.role or "hr_admin",
                    action="create",
                    action_by=action_by
                )
                logger.info(f"Created user: {user.email}, role={user.role}")
                return UserOut(**result._mapping)
            return None
        except ValueError as e:
            logger.error(f"Error hashing password for {user.email}: {str(e)}")
            raise

# ค้นหาผู้ใช้ด้วย ID
async def get_user(user_id: int) -> Optional[UserOut]:
    query = "SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": user_id})
    logger.info(f"Retrieved user: id={user_id}")
    return UserOut(**result._mapping) if result else None

# ดึงข้อมูลผู้ใช้ทั้งหมด
async def get_all_users() -> List[UserOut]:
    query = "SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} users")
    return [UserOut(**result._mapping) for result in results]

# อัปเดตข้อมูลผู้ใช้
async def update_user(user_id: int, user: UserUpdate, action_by: Optional[int]) -> Optional[UserOut]:
    async with database.transaction():
        values = {"id": user_id, "updated_at": datetime.utcnow()}
        query_parts = []

        if user.username is not None:
            query_parts.append("username = :username")
            values["username"] = user.username
        if user.email is not None:
            query_parts.append("email = :email")
            values["email"] = user.email
        if user.password is not None:
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), BCRYPT_SALT.encode('utf-8')).decode('utf-8')
            query_parts.append("password = :password")
            values["password"] = hashed_password
        if user.role is not None:
            query_parts.append("role = :role")
            values["role"] = user.role

        if not query_parts:
            logger.info(f"No fields to update for user id={user_id}")
            return None

        old_data = await get_user(user_id)
        if not old_data:
            return None

        query = f"""
            UPDATE users
            SET {', '.join(query_parts)}, updated_at = :updated_at
            WHERE id = :id
            RETURNING id, username, email, role, created_at, updated_at
        """
        result = await database.fetch_one(query=query, values=values)
        if result:
            await log_user_history(
                user_id=user_id,
                username=old_data.username,
                email=old_data.email,
                password=old_data.password if user.password is None else hashed_password,
                role=old_data.role,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated user: id={user_id}")
            return UserOut(**result._mapping)
        return None

# ลบผู้ใช้
async def delete_user(user_id: int, action_by: Optional[int]) -> Optional[int]:
    async with database.transaction():
        old_data = await get_user(user_id)
        if not old_data:
            return None

        query = "DELETE FROM users WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": user_id})
        if result:
            await log_user_history(
                user_id=user_id,
                username=old_data.username,
                email=old_data.email,
                password=old_data.password,
                role=old_data.role,
                action="delete",
                action_by=action_by
            )
            logger.info(f"Deleted user: id={user_id}")
            return result["id"]
        return None

# ตรวจสอบรหัสผ่านผู้ใช้
async def verify_user_password(user_id: int, password: str) -> bool:
    query = "SELECT password FROM users WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": user_id})
    if not result:
        logger.warning(f"User not found for password verification: id={user_id}")
        return False
    stored_password = result["password"]
    is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8'))
    logger.info(f"Verified password for user id={user_id}: {'success' if is_valid else 'failed'}")
    return is_valid

</xaiArtifact>

<xaiArtifact artifact_id="6c6d5d0a-5d03-4298-804f-aebe758c6f8c" artifact_version_id="c086be6d-178e-48ff-b93c-5cbf05f6a509" title="controllers/users/user.py" contentType="text/python">

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import List, Optional, Union
from datetime import datetime, timedelta
import logging
from app.models.users.user import create_user, get_user, update_user, delete_user, get_all_users
from app.models.persons.person import get_person
from app.models.organizations.organization import get_organization
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.schemas.person import PersonOut
from app.schemas.organization import OrganizationOut
from app.config.settings import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ตรวจสอบผู้ใช้จาก JWT token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"Decoded JWT payload: {payload}")
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None:
            logger.error("Invalid token: missing 'sub'")
            raise HTTPException(status_code=401, detail="Invalid token")
        logger.info(f"Authenticated user: id={user_id}, role={role}")
        return {"id": int(user_id), "role": role}
    except JWTError as e:
        logger.error(f"JWT decode failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")

# สร้างผู้ใช้ใหม่ (system_admin เท่านั้น)
@router.post("/", response_model=UserOut)
async def create_user_endpoint(user: UserCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "system_admin":
        logger.warning(f"Unauthorized attempt to create user by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="System admin access required")
    valid_roles = ["system_admin", "hr_admin", "organization_admin", "basetype_admin"]
    if user.role is not None and user.role not in valid_roles:
        logger.warning(f"Invalid role provided: {user.role}")
        raise HTTPException(status_code=422, detail=f"Role must be one of {valid_roles}")
    result = await create_user(user, action_by=current_user["id"])
    if not result:
        logger.warning(f"Failed to create user: {user.email}")
        raise HTTPException(status_code=400, detail="Email already exists")
    logger.info(f"Created user: {user.email}, role={result.role}")
    return result

# ดึงข้อมูลผู้ใช้ปัจจุบัน
@router.get("/me", response_model=Union[UserOut, PersonOut, OrganizationOut])
async def get_current_user_endpoint(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    if role == "person_user":
        result = await get_person(user_id)
        if not result:
            logger.warning(f"Person not found: id={user_id}")
            raise HTTPException(status_code=404, detail="Person not found")
        logger.info(f"Retrieved person: id={user_id}")
        return result
    elif role == "organization_user":
        result = await get_organization(user_id)
        if not result:
            logger.warning(f"Organization not found: id={user_id}")
            raise HTTPException(status_code=404, detail="Organization not found")
        logger.info(f"Retrieved organization: id={user_id}")
        return result
    else:
        result = await get_user(user_id)
        if not result:
            logger.warning(f"User not found: id={user_id}")
            raise HTTPException(status_code=404, detail="User not found")
        logger.info(f"Retrieved user: id={user_id}, role={result.role}")
        return result

# ดึงข้อมูลผู้ใช้ตาม ID (system_admin เท่านั้น)
@router.get("/{user_id}", response_model=UserOut)
async def get_user_endpoint(user_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "system_admin":
        logger.warning(f"Unauthorized attempt to get user by id={user_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="System admin access required")
    result = await get_user(user_id)
    if not result:
        logger.warning(f"User not found: id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    if result.role not in ["system_admin", "hr_admin", "organization_admin", "basetype_admin"]:
        logger.warning(f"Unauthorized attempt to access user with role={result.role} by user: id={current_user['id']}")
        raise HTTPException(status_code=403, detail="Cannot access this user")
    logger.info(f"Retrieved user: id={user_id}, role={result.role}")
    return result

# ดึงข้อมูลผู้ใช้ทั้งหมด (system_admin เท่านั้น)
@router.get("/", response_model=List[UserOut])
async def get_all_users_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "system_admin":
        logger.warning(f"Unauthorized attempt to list all users by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="System admin access required")
    results = await get_all_users()
    filtered_results = [user for user in results if user.role in ["system_admin", "hr_admin", "organization_admin", "basetype_admin"]]
    logger.info(f"Retrieved {len(filtered_results)} users")
    return filtered_results

# อัปเดตข้อมูลผู้ใช้ (system_admin เท่านั้น)
@router.put("/{user_id}", response_model=UserOut)
async def update_user_endpoint(user_id: int, user: UserUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "system_admin":
        logger.warning(f"Unauthorized attempt to update user by id={user_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="System admin access required")
    target_user = await get_user(user_id)
    if not target_user:
        logger.warning(f"User not found for update: id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.role not in ["system_admin", "hr_admin", "organization_admin", "basetype_admin"]:
        logger.warning(f"Unauthorized attempt to update user with role={target_user.role} by user: id={current_user['id']}")
        raise HTTPException(status_code=403, detail="Cannot update this user")
    valid_roles = ["system_admin", "hr_admin", "organization_admin", "basetype_admin"]
    if user.role is not None and user.role not in valid_roles:
        logger.warning(f"Invalid role provided: {user.role}")
        raise HTTPException(status_code=422, detail=f"Role must be one of {valid_roles}")
    result = await update_user(user_id, user, action_by=current_user["id"])
    if not result:
        logger.warning(f"User not found for update: id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"Updated user: id={user_id}, role={result.role}")
    return result

# ลบผู้ใช้ (system_admin เท่านั้น)
@router.delete("/{user_id}")
async def delete_user_endpoint(user_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "system_admin":
        logger.warning(f"Unauthorized attempt to delete user by id={user_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="System admin access required")
    target_user = await get_user(user_id)
    if not target_user:
        logger.warning(f"User not found for deletion: id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.role not in ["system_admin", "hr_admin", "organization_admin", "basetype_admin"]:
        logger.warning(f"Unauthorized attempt to delete user with role={target_user.role} by user: id={current_user['id']}")
        raise HTTPException(status_code=403, detail="Cannot delete this user")
    result = await delete_user(user_id, action_by=current_user["id"])
    if not result:
        logger.warning(f"User not found for deletion: id={user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"Deleted user: id={user_id}")
    return {"message": "User deleted"}

# สร้าง JWT access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

</xaiArtifact>

<xaiArtifact artifact_id="2f178ce4-6405-4d0a-93ea-403576a44e5f" artifact_version_id="9567bed0-d949-466c-9828-5e78c8534e8d" title="controllers/persons/person.py" contentType="text/python">

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
import logging
from app.models.persons.person import create_person, get_person, update_person, delete_person, get_all_persons
from app.schemas.person import PersonCreate, PersonUpdate, PersonOut
from app.controllers.users.user import get_current_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/persons", tags=["persons"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# สร้าง person ใหม่ (hr_admin เท่านั้น)
@router.post("/", response_model=PersonOut)
async def create_person_endpoint(person: PersonCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "hr_admin":
        logger.warning(f"Unauthorized attempt to create person by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="HR admin access required")
    result = await create_person(person, action_by=current_user["id"])
    if not result:
        logger.warning(f"Failed to create person: {person.email}")
        raise HTTPException(status_code=400, detail="Email or personal ID number already exists")
    logger.info(f"Created person: id={result.id}")
    return result

# ดึงข้อมูล person ตาม ID (hr_admin เท่านั้น)
@router.get("/{person_id}", response_model=PersonOut)
async def get_person_endpoint(person_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "hr_admin":
        logger.warning(f"Unauthorized attempt to get person by id={person_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="HR admin access required")
    result = await get_person(person_id)
    if not result:
        logger.warning(f"Person not found: id={person_id}")
        raise HTTPException(status_code=404, detail="Person not found")
    logger.info(f"Retrieved person: id={person_id}")
    return result

# ดึงข้อมูล person ทั้งหมด (hr_admin เท่านั้น)
@router.get("/", response_model=List[PersonOut])
async def get_all_persons_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "hr_admin":
        logger.warning(f"Unauthorized attempt to list all persons by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="HR admin access required")
    results = await get_all_persons()
    logger.info(f"Retrieved {len(results)} persons")
    return results

# อัปเดตข้อมูล person (hr_admin เท่านั้น)
@router.put("/{person_id}", response_model=PersonOut)
async def update_person_endpoint(person_id: int, person: PersonUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "hr_admin":
        logger.warning(f"Unauthorized attempt to update person by id={person_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="HR admin access required")
    result = await update_person(person_id, person, action_by=current_user["id"])
    if not result:
        logger.warning(f"Person not found for update: id={person_id}")
        raise HTTPException(status_code=404, detail="Person not found")
    logger.info(f"Updated person: id={person_id}")
    return result

# ลบ person (hr_admin เท่านั้น)
@router.delete("/{person_id}")
async def delete_person_endpoint(person_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "hr_admin":
        logger.warning(f"Unauthorized attempt to delete person by id={person_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="HR admin access required")
    result = await delete_person(person_id, action_by=current_user["id"])
    if not result:
        logger.warning(f"Person not found for deletion: id={person_id}")
        raise HTTPException(status_code=404, detail="Person not found")
    logger.info(f"Deleted person: id={person_id}")
    return {"message": "Person deleted"}

</xaiArtifact>

<xaiArtifact artifact_id="34294ce7-a49a-420c-9bbe-6f920cf316e0" artifact_version_id="d5b094de-7620-489a-873f-807643b96f31" title="controllers/organizations/organization.py" contentType="text/python">

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

# ดึงข้อมูล organization ตาม ID (organization_admin เท่านั้น)
@router.get("/{organization_id}", response_model=OrganizationOut)
async def get_organization_endpoint(organization_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "organization_admin":
        logger.warning(f"Unauthorized attempt to get organization by id={organization_id} by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Organization admin access required")
    result = await get_organization(organization_id)
    if not result:
        logger.warning(f"Organization not found: id={organization_id}")
        raise HTTPException(status_code=404, detail="Organization not found")
    logger.info(f"Retrieved organization: id={organization_id}")
    return result

# ดึงข้อมูล organization ทั้งหมด (organization_admin เท่านั้น)
@router.get("/", response_model=List[OrganizationOut])
async def get_all_organizations_endpoint(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "organization_admin":
        logger.warning(f"Unauthorized attempt to list all organizations by user: id={current_user['id']}, role={current_user['role']}")
        raise HTTPException(status_code=403, detail="Organization admin access required")
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

</xaiArtifact>