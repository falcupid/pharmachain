from __future__ import annotations

import json
from pathlib import Path

from fastapi import HTTPException, status
from web3 import Web3

from src.config import Config
from src.schemas.supply_chain import (
    CreateProductInput,
    CreateStatusInput,
    CreateTelemetryInput,
    CreateWorkerInput,
    ProductRecord,
    StatusRecord,
    TelemetryRecord,
    WorkerRecord,
)


class BlockchainSupplyChainGateway:
    def __init__(self) -> None:
        self._ensure_config()
        abi_path = Path(__file__).resolve().parents[1] / "abi" / "supplychain_abi.json"
        self.w3 = Web3(Web3.HTTPProvider(Config.WEB3_RPC_URL))
        self.account = self.w3.to_checksum_address(Config.WEB3_ACCOUNT_ADDRESS or "")
        self.contract_address = self.w3.to_checksum_address(Config.WEB3_CONTRACT_ADDRESS or "")
        self.private_key = Config.WEB3_PRIVATE_KEY or ""

        with abi_path.open("r", encoding="utf-8") as file:
            abi = json.load(file)

        self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)

    def _ensure_config(self) -> None:
        missing = [
            name
            for name, value in {
                "WEB3_RPC_URL": Config.WEB3_RPC_URL,
                "WEB3_PRIVATE_KEY": Config.WEB3_PRIVATE_KEY,
                "WEB3_ACCOUNT_ADDRESS": Config.WEB3_ACCOUNT_ADDRESS,
                "WEB3_CONTRACT_ADDRESS": Config.WEB3_CONTRACT_ADDRESS,
            }.items()
            if not value
        ]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Missing blockchain configuration: {', '.join(missing)}",
            )

    def _build_and_send(self, fn) -> None:
        nonce = self.w3.eth.get_transaction_count(self.account)
        transaction = fn.build_transaction(
            {
                "from": self.account,
                "nonce": nonce,
                "gasPrice": self.w3.eth.gas_price,
            }
        )
        if "gas" not in transaction:
            transaction["gas"] = fn.estimate_gas({"from": self.account})
        signed = self.w3.eth.account.sign_transaction(transaction, self.private_key)
        txn_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        self.w3.eth.wait_for_transaction_receipt(txn_hash)

    @staticmethod
    def _to_int(value) -> int:
        return int(value)

    def list_workers(self) -> list[WorkerRecord]:
        workers = self.contract.functions.getWorkersList().call()
        return [
            WorkerRecord(
                name=item[0],
                id=self._to_int(item[1]),
                timestamp=self._to_int(item[2]),
            )
            for item in workers
        ]

    def create_worker(self, payload: CreateWorkerInput) -> WorkerRecord:
        self._build_and_send(self.contract.functions.setWorker(payload.name))
        return self.list_workers()[-1]

    def list_products(self) -> list[ProductRecord]:
        products = self.contract.functions.getProducts().call()
        return [
            ProductRecord(
                id=self._to_int(item[0]),
                name=item[1],
                batch_number=item[2],
                manufacturer=item[3],
                description=item[4],
                required_temperature=item[5],
                manufacturing_date=item[6],
                expiry_date=item[7],
                current_owner=item[8],
                timestamp=self._to_int(item[9]),
                verified=item[10],
            )
            for item in products
        ]

    def create_product(self, payload: CreateProductInput) -> ProductRecord:
        self._build_and_send(
            self.contract.functions.addProduct(
                payload.name,
                payload.batch_number,
                payload.manufacturer,
                payload.description,
                payload.required_temperature,
                payload.manufacturing_date,
                payload.expiry_date,
            )
        )
        return self.list_products()[-1]

    def list_status(self, product_id: int) -> list[StatusRecord]:
        statuses = self.contract.functions.getProductStatus(product_id).call()
        return [
            StatusRecord(
                location=item[0],
                timestamp=self._to_int(item[1]),
                temperature=item[2],
                humidity=item[3],
                heat_index=item[4],
                worker_id=self._to_int(item[5]),
                product_id=self._to_int(item[6]),
                total_quantity=self._to_int(item[7]),
                delivered=bool(item[8]),
            )
            for item in statuses
        ]

    def create_status(self, product_id: int, payload: CreateStatusInput) -> StatusRecord:
        self._build_and_send(
            self.contract.functions.addStatus(
                payload.location,
                payload.temperature,
                payload.humidity,
                payload.heat_index,
                payload.worker_id,
                product_id,
                payload.total_quantity,
                payload.delivered,
            )
        )
        return self.list_status(product_id)[-1]

    def list_telemetry(self, product_id: int) -> list[TelemetryRecord]:
        readings = self.contract.functions.getProductData(product_id).call()
        return [
            TelemetryRecord(
                temperature=self._to_int(item[0]),
                humidity=self._to_int(item[1]),
                heat_index=self._to_int(item[2]),
                product_id=self._to_int(item[3]),
            )
            for item in readings
        ]

    def create_telemetry(self, product_id: int, payload: CreateTelemetryInput) -> TelemetryRecord:
        self._build_and_send(
            self.contract.functions.addData(
                payload.temperature,
                payload.humidity,
                payload.heat_index,
                product_id,
            )
        )
        return self.list_telemetry(product_id)[-1]
