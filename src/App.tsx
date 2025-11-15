import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import CategoryPage from "./pages/CategoryPage";
import Upgrade from "./pages/Upgrade";

const App = () => (
  <Routes>
    <Route path="" element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/view-all" element={<CategoryPage />} />
      {/* ADD ALL CUSTOM ROUTES BELOW */}
    </Route>
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  </Routes>
);

export default App;
