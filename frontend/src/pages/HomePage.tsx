import { useEffect, useState } from "react";

import { MetricCards } from "../components/sections/MetricCards";
import { chainsightApi } from "../services/api";
import type { IntegrationDetails, NodeRedFlowDetails, Overview, Product } from "../types";

export function HomePage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationDetails | null>(null);
  const [nodeRedFlow, setNodeRedFlow] = useState<NodeRedFlowDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void Promise.all([
      chainsightApi.getOverview(),
      chainsightApi.getIntegrations(),
      chainsightApi.getNodeRedFlow(),
      chainsightApi.getProducts(),
    ]).then(([overviewData, integrationData, flowData, productData]) => {
      setOverview(overviewData);
      setIntegrations(integrationData);
      setNodeRedFlow(flowData);
      setProducts(productData.slice(0, 3));
    });
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-grid home-hero">
        <article className="hero-copy">
          <p className="eyebrow">Supply chain visibility</p>
          <h2 className="hero-title">A quiet interface for condition-aware tracking.</h2>
          <p className="hero-text">
            Monitor products, record custody, and review telemetry from one minimal control layer built
            for sensitive logistics operations.
          </p>
        </article>

        <article className="glass-card hero-panel">
          <div className="hero-panel-row">
            <span>Mode</span>
            <strong>{overview?.chain_mode ?? "sandbox"}</strong>
          </div>
          <div className="hero-panel-row">
            <span>Active alerts</span>
            <strong>{overview?.active_alerts ?? "--"}</strong>
          </div>
          <div className="hero-panel-row">
            <span>Proof rail</span>
            <strong>{integrations?.rpc_url_configured ? "Configured" : "Pending"}</strong>
          </div>
        </article>
      </section>

      <MetricCards overview={overview} />

      <section className="feature-grid">
        <article className="glass-card detail-panel">
          <div className="section-copy">
            <p className="eyebrow">Platform</p>
            <h2>What ChainSight focuses on</h2>
          </div>
          <div className="detail-list">
            <div>
              <strong>Movement history</strong>
              <p>Structured product records and clean custody updates.</p>
            </div>
            <div>
              <strong>Condition visibility</strong>
              <p>Temperature, humidity, and heat-index readings in one view.</p>
            </div>
            <div>
              <strong>Node-RED intake</strong>
              <p>Sensor and gateway payloads enter ChainSight through a dedicated Node-RED telemetry flow.</p>
            </div>
          </div>
        </article>

        <article className="glass-card detail-panel">
          <div className="section-copy">
            <p className="eyebrow">Integration</p>
            <h2>Current environment</h2>
          </div>
          <div className="stack-list">
            <div className="stack-row">
              <span>Contract</span>
              <strong>{integrations?.contract_address || "Not connected"}</strong>
            </div>
            <div className="stack-row">
              <span>Explorer</span>
              <strong>
                {integrations?.explorer_url ? (
                  <a href={integrations.explorer_url} target="_blank" rel="noreferrer">
                    Open link
                  </a>
                ) : (
                  "Unavailable"
                )}
              </strong>
            </div>
            <div className="stack-row">
              <span>{nodeRedFlow?.provider ?? "Node-RED"} flow</span>
              <strong>{nodeRedFlow?.endpoint ?? integrations?.telemetry_flow_endpoint ?? "Unavailable"}</strong>
            </div>
            <div className="stack-row">
              <span>Records loaded</span>
              <strong>{products.length}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="glass-card shelf-panel">
        <div className="section-copy">
          <p className="eyebrow">Recent products</p>
          <h2>Live catalog snapshot</h2>
        </div>
        <div className="product-shelf">
          {products.map((product) => (
            <article key={product.id} className="product-row">
              <div>
                <strong>{product.name}</strong>
                <p>{product.description}</p>
              </div>
              <div className="product-meta">
                <span>{product.required_temperature}</span>
                <span>{product.manufactured_at}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
