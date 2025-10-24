# Test Plan for Industry Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create industry type 1 | POST | /industry_types/ | Valid basetype_admin token | `{"naisc": "1111", "description": "Agriculture"}` | Returns IndustryTypeOut with id, naisc="1111", description="Agriculture", HTTP 200 |
| Create industry type 2 | POST | /industry_types/ | Valid basetype_admin token | `{"naisc": "2222", "description": "Manufacturing"}` | Returns IndustryTypeOut with id, naisc="2222", description="Manufacturing", HTTP 200 |
| List all industry types | GET | /industry_types/ | Valid basetype_admin token | None | Returns list of IndustryTypeOut including Agriculture and Manufacturing, HTTP 200 |
| Get industry type by ID | GET | /industry_types/1 | Valid basetype_admin token | None | Returns IndustryTypeOut with id=1, naisc="1111", description="Agriculture", HTTP 200 |
| Update industry type 1 | PUT | /industry_types/1 | Valid basetype_admin token | `{"description": "Updated Agriculture"}` | Returns updated IndustryTypeOut with description="Updated Agriculture", HTTP 200 |
| Update industry type 2 | PUT | /industry_types/2 | Valid basetype_admin token | `{"naisc": "2223"}` | Returns updated IndustryTypeOut with naisc="2223", HTTP 200 |
| List all industry types after update | GET | /industry_types/ | Valid basetype_admin token | None | Returns list of IndustryTypeOut including Updated Agriculture and naisc="2223", HTTP 200 |
| Delete industry type 1 | DELETE | /industry_types/1 | Valid basetype_admin token | None | Returns {"message": "Industry type deleted"}, HTTP 200 |
| Delete industry type 2 | DELETE | /industry_types/2 | Valid basetype_admin token | None | Returns {"message": "Industry type deleted"}, HTTP 200 |
| List all industry types after delete | GET | /industry_types/ | Valid basetype_admin token | None | Returns empty list or remaining IndustryTypeOut, HTTP 200 |