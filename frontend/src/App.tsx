import { Navigate, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/layout/AppHeader";
import { HomePage } from "./pages/HomePage";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
