# Test Plan for Racial Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create racial type 1 | POST | /racial_types/ | Valid basetype_admin token | `{"description": "Asian"}` | Returns RacialTypeOut with id, description="Asian", HTTP 200 |
| Create racial type 2 | POST | /racial_types/ | Valid basetype_admin token | `{"description": "Caucasian"}` | Returns RacialTypeOut with id, description="Caucasian", HTTP 200 |
| List all racial types | GET | /racial_types/ | Valid basetype_admin token | None | Returns list of RacialTypeOut including Asian and Caucasian, HTTP 200 |
| Get racial type by ID | GET | /racial_types/1 | Valid basetype_admin token | None | Returns RacialTypeOut with id=1, description="Asian", HTTP 200 |
| Update racial type 1 | PUT | /racial_types/1 | Valid basetype_admin token | `{"description": "Updated Asian"}` | Returns updated RacialTypeOut with description="Updated Asian", HTTP 200 |
| Update racial type 2 | PUT | /racial_types/2 | Valid basetype_admin token | `{"description": "Updated Caucasian"}` | Returns updated RacialTypeOut with description="Updated Caucasian", HTTP 200 |
| List all racial types after update | GET | /racial_types/ | Valid basetype_admin token | None | Returns list of RacialTypeOut including Updated Asian and Updated Caucasian, HTTP 200 |
| Delete racial type 1 | DELETE | /racial_types/1 | Valid basetype_admin token | None | Returns {"message": "Racial type deleted"}, HTTP 200 |
| Delete racial type 2 | DELETE | /racial_types/2 | Valid basetype_admin token | None | Returns {"message": "Racial type deleted"}, HTTP 200 |
| List all racial types after delete | GET | /racial_types/ | Valid basetype_admin token | None | Returns empty list or remaining RacialTypeOut, HTTP 200 |