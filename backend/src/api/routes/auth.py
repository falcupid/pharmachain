from fastapi import APIRouter, HTTPException, status

from src.schemas.auth import LoginInput, LoginResponse
from src.services.auth import AuthenticationService


router = APIRouter(prefix="/auth", tags=["authentication"])

auth_service = AuthenticationService()


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginInput) -> LoginResponse:
    result = auth_service.authenticate(payload)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user, token = result

    return LoginResponse(
        access_token=token,
        user=user,
    )