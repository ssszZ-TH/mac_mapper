
import bcrypt

BCRYPT_SALT = '$2b$12$zDZMoHsxUdSvpuNJjEzsve'
password = 'securepass123'

hashed_password = bcrypt.hashpw(password.encode('utf-8'), BCRYPT_SALT.encode('utf-8')).decode('utf-8')

print(hashed_password)

# runcode $2b$12$zDZMoHsxUdSvpuNJjEzsve5hnjvtCdHLc3SFFvuGmQhuV.UCgKOw2

# database have "$2b$12$zDZMoHsxUdSvpuNJjEzsveo9B8iU0eGRl/zSv2OVkxeaur4eAqrza"