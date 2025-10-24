import re
import logging
from datetime import timedelta

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATABASE_URL = "postgresql://spa:spa@db:5432/myapp"
API_HOST = "0.0.0.0"
API_PORT = 8080
SECRET_KEY = "8c2f7a9b3d6e1f0c4a8b2d5e7f9a1c3b6d8e0f2a4b7c9d1e3f5a8b0c2d4e6f"
ALGORITHM = "HS256"
BCRYPT_SALT = "$2b$12$zDZMoHsxUdSvpuNJjEzsve"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 1 day in minutes
ALLOWED_ORIGINS = ["http://localhost:5173"]
ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"]

logger.info(f"Loaded BCRYPT_SALT: {BCRYPT_SALT}")
if not BCRYPT_SALT:
    raise ValueError("BCRYPT_SALT is not set")
if not re.match(r'^\$2b\$\d{2}\$[A-Za-z0-9./]{22}$', BCRYPT_SALT):
    raise ValueError(f"BCRYPT_SALT is invalid: {BCRYPT_SALT}. It must be in the format $2b$<cost>$<22-char-base64>")