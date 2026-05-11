from __future__ import annotations

from typing import Protocol

from src.schemas.supply_chain import (
    CreateProductInput,
    CreateStatusInput,
    CreateTelemetryInput,
    CreateWorkerInput,
    ProductRecord,
    StatusRecord,
    TelemetryRecord,
    WorkerRecord,
)


class SupplyChainGateway(Protocol):
    def list_workers(self) -> list[WorkerRecord]: ...

    def create_worker(self, payload: CreateWorkerInput) -> WorkerRecord: ...

    def list_products(self) -> list[ProductRecord]: ...

    def create_product(self, payload: CreateProductInput) -> ProductRecord: ...

    def list_status(self, product_id: int) -> list[StatusRecord]: ...

    def create_status(self, product_id: int, payload: CreateStatusInput) -> StatusRecord: ...

    def list_telemetry(self, product_id: int) -> list[TelemetryRecord]: ...

    def create_telemetry(self, product_id: int, payload: CreateTelemetryInput) -> TelemetryRecord: ...
