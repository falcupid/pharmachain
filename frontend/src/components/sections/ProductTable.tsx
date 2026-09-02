import { useState } from "react";

import { ProductQRModal } from "../qr/ProductQRModal";
import type { Product } from "../../types";

type Props = {
  products: Product[];
};

export function ProductTable({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="table-card glass-card">
      <div className="section-copy">
        <p className="eyebrow">Catalog</p>
        <h2>All Products</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Batch Number</th>
              <th>Manufacturer</th>
              <th>Temperature</th>
              <th>Manufacturing Date</th>
              <th>Expiry Date</th>
              <th>Verified</th>
              <th>QR Code</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>

                <td>
                  <strong>{product.name}</strong>
                  <p className="table-subcopy">
                    {product.description}
                  </p>
                </td>

                <td>{product.batch_number}</td>

                <td>{product.manufacturer}</td>

                <td>{product.required_temperature}</td>

                <td>{product.manufacturing_date}</td>

                <td>{product.expiry_date}</td>

                <td>
                  {product.verified ? (
                    <span>🟢 Verified</span>
                  ) : (
                    <span>🔴 Not Verified</span>
                  )}
                </td>

                <td>
                  <button onClick={() => setSelectedProduct(product)}>
                    View QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductQRModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}