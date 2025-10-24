# backend/app/models/persons/person.py

from app.config.database import database
from app.schemas.person import PersonCreate, PersonUpdate, PersonOut
from app.models.users.user import create_user, log_user_history, update_user, delete_user, get_user_password
from app.schemas.user import UserCreate, UserUpdate
import bcrypt
import logging
from typing import Optional, List
from datetime import datetime, date

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ค้นหา person ด้วย ID
async def get_person(person_id: int) -> Optional[PersonOut]:
    query = """
        SELECT u.id, u.username, u.email, p.personal_id_number, p.first_name, p.middle_name, p.last_name, 
               p.nick_name, p.birth_date, p.gender_type_id, p.marital_status_type_id, p.country_id, 
               p.height, p.weight, p.racial_type_id, p.income_range_id, p.about_me, p.created_at, p.updated_at
        FROM users u
        JOIN persons p ON u.id = p.id
        WHERE u.id = :id
    """
    result = await database.fetch_one(query=query, values={"id": person_id})
    logger.info(f"Retrieved person: id={person_id}")
    return PersonOut(**result._mapping) if result else None

# ค้นหา person ด้วย personal_id_number
async def get_person_by_personal_id(personal_id_number: str) -> Optional[dict]:
    query = """
        SELECT u.id, u.username, u.email, p.personal_id_number, p.first_name, p.middle_name, p.last_name, 
               p.nick_name, p.birth_date, p.gender_type_id, p.marital_status_type_id, p.country_id, 
               p.height, p.weight, p.racial_type_id, p.income_range_id, p.about_me, p.created_at, p.updated_at
        FROM users u
        JOIN persons p ON u.id = p.id
        WHERE p.personal_id_number = :personal_id_number
    """
    result = await database.fetch_one(query=query, values={"personal_id_number": personal_id_number})
    logger.info(f"Queried person with personal_id_number {personal_id_number}: {result}")
    return result

# ดึงข้อมูล person ทั้งหมด
async def get_all_persons() -> List[PersonOut]:
    query = """
        SELECT u.id, u.username, u.email, p.personal_id_number, p.first_name, p.middle_name, p.last_name, 
               p.nick_name, p.birth_date, p.gender_type_id, p.marital_status_type_id, p.country_id, 
               p.height, p.weight, p.racial_type_id, p.income_range_id, p.about_me, p.created_at, p.updated_at
        FROM users u
        JOIN persons p ON u.id = p.id
        ORDER BY u.id ASC
    """
    results = await database.fetch_all(query=query)
    logger.info(f"Retrieved {len(results)} persons")
    return [PersonOut(**result._mapping) for result in results]

# บันทึกประวัติการกระทำของ person
async def log_person_history(person_id: int, personal_id_number: str, first_name: str, middle_name: Optional[str], 
                             last_name: str, nick_name: Optional[str], birth_date: date, gender_type_id: Optional[int], 
                             marital_status_type_id: Optional[int], country_id: Optional[int], height: int, 
                             weight: int, racial_type_id: Optional[int], income_range_id: Optional[int], 
                             about_me: Optional[str], action: str, action_by: Optional[int] = None):
    query = """
        INSERT INTO person_history (person_id, personal_id_number, first_name, middle_name, last_name, nick_name, 
                                   birth_date, gender_type_id, marital_status_type_id, country_id, height, weight, 
                                   racial_type_id, income_range_id, about_me, action, action_by, action_at)
        VALUES (:person_id, :personal_id_number, :first_name, :middle_name, :last_name, :nick_name, 
                :birth_date, :gender_type_id, :marital_status_type_id, :country_id, :height, :weight, 
                :racial_type_id, :income_range_id, :about_me, :action, :action_by, :action_at)
    """
    values = {
        "person_id": person_id,
        "personal_id_number": personal_id_number,
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "nick_name": nick_name,
        "birth_date": birth_date,
        "gender_type_id": gender_type_id,
        "marital_status_type_id": marital_status_type_id,
        "country_id": country_id,
        "height": height,
        "weight": weight,
        "racial_type_id": racial_type_id,
        "income_range_id": income_range_id,
        "about_me": about_me,
        "action": action,
        "action_by": action_by,
        "action_at": datetime.utcnow()
    }
    await database.execute(query=query, values=values)
    logger.info(f"Logged person history: person_id={person_id}, action={action}, action_by={action_by}")

