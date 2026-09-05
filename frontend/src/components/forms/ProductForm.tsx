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
          <span>Product name</span>
          <input
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
            placeholder="Temperature-Sensitive Vaccine Kit"
            required
          />
        </label>

        <label>
          <span>Batch number</span>
          <input
            value={form.batch_number}
            onChange={(event) =>
              setForm({
                ...form,
                batch_number: event.target.value,
              })
            }
            placeholder="VAC-2026-001"
            required
          />
        </label>

        <label>
          <span>Manufacturer</span>
          <input
            value={form.manufacturer}
            onChange={(event) =>
              setForm({
                ...form,
                manufacturer: event.target.value,
              })
            }
            placeholder="Pharmaceutical Company"
            required
          />
        </label>

        <label>
          <span>Required temperature</span>
          <input
            value={form.required_temperature}
            onChange={(event) =>
              setForm({
                ...form,
                required_temperature: event.target.value,
              })
            }
            placeholder="2 C to 8 C"
            required
          />
        </label>

        <label>
          <span>Manufacturing date</span>
          <input
            type="date"
            value={form.manufacturing_date}
            onChange={(event) =>
              setForm({
                ...form,
                manufacturing_date: event.target.value,
              })
            }
            required
          />
        </label>

        <label>
          <span>Expiry date</span>
          <input
            type="date"
            value={form.expiry_date}
            onChange={(event) =>
              setForm({
                ...form,
                expiry_date: event.target.value,
              })
            }
            required
          />
        </label>
      </div>

      <label>
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
          placeholder="Short note on the shipment, risk profile, or handling requirement."
          rows={4}
          required
        />
      </label>

      <button
        className="primary-button"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}