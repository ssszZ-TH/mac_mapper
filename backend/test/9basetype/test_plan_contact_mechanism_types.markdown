# Test Plan for Contact Mechanism Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create contact mechanism type 1 | POST | /contact_mechanism_types/ | Valid basetype_admin token | `{"description": "Email"}` | Returns ContactMechanismTypeOut with id, description="Email", HTTP 200 |
| Create contact mechanism type 2 | POST | /contact_mechanism_types/ | Valid basetype_admin token | `{"description": "Phone"}` | Returns ContactMechanismTypeOut with id, description="Phone", HTTP 200 |
| List all contact mechanism types | GET | /contact_mechanism_types/ | Valid basetype_admin token | None | Returns list of ContactMechanismTypeOut including Email and Phone, HTTP 200 |
| Get contact mechanism type by ID | GET | /contact_mechanism_types/1 | Valid basetype_admin token | None | Returns ContactMechanismTypeOut with id=1, description="Email", HTTP 200 |
| Update contact mechanism type 1 | PUT | /contact_mechanism_types/1 | Valid basetype_admin token | `{"description": "Updated Email"}` | Returns updated ContactMechanismTypeOut with description="Updated Email", HTTP 200 |
| Update contact mechanism type 2 | PUT | /contact_mechanism_types/2 | Valid basetype_admin token | `{"description": "Updated Phone"}` | Returns updated ContactMechanismTypeOut with description="Updated Phone", HTTP 200 |
| List all contact mechanism types after update | GET | /contact_mechanism_types/ | Valid basetype_admin token | None | Returns list of ContactMechanismTypeOut including Updated Email and Updated Phone, HTTP 200 |
| Delete contact mechanism type 1 | DELETE | /contact_mechanism_types/1 | Valid basetype_admin token | None | Returns {"message": "Contact mechanism type deleted"}, HTTP 200 |
| Delete contact mechanism type 2 | DELETE | /contact_mechanism_types/2 | Valid basetype_admin token | None | Returns {"message": "Contact mechanism type deleted"}, HTTP 200 |
| List all contact mechanism types after delete | GET | /contact_mechanism_types/ | Valid basetype_admin token | None | Returns empty list or remaining ContactMechanismTypeOut, HTTP 200 |