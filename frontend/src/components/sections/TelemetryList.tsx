import type { TelemetryEvent } from "../../types";

type Props = {
  telemetry: TelemetryEvent[];
};

export function TelemetryList({ telemetry }: Props) {
  if (!telemetry.length) {
    return <div className="empty-card glass-card">No telemetry readings found.</div>;
  }

  return (
    <div className="telemetry-grid">
      {telemetry.map((reading, index) => (
        <article key={`${reading.product_id}-${index}`} className="glass-card telemetry-card">
          <span>Reading {index + 1}</span>
          <strong>{reading.temperature} C</strong>
          <p>Humidity {reading.humidity}%</p>
          <p>Heat index {reading.heat_index} C</p>
        </article>
      ))}
    </div>
  );
}
