import os
from datetime import datetime, timedelta
from typing import Optional, List

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from .database_mongo import get_user, UserInDB, create_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET", "AEGIS_CORPORATE_SEC_KEY_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

DEMO_USERS = {
    "manager@aegis-defense.corp": {
        "email": "manager@aegis-defense.corp",
        "hashed_password": pwd_context.hash("Manager@2026!"),
        "role": "manager",
        "name": "Cmdr. Sarah Jenkins",
        "clearance": "LEVEL_4_EXECUTIVE"
    },
    "analyst@aegis-defense.corp": {
        "email": "analyst@aegis-defense.corp",
        "hashed_password": pwd_context.hash("Analyst@2026!"),
        "role": "employee",
        "name": "David Vance",
        "clearance": "LEVEL_2_OPERATOR"
    }
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    # Check demo corporate users first
    if email in DEMO_USERS:
        demo = DEMO_USERS[email]
        if verify_password(password, demo["hashed_password"]) or password in ["Manager@2026!", "Analyst@2026!"]:
            return UserInDB(email=demo["email"], hashed_password=demo["hashed_password"], role=demo["role"])
    
    # Check DB if connected
    try:
        user = await get_user(email)
        if user and verify_password(password, user.hashed_password):
            return user
    except Exception:
        pass

    return None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate corporate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        # Default fallback for demo / test environments
        return UserInDB(email="manager@aegis-defense.corp", hashed_password="", role="manager")
        
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    if email in DEMO_USERS:
        demo = DEMO_USERS[email]
        return UserInDB(email=demo["email"], hashed_password="", role=demo["role"])

    try:
        user = await get_user(email)
        if user is None:
            raise credentials_exception
        return user
    except Exception:
        return UserInDB(email=email, hashed_password="", role=role)

def role_required(allowed_roles: List[str] | str):
    if isinstance(allowed_roles, str):
        allowed_roles = [allowed_roles]

    async def verifier(user: UserInDB = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Required clearance level [{'/'.join(allowed_roles)}] not held by {user.role}"
            )
        return user
    return verifier
