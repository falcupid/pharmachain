from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.auth import router as auth_router
from src.api.routes.health import router as health_router
from src.api.routes.supply_chain import router as supply_chain_router
from src.config import Config


app = FastAPI(
    title=Config.APP_NAME,
    version="0.1.0",
    description="PharmaChain API for operational tracking and blockchain proof flows.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=Config.API_PREFIX)
app.include_router(supply_chain_router, prefix=Config.API_PREFIX)
app.include_router(auth_router, prefix=Config.API_PREFIX)
