import { useEffect, useState } from "react";

import { ProductForm } from "../components/forms/ProductForm";
import { ProductTable } from "../components/sections/ProductTable";
import { chainsightApi } from "../services/api";
import type { CreateProductInput, Product } from "../types";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    const data = await chainsightApi.getProducts();
    setProducts(data);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleCreateProduct(payload: CreateProductInput) {
    await chainsightApi.createProduct(payload);
    setNotice("Product saved.");
    await loadProducts();
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Products</p>
        <h2 className="page-title">Catalog records that stay readable.</h2>
        <p className="page-text">
          Add core shipment details without bloated fields or noisy layout.
        </p>
      </section>

      <section className="content-grid">
        <ProductForm onSubmit={handleCreateProduct} />
        <article className="glass-card aside-panel">
          <div className="section-copy">
            <p className="eyebrow">Guidance</p>
            <h2>Use short, durable product definitions</h2>
          </div>
          <div className="detail-list">
            <div>
              <strong>Name clearly</strong>
              <p>Use a product or batch label your operations team would recognize instantly.</p>
            </div>
            <div>
              <strong>Keep temperature human</strong>
              <p>Write storage rules in simple language instead of encoded field values.</p>
            </div>
            <div>
              <strong>Describe risk</strong>
              <p>State why the shipment matters and what condition must be protected.</p>
            </div>
          </div>
          {notice ? <p className="notice-text">{notice}</p> : null}
        </article>
      </section>

      <ProductTable products={products} />
    </div>
  );
}
