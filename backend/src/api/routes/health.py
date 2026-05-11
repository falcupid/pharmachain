from fastapi import APIRouter

from src.config import Config
from src.utils.responses import success_response


router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    return success_response(
        message="ChainSight backend is healthy.",
        data={
            "environment": Config.APP_ENV,
            "chain_mode": Config.CHAIN_MODE,
        },
    )
