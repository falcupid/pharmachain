import { FormEvent, useState } from "react";

import { StatusTimeline } from "../components/sections/StatusTimeline";
import { TelemetryList } from "../components/sections/TelemetryList";
import { chainsightApi } from "../services/api";
import type { StatusEvent, TelemetryEvent } from "../types";

export function TrackingPage() {
  const [productId, setProductId] = useState(0);
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const [statusData, telemetryData] = await Promise.all([
      chainsightApi.getStatus(productId),
      chainsightApi.getTelemetry(productId),
    ]);
    setStatusEvents(statusData);
    setTelemetry(telemetryData);
    setSearched(true);
  }

  return (
    <div className="page-stack">
      <section className="tracking-shell glass-card">
        <div className="section-copy">
          <p className="eyebrow">Tracking</p>
          <h2>Load one product, then read the full chain.</h2>
          <p>
            Search by product ID to review movement events and recorded condition readings.
          </p>
        </div>

        <form className="tracking-form" onSubmit={handleSearch}>
          <input
            type="number"
            value={productId}
            onChange={(event) => setProductId(Number(event.target.value))}
            placeholder="Product ID"
            required
          />
          <button className="primary-button" type="submit">
            View record
          </button>
        </form>
      </section>

      {searched ? (
        <section className="results-grid">
          <div>
            <div className="section-copy">
              <p className="eyebrow">Timeline</p>
              <h2>Movement</h2>
            </div>
            <StatusTimeline events={statusEvents} />
          </div>

          <div>
            <div className="section-copy">
              <p className="eyebrow">Telemetry</p>
              <h2>Condition</h2>
            </div>
            <TelemetryList telemetry={telemetry} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
