import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import CategoryPage from "./pages/CategoryPage";
import Upgrade from "./pages/Upgrade";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PasswordProvider } from "./context/PasswordContext";

const App = () => (
  <AuthProvider>
    <PasswordProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path=""
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/view-all" element={<CategoryPage />} />

          {/* ADD ALL CUSTOM ROUTES BELOW */}
        </Route>
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      </Routes>
    </PasswordProvider>
  </AuthProvider>
);

export default App;