# สร้าง person ใหม่
async def create_person(person: PersonCreate, action_by: Optional[int]) -> Optional[PersonOut]:
    async with database.transaction():
        try:
            user = UserCreate(username=person.username, email=person.email, password=person.password, role="person_user")
            user_result = await create_user(user, action_by)
            
            if not user_result:
                logger.warning(f"Failed to create user for person: {person.email}")
                return None

            existing_person = await get_person_by_personal_id(person.personal_id_number)
            if existing_person:
                logger.warning(f"Attempt to create person with existing personal_id_number: {person.personal_id_number}")
                return None

            query = """
                INSERT INTO persons (id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, 
                                    gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, 
                                    income_range_id, about_me, created_at)
                VALUES (:id, :personal_id_number, :first_name, :middle_name, :last_name, :nick_name, :birth_date, 
                        :gender_type_id, :marital_status_type_id, :country_id, :height, :weight, :racial_type_id, 
                        :income_range_id, :about_me, :created_at)
                RETURNING id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, 
                          gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, 
                          income_range_id, about_me, created_at, updated_at
            """

            values = {
                "id": user_result.id,
                "personal_id_number": person.personal_id_number,
                "first_name": person.first_name,
                "middle_name": person.middle_name,
                "last_name": person.last_name,
                "nick_name": person.nick_name,
                "birth_date": person.birth_date,
                "gender_type_id": person.gender_type_id,
                "marital_status_type_id": person.marital_status_type_id,
                "country_id": person.country_id,
                "height": person.height,
                "weight": person.weight,
                "racial_type_id": person.racial_type_id,
                "income_range_id": person.income_range_id,
                "about_me": person.about_me,
                "created_at": datetime.utcnow()
            }
            result = await database.fetch_one(query=query, values=values)
            if result:
                await log_person_history(
                    person_id=user_result.id,
                    personal_id_number=person.personal_id_number,
                    first_name=person.first_name,
                    middle_name=person.middle_name,
                    last_name=person.last_name,
                    nick_name=person.nick_name,
                    birth_date=person.birth_date,
                    gender_type_id=person.gender_type_id,
                    marital_status_type_id=person.marital_status_type_id,
                    country_id=person.country_id,
                    height=person.height,
                    weight=person.weight,
                    racial_type_id=person.racial_type_id,
                    income_range_id=person.income_range_id,
                    about_me=person.about_me,
                    action="create",
                    action_by=action_by
                )
                
                logger.info(f"Created person: id={user_result.id}")
                return PersonOut(
                    username=user_result.username,
                    email=user_result.email,
                    **result._mapping
                )
            return None
        except Exception as e:
            logger.error(f"Error creating person: {str(e)}")
            raise

