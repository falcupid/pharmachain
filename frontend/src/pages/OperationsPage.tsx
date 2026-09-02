import { useEffect, useState } from "react";

import { StatusForm } from "../components/forms/StatusForm";
import { TelemetryForm } from "../components/forms/TelemetryForm";
import { WorkerForm } from "../components/forms/WorkerForm";
import { PharmaChainApi } from "../services/api";
import {
  getCurrentUserRole,
  type UserRole,
} from "../services/auth";
import type {
  CreateStatusInput,
  NodeRedFlowDetails,
  NodeRedTelemetryInput,
  Worker,
} from "../types";

export function OperationsPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [nodeRedFlow, setNodeRedFlow] =
    useState<NodeRedFlowDetails | null>(null);
  const [notice, setNotice] = useState("");

  const role: UserRole | null = getCurrentUserRole();

  /*
   * ============================================================
   * ROLE PERMISSIONS
   * ============================================================
   */

  // Only administrators can manage/register workers.
  const canManageWorkers =
    role === "admin";

  // Admin, pharmaceutical company and dispatcher
  // can record product movement/status events.
  const canRecordStatus =
    role === "admin" ||
    role === "pharmaceutical_company" ||
    role === "dispatcher";

  // Admin and dispatcher can submit telemetry.
  const canRecordTelemetry =
    role === "admin" ||
    role === "dispatcher";

  /*
   * ============================================================
   * LOAD OPERATIONS DATA
   * ============================================================
   */

  async function loadWorkers() {
    const data = await PharmaChainApi.getWorkers();
    setWorkers(data);
  }

  useEffect(() => {
    void loadWorkers();

    void PharmaChainApi.getNodeRedFlow().then(
      setNodeRedFlow,
    );
  }, []);

  /*
   * ============================================================
   * CREATE WORKER
   * ============================================================
   */

  async function handleCreateWorker(name: string) {
    if (!canManageWorkers) {
      setNotice(
        "You do not have permission to manage workers.",
      );
      return;
    }

    await PharmaChainApi.createWorker({ name });

    setNotice("Handler added.");

    await loadWorkers();
  }

  /*
   * ============================================================
   * CREATE STATUS
   * ============================================================
   */

  async function handleCreateStatus(
    productId: number,
    payload: CreateStatusInput,
  ) {
    if (!canRecordStatus) {
      setNotice(
        "You do not have permission to record status events.",
      );
      return;
    }

    await PharmaChainApi.createStatus(
      productId,
      payload,
    );

    setNotice(
      `Status recorded for product ${productId}.`,
    );
  }

  /*
   * ============================================================
   * CREATE TELEMETRY
   * ============================================================
   */

  async function handleCreateTelemetry(
    productId: number,
    payload: Omit<
      NodeRedTelemetryInput,
      "product_id"
    >,
  ) {
    if (!canRecordTelemetry) {
      setNotice(
        "You do not have permission to record telemetry.",
      );
      return;
    }

    await PharmaChainApi.ingestNodeRedTelemetry({
      product_id: productId,
      temperature: payload.temperature,
      humidity: payload.humidity,
      heat_index: payload.heat_index,
      gateway_id: payload.gateway_id,
      flow_name: payload.flow_name,
      recorded_at: payload.recorded_at ?? null,
    });

    setNotice(
      `Node-RED telemetry recorded for product ${productId}.`,
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Operations</p>

        <h2 className="page-title">
          Handlers, checkpoints, and Node-RED intake.
        </h2>

        <p className="page-text">
          Capture operator checkpoints and accept telemetry
          through the named Node-RED gateway flow.
        </p>
      </section>

      {/* ========================================================
          WORKER MANAGEMENT
         ======================================================== */}

      {canManageWorkers ? (
        <section className="operations-grid">
          <WorkerForm onSubmit={handleCreateWorker} />

          <TelemetryForm
            onSubmit={handleCreateTelemetry}
          />

          <article className="glass-card aside-panel compact-panel">
            <div className="section-copy">
              <p className="eyebrow">
                Node-RED flow
              </p>

              <h2>
                {nodeRedFlow?.name ??
                  "Telemetry ingestion"}
              </h2>
            </div>

            <div className="simple-list">
              <div className="simple-row">
                <strong>Endpoint</strong>

                <span>
                  {nodeRedFlow?.endpoint ??
                    "/api/ingestion/node-red/telemetry"}
                </span>
              </div>

              <div className="simple-row">
                <strong>Method</strong>

                <span>
                  {nodeRedFlow?.method ?? "POST"}
                </span>
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
      ) : (
        <section className="operations-grid">
          {canRecordTelemetry ? (
            <TelemetryForm
              onSubmit={handleCreateTelemetry}
            />
          ) : null}

          <article className="glass-card aside-panel compact-panel">
            <div className="section-copy">
              <p className="eyebrow">
                Node-RED flow
              </p>

              <h2>
                {nodeRedFlow?.name ??
                  "Telemetry ingestion"}
              </h2>
            </div>

            <div className="simple-list">
              <div className="simple-row">
                <strong>Endpoint</strong>

                <span>
                  {nodeRedFlow?.endpoint ??
                    "/api/ingestion/node-red/telemetry"}
                </span>
              </div>

              <div className="simple-row">
                <strong>Method</strong>

                <span>
                  {nodeRedFlow?.method ?? "POST"}
                </span>
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
      )}

      {/* ========================================================
          REGISTERED WORKERS
         ======================================================== */}

      <article className="glass-card aside-panel">
        <div className="section-copy">
          <p className="eyebrow">Handlers</p>

          <h2>Registered team</h2>
        </div>

        <div className="simple-list">
          {workers.length > 0 ? (
            workers.map((worker) => (
              <div
                key={worker.id}
                className="simple-row"
              >
                <strong>{worker.name}</strong>

                <span>
                  Worker {worker.id}
                </span>
              </div>
            ))
          ) : (
            <p>
              No workers have been registered yet.
            </p>
          )}
        </div>
      </article>

      {/* ========================================================
          STATUS FORM
         ======================================================== */}

      {canRecordStatus ? (
        <StatusForm
          onSubmit={handleCreateStatus}
        />
      ) : (
        <article className="glass-card notice-banner">
          <strong>View-only operational access</strong>

          <p
            style={{
              margin: "0.45rem 0 0",
              color: "var(--muted)",
            }}
          >
            Your account can view operational information,
            but it cannot record operational status events.
          </p>
        </article>
      )}

      {/* ========================================================
          NOTICE
         ======================================================== */}

      {notice ? (
        <div className="notice-banner glass-card">
          {notice}
        </div>
      ) : null}
    </div>
  );
}