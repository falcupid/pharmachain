import { FormEvent, useState } from "react";

import type { NodeRedTelemetryInput } from "../../types";

type Props = {
  onSubmit: (productId: number, payload: Omit<NodeRedTelemetryInput, "product_id">) => Promise<void>;
};

const initialState = {
  productId: 0,
  temperature: 0,
  humidity: 0,
  heat_index: 0,
  gateway_id: "node-red-gateway",
  flow_name: "Node-RED Telemetry Flow",
};

export function TelemetryForm({ onSubmit }: Props) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form.productId, {
        temperature: form.temperature,
        humidity: form.humidity,
        heat_index: form.heat_index,
        gateway_id: form.gateway_id,
        flow_name: form.flow_name,
      });
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card form-card compact" onSubmit={handleSubmit}>
      <div className="section-copy">
        <p className="eyebrow">Node-RED intake</p>
        <h2>Simulate a gateway post</h2>
      </div>

      <div className="field-grid single-column">
        <label>
          <span>Flow name</span>
          <input
            value={form.flow_name}
            onChange={(event) => setForm({ ...form, flow_name: event.target.value })}
            required
          />
        </label>

        <label>
          <span>Gateway ID</span>
          <input
            value={form.gateway_id}
            onChange={(event) => setForm({ ...form, gateway_id: event.target.value })}
            required
          />
        </label>

        <label>
          <span>Product ID</span>
          <input
            type="number"
            value={form.productId}
            onChange={(event) => setForm({ ...form, productId: Number(event.target.value) })}
            required
          />
        </label>

        <label>
          <span>Temperature</span>
          <input
            type="number"
            value={form.temperature}
            onChange={(event) => setForm({ ...form, temperature: Number(event.target.value) })}
            required
          />
        </label>

        <label>
          <span>Humidity</span>
          <input
            type="number"
            value={form.humidity}
            onChange={(event) => setForm({ ...form, humidity: Number(event.target.value) })}
            required
          />
        </label>

        <label>
          <span>Heat index</span>
          <input
            type="number"
            value={form.heat_index}
            onChange={(event) => setForm({ ...form, heat_index: Number(event.target.value) })}
            required
          />
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Send Node-RED payload"}
      </button>
    </form>
  );
}
