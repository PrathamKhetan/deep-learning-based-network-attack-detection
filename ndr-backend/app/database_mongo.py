import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from datetime import datetime

logger = logging.getLogger("ndr.mongodb")

# ----------------------------------------------------------------------
# Mongo client – reads URI from .env
# ----------------------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ndr")
client = AsyncIOMotorClient(MONGO_URI)
# The database name is the last path segment of the URI (default "ndr")
_db_name = MONGO_URI.rsplit("/", 1)[-1].split("?")[0]
db = client[_db_name]

# ----------------------------------------------------------------------
# Pydantic models for typing – these are not stored in Mongo, just for
# validation when we write/read documents.
# ----------------------------------------------------------------------
class UserInDB(BaseModel):
    email: str = Field(..., description="User email, primary key")
    hashed_password: str
    role: str = Field(..., description="admin|employee|boss")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AttackLog(BaseModel):
    user_email: str
    source_ip: str
    endpoint: str
    payload: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    severity: str = Field(..., description="low|medium|high")
    description: str

# ----------------------------------------------------------------------
# Helper functions – thin wrappers around Motor calls
# ----------------------------------------------------------------------
async def get_user(email: str) -> UserInDB | None:
    doc = await db["users"].find_one({"email": email})
    return UserInDB(**doc) if doc else None

async def create_user(user: UserInDB) -> None:
    await db["users"].insert_one(user.dict())
    logger.info("Created user %s with role %s", user.email, user.role)

async def log_attack(event: AttackLog) -> None:
    await db["attack_logs"].insert_one(event.dict())
    logger.info("Logged attack from %s – %s", event.user_email, event.severity)
