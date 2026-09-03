from __future__ import annotations

import time

from src.data.sample_state import (
    SAMPLE_PRODUCTS,
    SAMPLE_STATUS,
    SAMPLE_TELEMETRY,
    SAMPLE_WORKERS,
)
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


class SandboxSupplyChainGateway:
    def __init__(self) -> None:
        self.workers = [
            item.model_copy(deep=True)
            for item in SAMPLE_WORKERS
        ]

        self.products = [
            item.model_copy(deep=True)
            for item in SAMPLE_PRODUCTS
        ]

        self.status_events = {
            key: [
                event.model_copy(deep=True)
                for event in value
            ]
            for key, value in SAMPLE_STATUS.items()
        }

        self.telemetry_events = {
            key: [
                event.model_copy(deep=True)
                for event in value
            ]
            for key, value in SAMPLE_TELEMETRY.items()
        }

    def list_workers(self) -> list[WorkerRecord]:
        return self.workers

    def create_worker(
        self,
        payload: CreateWorkerInput,
    ) -> WorkerRecord:
        worker = WorkerRecord(
            id=len(self.workers),
            name=payload.name,
            timestamp=int(time.time()),
        )

        self.workers.append(worker)
        return worker

    def list_products(self) -> list[ProductRecord]:
        return self.products

    def create_product(
        self,
        payload: CreateProductInput,
    ) -> ProductRecord:
        product = ProductRecord(
            id=len(self.products),
            name=payload.name,
            batch_number=payload.batch_number,
            manufacturer=payload.manufacturer,
            description=payload.description,
            required_temperature=payload.required_temperature,
            manufacturing_date=payload.manufacturing_date,
            expiry_date=payload.expiry_date,
            current_owner="",
            timestamp=int(time.time()),
            verified=False,
        )

        self.products.append(product)
        return product

    def list_status(
        self,
        product_id: int,
    ) -> list[StatusRecord]:
        return self.status_events.get(product_id, [])

    def create_status(
        self,
        product_id: int,
        payload: CreateStatusInput,
    ) -> StatusRecord:
        status = StatusRecord(
            location=payload.location,
            timestamp=int(time.time()),
            temperature=payload.temperature,
            humidity=payload.humidity,
            heat_index=payload.heat_index,
            worker_id=payload.worker_id,
            product_id=product_id,
            total_quantity=payload.total_quantity,
            delivered=payload.delivered,
        )

        self.status_events.setdefault(
            product_id,
            [],
        ).append(status)

        return status

    def list_telemetry(
        self,
        product_id: int,
    ) -> list[TelemetryRecord]:
        return self.telemetry_events.get(product_id, [])

    def create_telemetry(
        self,
        product_id: int,
        payload: CreateTelemetryInput,
    ) -> TelemetryRecord:
        reading = TelemetryRecord(
            temperature=payload.temperature,
            humidity=payload.humidity,
            heat_index=payload.heat_index,
            product_id=product_id,
        )

        self.telemetry_events.setdefault(
            product_id,
            [],
        ).append(reading)

        return reading