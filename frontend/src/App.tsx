import { Navigate, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/layout/AppHeader";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { OperationsPage } from "./pages/OperationsPage";
import { ProductsPage } from "./pages/ProductsPage";
import { TrackingPage } from "./pages/TrackingPage";

export default function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <AppHeader />

      <main className="page-shell">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            {/* Overview - all roles */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin",
                    "pharmaceutical_company",
                    "dispatcher",
                    "pharmachain_employee",
                  ]}
                />
              }
            >
              <Route path="/" element={<HomePage />} />
            </Route>

            {/* Products - all roles */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin",
                    "pharmaceutical_company",
                    "dispatcher",
                    "pharmachain_employee",
                  ]}
                />
              }
            >
              <Route path="/products" element={<ProductsPage />} />
            </Route>

            {/* Operations - admin, company, dispatcher */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin",
                    "pharmaceutical_company",
                    "dispatcher",
                  ]}
                />
              }
            >
              <Route path="/operations" element={<OperationsPage />} />
            </Route>

            {/* Tracking - all roles */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin",
                    "pharmaceutical_company",
                    "dispatcher",
                    "pharmachain_employee",
                  ]}
                />
              }
            >
              <Route path="/tracking" element={<TrackingPage />} />
              <Route
                path="/tracking/:productId"
                element={<TrackingPage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}