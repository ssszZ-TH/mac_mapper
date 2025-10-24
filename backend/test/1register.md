# Test Plan for /register_system_admin Endpoint

| Method | Part | JWT Bearer | Body Payload | Expected Result |
|--------|------|------------|--------------|-----------------|
| POST   | /register_system_admin | None | {"username": "admin1", "password": "securepass123", "email": "admin1@example.com"} | 201 Created, returns user data (id, username, email, role, created_at) |
| POST   | /register_system_admin | None | {"username": "admin1", "password": "securepass123", "email": "admin1@example.com"} | 400 Bad Request, "Username or email already exists" |
| POST   | /register_system_admin | None | {"username": "", "password": "securepass123", "email": "admin2@example.com"} | 422 Unprocessable Entity, invalid username |
| POST   | /register_system_admin | None | {"username": "admin2", "password": "securepass123", "email": "invalid-email"} | 422 Unprocessable Entity, invalid email |
| GET    | /register_system_admin | None | None | 405 Method Not Allowed |

Note: No JWT Bearer is required for this endpoint as it’s for registration.