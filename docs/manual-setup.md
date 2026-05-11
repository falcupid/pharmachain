# Manual Setup Notes

You still need to plug in a few project-specific values before production use:

## Backend `.env`

- `CHAIN_MODE=sandbox` for bundled sample records or `CHAIN_MODE=blockchain` for live chain activity
- `WEB3_RPC_URL` with your RPC provider URL
- `WEB3_PRIVATE_KEY` with the signing wallet private key
- `WEB3_ACCOUNT_ADDRESS` with the wallet address that signs transactions
- `WEB3_CONTRACT_ADDRESS` with your deployed `Supplychain` contract address
- `CHAIN_EXPLORER_BASE_URL` with the right explorer base, for example `https://amoy.polygonscan.com/address/`
- Node-RED should post telemetry JSON to `POST /api/ingestion/node-red/telemetry`

## Frontend `.env`

- `VITE_API_URL` if your backend will not run on `http://localhost:8000/api`

## Product copy and links you may want to customize

- Landing-page wording inside `frontend/src/pages/HomePage.tsx`
- Sample records in `backend/src/data/sample_state.py`
- Industry-specific labels or ranges in `frontend/src/components/forms/ProductForm.tsx`

## Contract notes

- The Solidity contract is named `Supplychain` and lives in `contracts/SupplyChain.sol`
- The backend sends the `AddProduct` arguments expected by the deployed contract interface
