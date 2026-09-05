from __future__ import annotations
from src.config import Config

from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash

from src.schemas.auth import LoginInput, UserRecord


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

password_hash = PasswordHash.recommended()
security = HTTPBearer()


class AuthenticationService:
    def __init__(self) -> None:
        self.users = [
            {
                "id": 1,
                "name": "PharmaChain Admin",
                "email": "admin@pharmachain.com",
                "password": password_hash.hash("Admin123!"),
                "role": "admin",
                "company_name": None,
            },
            {
                "id": 2,
                "name": "Demo Pharmaceutical Company",
                "email": "company@pharmachain.com",
                "password": password_hash.hash("Company123!"),
                "role": "pharmaceutical_company",
                "company_name": "Demo Pharmaceutical Company",
            },
            {
                "id": 3,
                "name": "Demo Dispatcher",
                "email": "dispatcher@pharmachain.com",
                "password": password_hash.hash("Dispatcher123!"),
                "role": "dispatcher",
                "company_name": None,
            },
            {
                "id": 4,
                "name": "Demo PharmaChain Employee",
                "email": "employee@pharmachain.com",
                "password": password_hash.hash("Employee123!"),
                "role": "pharmachain_employee",
                "company_name": None,
            },
        ]

    def authenticate(
        self,
        payload: LoginInput,
    ) -> tuple[UserRecord, str] | None:

        user = next(
            (
                user
                for user in self.users
                if user["email"].lower() == payload.email.lower()
            ),
            None,
        )

        if user is None:
            return None

        if not password_hash.verify(
            payload.password,
            user["password"],
        ):
            return None

        user_record = UserRecord(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"],
            company_name=user["company_name"],
        )

        token = self._create_access_token(user_record)

        return user_record, token

    def _create_access_token(
        self,
        user: UserRecord,
    ) -> str:

        expires_at = (
            datetime.now(timezone.utc)
            + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "exp": expires_at,
        }

        return jwt.encode(
            payload,
            Config.SECRET_KEY,
            algorithm=ALGORITHM,
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserRecord:

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = int(payload.get("sub"))
        email = payload.get("email")
        role = payload.get("role")

        if user_id is None or email is None or role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )

        return UserRecord(
            id=user_id,
            name="",
            email=email,
            role=role,
            company_name=None,
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
        )

    except (jwt.InvalidTokenError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        )


def require_admin(
    current_user: UserRecord = Depends(get_current_user),
) -> UserRecord:

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )

    return current_user


def require_admin_or_company(
    current_user: UserRecord = Depends(get_current_user),
) -> UserRecord:

    allowed_roles = {
        "admin",
        "pharmaceutical_company",
    }

    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator or pharmaceutical company access required.",
        )

    return current_user


def require_operations_access(
    current_user: UserRecord = Depends(get_current_user),
) -> UserRecord:

    allowed_roles = {
        "admin",
        "pharmaceutical_company",
        "dispatcher",
        "pharmachain_employee",
    }

    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this operation.",
        )

    return current_user


def require_roles_for_status(
    current_user: UserRecord = Depends(get_current_user),
) -> UserRecord:

    allowed_roles = {
        "admin",
        "pharmaceutical_company",
        "dispatcher",
    }

    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create product status events.",
        )

    return current_user