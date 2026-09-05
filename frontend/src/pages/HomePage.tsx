import { useEffect, useState } from "react";

import { MetricCards } from "../components/sections/MetricCards";
import { ProductQRCode } from "../components/qr/ProductQRCode";
import { PharmaChainApi } from "../services/api";
import {
  getCurrentUserRole,
  type UserRole,
} from "../services/auth";
import type {
  IntegrationDetails,
  NodeRedFlowDetails,
  Overview,
  Product,
} from "../types";

export function HomePage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [integrations, setIntegrations] =
    useState<IntegrationDetails | null>(null);
  const [nodeRedFlow, setNodeRedFlow] =
    useState<NodeRedFlowDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const role: UserRole | null = getCurrentUserRole();

  useEffect(() => {
    async function loadOverview() {
      try {
        const data = await PharmaChainApi.getOverview();
        setOverview(data);
      } catch (error) {
        console.error(
          "Unable to load overview data:",
          error,
        );
      }
    }

    async function loadProducts() {
      try {
        const data = await PharmaChainApi.getProducts();
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error(
          "Unable to load product data:",
          error,
        );
      }
    }

    async function loadNodeRedFlow() {
      try {
        const data = await PharmaChainApi.getNodeRedFlow();
        setNodeRedFlow(data);
      } catch (error) {
        console.error(
          "Unable to load Node-RED flow:",
          error,
        );
      }
    }

    async function loadIntegrations() {
      /*
       * Integration details are currently protected
       * as administrator-only on the backend.
       */
      if (role !== "admin") {
        return;
      }

      try {
        const data =
          await PharmaChainApi.getIntegrations();

        setIntegrations(data);
      } catch (error) {
        console.error(
          "Unable to load integration data:",
          error,
        );
      }
    }

    void loadOverview();
    void loadProducts();

    /*
     * Node-RED information is useful to operational
     * users but is not available to every role.
     */
    if (
      role === "admin" ||
      role === "pharmaceutical_company" ||
      role === "dispatcher"
    ) {
      void loadNodeRedFlow();
    }

    void loadIntegrations();
  }, [role]);

  return (
    <div className="page-stack">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-grid home-hero">

        <article className="hero-copy">
          <p className="eyebrow">
            Supply chain visibility
          </p>

          <h2 className="hero-title">
            A quiet interface for condition-aware tracking.
          </h2>

          <p className="hero-text">
            Monitor products, record custody, and review
            telemetry from one minimal control layer built
            for sensitive logistics operations.
          </p>
        </article>

        <article className="glass-card hero-panel">

          <div className="hero-panel-row">
            <span>Mode</span>

            <strong>
              {overview?.chain_mode ?? "sandbox"}
            </strong>
          </div>

          <div className="hero-panel-row">
            <span>Active alerts</span>

            <strong>
              {overview?.active_alerts ?? "--"}
            </strong>
          </div>

          <div className="hero-panel-row">
            <span>Proof rail</span>

            <strong>
              {integrations
                ? integrations.rpc_url_configured
                  ? "Configured"
                  : "Pending"
                : "Protected"}
            </strong>
          </div>

        </article>

      </section>

      {/* =========================
          METRICS
      ========================= */}

      <MetricCards overview={overview} />

      {/* =========================
          PLATFORM + INTEGRATION
      ========================= */}

      <section className="feature-grid">

        <article className="glass-card detail-panel">

          <div className="section-copy">

            <p className="eyebrow">
              Platform
            </p>

            <h2>
              What PharmaChain focuses on
            </h2>

          </div>

          <div className="detail-list">

            <div>
              <strong>
                Movement history
              </strong>

              <p>
                Structured product records and clean
                custody updates.
              </p>
            </div>

            <div>
              <strong>
                Condition visibility
              </strong>

              <p>
                Temperature, humidity, and heat-index
                readings in one view.
              </p>
            </div>

            <div>
              <strong>
                Node-RED intake
              </strong>

              <p>
                Sensor and gateway payloads enter
                PharmaChain through a dedicated
                Node-RED telemetry flow.
              </p>
            </div>

          </div>

        </article>

        <article className="glass-card detail-panel">

          <div className="section-copy">

            <p className="eyebrow">
              Integration
            </p>

            <h2>
              Current environment
            </h2>

          </div>

          <div className="stack-list">

            <div className="stack-row">
              <span>Contract</span>

              <strong>
                {integrations?.contract_address ||
                  "Not connected"}
              </strong>
            </div>

            <div className="stack-row">
              <span>Explorer</span>

              <strong>

                {integrations?.explorer_url ? (
                  <a
                    href={integrations.explorer_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open link
                  </a>
                ) : (
                  "Unavailable"
                )}

              </strong>
            </div>

            <div className="stack-row">

              <span>
                {nodeRedFlow?.provider ??
                  "Node-RED"}{" "}
                flow
              </span>

              <strong>
                {nodeRedFlow?.endpoint ??
                  integrations?.telemetry_flow_endpoint ??
                  "Protected"}
              </strong>

            </div>

            <div className="stack-row">

              <span>
                Records loaded
              </span>

              <strong>
                {products.length}
              </strong>

            </div>

          </div>

        </article>

      </section>

      {/* =========================
          RECENT PRODUCTS
      ========================= */}

      <section className="glass-card shelf-panel">

        <div className="section-copy">

          <p className="eyebrow">
            Recent products
          </p>

          <h2>
            Live catalog snapshot
          </h2>

        </div>

        <div className="product-shelf">

          {products.length > 0 ? (

            products.map((product) => (

              <article
                key={product.id}
                className="product-row"
              >

                <div>

                  <strong>
                    {product.name}
                  </strong>

                  <p>
                    {product.description}
                  </p>

                </div>

                <div className="product-meta">

                  <span>
                    {product.required_temperature}
                  </span>

                  <span>
                    {product.manufacturing_date}
                  </span>

                </div>

              </article>

            ))

          ) : (

            <p
              style={{
                color: "var(--muted)",
              }}
            >
              No product records available.
            </p>

          )}

        </div>

      </section>

      {/* =========================
          QR CODE
      ========================= */}

      <section className="glass-card shelf-panel">

        <div className="section-copy">

          <p className="eyebrow">
            QR Code Test
          </p>

          <h2>
            Testing Product QR Code
          </h2>

        </div>

        <ProductQRCode productId={1} />

      </section>

    </div>
  );
}