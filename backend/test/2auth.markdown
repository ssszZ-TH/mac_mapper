| Method | Part | JWT Bearer | Body Payload | Expected Result |
| --- | --- | --- | --- | --- |
| POST | /users/register | None | `{"username": "sysadmin1", "email": "sysadmin1@example.com", "password": "securepass123", "role": "system_admin"}` | Status 200, returns UserOut with id, username, email, role="system_admin" |
| POST | /auth/login | None | `{"email": "sysadmin1@example.com", "password": "securepass123"}` | Status 200, returns access_token |
| POST | /users | Valid token (system_admin) | `{"username": "hradmin1", "email": "hradmin1@example.com", "password": "securepass123", "role": "hr_admin"}` | Status 200, returns UserOut with id, username, email, role="hr_admin" |
| POST | /users | Valid token (system_admin) | `{"username": "orgadmin1", "email": "orgadmin1@example.com", "password": "securepass123", "role": "organization_admin"}` | Status 200, returns UserOut with id, username, email, role="organization_admin" |
| POST | /persons/register | None | `{"username": "person1", "email": "person1@example.com", "password": "securepass123", "personal_id_number": "1234567890123", "first_name": "John", "last_name": "Doe", "birth_date": "1990-01-01", "height": 170, "weight": 70}` | Status 200, returns PersonOut with id, username, email, personal_id_number, role="person_user" |
| POST | /organizations/register | None | `{"username": "org1", "email": "org1@example.com", "password": "securepass123", "name_en": "Org One", "federal_tax_id": "987654321"}` | Status 200, returns OrganizationOut with id, username, email, name_en, role="organization_user" |
| POST | /auth/login | None | `{"email": "hradmin1@example.com", "password": "securepass123"}` | Status 200, returns access_token for hr_admin |
| POST | /persons | Valid token (hr_admin) | `{"username": "person2", "email": "person2@example.com", "password": "securepass123", "personal_id_number": "9876543210987", "first_name": "Jane", "last_name": "Smith", "birth_date": "1995-02-02", "height": 165, "weight": 55}` | Status 200, returns PersonOut with id, username, email, personal_id_number, role="person_user" |
| POST | /auth/login | None | `{"email": "orgadmin1@example.com", "password": "securepass123"}` | Status 200, returns access_token for organization_admin |
| POST | /organizations | Valid token (organization_admin) | `{"username": "org2", "email": "org2@example.com", "password": "securepass123", "name_en": "Org Two", "federal_tax_id": "123456789"}` | Status 200, returns OrganizationOut with id, username, email, name_en, role="organization_user" |
| GET | /users/me | Valid token (system_admin) | None | Status 200, returns UserOut for sysadmin1 |
| GET | /users/2 | Valid token (system_admin) | None | Status 200, returns UserOut for hradmin1 |
| GET | /users | Valid token (system_admin) | None | Status 200, returns list of UserOut with system_admin, hr_admin, organization_admin roles only |
| GET | /persons/me | Valid token (person_user) | None | Status 200, returns PersonOut for person1 |
| GET | /persons/4 | Valid token (hr_admin) | None | Status 200, returns PersonOut for person1 |
| GET | /persons | Valid token (hr_admin) | None | Status 200, returns list of PersonOut for all persons |
| GET | /organizations/me | Valid token (organization_user) | None | Status 200, returns OrganizationOut for org1 |
| GET | /organizations/5 | Valid token (organization_admin) | None | Status 200, returns OrganizationOut for org1 |
| GET | /organizations | Valid token (organization_admin) | None | Status 200, returns list of OrganizationOut for all organizations |
| PUT | /users/me | Valid token (system_admin) | `{"username": "sysadmin_updated"}` | Status 200, returns updated UserOut for sysadmin1 |
| PUT | /users/2 | Valid token (system_admin) | `{"username": "hradmin_updated", "role": "hr_admin"}` | Status 200, returns updated UserOut for hradmin1 |
| PUT | /persons/me | Valid token (person_user) | `{"first_name": "John Updated"}` | Status 200, returns updated PersonOut for person1 |
| PUT | /persons/4 | Valid token (hr_admin) | `{"first_name": "Jane Updated"}` | Status 200, returns updated PersonOut for person2 |
| PUT | /organizations/me | Valid token (organization_user) | `{"name_en": "Org One Updated"}` | Status 200, returns updated OrganizationOut for org1 |
| PUT | /organizations/5 | Valid token (organization_admin) | `{"name_en": "Org Two Updated"}` | Status 200, returns updated OrganizationOut for org2 |
| DELETE | /users/me | Valid token (hr_admin) | None | Status 200, returns {"message": "User deleted"} for hradmin1 |
| DELETE | /persons/me | Valid token (person_user) | None | Status 200, returns {"message": "Person deleted"} for person1 |
| DELETE | /organizations/me | Valid token (organization_user) | None | Status 200, returns {"message": "Organization deleted"} for org1 |
| DELETE | /users/3 | Valid token (system_admin) | None | Status 200, returns {"message": "User deleted"} for orgadmin1 |
| DELETE | /persons/4 | Valid token (hr_admin) | None | Status 200, returns {"message": "Person deleted"} for person2 |
| DELETE | /organizations/5 | Valid token (organization_admin) | None | Status 200, returns {"message": "Organization deleted"} for org2 |
