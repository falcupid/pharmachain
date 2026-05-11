import axios from "axios";

import type {
  ApiEnvelope,
  CreateProductInput,
  CreateStatusInput,
  CreateTelemetryInput,
  CreateWorkerInput,
  IntegrationDetails,
  NodeRedFlowDetails,
  NodeRedTelemetryInput,
  Overview,
  Product,
  StatusEvent,
  TelemetryEvent,
  Worker,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

async function unwrap<T>(request: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const response = await request;
  return response.data.data;
}

export const chainsightApi = {
  getOverview: () => unwrap<Overview>(api.get("/overview")),
  getIntegrations: () => unwrap<IntegrationDetails>(api.get("/integrations")),
  getNodeRedFlow: () => unwrap<NodeRedFlowDetails>(api.get("/ingestion/node-red")),
  getWorkers: () => unwrap<Worker[]>(api.get("/workers")),
  createWorker: (payload: CreateWorkerInput) => unwrap<Worker>(api.post("/workers", payload)),
  getProducts: () => unwrap<Product[]>(api.get("/products")),
  createProduct: (payload: CreateProductInput) => unwrap<Product>(api.post("/products", payload)),
  getStatus: (productId: number) => unwrap<StatusEvent[]>(api.get(`/products/${productId}/status`)),
  createStatus: (productId: number, payload: CreateStatusInput) =>
    unwrap<StatusEvent>(api.post(`/products/${productId}/status`, payload)),
  getTelemetry: (productId: number) =>
    unwrap<TelemetryEvent[]>(api.get(`/products/${productId}/telemetry`)),
  createTelemetry: (productId: number, payload: CreateTelemetryInput) =>
    unwrap<TelemetryEvent>(api.post(`/products/${productId}/telemetry`, payload)),
  ingestNodeRedTelemetry: (payload: NodeRedTelemetryInput) =>
    unwrap(api.post("/ingestion/node-red/telemetry", payload)),
};
