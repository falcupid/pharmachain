import { FormEvent, useState } from "react";

type Props = {
  onSubmit: (name: string) => Promise<void>;
};

export function WorkerForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card form-card compact" onSubmit={handleSubmit}>
      <div className="section-copy">
        <p className="eyebrow">Handlers</p>
        <h2>Add a worker</h2>
      </div>

      <label>
        <span>Full name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Okafor"
          required
        />
      </label>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add worker"}
      </button>
    </form>
  );
}
