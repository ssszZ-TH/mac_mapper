# Test Plan for Country API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create country 1 | POST | /countries/ | Valid basetype_admin token | `{"iso_code": "US", "name_en": "United States", "name_th": "สหรัฐอเมริกา"}` | Returns CountryOut with id, iso_code="US", name_en="United States", name_th="สหรัฐอเมริกา", HTTP 200 |
| Create country 2 | POST | /countries/ | Valid basetype_admin token | `{"iso_code": "TH", "name_en": "Thailand", "name_th": "ประเทศไทย"}` | Returns CountryOut with id, iso_code="TH", name_en="Thailand", name_th="ประเทศไทย", HTTP 200 |
| List all countries | GET | /countries/ | Valid basetype_admin token | None | Returns list of CountryOut including US and TH, HTTP 200 |
| Get country by ID | GET | /countries/1 | Valid basetype_admin token | None | Returns CountryOut with id=1, iso_code="US", name_en="United States", name_th="สหรัฐอเมริกา", HTTP 200 |
| Update country 1 | PUT | /countries/1 | Valid basetype_admin token | `{"name_en": "Updated United States"}` | Returns updated CountryOut with name_en="Updated United States", HTTP 200 |
| Update country 2 | PUT | /countries/2 | Valid basetype_admin token | `{"name_th": "Updated ประเทศไทย"}` | Returns updated CountryOut with name_th="Updated ประเทศไทย", HTTP 200 |
| List all countries after update | GET | /countries/ | Valid basetype_admin token | None | Returns list of CountryOut including Updated United States and Updated ประเทศไทย, HTTP 200 |
| Delete country 1 | DELETE | /countries/1 | Valid basetype_admin token | None | Returns {"message": "Country deleted"}, HTTP 200 |
| Delete country 2 | DELETE | /countries/2 | Valid basetype_admin token | None | Returns {"message": "Country deleted"}, HTTP 200 |
| List all countries after delete | GET | /countries/ | Valid basetype_admin token | None | Returns empty list or remaining CountryOut, HTTP 200 |