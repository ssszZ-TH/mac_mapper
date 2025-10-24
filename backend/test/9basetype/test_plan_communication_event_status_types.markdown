# Test Plan for Communication Event Status Type API

| Test Description | Method | Path | JWT Bearer | Body Payload | Expected Result |
|------------------|--------|------|------------|--------------|-----------------|
| Create communication event status type 1 | POST | /communication_event_status_types/ | Valid basetype_admin token | `{"description": "Pending"}` | Returns CommunicationEventStatusTypeOut with id, description="Pending", HTTP 200 |
| Create communication event status type 2 | POST | /communication_event_status_types/ | Valid basetype_admin token | `{"description": "Completed"}` | Returns CommunicationEventStatusTypeOut with id, description="Completed", HTTP 200 |
| List all communication event status types | GET | /communication_event_status_types/ | Valid basetype_admin token | None | Returns list of CommunicationEventStatusTypeOut including Pending and Completed, HTTP 200 |
| Get communication event status type by ID | GET | /communication_event_status_types/1 | Valid basetype_admin token | None | Returns CommunicationEventStatusTypeOut with id=1, description="Pending", HTTP 200 |
| Update communication event status type 1 | PUT | /communication_event_status_types/1 | Valid basetype_admin token | `{"description": "Updated Pending"}` | Returns updated CommunicationEventStatusTypeOut with description="Updated Pending", HTTP 200 |
| Update communication event status type 2 | PUT | /communication_event_status_types/2 | Valid basetype_admin token | `{"description": "Updated Completed"}` | Returns updated CommunicationEventStatusTypeOut with description="Updated Completed", HTTP 200 |
| List all communication event status types after update | GET | /communication_event_status_types/ | Valid basetype_admin token | None | Returns list of CommunicationEventStatusTypeOut including Updated Pending and Updated Completed, HTTP 200 |
| Delete communication event status type 1 | DELETE | /communication_event_status_types/1 | Valid basetype_admin token | None | Returns {"message": "Communication event status type deleted"}, HTTP 200 |
| Delete communication event status type 2 | DELETE | /communication_event_status_types/2 | Valid basetype_admin token | None | Returns {"message": "Communication event status type deleted"}, HTTP 200 |
| List all communication event status types after delete | GET | /communication_event_status_types/ | Valid basetype_admin token | None | Returns empty list or remaining CommunicationEventStatusTypeOut, HTTP 200 |