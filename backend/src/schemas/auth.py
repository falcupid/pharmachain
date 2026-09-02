from pydantic import BaseModel, Field


class UserRecord(BaseModel):
    id: int
    name: str
    email: str
    role: str
    company_name: str | None = None


class LoginInput(BaseModel):
    email: str
    password: str = Field(min_length=6)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRecord