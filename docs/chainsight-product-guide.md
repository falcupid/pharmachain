# PharmaChain Product Guide

## 1. Product overview

PharmaChain is a supply-chain visibility product built for teams that need one clean place to manage tracked goods, handling checkpoints, and environmental telemetry.

The product is meant for operational environments where location updates alone are not enough. A shipment may also need condition evidence, handler accountability, and an optional verification layer for sensitive records. PharmaChain combines those concerns into one workflow instead of splitting them across spreadsheets, chat updates, IoT dashboards, and blockchain tooling.

At a high level, PharmaChain does four things well:

- registers products that need to be tracked
- records who handled them and where events happened
- receives device telemetry through a named Node-RED ingestion flow
- supports blockchain-backed writes when a deployment needs stronger trust guarantees

## 2. What the product does

PharmaChain allows an operations team to:

- create a product or shipment record
- define the expected storage or transport temperature range
- register workers, handlers, or checkpoint operators
- record product movement and custody events
- attach telemetry to a product timeline through a Node-RED gateway flow
- review telemetry and status history from one tracking view
- run in `sandbox` mode for setup and testing
- switch to `blockchain` mode when live chain infrastructure is ready

This makes the product useful for scenarios like:

- cold-chain medical logistics
- food and agricultural transport
- export compliance and warehouse transfer visibility
- industrial inventory that must stay within monitored environmental bounds

## 3. Product positioning

PharmaChain should be understood as an operations product first.

The blockchain layer is not the homepage story. The primary value is visibility: products, handlers, checkpoints, telemetry, and a single interface for understanding what happened. Blockchain becomes a supporting trust rail when required by the deployment.

The telemetry flow is also explicit by design. Instead of hiding device ingestion behind vague backend logic, PharmaChain names the intake path and surfaces it in the product so the operational model is clear:

- devices or sensors publish into Node-RED
- Node-RED formats the payload
- PharmaChain accepts the payload through a dedicated ingestion endpoint
- the reading is attached to a product timeline

## 4. Core technology

### Frontend

The frontend is a React application built with TypeScript and Vite. It provides the product interface for overview, product creation, operations intake, and product tracking.

Frontend responsibilities:

- render the product shell and navigation
- show operational summaries and integration state
- collect user input for product, handler, and checkpoint creation
- simulate or explain Node-RED gateway ingestion
- fetch timelines and telemetry for a selected product

Key frontend files:

- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/ProductsPage.tsx`
- `frontend/src/pages/OperationsPage.tsx`
- `frontend/src/pages/TrackingPage.tsx`
- `frontend/src/components/forms/TelemetryForm.tsx`
- `frontend/src/services/api.ts`
- `frontend/src/styles/globals.css`

### Backend

The backend is a FastAPI application managed with `uv`. It is responsible for the business workflow, configuration, blockchain gateway selection, and Node-RED telemetry ingestion.

Backend responsibilities:

- expose the API used by the frontend
- validate request payloads
- choose between `sandbox` and `blockchain` execution
- manage product, worker, status, and telemetry records
- expose the Node-RED flow metadata
- accept telemetry from a named ingestion endpoint

Key backend files:

- `backend/main.py`
- `backend/src/app.py`
- `backend/src/config.py`
- `backend/src/api/routes/supply_chain.py`
- `backend/src/services/supply_chain.py`
- `backend/src/services/sandbox.py`
- `backend/src/services/blockchain.py`
- `backend/src/schemas/supply_chain.py`
- `backend/src/data/sample_state.py`

### Contract layer

The Solidity contract defines the on-chain storage model used when PharmaChain runs in `blockchain` mode.

Contract file:

- `contracts/SupplyChain.sol`

The backend talks to the contract so the browser stays free of private keys, RPC logic, or direct chain writes.

## 5. Operating modes

### Sandbox mode

`sandbox` mode is the product's setup and test mode. It uses bundled sample records so the application can run immediately without live chain credentials.

Use `sandbox` mode when:

- you are styling or reviewing the frontend
- you are testing the user flow without a deployed contract
- you are wiring Node-RED before your blockchain environment is ready
- you want a safe environment for internal reviews and early testing

### Blockchain mode

`blockchain` mode activates the live gateway used for on-chain reads and writes.

Use `blockchain` mode when:

- you already have a deployed contract
- you have a valid RPC endpoint
- you have a funded signing wallet where needed
- you want status and product actions to go through the configured contract flow

## 6. End-to-end workflow

### High-level workflow

1. A team member creates a product record in PharmaChain.
2. A supervisor or operator registers workers or handlers.
3. A checkpoint event is recorded when the product changes location, custody, or delivery state.
4. Sensors or edge devices publish readings into Node-RED.
5. Node-RED sends the formatted payload to PharmaChain.
6. PharmaChain validates the payload and attaches the telemetry to the correct product.
7. The tracking screen shows both status history and telemetry history together.
8. If blockchain mode is enabled, product and status writes use the configured backend contract gateway.

### Node-RED telemetry workflow

The named ingestion path is:

- `POST /api/ingestion/node-red/telemetry`

The expected payload is:

- `product_id`
- `temperature`
- `humidity`
- `heat_index`
- `gateway_id`
- `flow_name`
- optional `recorded_at`

What happens after the payload is sent:

1. The request reaches the FastAPI route in `backend/src/api/routes/supply_chain.py`.
2. The payload is validated by schemas in `backend/src/schemas/supply_chain.py`.
3. `backend/src/services/supply_chain.py` converts the ingestion payload into a telemetry record.
4. The active gateway writes that telemetry into either sandbox data or the blockchain-backed service flow.
5. The frontend can then display the new telemetry in `frontend/src/pages/TrackingPage.tsx`.

## 7. Workflow file map

### App startup

- `backend/main.py`
  Starts the backend server entry point.

- `backend/src/app.py`
  Builds the FastAPI app, middleware, and mounted routes.

- `frontend/src/main.tsx`
  Mounts the frontend application in the browser.

- `frontend/src/App.tsx`
  Defines the route-level product structure.

### Configuration and environment

- `backend/src/config.py`
  Reads environment variables and decides whether the active mode is `sandbox` or `blockchain`.

- `backend/.env.example`
  Documents backend environment variables such as RPC URL, wallet key, contract address, and explorer base URL.

- `frontend/.env.example`
  Documents the frontend API base URL.

### Product and operations flow

- `backend/src/api/routes/supply_chain.py`
  Declares the endpoints for overview, integrations, workers, products, status, telemetry, and Node-RED intake.

- `backend/src/services/supply_chain.py`
  Coordinates business logic and exposes integration details used by the frontend.

- `backend/src/services/sandbox.py`
  Provides writable in-memory product, status, worker, and telemetry behavior for non-chain use.

- `backend/src/services/blockchain.py`
  Contains the blockchain gateway implementation used for live contract interaction.

- `backend/src/data/sample_state.py`
  Seeds sample workers, products, status history, and telemetry for `sandbox` mode.

- `backend/src/schemas/supply_chain.py`
  Defines the request and response contracts used by the API.

### Frontend screens

- `frontend/src/pages/HomePage.tsx`
  Explains the product focus, shows current mode, and surfaces the Node-RED flow presence.

- `frontend/src/pages/ProductsPage.tsx`
  Handles product creation and catalog listing.

- `frontend/src/pages/OperationsPage.tsx`
  Handles handlers, checkpoint capture, and Node-RED intake guidance.

- `frontend/src/pages/TrackingPage.tsx`
  Loads a product timeline and telemetry history by product ID.

- `frontend/src/components/forms/WorkerForm.tsx`
  Collects handler names.

- `frontend/src/components/forms/StatusForm.tsx`
  Collects movement and custody events.

- `frontend/src/components/forms/TelemetryForm.tsx`
  Simulates a Node-RED gateway post from the UI.

- `frontend/src/services/api.ts`
  Centralizes every frontend API request.

## 8. How to run the product

### Backend startup

1. Open `backend/.env.example`.
2. Create `backend/.env`.
3. Set your mode:
   - `CHAIN_MODE=sandbox` for bundled sample data
   - `CHAIN_MODE=blockchain` for live chain activity
4. Start the backend:

```bash
uv sync
uv run python main.py
```

The backend runs on `http://localhost:8000` by default.

