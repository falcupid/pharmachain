import { ProductQRCode } from "./ProductQRCode";
import type { Product } from "../../types";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductQRModal({ product, onClose }: Props) {
  if (!product) {
    return null;
  }

  const selectedProduct = product;

  function downloadQRCode() {
    const svg = document.getElementById("product-qr-code");

    if (!svg) {
      alert("QR Code not found.");
      return;
    }

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedProduct.name}-QR.svg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function printQRCode() {
    const svg = document.getElementById("product-qr-code");

    if (!svg) {
      alert("QR Code not found.");
      return;
    }

    const serializer = new XMLSerializer();
    const qrSvg = serializer.serializeToString(svg);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Unable to open print window.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>PharmaChain Product Label</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              text-align: center;
            }

            .label {
              width: 420px;
              margin: auto;
              border: 2px solid #333;
              border-radius: 12px;
              padding: 20px;
            }

            h1 {
              color: #2e8b57;
              margin-bottom: 5px;
            }

            .details {
              text-align: left;
              margin: 20px 0;
              line-height: 1.8;
            }

            svg {
              width: 180px;
              height: 180px;
            }

            .footer {
              margin-top: 15px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>

        <body>
          <div class="label">
            <h1>PHARMACHAIN</h1>

            <h2>${selectedProduct.name}</h2>

            <div class="details">
              <strong>Product ID:</strong> ${selectedProduct.id}<br>
              <strong>Batch Number:</strong> ${selectedProduct.batch_number}<br>
              <strong>Manufacturer:</strong> ${selectedProduct.manufacturer}<br>
              <strong>Temperature:</strong> ${selectedProduct.required_temperature}<br>
              <strong>Manufacturing Date:</strong> ${selectedProduct.manufacturing_date}<br>
              <strong>Expiry Date:</strong> ${selectedProduct.expiry_date}<br>
              <strong>Status:</strong> ${
                selectedProduct.verified ? "Verified" : "Not Verified"
              }
            </div>

            ${qrSvg}

            <div class="footer">
              Scan to verify product authenticity.
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          width: "520px",
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#2e8b57",
              fontWeight: "bold",
              margin: 0,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            PharmaChain
          </p>

          <h2 style={{ margin: "8px 0 0 0" }}>
            Product QR Code
          </h2>

          <p
            style={{
              color: "#666",
              marginTop: "10px",
            }}
          >
            {selectedProduct.name}
          </p>
        </div>

        <div
          style={{
            textAlign: "left",
            marginBottom: "20px",
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong>Batch Number:</strong> {selectedProduct.batch_number}
          </div>

          <div>
            <strong>Manufacturer:</strong> {selectedProduct.manufacturer}
          </div>

          <div>
            <strong>Temperature:</strong>{" "}
            {selectedProduct.required_temperature}
          </div>

          <div>
            <strong>Manufacturing Date:</strong>{" "}
            {selectedProduct.manufacturing_date}
          </div>

          <div>
            <strong>Expiry Date:</strong> {selectedProduct.expiry_date}
          </div>

          <div>
            <strong>Verification:</strong>{" "}
            {selectedProduct.verified
              ? "🟢 Verified"
              : "🔴 Not Verified"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <ProductQRCode productId={selectedProduct.id} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={downloadQRCode}
            style={{
              background: "#2e8b57",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Download QR
          </button>

          <button
            onClick={printQRCode}
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Print Label
          </button>

          <button
            onClick={onClose}
            style={{
              background: "#444",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}