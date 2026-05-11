# ChainSight Backend

Simple FastAPI backend for the ChainSight product.

## Stack

- FastAPI
- `uv` for environment and dependency management
- Config-based blockchain integration
- Sandbox mode for UI development without live chain credentials

## Run locally

```bash
uv sync
uv run python main.py
```

The API runs on `http://localhost:8000` by default.

## Environment

Copy `.env.example` to `.env`.

- Leave `CHAIN_MODE=sandbox` for a working environment with bundled sample data.
- Set `CHAIN_MODE=blockchain` and fill the `WEB3_*` values when you want the backend to read/write against your deployed contract.

## Node-RED ingestion

ChainSight exposes a named gateway intake for device readings:

- `POST /api/ingestion/node-red/telemetry`

Node-RED can send temperature, humidity, and heat-index readings to that endpoint, and ChainSight will attach the result to the product telemetry stream.
