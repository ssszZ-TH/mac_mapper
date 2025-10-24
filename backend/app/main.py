from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config.database import database
from app.controllers.auth.auth import router as auth_router
from app.controllers.users.user import router as user_router
from app.controllers.persons.person import router as person_router
from app.controllers.organizations.organization import router as organization_router
from app.controllers.gender_type import router as gender_type_router
from app.controllers.marital_status_types import router as marital_status_type_router
from app.controllers.countries import router as country_router
from app.controllers.racial_types import router as racial_type_router
from app.controllers.income_ranges import router as income_range_router
from app.controllers.organization_types import router as organization_type_router
from app.controllers.industry_types import router as industry_type_router
from app.controllers.contact_mechanism_types import router as contact_mechanism_type_router
from app.controllers.communication_event_status_types import router as communication_event_status_type_router
from app.controllers.communication_event_purpose_types import router as communication_event_purpose_type_router
from app.controllers.users_history import router as users_history_router
from app.controllers.person_history import router as person_history_router
from app.controllers.organization_history import router as organization_history_router
from app.controllers.communication_event import router as communication_event_router
from app.controllers.communication_event_history import router as communication_event_history_router

load_dotenv()

# Define lifespan event handler for FastAPI application
@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

# Initialize FastAPI app with lifespan event handler
app = FastAPI(lifespan=lifespan)

# Configure CORS to allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(person_router)
app.include_router(organization_router)
app.include_router(gender_type_router)
app.include_router(marital_status_type_router)
app.include_router(country_router)
app.include_router(racial_type_router)
app.include_router(income_range_router)
app.include_router(organization_type_router)
app.include_router(industry_type_router)
app.include_router(contact_mechanism_type_router)
app.include_router(communication_event_status_type_router)
app.include_router(communication_event_purpose_type_router)
app.include_router(users_history_router)
app.include_router(person_history_router)
app.include_router(organization_history_router)
app.include_router(communication_event_router)
app.include_router(communication_event_history_router)

@app.get("/")
async def root():
    return {"message": "FastAPI Backend", "github": "https://github.com/ssszZ-TH/party_fullstack_docker5"}