# อัปเดตข้อมูล person
async def update_person(person_id: int, person: PersonUpdate, action_by: Optional[int]) -> Optional[PersonOut]:
    async with database.transaction():
        values = {"id": person_id, "updated_at": datetime.utcnow()}
        query_parts = []

        if person.personal_id_number is not None and person.personal_id_number != '':
            query_parts.append("personal_id_number = :personal_id_number")
            values["personal_id_number"] = person.personal_id_number
        if person.first_name is not None and person.first_name != '':
            query_parts.append("first_name = :first_name")
            values["first_name"] = person.first_name
        if person.middle_name is not None:
            query_parts.append("middle_name = :middle_name")
            values["middle_name"] = person.middle_name
        if person.last_name is not None and person.last_name != '':
            query_parts.append("last_name = :last_name")
            values["last_name"] = person.last_name
        if person.nick_name is not None:
            query_parts.append("nick_name = :nick_name")
            values["nick_name"] = person.nick_name
        if person.birth_date is not None:
            query_parts.append("birth_date = :birth_date")
            values["birth_date"] = person.birth_date
        if person.gender_type_id is not None:
            query_parts.append("gender_type_id = :gender_type_id")
            values["gender_type_id"] = person.gender_type_id
        if person.marital_status_type_id is not None:
            query_parts.append("marital_status_type_id = :marital_status_type_id")
            values["marital_status_type_id"] = person.marital_status_type_id
        if person.country_id is not None:
            query_parts.append("country_id = :country_id")
            values["country_id"] = person.country_id
        if person.height is not None:
            query_parts.append("height = :height")
            values["height"] = person.height
        if person.weight is not None:
            query_parts.append("weight = :weight")
            values["weight"] = person.weight
        if person.racial_type_id is not None:
            query_parts.append("racial_type_id = :racial_type_id")
            values["racial_type_id"] = person.racial_type_id
        if person.income_range_id is not None:
            query_parts.append("income_range_id = :income_range_id")
            values["income_range_id"] = person.income_range_id
        if person.about_me is not None:
            query_parts.append("about_me = :about_me")
            values["about_me"] = person.about_me

        # Update user table if username, email, or password is provided
        user_values = {"id": person_id}
        user_query_parts = []
        if person.username is not None and person.username != '':
            user_query_parts.append("username = :username")
            user_values["username"] = person.username
        if person.email is not None and person.email != '':
            user_query_parts.append("email = :email")
            user_values["email"] = person.email
        if person.password is not None and person.password != '':
            user_query_parts.append("password = :password")
            user_values["password"] = person.password

        old_data = await get_person(person_id)
        if not old_data:
            return None

        user_result = None
        if user_query_parts:
            user_update = UserUpdate(
                username=person.username if person.username and person.username != '' else None,
                email=person.email if person.email and person.email != '' else None,
                password=person.password if person.password and person.password != '' else None,
                role=None
            )
            user_result = await update_user(person_id, user_update, action_by)
            if not user_result:
                logger.warning(f"Failed to update user for person: id={person_id}")
                return None

        if not query_parts and not user_query_parts:
            logger.info(f"No fields to update for person id={person_id}")
            return None

        if query_parts:
            query = f"""
                UPDATE persons
                SET {', '.join(query_parts)}, updated_at = :updated_at
                WHERE id = :id
                RETURNING id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, 
                          gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, 
                          income_range_id, about_me, created_at, updated_at
            """
            result = await database.fetch_one(query=query, values=values)
        else:
            result = old_data

        if result:
            await log_person_history(
                person_id=person_id,
                personal_id_number=person.personal_id_number if person.personal_id_number and person.personal_id_number != '' else old_data.personal_id_number,
                first_name=person.first_name if person.first_name and person.first_name != '' else old_data.first_name,
                middle_name=person.middle_name if person.middle_name is not None else old_data.middle_name,
                last_name=person.last_name if person.last_name and person.last_name != '' else old_data.last_name,
                nick_name=person.nick_name if person.nick_name is not None else old_data.nick_name,
                birth_date=person.birth_date if person.birth_date is not None else old_data.birth_date,
                gender_type_id=person.gender_type_id if person.gender_type_id is not None else old_data.gender_type_id,
                marital_status_type_id=person.marital_status_type_id if person.marital_status_type_id is not None else old_data.marital_status_type_id,
                country_id=person.country_id if person.country_id is not None else old_data.country_id,
                height=person.height if person.height is not None else old_data.height,
                weight=person.weight if person.weight is not None else old_data.weight,
                racial_type_id=person.racial_type_id if person.racial_type_id is not None else old_data.racial_type_id,
                income_range_id=person.income_range_id if person.income_range_id is not None else old_data.income_range_id,
                about_me=person.about_me if person.about_me is not None else old_data.about_me,
                action="update",
                action_by=action_by
            )
            logger.info(f"Updated person: id={person_id}")
            return PersonOut(
                username=old_data.username if not user_result else user_result.username,
                email=old_data.email if not user_result else user_result.email,
                **result._mapping
            )
        return None

# ลบ person
async def delete_person(person_id: int, action_by: Optional[int]) -> Optional[int]:
    async with database.transaction():
        old_data = await get_person(person_id)
        if not old_data:
            return None

        # Log history before deleting the person
        await log_person_history(
            person_id=person_id,
            personal_id_number=old_data.personal_id_number,
            first_name=old_data.first_name,
            middle_name=old_data.middle_name,
            last_name=old_data.last_name,
            nick_name=old_data.nick_name,
            birth_date=old_data.birth_date,
            gender_type_id=old_data.gender_type_id,
            marital_status_type_id=old_data.marital_status_type_id,
            country_id=old_data.country_id,
            height=old_data.height,
            weight=old_data.weight,
            racial_type_id=old_data.racial_type_id,
            income_range_id=old_data.income_range_id,
            about_me=old_data.about_me,
            action="delete",
            action_by=action_by
        )
        old_user_data = await database.fetch_one(query="SELECT username, email, password, role FROM users WHERE id = :id", values={"id": person_id})
        await log_user_history(
            user_id=person_id,
            username=old_user_data["username"],
            email=old_user_data["email"],
            password=old_user_data["password"],
            role=old_user_data["role"],
            action="delete",
            action_by=action_by
        )

        # Delete from users table (supertype) to cascade to persons table
        result = await delete_user(person_id, action_by)
        if result:
            logger.info(f"Deleted person: id={person_id}")
            return result
        return None