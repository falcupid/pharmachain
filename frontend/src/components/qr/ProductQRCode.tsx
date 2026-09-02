import QRCode from "react-qr-code";

interface ProductQRCodeProps {
  productId: string;
}

export function ProductQRCode({
  productId,
}: ProductQRCodeProps) {
  const trackingUrl =
    `http://localhost:5173/tracking/${productId}`;

  return (
    <div
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "12px",
        width: "fit-content",
      }}
    >
      <QRCode
        id="product-qr-code"
        value={trackingUrl}
        size={180}
      />

      <p
        style={{
          marginTop: 12,
          textAlign: "center",
          fontSize: 12,
        }}
      >
        Product ID: {productId}
      </p>
    </div>
  );
}