import type { Product } from "../../types";

type Props = {
  products: Product[];
};

export function ProductTable({ products }: Props) {
  return (
    <div className="table-card glass-card">
      <div className="section-copy">
        <p className="eyebrow">Catalog</p>
        <h2>All products</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Reference</th>
              <th>Temperature</th>
              <th>Manufactured</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <strong>{product.name}</strong>
                  <p className="table-subcopy">{product.description}</p>
                </td>
                <td>{product.price}</td>
                <td>{product.required_temperature}</td>
                <td>{product.manufactured_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
