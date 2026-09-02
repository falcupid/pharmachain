from src.schemas.supply_chain import ProductRecord, StatusRecord, TelemetryRecord, WorkerRecord


SAMPLE_WORKERS: list[WorkerRecord] = [
    WorkerRecord(id=0, name="Ada Okafor", timestamp=1715400000),
    WorkerRecord(id=1, name="Tobi Mensah", timestamp=1715403600),
]

SAMPLE_PRODUCTS: list[ProductRecord] = [
    ProductRecord(
        id=0,
        name="Temperature-Sensitive Vaccine Kit",
        batch_number="VAC-2026-001",
        manufacturer="Pfizer Nigeria",
        description="Cold-chain medical shipment prepared for regional hospital distribution.",
        required_temperature="2 C to 8 C",
        manufacturing_date="2026-05-01",
        expiry_date="2028-05-01",
        current_owner="0x59f6d60122463fe9b92e92aba84d6382de075971",
        timestamp=1715407200,
        verified=True,
    ),
    ProductRecord(
        id=1,
        name="Premium Cocoa Batch",
        batch_number="COCOA-2026-014",
        manufacturer="Lagos Cocoa Export Ltd",
        description="Export-ready agricultural batch with humidity monitoring and custody checkpoints.",
        required_temperature="18 C to 24 C",
        manufacturing_date="2026-05-03",
        expiry_date="2027-05-03",
        current_owner="0x59f6d60122463fe9b92e92aba84d6382de075971",
        timestamp=1715410800,
        verified=True,
    ),
]

SAMPLE_STATUS: dict[int, list[StatusRecord]] = {
    0: [
        StatusRecord(
            location="Lagos Packaging Hub",
            timestamp=1715414400,
            temperature="5",
            humidity="40",
            heat_index="5",
            worker_id=0,
            product_id=0,
            total_quantity=120,
            delivered=False,
        ),
        StatusRecord(
            location="Abuja Transfer Point",
            timestamp=1715418000,
            temperature="7",
            humidity="44",
            heat_index="7",
            worker_id=1,
            product_id=0,
            total_quantity=120,
            delivered=True,
        ),
    ],
    1: [
        StatusRecord(
            location="Ibadan Collection Center",
            timestamp=1715421600,
            temperature="22",
            humidity="61",
            heat_index="24",
            worker_id=1,
            product_id=1,
            total_quantity=72,
            delivered=False,
        )
    ],
}

SAMPLE_TELEMETRY: dict[int, list[TelemetryRecord]] = {
    0: [
        TelemetryRecord(temperature=5, humidity=40, heat_index=5, product_id=0),
        TelemetryRecord(temperature=7, humidity=44, heat_index=7, product_id=0),
    ],
    1: [
        TelemetryRecord(temperature=22, humidity=61, heat_index=24, product_id=1),
    ],
}
