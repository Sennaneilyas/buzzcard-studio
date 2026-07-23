import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/features/marketing";
import ProductsPage from "@/features/products/ProductsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:category" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;
