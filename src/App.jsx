import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/features/marketing";
import ProductsPage from "@/features/products/ProductsPage";
import { AuthForm, ProtectedRoute } from "@/features/auth";
import { OnboardingPage } from "@/features/onboarding";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthForm />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:category" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;
