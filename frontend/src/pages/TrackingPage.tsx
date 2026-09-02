import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { StatusTimeline } from "../components/sections/StatusTimeline";
import { QRScanner } from "../components/qr/QRScanner";
import { TelemetryList } from "../components/sections/TelemetryList";
import { PharmaChainApi } from "../services/api";
import type {
  StatusEvent,
  TelemetryEvent,
} from "../types";

export function TrackingPage() {
  const { productId: routeProductId } = useParams();

  const [productId, setProductId] = useState(0);
  const [statusEvents, setStatusEvents] =
    useState<StatusEvent[]>([]);
  const [telemetry, setTelemetry] =
    useState<TelemetryEvent[]>([]);
  const [searched, setSearched] = useState(false);
  const [scannerOpen, setScannerOpen] =
    useState(false);
  const [error, setError] = useState("");

  async function loadProduct(product: number) {
    if (!product || product < 1) {
      setError("Please enter a valid product ID.");
      setSearched(false);
      return;
    }

    setError("");

    try {
      console.log("Loading product:", product);

      const [
        statusData,
        telemetryData,
      ] = await Promise.all([
        PharmaChainApi.getStatus(product),
        PharmaChainApi.getTelemetry(product),
      ]);

      console.log("Status:", statusData);
      console.log("Telemetry:", telemetryData);

      setStatusEvents(statusData);
      setTelemetry(telemetryData);
      setSearched(true);
    } catch (requestError) {
      console.error(
        "Unable to load product:",
        requestError,
      );

      setError(
        "Unable to load this product. Please check the product ID and try again.",
      );

      setSearched(false);
    }
  }

  async function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await loadProduct(productId);
  }

  useEffect(() => {
    if (!routeProductId) {
      return;
    }

    const id = Number(routeProductId);

    if (Number.isNaN(id) || id < 1) {
      return;
    }

    setProductId(id);

    void loadProduct(id);
  }, [routeProductId]);

  return (
    <div className="page-stack">
      <section className="tracking-shell glass-card">
        <div className="section-copy">
          <p className="eyebrow">
            Tracking
          </p>

          <h2>
            Load one product, then read the full chain.
          </h2>

          <p>
            Search by product ID to review movement events
            and recorded condition readings.
          </p>
        </div>

        <form
          className="tracking-form"
          onSubmit={handleSearch}
        >
          <input
            type="number"
            min="1"
            value={productId || ""}
            onChange={(event) =>
              setProductId(
                Number(event.target.value),
              )
            }
            placeholder="Product ID"
            required
          />

          <button
            className="primary-button"
            type="submit"
          >
            View Record
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => setScannerOpen(true)}
            style={{
              marginLeft: "10px",
            }}
          >
            Scan QR
          </button>
        </form>

        {error ? (
          <p
            style={{
              marginTop: "1rem",
              color: "#b42318",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        ) : null}
      </section>

      {searched ? (
        <section className="results-grid">
          <div>
            <div className="section-copy">
              <p className="eyebrow">
                Timeline
              </p>

              <h2>
                Movement
              </h2>
            </div>

            <StatusTimeline
              events={statusEvents}
            />
          </div>

          <div>
            <div className="section-copy">
              <p className="eyebrow">
                Telemetry
              </p>

              <h2>
                Condition
              </h2>
            </div>

            <TelemetryList
              telemetry={telemetry}
            />
          </div>
        </section>
      ) : null}

      {scannerOpen ? (
        <QRScanner
          onClose={() =>
            setScannerOpen(false)
          }
        />
      ) : null}
    </div>
  );
}