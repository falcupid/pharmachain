import { FormEvent, useState } from "react";

import type { CreateProductInput } from "../../types";

type Props = {
  onSubmit: (payload: CreateProductInput) => Promise<void>;
};

const initialState: CreateProductInput = {
  name: "",
  batch_number: "",
  manufacturer: "",
  description: "",
  required_temperature: "",
  manufacturing_date: "",
  expiry_date: "",
};

export function ProductForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CreateProductInput>(initialState);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card form-card" onSubmit={handleSubmit}>
      <div className="section-copy">
        <p className="eyebrow">New product</p>
        <h2>Create a catalog entry</h2>
      </div>

      <div className="field-grid">
        <label>
          <span>Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Vaccine batch A14"
            required
          />
        </label>

        <label>
          <span>Reference</span>
          <input
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            placeholder="$180"
            required
          />
        </label>

        <label>
          <span>Temperature range</span>
          <input
            value={form.required_temperature}
            onChange={(event) =>
              setForm({ ...form, required_temperature: event.target.value })
            }
            placeholder="2 to 8 C"
            required
          />
        </label>

        <label>
          <span>Manufactured</span>
          <input
            value={form.manufactured_at}
            onChange={(event) => setForm({ ...form, manufactured_at: event.target.value })}
            placeholder="2026-05-10"
            required
          />
        </label>
      </div>

      <label>
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Short note on the shipment, risk profile, or handling requirement."
          rows={4}
          required
        />
      </label>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}
