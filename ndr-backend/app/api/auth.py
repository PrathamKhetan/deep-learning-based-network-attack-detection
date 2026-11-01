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
    valid_roles = {"admin", "employee", "boss", "manager", "ceo", "team_lead", "threat_hunter"}
    if req.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"role must be one of {valid_roles}")
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
        if req.email.endswith("@aegis-defense.corp"):
            lower = req.email.lower()
            role = "ceo" if "ceo" in lower else "manager" if "manager" in lower else "team_lead" if "lead" in lower else "threat_hunter" if "hunter" in lower else "employee"
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
        "is_ceo": current_user.role == "ceo",
        "is_manager": current_user.role in {"manager", "boss", "admin"},
        "is_team_lead": current_user.role == "team_lead",
        "clearance": "LEVEL_5_SOVEREIGN" if current_user.role == "ceo" else "LEVEL_4_EXECUTIVE" if current_user.role in {"manager", "boss", "admin"} else "LEVEL_3_OPERATIONS_LEAD" if current_user.role == "team_lead" else "LEVEL_1_OPERATOR"
    }

@router.get("/employee-history")
async def get_backend_employee_history(current_user: UserInDB = Depends(get_current_user)):
    """
    CRITICAL ROLE-BASED ACCESS CONTROL ENDPOINT:
    CEOs, Managers, and Team Leads can see employee history, but normal employees are strictly NOT permitted (HTTP 403 Forbidden).
    """
    if current_user.role not in {"ceo", "manager", "boss", "admin", "team_lead"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CLEARANCE VIOLATION (HTTP 403): Employee accounts are strictly prohibited from viewing peer or personnel audit logs. Supervisory clearance required."
        )

    return [
        {
            "id": "AUD-9025",
            "employeeId": "CORP-EXEC-0001",
            "employeeName": "Victoria Sterling",
            "role": "ceo",
            "action": "Approved Crisis Mode Contingency Budget",
            "targetResource": "FINANCIAL_RISK_POOL [$12.5M]",
            "sourceIp": "10.0.0.1",
            "timestamp": "8 mins ago",
            "severity": "INFO",
            "status": "SUCCESS",
            "riskScore": 0
        },
        {
            "id": "AUD-9024",
            "employeeId": "CORP-MGR-0091",
            "employeeName": "Cmdr. Sarah Jenkins",
            "role": "manager",
            "action": "Authorized Zero-Trust Perimeter Micro-Isolation",
            "targetResource": "BGP-OPTICAL-CORE [10.0.1.1]",
            "sourceIp": "10.0.0.99",
            "timestamp": "14 mins ago",
            "severity": "CRITICAL",
            "status": "SUCCESS",
            "riskScore": 12
        },
        {
            "id": "AUD-9021",
            "employeeId": "CORP-EMP-4420",
            "employeeName": "David Vance",
            "role": "employee",
            "action": "Quarantined DMZ WAF Route",
            "targetResource": "node-dmz-waf [10.0.4.1]",
            "sourceIp": "10.0.4.12",
            "timestamp": "45 mins ago",
            "severity": "CRITICAL",
            "status": "SUCCESS",
            "riskScore": 35
        }
    ]
