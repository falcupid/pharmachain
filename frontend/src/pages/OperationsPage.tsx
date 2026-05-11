import { useEffect, useState } from "react";

import { StatusForm } from "../components/forms/StatusForm";
import { TelemetryForm } from "../components/forms/TelemetryForm";
import { WorkerForm } from "../components/forms/WorkerForm";
import { chainsightApi } from "../services/api";
import type { CreateStatusInput, NodeRedFlowDetails, NodeRedTelemetryInput, Worker } from "../types";

export function OperationsPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [nodeRedFlow, setNodeRedFlow] = useState<NodeRedFlowDetails | null>(null);
  const [notice, setNotice] = useState("");

  async function loadWorkers() {
    const data = await chainsightApi.getWorkers();
    setWorkers(data);
  }

  useEffect(() => {
    void loadWorkers();
    void chainsightApi.getNodeRedFlow().then(setNodeRedFlow);
  }, []);

  async function handleCreateWorker(name: string) {
    await chainsightApi.createWorker({ name });
    setNotice("Handler added.");
    await loadWorkers();
  }

  async function handleCreateStatus(productId: number, payload: CreateStatusInput) {
    await chainsightApi.createStatus(productId, payload);
    setNotice(`Status recorded for product ${productId}.`);
  }

  async function handleCreateTelemetry(
    productId: number,
    payload: Omit<NodeRedTelemetryInput, "product_id">,
  ) {
    await chainsightApi.ingestNodeRedTelemetry({
      product_id: productId,
      temperature: payload.temperature,
      humidity: payload.humidity,
      heat_index: payload.heat_index,
      gateway_id: payload.gateway_id,
      flow_name: payload.flow_name,
      recorded_at: payload.recorded_at ?? null,
    });
    setNotice(`Node-RED telemetry recorded for product ${productId}.`);
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Operations</p>
        <h2 className="page-title">Handlers, checkpoints, and Node-RED intake.</h2>
        <p className="page-text">
          Capture operator checkpoints and accept telemetry through the named Node-RED gateway flow.
        </p>
      </section>

      <section className="operations-grid">
        <WorkerForm onSubmit={handleCreateWorker} />
        <TelemetryForm onSubmit={handleCreateTelemetry} />
        <article className="glass-card aside-panel compact-panel">
          <div className="section-copy">
            <p className="eyebrow">Node-RED flow</p>
            <h2>{nodeRedFlow?.name ?? "Telemetry ingestion"}</h2>
          </div>
          <div className="simple-list">
            <div className="simple-row">
              <strong>Endpoint</strong>
              <span>{nodeRedFlow?.endpoint ?? "/api/ingestion/node-red/telemetry"}</span>
            </div>
            <div className="simple-row">
              <strong>Method</strong>
              <span>{nodeRedFlow?.method ?? "POST"}</span>
            </div>
          <div className="simple-row">
            <strong>Purpose</strong>
            <span>
              {nodeRedFlow?.description ??
                "Accept gateway readings before they appear in product telemetry views."}
            </span>
          </div>
        </div>
      </article>
      </section>

      <article className="glass-card aside-panel">
        <div className="section-copy">
          <p className="eyebrow">Handlers</p>
          <h2>Registered team</h2>
        </div>
        <div className="simple-list">
          {workers.map((worker) => (
            <div key={worker.id} className="simple-row">
              <strong>{worker.name}</strong>
              <span>Worker {worker.id}</span>
            </div>
          ))}
        </div>
      </article>

      <StatusForm onSubmit={handleCreateStatus} />

      {notice ? <div className="notice-banner glass-card">{notice}</div> : null}
    </div>
  );
}
