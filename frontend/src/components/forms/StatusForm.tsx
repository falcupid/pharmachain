import { FormEvent, useState } from "react";

import type { CreateStatusInput } from "../../types";

type Props = {
  onSubmit: (productId: number, payload: CreateStatusInput) => Promise<void>;
};

const initialState = {
  productId: 0,
  location: "",
  temperature: "",
  humidity: "",
  heat_index: "",
  worker_id: 0,
  total_quantity: 0,
  delivered: false,
};

export function StatusForm({ onSubmit }: Props) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form.productId, {
        location: form.location,
        temperature: form.temperature,
        humidity: form.humidity,
        heat_index: form.heat_index,
        worker_id: form.worker_id,
        total_quantity: form.total_quantity,
        delivered: form.delivered,
      });
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card form-card" onSubmit={handleSubmit}>
      <div className="section-copy">
        <p className="eyebrow">Status update</p>
        <h2>Record a checkpoint</h2>
      </div>

      <div className="field-grid">
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
          <span>Worker ID</span>
          <input
            type="number"
            value={form.worker_id}
            onChange={(event) => setForm({ ...form, worker_id: Number(event.target.value) })}
            required
          />
        </label>

        <label>
          <span>Location</span>
          <input
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            placeholder="Abuja transfer hub"
            required
          />
        </label>

        <label>
          <span>Quantity</span>
          <input
            type="number"
            value={form.total_quantity}
            onChange={(event) =>
              setForm({ ...form, total_quantity: Number(event.target.value) })
            }
            required
          />
        </label>

        <label>
          <span>Temperature</span>
          <input
            value={form.temperature}
            onChange={(event) => setForm({ ...form, temperature: event.target.value })}
            placeholder="7"
            required
          />
        </label>

        <label>
          <span>Humidity</span>
          <input
            value={form.humidity}
            onChange={(event) => setForm({ ...form, humidity: event.target.value })}
            placeholder="44"
            required
          />
        </label>

        <label>
          <span>Heat index</span>
          <input
            value={form.heat_index}
            onChange={(event) => setForm({ ...form, heat_index: event.target.value })}
            placeholder="7"
            required
          />
        </label>
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.delivered}
          onChange={(event) => setForm({ ...form, delivered: event.target.checked })}
        />
        <span>Mark as delivered</span>
      </label>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save status"}
      </button>
    </form>
  );
}
