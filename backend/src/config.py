from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_NAME: str = "PharmaChain API"
    API_PREFIX: str = "/api"
    CHAIN_MODE: str = "sandbox"
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Supabase / PostgreSQL
    DATABASE_URL: str | None = None

    # Polygon / Web3
    WEB3_RPC_URL: str | None = None
    WEB3_PRIVATE_KEY: str | None = None
    WEB3_ACCOUNT_ADDRESS: str | None = None
    WEB3_CONTRACT_ADDRESS: str | None = None
    CHAIN_EXPLORER_BASE_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, value: Any) -> Any:
        if isinstance(value, str):
            return [
                origin.strip()
                for origin in value.split(",")
                if origin.strip()
            ]
        return value

    @property
    def blockchain_enabled(self) -> bool:
        return self.CHAIN_MODE.lower() == "blockchain"


Config = Settings()