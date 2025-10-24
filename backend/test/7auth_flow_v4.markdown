# Test Plan for User Management API (Simplified)

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Register system admin | POST | /auth/register | None | `{"username": "sysadmin1", "email": "sysadmin1@example.com", "password": "securepass123", "role": "system_admin"}` | 200, UserOut with system_admin role |
| Login system admin | POST | /auth/login | None | `{"email": "sysadmin1@example.com", "password": "securepass123"}` | 200, access_token |
| Create hr admin | POST | /users | System admin token | `{"username": "hradmin1", "email": "hradmin1@example.com", "password": "securepass123", "role": "hr_admin"}` | 200, UserOut with hr_admin role |
| Create organization admin | POST | /users | System admin token | `{"username": "orgadmin1", "email": "orgadmin1@example.com", "password": "securepass123", "role": "organization_admin"}` | 200, UserOut with organization_admin role |
| Create basetype admin | POST | /users | System admin token | `{"username": "basetypeadmin1", "email": "basetypeadmin1@example.com", "password": "securepass123", "role": "basetype_admin"}` | 200, UserOut with basetype_admin role |
| System admin updates hr admin username | PUT | /users/{hr_admin_id} | System admin token | `{"username": "hradmin_updated"}` | 200, UserOut with updated username |
| System admin updates hr admin password | PUT | /users/{hr_admin_id} | System admin token | `{"password": "newpass123"}` | 200, UserOut |
| Login hr admin with new credentials | POST | /auth/login | None | `{"email": "hradmin1@example.com", "password": "newpass123"}` | 200, access_token |
| System admin reverts hr admin credentials | PUT | /users/{hr_admin_id} | System admin token | `{"username": "hradmin1", "password": "securepass123"}` | 200, UserOut with original credentials |
| System admin updates org admin username | PUT | /users/{org_admin_id} | System admin token | `{"username": "orgadmin_updated"}` | 200, UserOut with updated username |
| System admin updates org admin password | PUT | /users/{org_admin_id} | System admin token | `{"password": "newpass123"}` | 200, UserOut |
| Login org admin with new credentials | POST | /auth/login | None | `{"email": "orgadmin1@example.com", "password": "newpass123"}` | 200, access_token |
| System admin reverts org admin credentials | PUT | /users/{org_admin_id} | System admin token | `{"username": "orgadmin1", "password": "securepass123"}` | 200, UserOut with original credentials |
| System admin updates basetype admin username | PUT | /users/{basetype_admin_id} | System admin token | `{"username": "basetypeadmin_updated"}` | 200, UserOut with updated username |
| System admin updates basetype admin password | PUT | /users/{basetype_admin_id} | System admin token | `{"password": "newpass123"}` | 200, UserOut |
| Login basetype admin with new credentials | POST | /auth/login | None | `{"email": "basetypeadmin1@example.com", "password": "newpass123"}` | 200, access_token |
| System admin reverts basetype admin credentials | PUT | /users/{basetype_admin_id} | System admin token | `{"username": "basetypeadmin1", "password": "securepass123"}` | 200, UserOut with original credentials |
| Get all users by system admin | GET | /users | System admin token | None | 200, List of UserOut |
| Get hr admin by system admin | GET | /users/{hr_admin_id} | System admin token | None | 200, UserOut |
| Get org admin by system admin | GET | /users/{org_admin_id} | System admin token | None | 200, UserOut |
| Get basetype admin by system admin | GET | /users/{basetype_admin_id} | System admin token | None | 200, UserOut |
| System admin gets own data | GET | /users/me | System admin token | None | 200, UserOut with own data |
| Delete hr admin by system admin | DELETE | /users/{hr_admin_id} | System admin token | None | 200, "User deleted" |
| Delete org admin by system admin | DELETE | /users/{org_admin_id} | System admin token | None | 200, "User deleted" |
| Delete basetype admin by system admin | DELETE | /users/{basetype_admin_id} | System admin token | None | 200, "User deleted" |
| Recreate hr admin | POST | /users | System admin token | `{"username": "hradmin1", "email": "hradmin1@example.com", "password": "securepass123", "role": "hr_admin"}` | 200, UserOut with hr_admin role |
| Recreate org admin | POST | /users | System admin token | `{"username": "orgadmin1", "email": "orgadmin1@example.com", "password": "securepass123", "role": "organization_admin"}` | 200, UserOut with organization_admin role |
| Recreate basetype admin | POST | /users | System admin token | `{"username": "basetypeadmin1", "email": "basetypeadmin1@example.com", "password": "securepass123", "role": "basetype_admin"}` | 200, UserOut with basetype_admin role |
| Hr admin creates person user | POST | /persons | Hr admin token | `{"username": "person1", "email": "person1@example.com", "password": "securepass123", "personal_id_number": "1234567890123", "first_name": "John", "last_name": "Doe", "birth_date": "1990-01-01", "height": 170, "weight": 70}` | 200, PersonOut with person_user role |
| Login person user | POST | /auth/login | None | `{"email": "person1@example.com", "password": "securepass123"}` | 200, access_token |
| Organization admin creates org user | POST | /organizations | Organization admin token | `{"username": "org1", "email": "org1@example.com", "password": "securepass123", "name_en": "Org One", "federal_tax_id": "987654321"}` | 200, OrganizationOut with organization_user role |
| Login organization user | POST | /auth/login | None | `{"email": "org1@example.com", "password": "securepass123"}` | 200, access_token |
| Hr admin creates another person user | POST | /persons | Hr admin token | `{"username": "person2", "email": "person2@example.com", "password": "securepass123", "personal_id_number": "9876543210123", "first_name": "Jane", "last_name": "Doe", "birth_date": "1992-02-02", "height": 165, "weight": 60}` | 200, PersonOut |
| Hr admin gets person user | GET | /persons/{person2_id} | Hr admin token | None | 200, PersonOut |
| Hr admin gets all persons | GET | /persons | Hr admin token | None | 200, List of PersonOut |
| Hr admin updates person user | PUT | /persons/{person2_id} | Hr admin token | `{"first_name": "Janet"}` | 200, PersonOut with updated first_name |
| Hr admin deletes person user | DELETE | /persons/{person2_id} | Hr admin token | None | 200, "Person deleted" |
| Organization admin creates another org user | POST | /organizations | Organization admin token | `{"username": "org2", "email": "org2@example.com", "password": "securepass123", "name_en": "Org Two", "federal_tax_id": "123456789"}` | 200, OrganizationOut |
| Organization admin gets org user | GET | /organizations/{org2_id} | Organization admin token | None | 200, OrganizationOut |
| Organization admin gets all orgs | GET | /organizations | Organization admin token | None | 200, List of OrganizationOut |
| Organization admin updates org user | PUT | /organizations/{org2_id} | Organization admin token | `{"name_en": "Org Two Updated"}` | 200, OrganizationOut with updated name_en |
| Organization admin deletes org user | DELETE | /organizations/{org2_id} | Organization admin token | None | 200, "Organization deleted" |
| Unauthorized user creation by hr admin | POST | /users | Hr admin token | `{"username": "testuser", "email": "testuser@example.com", "password": "securepass123", "role": "hr_admin"}` | 403, "System admin access required" |
| Unauthorized user creation by org admin | POST | /users | Organization admin token | `{"username": "testuser", "email": "testuser@example.com", "password": "securepass123", "role": "organization_admin"}` | 403, "System admin access required" |
| Unauthorized user creation by person user | POST | /users | Person user token | `{"username": "testuser", "email": "testuser@example.com", "password": "securepass123", "role": "hr_admin"}` | 403, "System admin access required" |
| Unauthorized user creation by org user | POST | /users | Organization user token | `{"username": "testuser", "email": "testuser@example.com", "password": "securepass123", "role": "organization_admin"}` | 403, "System admin access required" |
| Unauthorized person creation by system admin | POST | /persons | System admin token | `{"username": "person3", "email": "person3@example.com", "password": "securepass123", "personal_id_number": "1112223334445", "first_name": "Bob", "last_name": "Smith", "birth_date": "1985-03-03", "height": 180, "weight": 80}` | 403, "HR admin access required" |
| Unauthorized person creation by org admin | POST | /persons | Organization admin token | `{"username": "person3", "email": "person3@example.com", "password": "securepass123", "personal_id_number": "1112223334445", "first_name": "Bob", "last_name": "Smith", "birth_date": "1985-03-03", "height": 180, "weight": 80}` | 403, "HR admin access required" |
| Unauthorized person creation by person user | POST | /persons | Person user token | `{"username": "person3", "email": "person3@example.com", "password": "securepass123", "personal_id_number": "1112223334445", "first_name": "Bob", "last_name": "Smith", "birth_date": "1985-03-03", "height": 180, "weight": 80}` | 403, "HR admin access required" |
| Unauthorized person creation by org user | POST | /persons | Organization user token | `{"username": "person3", "email": "person3@example.com", "password": "securepass123", "personal_id_number": "1112223334445", "first_name": "Bob", "last_name": "Smith", "birth_date": "1985-03-03", "height": 180, "weight": 80}` | 403, "HR admin access required" |
| Unauthorized org creation by system admin | POST | /organizations | System admin token | `{"username": "org3", "email": "org3@example.com", "password": "securepass123", "name_en": "Org Three", "federal_tax_id": "112233445"}` | 403, "Organization admin access required" |
| Unauthorized org creation by hr admin | POST | /organizations | Hr admin token | `{"username": "org3", "email": "org3@example.com", "password": "securepass123", "name_en": "Org Three", "federal_tax_id": "112233445"}` | 403, "Organization admin access required" |
| Unauthorized org creation by person user | POST | /organizations | Person user token | `{"username": "org3", "email": "org3@example.com", "password": "securepass123", "name_en": "Org Three", "federal_tax_id": "112233445"}` | 403, "Organization admin access required" |
| Unauthorized org creation by org user | POST | /organizations | Organization user token | `{"username": "org3", "email": "org3@example.com", "password": "securepass123", "name_en": "Org Three", "federal_tax_id": "112233445"}` | 403, "Organization admin access required" |
| Unauthorized person get by system admin | GET | /persons/{person1_id} | System admin token | None | 403, "HR admin access required" |
| Unauthorized person get by org admin | GET | /persons/{person1_id} | Organization admin token | None | 403, "HR admin access required" |
| Unauthorized person get by person user | GET | /persons/{person1_id} | Person user token | None | 403, "HR admin access required" |
| Unauthorized person get by org user | GET | /persons/{person1_id} | Organization user token | None | 403, "HR admin access required" |
| Unauthorized org get by system admin | GET | /organizations/{org1_id} | System admin token | None | 403, "Organization admin access required" |
| Unauthorized org get by hr admin | GET | /organizations/{org1_id} | Hr admin token | None | 403, "Organization admin access required" |
| Unauthorized org get by person user | GET | /organizations/{org1_id} | Person user token | None | 403, "Organization admin access required" |
| Unauthorized org get by org user | GET | /organizations/{org1_id} | Organization user token | None | 403, "Organization admin access required" |
| System admin updates person user username | PUT | /users/{person1_id} | System admin token | `{"username": "person1_updated"}` | 403, "Cannot update this user" |
| System admin updates person user password | PUT | /users/{person1_id} | System admin token | `{"password": "newpass123"}` | 403, "Cannot update this user" |
| System admin updates org user username | PUT | /users/{org1_id} | System admin token | `{"username": "org1_updated"}` | 403, "Cannot update this user" |
| System admin updates org user password | PUT | /users/{org1_id} | System admin token | `{"password": "newpass123"}` | 403, "Cannot update this user" |
| Hr admin updates person user username | PUT | /users/{person1_id} | Hr admin token | `{"username": "person1_updated"}` | 403, "System admin access required" |
| Hr admin updates person user password | PUT | /users/{person1_id} | Hr admin token | `{"password": "newpass123"}` | 403, "System admin access required" |
| Organization admin updates org user username | PUT | /users/{org1_id} | Organization admin token | `{"username": "org1_updated"}` | 403, "System admin access required" |
| Organization admin updates org user password | PUT | /users/{org1_id} | Organization admin token | `{"password": "newpass123"}` | 403, "System admin access required" |
| Person user accesses own data | GET | /users/me | Person user token | None | 200, PersonOut with own data |
| Organization user accesses own data | GET | /users/me | Organization user token | None | 200, OrganizationOut with own data |
| Invalid login credentials | POST | /auth/login | None | `{"email": "sysadmin1@example.com", "password": "wrongpass"}` | 401, "Invalid email or password" |
| Register with existing email | POST | /auth/register | None | `{"username": "sysadmin2", "email": "sysadmin1@example.com", "password": "securepass123", "role": "system_admin"}` | 400, "Email already exists" |
| Register with invalid role | POST | /auth/register | None | `{"username": "testuser", "email": "testuser@example.com", "password": "securepass123", "role": "invalid_role"}` | 422, "Role must be one of [system_admin, hr_admin, organization_admin]" |
| Get non-existent user | GET | /users/{invalid_id} | System admin token | None | 404, "User not found" |
| Get non-existent person | GET | /persons/{invalid_id} | Hr admin token | None | 404, "Person not found" |
| Get non-existent organization | GET | /organizations/{invalid_id} | Organization admin token | None | 404, "Organization not found" |