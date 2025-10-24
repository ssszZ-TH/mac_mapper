# Test Plan for Organization Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create organization type 1 | POST | /organization_types/ | Valid basetype_admin token | `{"description": "Corporation"}` | Returns OrganizationTypeOut with id, description="Corporation", HTTP 200 |
| Create organization type 2 | POST | /organization_types/ | Valid basetype_admin token | `{"description": "Non-Profit"}` | Returns OrganizationTypeOut with id, description="Non-Profit", HTTP 200 |
| List all organization types | GET | /organization_types/ | Valid basetype_admin token | None | Returns list of OrganizationTypeOut including Corporation and Non-Profit, HTTP 200 |
| Get organization type by ID | GET | /organization_types/1 | Valid basetype_admin token | None | Returns OrganizationTypeOut with id=1, description="Corporation", HTTP 200 |
| Update organization type 1 | PUT | /organization_types/1 | Valid basetype_admin token | `{"description": "Updated Corporation"}` | Returns updated OrganizationTypeOut with description="Updated Corporation", HTTP 200 |
| Update organization type 2 | PUT | /organization_types/2 | Valid basetype_admin token | `{"description": "Updated Non-Profit"}` | Returns updated OrganizationTypeOut with description="Updated Non-Profit", HTTP 200 |
| List all organization types after update | GET | /organization_types/ | Valid basetype_admin token | None | Returns list of OrganizationTypeOut including Updated Corporation and Updated Non-Profit, HTTP 200 |
| Delete organization type 1 | DELETE | /organization_types/1 | Valid basetype_admin token | None | Returns {"message": "Organization type deleted"}, HTTP 200 |
| Delete organization type 2 | DELETE | /organization_types/2 | Valid basetype_admin token | None | Returns {"message": "Organization type deleted"}, HTTP 200 |
| List all organization types after delete | GET | /organization_types/ | Valid basetype_admin token | None | Returns empty list or remaining OrganizationTypeOut, HTTP 200 |