from __future__ import annotations

from functools import lru_cache

from src.config import Config
from src.schemas.supply_chain import (
    CreateProductInput,
    CreateStatusInput,
    CreateTelemetryInput,
    CreateWorkerInput,
    IntegrationRecord,
    NodeRedFlowRecord,
    NodeRedTelemetryInput,
    NodeRedTelemetryReceipt,
    OverviewRecord,
    ProductRecord,
    StatusRecord,
    TelemetryRecord,
    WorkerRecord,
)
from src.services.base import SupplyChainGateway
from src.services.blockchain import BlockchainSupplyChainGateway
from src.services.database import DatabaseSupplyChainGateway
from src.services.sandbox import SandboxSupplyChainGateway


class SupplyChainService:
    def __init__(
        self,
        gateway: SupplyChainGateway,
        blockchain_gateway: BlockchainSupplyChainGateway | None = None,
    ) -> None:
        # Primary operational storage:
        # PostgreSQL/Supabase in production, sandbox locally when no DB exists.
        self.gateway = gateway

        # Optional secondary blockchain gateway used for verification.
        self.blockchain_gateway = blockchain_gateway

    def get_overview(self) -> OverviewRecord:
        products = self.list_products()
        workers = self.list_workers()

        status_count = sum(
            len(self.list_status(product.id))
            for product in products
        )

        telemetry = [
            reading
            for product in products
            for reading in self.list_telemetry(product.id)
        ]

        active_alerts = sum(
            1
            for reading in telemetry
            if reading.temperature > 24 or reading.humidity > 70
        )

        return OverviewRecord(
            product_count=len(products),
            worker_count=len(workers),
            status_count=status_count,
            telemetry_count=len(telemetry),
            active_alerts=active_alerts,
            chain_mode=Config.CHAIN_MODE,
        )

    def get_integration_details(self) -> IntegrationRecord:
        explorer_url = None

        if (
            Config.CHAIN_EXPLORER_BASE_URL
            and Config.WEB3_CONTRACT_ADDRESS
        ):
            explorer_url = (
                f"{Config.CHAIN_EXPLORER_BASE_URL}"
                f"{Config.WEB3_CONTRACT_ADDRESS}"
            )

        return IntegrationRecord(
            chain_mode=Config.CHAIN_MODE,
            contract_address=Config.WEB3_CONTRACT_ADDRESS,
            explorer_url=explorer_url,
            rpc_url_configured=bool(Config.WEB3_RPC_URL),
            telemetry_flow_name="Node-RED Telemetry Flow",
            telemetry_flow_provider="Node-RED",
            telemetry_flow_endpoint=(
                f"{Config.API_PREFIX}/ingestion/node-red/telemetry"
            ),
        )

    def get_node_red_flow(self) -> NodeRedFlowRecord:
        return NodeRedFlowRecord(
            name="Node-RED Telemetry Flow",
            provider="Node-RED",
            endpoint=f"{Config.API_PREFIX}/ingestion/node-red",
            method="POST",
            content_type="application/json",
            description=(
                "Gateway or sensor readings are posted from Node-RED "
                "into PharmaChain before they are attached to a product "
                "timeline."
            ),
        )

    # ---------------------------------------------------------
    # WORKERS
    # ---------------------------------------------------------

    def list_workers(self) -> list[WorkerRecord]:
        return self.gateway.list_workers()

    def create_worker(
        self,
        payload: CreateWorkerInput,
    ) -> WorkerRecord:
        return self.gateway.create_worker(payload)

    # ---------------------------------------------------------
    # PRODUCTS
    # ---------------------------------------------------------

    def list_products(self) -> list[ProductRecord]:
        return self.gateway.list_products()

    def create_product(
        self,
        payload: CreateProductInput,
    ) -> ProductRecord:
        # 1. Always save the operational record to Supabase/database first.
        product = self.gateway.create_product(payload)

        # 2. If blockchain verification is configured, register the same
        #    product on Polygon Amoy.
        if self.blockchain_gateway is not None:
            try:
                blockchain_product = (
                    self.blockchain_gateway.create_product(payload)
                )

                # Return the database product identity, but reflect the
                # blockchain verification result in the API response.
                return product.model_copy(
                    update={
                        "verified": blockchain_product.verified,
                        "current_owner": blockchain_product.current_owner,
                    }
                )

            except Exception as exc:
                # The database write has already succeeded.
                # Blockchain failure must not destroy the operational record.
                print(
                    "Blockchain product verification failed:",
                    str(exc),
                )

        return product

    # ---------------------------------------------------------
    # STATUS
    # ---------------------------------------------------------

    def list_status(
        self,
        product_id: int,
    ) -> list[StatusRecord]:
        return self.gateway.list_status(product_id)

    def create_status(
        self,
        product_id: int,
        payload: CreateStatusInput,
    ) -> StatusRecord:
        return self.gateway.create_status(product_id, payload)

    # ---------------------------------------------------------
    # TELEMETRY
    # ---------------------------------------------------------

    def list_telemetry(
        self,
        product_id: int,
    ) -> list[TelemetryRecord]:
        return self.gateway.list_telemetry(product_id)

    def create_telemetry(
        self,
        product_id: int,
        payload: CreateTelemetryInput,
    ) -> TelemetryRecord:
        return self.gateway.create_telemetry(product_id, payload)

    def ingest_node_red_telemetry(
        self,
        payload: NodeRedTelemetryInput,
    ) -> NodeRedTelemetryReceipt:
        reading = self.gateway.create_telemetry(
            payload.product_id,
            CreateTelemetryInput(
                temperature=payload.temperature,
                humidity=payload.humidity,
                heat_index=payload.heat_index,
            ),
        )

        return NodeRedTelemetryReceipt(
            flow_name=payload.flow_name,
            provider="Node-RED",
            gateway_id=payload.gateway_id,
            product_id=payload.product_id,
            endpoint=(
                f"{Config.API_PREFIX}/ingestion/node-red/telemetry"
            ),
            chain_mode=Config.CHAIN_MODE,
            temperature=reading.temperature,
            humidity=reading.humidity,
            heat_index=reading.heat_index,
            recorded_at=payload.recorded_at,
        )


@lru_cache
def get_supply_chain_service() -> SupplyChainService:
    # ---------------------------------------------------------
    # PRIMARY STORAGE
    # ---------------------------------------------------------

    if Config.DATABASE_URL:
        gateway: SupplyChainGateway = DatabaseSupplyChainGateway()
    else:
        gateway = SandboxSupplyChainGateway()

    # ---------------------------------------------------------
    # OPTIONAL BLOCKCHAIN VERIFICATION
    # ---------------------------------------------------------

    blockchain_gateway: BlockchainSupplyChainGateway | None = None

    if Config.blockchain_enabled:
        blockchain_gateway = BlockchainSupplyChainGateway()

    return SupplyChainService(
        gateway=gateway,
        blockchain_gateway=blockchain_gateway,
    )