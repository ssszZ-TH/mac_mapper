# Test Plan for Communication Event Purpose Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create communication event purpose type 1 | POST | /communication_event_purpose_types/ | Valid basetype_admin token | `{"description": "Inquiry"}` | Returns CommunicationEventPurposeTypeOut with id, description="Inquiry", HTTP 200 |
| Create communication event purpose type 2 | POST | /communication_event_purpose_types/ | Valid basetype_admin token | `{"description": "Support"}` | Returns CommunicationEventPurposeTypeOut with id, description="Support", HTTP 200 |
| List all communication event purpose types | GET | /communication_event_purpose_types/ | Valid basetype_admin token | None | Returns list of CommunicationEventPurposeTypeOut including Inquiry and Support, HTTP 200 |
| Get communication event purpose type by ID | GET | /communication_event_purpose_types/1 | Valid basetype_admin token | None | Returns CommunicationEventPurposeTypeOut with id=1, description="Inquiry", HTTP 200 |
| Update communication event purpose type 1 | PUT | /communication_event_purpose_types/1 | Valid basetype_admin token | `{"description": "Updated Inquiry"}` | Returns updated CommunicationEventPurposeTypeOut with description="Updated Inquiry", HTTP 200 |
| Update communication event purpose type 2 | PUT | /communication_event_purpose_types/2 | Valid basetype_admin token | `{"description": "Updated Support"}` | Returns updated CommunicationEventPurposeTypeOut with description="Updated Support", HTTP 200 |
| List all communication event purpose types after update | GET | /communication_event_purpose_types/ | Valid basetype_admin token | None | Returns list of CommunicationEventPurposeTypeOut including Updated Inquiry and Updated Support, HTTP 200 |
| Delete communication event purpose type 1 | DELETE | /communication_event_purpose_types/1 | Valid basetype_admin token | None | Returns {"message": "Communication event purpose type deleted"}, HTTP 200 |
| Delete communication event purpose type 2 | DELETE | /communication_event_purpose_types/2 | Valid basetype_admin token | None | Returns {"message": "Communication event purpose type deleted"}, HTTP 200 |
| List all communication event purpose types after delete | GET | /communication_event_purpose_types/ | Valid basetype_admin token | None | Returns empty list or remaining CommunicationEventPurposeTypeOut, HTTP 200 |