import type { Overview } from "../../types";

type Props = {
  overview: Overview | null;
};

const fallbackMetrics = [
  { label: "Products", value: "--" },
  { label: "Workers", value: "--" },
  { label: "Status events", value: "--" },
  { label: "Telemetry logs", value: "--" },
];

export function MetricCards({ overview }: Props) {
  const metrics = overview
    ? [
        { label: "Products", value: overview.product_count },
        { label: "Workers", value: overview.worker_count },
        { label: "Status events", value: overview.status_count },
        { label: "Telemetry logs", value: overview.telemetry_count },
      ]
    : fallbackMetrics;

  return (
    <section className="metrics-grid">
      {metrics.map((metric) => (
        <article key={metric.label} className="glass-card metric-card">
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
        </article>
      ))}
    </section>
  );
}
