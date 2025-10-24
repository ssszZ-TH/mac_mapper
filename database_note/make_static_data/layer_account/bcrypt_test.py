import bcrypt
import re

BCRYPT_SALT = '$2b$12$zDZMoHsxUdSvpuNJjEzsve'

if not BCRYPT_SALT:
    raise ValueError("BCRYPT_SALT is not set")
if not re.match(r'^\$2b\$\d{2}\$[A-Za-z0-9./]{22}$', BCRYPT_SALT):
    raise ValueError(f"BCRYPT_SALT is invalid: {BCRYPT_SALT}. It must be in the format $2b$<cost>$<22-char-base64>")

password = '1234'

hashed_password = bcrypt.hashpw(password.encode('utf-8'), BCRYPT_SALT.encode('utf-8')).decode('utf-8')

print(hashed_password)

# $2b$12$zDZMoHsxUdSvpuNJjEzsveMtmFDtrelp9aRTHnoiLSOk2/UmznCOa