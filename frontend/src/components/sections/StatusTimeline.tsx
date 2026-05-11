import type { StatusEvent } from "../../types";

type Props = {
  events: StatusEvent[];
};

function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString();
}

export function StatusTimeline({ events }: Props) {
  if (!events.length) {
    return <div className="empty-card glass-card">No movement records found.</div>;
  }

  return (
    <div className="timeline">
      {events.map((event, index) => (
        <article
          key={`${event.product_id}-${event.timestamp}-${index}`}
          className="timeline-card glass-card"
        >
          <div className="timeline-head">
            <div>
              <strong>{event.location}</strong>
              <p>{formatTimestamp(event.timestamp)}</p>
            </div>
            <span className={`timeline-badge${event.delivered ? " delivered" : ""}`}>
              {event.delivered ? "Delivered" : "In transit"}
            </span>
          </div>

          <div className="timeline-meta">
            <span>Temp {event.temperature} C</span>
            <span>Humidity {event.humidity}%</span>
            <span>Heat index {event.heat_index} C</span>
            <span>Worker {event.worker_id}</span>
            <span>Qty {event.total_quantity}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
