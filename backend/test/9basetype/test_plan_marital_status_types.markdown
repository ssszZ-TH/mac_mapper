# Test Plan for Marital Status Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create marital status type 1 | POST | /marital_status_types/ | Valid basetype_admin token | `{"description": "Single"}` | Returns MaritalStatusTypeOut with id, description="Single", HTTP 200 |
| Create marital status type 2 | POST | /marital_status_types/ | Valid basetype_admin token | `{"description": "Married"}` | Returns MaritalStatusTypeOut with id, description="Married", HTTP 200 |
| List all marital status types | GET | /marital_status_types/ | Valid basetype_admin token | None | Returns list of MaritalStatusTypeOut including Single and Married, HTTP 200 |
| Get marital status type by ID | GET | /marital_status_types/1 | Valid basetype_admin token | None | Returns MaritalStatusTypeOut with id=1, description="Single", HTTP 200 |
| Update marital status type 1 | PUT | /marital_status_types/1 | Valid basetype_admin token | `{"description": "Updated Single"}` | Returns updated MaritalStatusTypeOut with description="Updated Single", HTTP 200 |
| Update marital status type 2 | PUT | /marital_status_types/2 | Valid basetype_admin token | `{"description": "Updated Married"}` | Returns updated MaritalStatusTypeOut with description="Updated Married", HTTP 200 |
| List all marital status types after update | GET | /marital_status_types/ | Valid basetype_admin token | None | Returns list of MaritalStatusTypeOut including Updated Single and Updated Married, HTTP 200 |
| Delete marital status type 1 | DELETE | /marital_status_types/1 | Valid basetype_admin token | None | Returns {"message": "Marital status type deleted"}, HTTP 200 |
| Delete marital status type 2 | DELETE | /marital_status_types/2 | Valid basetype_admin token | None | Returns {"message": "Marital status type deleted"}, HTTP 200 |
| List all marital status types after delete | GET | /marital_status_types/ | Valid basetype_admin token | None | Returns empty list or remaining MaritalStatusTypeOut, HTTP 200 |