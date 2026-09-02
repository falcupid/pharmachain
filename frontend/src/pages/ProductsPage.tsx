import { useEffect, useState } from "react";

import { ProductForm } from "../components/forms/ProductForm";
import { ProductTable } from "../components/sections/ProductTable";
import { PharmaChainApi } from "../services/api";
import {
  getCurrentUserRole,
  type UserRole,
} from "../services/auth";
import type { CreateProductInput, Product } from "../types";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");

  const role = getCurrentUserRole();

  const canCreateProduct: boolean =
    role === "admin" ||
    role === "pharmaceutical_company";

  async function loadProducts() {
    const data = await PharmaChainApi.getProducts();
    setProducts(data);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleCreateProduct(payload: CreateProductInput) {
    if (!canCreateProduct) {
      setNotice(
        "You do not have permission to create products.",
      );
      return;
    }

    await PharmaChainApi.createProduct(payload);

    setNotice("Product saved.");

    await loadProducts();
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Products</p>

        <h2 className="page-title">
          Catalog records that stay readable.
        </h2>

        <p className="page-text">
          Add core shipment details without bloated fields or noisy
          layout.
        </p>
      </section>

      {canCreateProduct ? (
        <section className="content-grid">
          <ProductForm onSubmit={handleCreateProduct} />

          <article className="glass-card aside-panel">
            <div className="section-copy">
              <p className="eyebrow">Guidance</p>

              <h2>
                Use short, durable product definitions
              </h2>
            </div>

            <div className="detail-list">
              <div>
                <strong>Name clearly</strong>

                <p>
                  Use a product or batch label your operations team
                  would recognize instantly.
                </p>
              </div>

              <div>
                <strong>Keep temperature human</strong>

                <p>
                  Write storage rules in simple language instead of
                  encoded field values.
                </p>
              </div>

              <div>
                <strong>Describe risk</strong>

                <p>
                  State why the shipment matters and what condition
                  must be protected.
                </p>
              </div>
            </div>

            {notice ? (
              <p className="notice-text">{notice}</p>
            ) : null}
          </article>
        </section>
      ) : (
        <article className="glass-card notice-banner">
          <strong>View-only access</strong>

          <p
            style={{
              margin: "0.45rem 0 0",
              color: "var(--muted)",
            }}
          >
            Your account can view product records, but you do not
            have permission to create or modify products.
          </p>
        </article>
      )}

      <ProductTable products={products} />
    </div>
  );
}