### Frontend startup

1. Open `frontend/.env.example`.
2. Create `frontend/.env` only if you need a different API URL.
3. Install dependencies and start the frontend:

```bash
cmd /c npm install
cmd /c npm run dev
```

The frontend runs on Vite's default local development port unless you change it.

## 9. How to use PharmaChain in practice

### Basic manual product flow

1. Open the home screen to confirm the current mode and integration state.
2. Go to Products and create a product record.
3. Go to Operations and register the handlers involved in the process.
4. Record at least one status or custody event for the product.
5. Send telemetry using either Node-RED or the UI ingestion form.
6. Open Tracking, enter the product ID, and review the combined movement and telemetry history.

### Node-RED integration flow

In Node-RED, create a flow that collects sensor or gateway data and forwards it with an HTTP request node to:

```text
POST http://localhost:8000/api/ingestion/node-red/telemetry
```

Example payload:

```json
{
  "product_id": 1,
  "temperature": 6,
  "humidity": 43,
  "heat_index": 7,
  "gateway_id": "cold-room-gateway-01",
  "flow_name": "Node-RED Telemetry Flow"
}
```

Once accepted, the reading becomes part of the selected product's telemetry history.

## 10. User persona

### Persona: Ada Okafor

- Role: Operations Coordinator
- Company type: temperature-sensitive medical logistics company
- Primary responsibility: keep routed products within condition limits while maintaining handling accountability

Ada needs a system that helps her answer questions like:

- who last handled this shipment
- where the shipment was last checked
- whether the temperature stayed within range
- whether the shipment can be marked delivered with confidence

Her current pain points are:

- updates scattered across chat messages and spreadsheets
- sensor readings living in a separate dashboard from product operations
- weak auditability when management asks for proof of handling or condition history

## 11. Test scenario

### Scenario: cold-chain vaccine handoff

Use this scenario to test the product end to end.

1. Ada opens PharmaChain in `sandbox` mode.
2. She creates a product named `Vaccine Batch A14`.
3. She registers two handlers in Operations.
4. She records a checkpoint from the origin hub.
5. A Node-RED flow posts telemetry for the product into the ingestion endpoint.
6. She opens Tracking and searches for the product ID.
7. She confirms that both the custody timeline and telemetry readings appear.

Expected result:

- the product appears in the catalog
- the handlers appear in the operations list
- the status event appears in the product timeline
- the telemetry appears in the telemetry history
- the product can be reviewed from one place without switching tools

## 12. Acceptance checklist

Use this checklist after setup:

- product creation works from the Products page
- worker creation works from the Operations page
- status submission works from the Operations page
- Node-RED telemetry ingestion works through `/api/ingestion/node-red/telemetry`
- tracking loads status and telemetry for a valid product ID
- `CHAIN_MODE=sandbox` works without live chain credentials
- `CHAIN_MODE=blockchain` is ready once RPC, wallet, and contract values are configured
