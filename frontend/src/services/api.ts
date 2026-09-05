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
  baseURL:
    import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL}/api`
      : "http://localhost:8000/api",
});

/*
 * Attach the logged-in user's JWT token to
 * every API request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "pharmachain_token",
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/*
 * If the backend says the token is invalid or expired,
 * clear the local session and send the user back to login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pharmachain_token");
      localStorage.removeItem("pharmachain_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

async function unwrap<T>(
  request: Promise<{ data: ApiEnvelope<T> }>,
): Promise<T> {
  const response = await request;

  return response.data.data;
}

export const PharmaChainApi = {
  getOverview: () =>
    unwrap<Overview>(
      api.get("/overview"),
    ),

  getIntegrations: () =>
    unwrap<IntegrationDetails>(
      api.get("/integrations"),
    ),

  getNodeRedFlow: () =>
    unwrap<NodeRedFlowDetails>(
      api.get("/ingestion/node-red"),
    ),

  getWorkers: () =>
    unwrap<Worker[]>(
      api.get("/workers"),
    ),

  createWorker: (
    payload: CreateWorkerInput,
  ) =>
    unwrap<Worker>(
      api.post("/workers", payload),
    ),

  getProducts: () =>
    unwrap<Product[]>(
      api.get("/products"),
    ),

  createProduct: (
    payload: CreateProductInput,
  ) =>
    unwrap<Product>(
      api.post("/products", payload),
    ),

  getStatus: (
    productId: number,
  ) =>
    unwrap<StatusEvent[]>(
      api.get(
        `/products/${productId}/status`,
      ),
    ),

  createStatus: (
    productId: number,
    payload: CreateStatusInput,
  ) =>
    unwrap<StatusEvent>(
      api.post(
        `/products/${productId}/status`,
        payload,
      ),
    ),

  getTelemetry: (
    productId: number,
  ) =>
    unwrap<TelemetryEvent[]>(
      api.get(
        `/products/${productId}/telemetry`,
      ),
    ),

  createTelemetry: (
    productId: number,
    payload: CreateTelemetryInput,
  ) =>
    unwrap<TelemetryEvent>(
      api.post(
        `/products/${productId}/telemetry`,
        payload,
      ),
    ),

  ingestNodeRedTelemetry: (
    payload: NodeRedTelemetryInput,
  ) =>
    unwrap(
      api.post(
        "/ingestion/node-red/telemetry",
        payload,
      ),
    ),
};