import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";

interface QRScannerProps {
  onClose: () => void;
}

export function QRScanner({ onClose }: QRScannerProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          width: "420px",
          textAlign: "center",
        }}
      >
        <h2>Scan Product QR Code</h2>

        <p style={{ marginBottom: "20px" }}>
          Point your camera at a PharmaChain QR code.
        </p>

        <Scanner
            onScan={(results) => {
            if (!results.length) return;

            const qrValue = results[0].rawValue;

            try {
                const url = new URL(qrValue);

                navigate(url.pathname);

                onClose();
            } catch {
                alert("Invalid QR Code");
            }
            }}
        />

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}