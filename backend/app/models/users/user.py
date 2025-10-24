from app.config.database import database
from app.config.settings import BCRYPT_SALT
from app.schemas.user import UserCreate, UserUpdate, UserOut
import bcrypt
import logging
from typing import Optional, List
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหาผู้ใช้ด้วยอีเมล
async def get_user_by_email(email: str) -> Optional[dict]:
    query = "SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE email = :email"
    result = await database.fetch_one(query=query, values={"email": email})
    logger.info(f"Queried user with email {email}: {result}")
    return result

# บันทึกประวัติการกระทำของผู้ใช้
async def log_user_history(user_id: int, username: str, email: str, password: str, role: str, action: str, action_by: Optional[int] = None):
    query = """
        INSERT INTO users_history (user_id, username, email, password, role, action, action_by, action_at)
        VALUES (:user_id, :username, :email, :password, :role, :action, :action_by, :action_at)
    """
    values = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "password": password,
        "role": role,
        "action": action,
        "action_by": action_by,
        "action_at": datetime.utcnow()
    }
    await database.execute(query=query, values=values)
    logger.info(f"Logged history: user_id={user_id}, action={action}, action_by={action_by}")

# สร้างผู้ใช้ใหม่
async def create_user(user: UserCreate, action_by: Optional[int]) -> Optional[UserOut]:
    async with database.transaction():
        try:
            existing_user = await get_user_by_email(user.email)
            if existing_user:
                logger.warning(f"Attempt to create user with existing email: {user.email}")
                return None
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), BCRYPT_SALT.encode('utf-8')).decode('utf-8')
            now = datetime.utcnow()
            query = """
                INSERT INTO users (username, email, password, role, created_at)
                VALUES (:username, :email, :password, :role, :created_at)
                RETURNING id, username, email, role, created_at, updated_at
            """
            values = {
                "username": user.username,
                "email": user.email,
                "password": hashed_password,
                "role": user.role or "hr_admin",
                "created_at": now
            }
            result = await database.fetch_one(query=query, values=values)
            if result:
                await log_user_history(
                    user_id=result["id"],
                    username=user.username,
                    email=user.email,
                    password=hashed_password,
                    role=user.role or "hr_admin",
                    action="create",
                    action_by=action_by
                )
                logger.info(f"Created user: {user.email}, role={user.role}")
                return UserOut(**result._mapping)
            return None
        except ValueError as e:
            logger.error(f"Error hashing password for {user.email}: {str(e)}")
            raise

# ค้นหาผู้ใช้ด้วย ID
async def get_user(user_id: int) -> Optional[UserOut]:
    query = "SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": user_id})
    logger.info(f"Retrieved user: id={user_id}")
    return UserOut(**result._mapping) if result else None

# ดึงข้อมูลผู้ใช้ทั้งหมด
async def get_all_users() -> List[UserOut]:
    query = "SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY id ASC"
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} users")
    return [UserOut(**result._mapping) for result in results]

# ดึงข้อมูลรหัสผ่านผู้ใช้
async def get_user_password(user_id: int) -> Optional[str]:
    query = "SELECT password FROM users WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": user_id})
    return result["password"] if result else None

# อัปเดตข้อมูลผู้ใช้
async def update_user(user_id: int, user: UserUpdate, action_by: Optional[int]) -> Optional[UserOut]:
    async with database.transaction():
        values = {"id": user_id, "updated_at": datetime.utcnow()}
        query_parts = []

        if user.username is not None:
            query_parts.append("username = :username")
            values["username"] = user.username
        if user.email is not None:
            query_parts.append("email = :email")
            values["email"] = user.email
        if user.password is not None:
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), BCRYPT_SALT.encode('utf-8')).decode('utf-8')
            query_parts.append("password = :password")
            values["password"] = hashed_password
        if user.role is not None:
            query_parts.append("role = :role")
            values["role"] = user.role

        if not query_parts:
            logger.info(f"No fields to update for user id={user_id}")
            return None

        old_data = await get_user(user_id)
        if not old_data:
            return None

        old_password = await get_user_password(user_id)
        if not old_password:
            return None

        query = f"""
            UPDATE users
            SET {', '.join(query_parts)}, updated_at = :updated_at
            WHERE id = :id
            RETURNING id, username, email, role, created_at, updated_at
        """
        result = await database.fetch_one(query=query, values=values)
        if result:
            await log_user_history(
                user_id=user_id,
                username=old_data.username,
                email=old_data.email,
                password=old_password if user.password is None else hashed_password,
                role=old_data.role,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated user: id={user_id}")
            return UserOut(**result._mapping)
        return None

# ลบผู้ใช้
async def delete_user(user_id: int, action_by: Optional[int]) -> Optional[int]:
    async with database.transaction():
        old_data = await get_user(user_id)
        if not old_data:
            return None

        old_password = await get_user_password(user_id)
        if not old_password:
            return None

        # Log history before deleting the user
        await log_user_history(
            user_id=user_id,
            username=old_data.username,
            email=old_data.email,
            password=old_password,
            role=old_data.role,
            action="delete",
            action_by=action_by
        )

        query = "DELETE FROM users WHERE id = :id RETURNING id"
        result = await database.fetch_one(query=query, values={"id": user_id})
        if result:
            logger.info(f"Deleted user: id={user_id}")
            return result["id"]
        return None

# ตรวจสอบรหัสผ่านผู้ใช้
async def verify_user_password(user_id: int, password: str) -> bool:
    query = "SELECT password FROM users WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": user_id})
    if not result:
        logger.warning(f"User not found for password verification: id={user_id}")
        return False
    stored_password = result["password"]
    is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8'))
    logger.info(f"Verified password for user id={user_id}: {'success' if is_valid else 'failed'}")
    return is_valid