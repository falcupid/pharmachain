from __future__ import annotations

from src.database import get_db_connection
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


class DatabaseSupplyChainGateway:
    """PostgreSQL/Supabase implementation of the supply-chain gateway."""

    def list_workers(self) -> list[WorkerRecord]:
        with get_db_connection() as conn:
            rows = conn.execute(
                """
                SELECT id, name, timestamp
                FROM workers
                ORDER BY id
                """
            ).fetchall()

        return [
            WorkerRecord(
                id=row[0],
                name=row[1],
                timestamp=row[2],
            )
            for row in rows
        ]

    def create_worker(
        self,
        payload: CreateWorkerInput,
    ) -> WorkerRecord:
        with get_db_connection() as conn:
            row = conn.execute(
                """
                INSERT INTO workers (name, timestamp)
                VALUES (%s, EXTRACT(EPOCH FROM NOW())::bigint)
                RETURNING id, name, timestamp
                """,
                (payload.name,),
            ).fetchone()

        return WorkerRecord(
            id=row[0],
            name=row[1],
            timestamp=row[2],
        )

    def list_products(self) -> list[ProductRecord]:
        with get_db_connection() as conn:
            rows = conn.execute(
                """
                SELECT
                    id,
                    name,
                    batch_number,
                    manufacturer,
                    description,
                    required_temperature,
                    manufacturing_date,
                    expiry_date,
                    current_owner,
                    timestamp,
                    verified
                FROM products
                ORDER BY id
                """
            ).fetchall()

        return [
            ProductRecord(
                id=row[0],
                name=row[1],
                batch_number=row[2],
                manufacturer=row[3],
                description=row[4],
                required_temperature=row[5],
                manufacturing_date=row[6],
                expiry_date=row[7],
                current_owner=row[8],
                timestamp=row[9],
                verified=row[10],
            )
            for row in rows
        ]

    def create_product(
        self,
        payload: CreateProductInput,
    ) -> ProductRecord:
        with get_db_connection() as conn:
            row = conn.execute(
                """
                INSERT INTO products (
                    name,
                    batch_number,
                    manufacturer,
                    description,
                    required_temperature,
                    manufacturing_date,
                    expiry_date,
                    current_owner,
                    timestamp,
                    verified
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    '',
                    EXTRACT(EPOCH FROM NOW())::bigint,
                    FALSE
                )
                RETURNING
                    id,
                    name,
                    batch_number,
                    manufacturer,
                    description,
                    required_temperature,
                    manufacturing_date,
                    expiry_date,
                    current_owner,
                    timestamp,
                    verified
                """,
                (
                    payload.name,
                    payload.batch_number,
                    payload.manufacturer,
                    payload.description,
                    payload.required_temperature,
                    payload.manufacturing_date,
                    payload.expiry_date,
                ),
            ).fetchone()

        return ProductRecord(
            id=row[0],
            name=row[1],
            batch_number=row[2],
            manufacturer=row[3],
            description=row[4],
            required_temperature=row[5],
            manufacturing_date=row[6],
            expiry_date=row[7],
            current_owner=row[8],
            timestamp=row[9],
            verified=row[10],
        )

    def list_status(
        self,
        product_id: int,
    ) -> list[StatusRecord]:
        with get_db_connection() as conn:
            rows = conn.execute(
                """
                SELECT
                    location,
                    timestamp,
                    temperature,
                    humidity,
                    heat_index,
                    worker_id,
                    product_id,
                    total_quantity,
                    delivered
                FROM status_events
                WHERE product_id = %s
                ORDER BY timestamp
                """,
                (product_id,),
            ).fetchall()

        return [
            StatusRecord(
                location=row[0],
                timestamp=row[1],
                temperature=row[2],
                humidity=row[3],
                heat_index=row[4],
                worker_id=row[5],
                product_id=row[6],
                total_quantity=row[7],
                delivered=row[8],
            )
            for row in rows
        ]

    def create_status(
        self,
        product_id: int,
        payload: CreateStatusInput,
    ) -> StatusRecord:
        with get_db_connection() as conn:
            row = conn.execute(
                """
                INSERT INTO status_events (
                    location,
                    timestamp,
                    temperature,
                    humidity,
                    heat_index,
                    worker_id,
                    product_id,
                    total_quantity,
                    delivered
                )
                VALUES (
                    %s,
                    EXTRACT(EPOCH FROM NOW())::bigint,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
                RETURNING
                    location,
                    timestamp,
                    temperature,
                    humidity,
                    heat_index,
                    worker_id,
                    product_id,
                    total_quantity,
                    delivered
                """,
                (
                    payload.location,
                    payload.temperature,
                    payload.humidity,
                    payload.heat_index,
                    payload.worker_id,
                    product_id,
                    payload.total_quantity,
                    payload.delivered,
                ),
            ).fetchone()

        return StatusRecord(
            location=row[0],
            timestamp=row[1],
            temperature=row[2],
            humidity=row[3],
            heat_index=row[4],
            worker_id=row[5],
            product_id=row[6],
            total_quantity=row[7],
            delivered=row[8],
        )

    def list_telemetry(
        self,
        product_id: int,
    ) -> list[TelemetryRecord]:
        with get_db_connection() as conn:
            rows = conn.execute(
                """
                SELECT
                    temperature,
                    humidity,
                    heat_index,
                    product_id
                FROM telemetry_events
                WHERE product_id = %s
                ORDER BY id
                """,
                (product_id,),
            ).fetchall()

        return [
            TelemetryRecord(
                temperature=row[0],
                humidity=row[1],
                heat_index=row[2],
                product_id=row[3],
            )
            for row in rows
        ]

    def create_telemetry(
        self,
        product_id: int,
        payload: CreateTelemetryInput,
    ) -> TelemetryRecord:
        with get_db_connection() as conn:
            row = conn.execute(
                """
                INSERT INTO telemetry_events (
                    temperature,
                    humidity,
                    heat_index,
                    product_id
                )
                VALUES (%s, %s, %s, %s)
                RETURNING
                    temperature,
                    humidity,
                    heat_index,
                    product_id
                """,
                (
                    payload.temperature,
                    payload.humidity,
                    payload.heat_index,
                    product_id,
                ),
            ).fetchone()

        return TelemetryRecord(
            temperature=row[0],
            humidity=row[1],
            heat_index=row[2],
            product_id=row[3],
        )