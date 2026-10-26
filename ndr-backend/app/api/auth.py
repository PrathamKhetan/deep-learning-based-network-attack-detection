from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, validator

from ..auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    create_user,
)
from ..database_mongo import UserInDB

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str

    @validator("role")
    def validate_role(cls, v):
        if v not in {"admin", "employee", "boss"}:
            raise ValueError("role must be admin, employee or boss")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/register", status_code=201)
async def register(req: RegisterRequest):
    existing = await UserInDB.from_orm(req) if False else None
    # Simpler existence check via DB
    from ..database_mongo import get_user
    if await get_user(req.email):
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = get_password_hash(req.password)
    user = UserInDB(email=req.email, hashed_password=hashed, role=req.role)
    await create_user(user)
    return {"msg": "User created"}

@router.post("/login", response_model=TokenResponse)
async def login(req: RegisterRequest):
    user = await authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token}
