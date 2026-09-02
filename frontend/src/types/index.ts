export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Overview = {
  product_count: number;
  worker_count: number;
  status_count: number;
  telemetry_count: number;
  active_alerts: number;
  chain_mode: string;
};

export type IntegrationDetails = {
  chain_mode: string;
  contract_address: string | null;
  explorer_url: string | null;
  rpc_url_configured: boolean;
  telemetry_flow_name: string;
  telemetry_flow_provider: string;
  telemetry_flow_endpoint: string;
};

export type NodeRedFlowDetails = {
  name: string;
  provider: string;
  endpoint: string;
  method: string;
  content_type: string;
  description: string;
};

export type Worker = {
  id: number;
  name: string;
  timestamp: number;
};

export type Product = {
  id: number;
  name: string;
  batch_number: string;
  manufacturer: string;
  description: string;
  required_temperature: string;
  manufacturing_date: string;
  expiry_date: string;
  current_owner: string;
  timestamp: number;
  verified: boolean;
};

export type StatusEvent = {
  location: string;
  timestamp: number;
  temperature: string;
  humidity: string;
  heat_index: string;
  worker_id: number;
  product_id: number;
  total_quantity: number;
  delivered: boolean;
};

export type TelemetryEvent = {
  temperature: number;
  humidity: number;
  heat_index: number;
  product_id: number;
};

export type CreateWorkerInput = {
  name: string;
};

export type CreateProductInput = {
  name: string;
  batch_number: string;
  manufacturer: string;
  description: string;
  required_temperature: string;
  manufacturing_date: string;
  expiry_date: string;
};

export type CreateStatusInput = {
  location: string;
  temperature: string;
  humidity: string;
  heat_index: string;
  worker_id: number;
  total_quantity: number;
  delivered: boolean;
};

export type CreateTelemetryInput = {
  temperature: number;
  humidity: number;
  heat_index: number;
};

export type NodeRedTelemetryInput = {
  product_id: number;
  temperature: number;
  humidity: number;
  heat_index: number;
  gateway_id: string;
  flow_name: string;
  recorded_at?: number | null;
};
