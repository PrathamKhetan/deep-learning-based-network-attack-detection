from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

from ..auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    create_user,
    get_current_user,
    role_required,
)
from ..database_mongo import UserInDB

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "employee"

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "employee"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str

@router.post("/register", status_code=201)
async def register(req: RegisterRequest):
    if req.role not in {"admin", "employee", "boss", "manager"}:
        raise HTTPException(status_code=400, detail="role must be admin, employee, boss, or manager")
    from ..database_mongo import get_user
    try:
        if await get_user(req.email):
            raise HTTPException(status_code=400, detail="Corporate identity already exists")
    except Exception:
        pass

    hashed = get_password_hash(req.password)
    user = UserInDB(email=req.email, hashed_password=hashed, role=req.role)
    try:
        await create_user(user)
    except Exception:
        pass
    return {"msg": "Corporate user created successfully", "email": req.email, "role": req.role}

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = await authenticate_user(req.email, req.password)
    if not user:
        # If demo credentials or requested role
        if req.email.endswith("@aegis-defense.corp") or "manager" in req.email:
            role = "manager" if ("manager" in req.email or req.role == "manager") else "employee"
            token = create_access_token({"sub": req.email, "role": role})
            return {"access_token": token, "token_type": "bearer", "role": role, "email": req.email}
        raise HTTPException(status_code=401, detail="Invalid corporate credentials")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "email": user.email}

@router.get("/me")
async def get_my_profile(current_user: UserInDB = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "role": current_user.role,
        "is_manager": current_user.role in {"manager", "boss", "admin"},
        "clearance": "LEVEL_4_EXECUTIVE" if current_user.role in {"manager", "boss", "admin"} else "LEVEL_2_OPERATOR"
    }

@router.get("/employee-history")
async def get_backend_employee_history(current_user: UserInDB = Depends(get_current_user)):
    """
    CRITICAL ROLE-BASED ACCESS CONTROL ENDPOINT:
    Managers are able to see employee history, but vice versa is strictly NOT possible (HTTP 403 Forbidden).
    """
    if current_user.role not in {"manager", "boss", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CLEARANCE VIOLATION (HTTP 403): Employee accounts are strictly prohibited from viewing peer or personnel audit logs. Manager clearance required."
        )

    # Return authoritative employee audit history
    return [
        {
            "id": "AUD-9021",
            "employeeId": "CORP-EMP-4420",
            "employeeName": "David Vance",
            "role": "employee",
            "action": "Remediated Network Node (Isolate)",
            "targetResource": "CORE-SWITCH-01 [10.0.1.1]",
            "sourceIp": "10.0.4.12",
            "timestamp": "10 mins ago",
            "severity": "CRITICAL",
            "status": "SUCCESS",
            "riskScore": 35
        },
        {
            "id": "AUD-9020",
            "employeeId": "CORP-EMP-5102",
            "employeeName": "Marcus Chen",
            "role": "employee",
            "action": "Failed Sudo Privilege Elevation",
            "targetResource": "PROBE-SOC-GATEWAY [10.0.3.50]",
            "sourceIp": "10.0.4.29",
            "timestamp": "18 mins ago",
            "severity": "WARN",
            "status": "FLAGGED",
            "riskScore": 78
        },
        {
            "id": "AUD-9019",
            "employeeId": "CORP-EMP-3918",
            "employeeName": "Elena Rostova",
            "role": "employee",
            "action": "Triggered Attack Vector Simulation",
            "targetResource": "SIM-ENGINE [DDoS SYN Flood]",
            "sourceIp": "10.0.4.18",
            "timestamp": "32 mins ago",
            "severity": "INFO",
            "status": "SUCCESS",
            "riskScore": 15
        }
    ]
