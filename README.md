# PharmaChain

PharmaChain is a supply-chain visibility platform for product tracking, custody events, and environmental monitoring.

## Structure

- `backend/`: FastAPI API with config-based chain integration and `uv`
- `frontend/`: Vite + React product UI
- `contracts/`: Solidity contract source
- `docs/`: setup notes, product guide, and integration documentation

## Highlights

- Removed hardcoded addresses and private key placeholders from the app flow
- Moved blockchain interaction behind the backend instead of the browser
- Added a sandbox mode so the product can run without live chain credentials
- Reworked the frontend into a cleaner PharmaChain product shell
- Aligned contract writes with the current backend input flow
- Added a named Node-RED telemetry ingestion flow for device and gateway data
- Documented the product, workflow, and test scenario in `docs/PharmaChain-product-guide.md`
