from fastapi import APIRouter, Depends

from src.schemas.supply_chain import (
    CreateProductInput,
    CreateStatusInput,
    CreateTelemetryInput,
    CreateWorkerInput,
    NodeRedTelemetryInput,
)
from src.services.supply_chain import SupplyChainService, get_supply_chain_service
from src.utils.responses import success_response


router = APIRouter(tags=["supply-chain"])


@router.get("/overview")
async def get_overview(service: SupplyChainService = Depends(get_supply_chain_service)) -> dict:
    return success_response(
        message="Overview fetched successfully.",
        data=service.get_overview(),
    )


@router.get("/integrations")
async def get_integrations(service: SupplyChainService = Depends(get_supply_chain_service)) -> dict:
    return success_response(
        message="Integration settings fetched successfully.",
        data=service.get_integration_details(),
    )


@router.get("/ingestion/node-red")
async def get_node_red_flow(service: SupplyChainService = Depends(get_supply_chain_service)) -> dict:
    return success_response(
        message="Node-RED flow details fetched successfully.",
        data=service.get_node_red_flow(),
    )


@router.get("/workers")
async def list_workers(service: SupplyChainService = Depends(get_supply_chain_service)) -> dict:
    return success_response(
        message="Workers fetched successfully.",
        data=service.list_workers(),
    )


@router.post("/workers")
async def create_worker(
    payload: CreateWorkerInput,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Worker created successfully.",
        data=service.create_worker(payload),
    )


@router.get("/products")
async def list_products(service: SupplyChainService = Depends(get_supply_chain_service)) -> dict:
    return success_response(
        message="Products fetched successfully.",
        data=service.list_products(),
    )


@router.post("/products")
async def create_product(
    payload: CreateProductInput,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Product created successfully.",
        data=service.create_product(payload),
    )


@router.get("/products/{product_id}/status")
async def list_product_status(
    product_id: int,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Status timeline fetched successfully.",
        data=service.list_status(product_id),
    )


@router.post("/products/{product_id}/status")
async def create_product_status(
    product_id: int,
    payload: CreateStatusInput,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Status event created successfully.",
        data=service.create_status(product_id, payload),
    )


@router.get("/products/{product_id}/telemetry")
async def list_product_telemetry(
    product_id: int,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Telemetry fetched successfully.",
        data=service.list_telemetry(product_id),
    )


@router.post("/products/{product_id}/telemetry")
async def create_product_telemetry(
    product_id: int,
    payload: CreateTelemetryInput,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Telemetry recorded successfully.",
        data=service.create_telemetry(product_id, payload),
    )


@router.post("/ingestion/node-red/telemetry")
async def ingest_node_red_telemetry(
    payload: NodeRedTelemetryInput,
    service: SupplyChainService = Depends(get_supply_chain_service),
) -> dict:
    return success_response(
        message="Node-RED telemetry accepted successfully.",
        data=service.ingest_node_red_telemetry(payload),
    )
