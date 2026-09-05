from __future__ import annotations

import sys
from pathlib import Path

# Allow imports from backend/
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from src.data.sample_state import (  # noqa: E402
    SAMPLE_PRODUCTS,
    SAMPLE_STATUS,
    SAMPLE_TELEMETRY,
    SAMPLE_WORKERS,
)
from src.database import get_db_connection  # noqa: E402


def seed_database() -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # ---------------------------------------------------------
            # Workers
            # ---------------------------------------------------------
            for worker in SAMPLE_WORKERS:
                cursor.execute(
                    """
                    INSERT INTO workers (id, name, timestamp)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) DO NOTHING;
                    """,
                    (
                        worker.id,
                        worker.name,
                        worker.timestamp,
                    ),
                )

            # ---------------------------------------------------------
            # Products
            # ---------------------------------------------------------
            for product in SAMPLE_PRODUCTS:
                cursor.execute(
                    """
                    INSERT INTO products (
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
                    )
                    VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    )
                    ON CONFLICT (id) DO NOTHING;
                    """,
                    (
                        product.id,
                        product.name,
                        product.batch_number,
                        product.manufacturer,
                        product.description,
                        product.required_temperature,
                        product.manufacturing_date,
                        product.expiry_date,
                        product.current_owner,
                        product.timestamp,
                        product.verified,
                    ),
                )

            # ---------------------------------------------------------
            # Status events
            # ---------------------------------------------------------
            for product_id, events in SAMPLE_STATUS.items():
                for event in events:
                    cursor.execute(
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
                            %s, %s, %s, %s, %s, %s, %s, %s, %s
                        )
                        """,
                        (
                            event.location,
                            event.timestamp,
                            event.temperature,
                            event.humidity,
                            event.heat_index,
                            event.worker_id,
                            product_id,
                            event.total_quantity,
                            event.delivered,
                        ),
                    )

            # ---------------------------------------------------------
            # Telemetry
            # ---------------------------------------------------------
            for product_id, readings in SAMPLE_TELEMETRY.items():
                for reading in readings:
                    cursor.execute(
                        """
                        INSERT INTO telemetry_events (
                            temperature,
                            humidity,
                            heat_index,
                            product_id
                        )
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            reading.temperature,
                            reading.humidity,
                            reading.heat_index,
                            product_id,
                        ),
                    )

    print("PharmaChain sample data seeded successfully.")


if __name__ == "__main__":
    seed_database()