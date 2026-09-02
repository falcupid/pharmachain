import { Navigate, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/layout/AppHeader";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { OperationsPage } from "./pages/OperationsPage";
import { TrackingPage } from "./pages/TrackingPage";

export default function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <AppHeader />

      <main className="page-shell">
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* =========================
              AUTHENTICATED ROUTES
          ========================= */}

          <Route element={<ProtectedRoute />}>

            {/* =========================
                OVERVIEW
                Everyone can view
            ========================= */}

            <Route
              path="/"
              element={<HomePage />}
            />

            {/* =========================
                PRODUCTS
                Everyone except nobody
                is blocked at page level.
                Editing permissions will
                be handled inside ProductsPage.
            ========================= */}

            <Route
              path="/products"
              element={<ProductsPage />}
            />

            {/* =========================
                OPERATIONS
                Admin + Dispatcher only
            ========================= */}

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin",
                    "dispatcher",
                  ]}
                />
              }
            >
              <Route
                path="/operations"
                element={<OperationsPage />}
              />
            </Route>

            {/* =========================
                TRACKING
                Everyone can view
            ========================= */}

            <Route
              path="/tracking"
              element={<TrackingPage />}
            />

            <Route
              path="/tracking/:productId"
              element={<TrackingPage />}
            />

          </Route>

          {/* =========================
              UNKNOWN ROUTES
          ========================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </main>
    </div>
  );
}