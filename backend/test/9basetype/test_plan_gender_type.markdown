# Test Plan for Gender Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create gender type 1 | POST | /gender_types/ | Valid basetype_admin token | `{"description": "Male"}` | Returns GenderTypeOut with id, description="Male", HTTP 200 |
| Create gender type 2 | POST | /gender_types/ | Valid basetype_admin token | `{"description": "Female"}` | Returns GenderTypeOut with id, description="Female", HTTP 200 |
| List all gender types | GET | /gender_types/ | Valid basetype_admin token | None | Returns list of GenderTypeOut including Male and Female, HTTP 200 |
| Get gender type by ID | GET | /gender_types/1 | Valid basetype_admin token | None | Returns GenderTypeOut with id=1, description="Male", HTTP 200 |
| Update gender type 1 | PUT | /gender_types/1 | Valid basetype_admin token | `{"description": "Updated Male"}` | Returns updated GenderTypeOut with description="Updated Male", HTTP 200 |
| Update gender type 2 | PUT | /gender_types/2 | Valid basetype_admin token | `{"description": "Updated Female"}` | Returns updated GenderTypeOut with description="Updated Female", HTTP 200 |
| List all gender types after update | GET | /gender_types/ | Valid basetype_admin token | None | Returns list of GenderTypeOut including Updated Male and Updated Female, HTTP 200 |
| Delete gender type 1 | DELETE | /gender_types/1 | Valid basetype_admin token | None | Returns {"message": "Gender type deleted"}, HTTP 200 |
| Delete gender type 2 | DELETE | /gender_types/2 | Valid basetype_admin token | None | Returns {"message": "Gender type deleted"}, HTTP 200 |
| List all gender types after delete | GET | /gender_types/ | Valid basetype_admin token | None | Returns empty list or remaining GenderTypeOut, HTTP 200 |