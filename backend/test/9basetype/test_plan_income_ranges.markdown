# Test Plan for Income Range API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create income range 1 | POST | /income_ranges/ | Valid basetype_admin token | `{"description": "0-50000"}` | Returns IncomeRangeOut with id, description="0-50000", HTTP 200 |
| Create income range 2 | POST | /income_ranges/ | Valid basetype_admin token | `{"description": "50001-100000"}` | Returns IncomeRangeOut with id, description="50001-100000", HTTP 200 |
| List all income ranges | GET | /income_ranges/ | Valid basetype_admin token | None | Returns list of IncomeRangeOut including 0-50000 and 50001-100000, HTTP 200 |
| Get income range by ID | GET | /income_ranges/1 | Valid basetype_admin token | None | Returns IncomeRangeOut with id=1, description="0-50000", HTTP 200 |
| Update income range 1 | PUT | /income_ranges/1 | Valid basetype_admin token | `{"description": "Updated 0-50000"}` | Returns updated IncomeRangeOut with description="Updated 0-50000", HTTP 200 |
| Update income range 2 | PUT | /income_ranges/2 | Valid basetype_admin token | `{"description": "Updated 50001-100000"}` | Returns updated IncomeRangeOut with description="Updated 50001-100000", HTTP 200 |
| List all income ranges after update | GET | /income_ranges/ | Valid basetype_admin token | None | Returns list of IncomeRangeOut including Updated 0-50000 and Updated 50001-100000, HTTP 200 |
| Delete income range 1 | DELETE | /income_ranges/1 | Valid basetype_admin token | None | Returns {"message": "Income range deleted"}, HTTP 200 |
| Delete income range 2 | DELETE | /income_ranges/2 | Valid basetype_admin token | None | Returns {"message": "Income range deleted"}, HTTP 200 |
| List all income ranges after delete | GET | /income_ranges/ | Valid basetype_admin token | None | Returns empty list or remaining IncomeRangeOut, HTTP 200 |