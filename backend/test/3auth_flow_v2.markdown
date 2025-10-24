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