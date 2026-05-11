from pydantic import BaseModel, Field


class WorkerRecord(BaseModel):
    id: int
    name: str
    timestamp: int


class ProductRecord(BaseModel):
    id: int
    name: str
    price: str
    description: str
    required_temperature: str
    manufactured_at: str
    timestamp: int


class StatusRecord(BaseModel):
    location: str
    timestamp: int
    temperature: str
    humidity: str
    heat_index: str
    worker_id: int
    product_id: int
    total_quantity: int
    delivered: bool


class TelemetryRecord(BaseModel):
    temperature: int
    humidity: int
    heat_index: int
    product_id: int


class OverviewRecord(BaseModel):
    product_count: int
    worker_count: int
    status_count: int
    telemetry_count: int
    active_alerts: int
    chain_mode: str


class IntegrationRecord(BaseModel):
    chain_mode: str
    contract_address: str | None
    explorer_url: str | None
    rpc_url_configured: bool
    telemetry_flow_name: str
    telemetry_flow_provider: str
    telemetry_flow_endpoint: str


class CreateWorkerInput(BaseModel):
    name: str = Field(min_length=2, max_length=80)


class CreateProductInput(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    price: str = Field(min_length=1, max_length=40)
    description: str = Field(min_length=8, max_length=400)
    required_temperature: str = Field(min_length=1, max_length=40)
    manufactured_at: str = Field(min_length=2, max_length=60)


class CreateStatusInput(BaseModel):
    location: str = Field(min_length=2, max_length=120)
    temperature: str = Field(min_length=1, max_length=20)
    humidity: str = Field(min_length=1, max_length=20)
    heat_index: str = Field(min_length=1, max_length=20)
    worker_id: int = Field(ge=0)
    total_quantity: int = Field(ge=0)
    delivered: bool = False


class CreateTelemetryInput(BaseModel):
    temperature: int
    humidity: int
    heat_index: int


class NodeRedTelemetryInput(BaseModel):
    product_id: int = Field(ge=0)
    temperature: int
    humidity: int
    heat_index: int
    gateway_id: str = Field(default="node-red-gateway", min_length=2, max_length=80)
    flow_name: str = Field(default="Node-RED Telemetry Flow", min_length=3, max_length=120)
    recorded_at: int | None = None


class NodeRedTelemetryReceipt(BaseModel):
    flow_name: str
    provider: str
    gateway_id: str
    product_id: int
    endpoint: str
    chain_mode: str
    temperature: int
    humidity: int
    heat_index: int
    recorded_at: int | None = None


class NodeRedFlowRecord(BaseModel):
    name: str
    provider: str
    endpoint: str
    method: str
    content_type: str
    description: str
