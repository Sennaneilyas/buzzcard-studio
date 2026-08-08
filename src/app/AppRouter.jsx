import { Routes, Route } from "react-router-dom";
import LandingPage from "@/features/marketing/LandingPage";
import ProductsPage from "@/features/products/ProductsPage";
import { AuthForm, ProtectedRoute } from "@/features/auth";
import OnboardingPage from "@/features/onboarding/OnboardingPage";
import PublicProfileRoute from "@/app/routes/public-profile";
import BuzzTemplate from "@/features/templates/BuzzTemplate/BuzzTemplate";
import DoctorTemplate from "@/features/templates/doctor-template/DoctorTemplate";
import CoiffeurTemplate from "@/features/templates/coiffeur-template/CoiffeurTemplate";

export default function AppRouter() {
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
      <Route path="/profile/:slug" element={<PublicProfileRoute />} />
      <Route path="/template" element={<BuzzTemplate />} />
      <Route path="/template-doctor" element={<DoctorTemplate />} />
      <Route path="/doctor-template" element={<DoctorTemplate />} />
      <Route path="/template-coiffeur" element={<CoiffeurTemplate />} />
    </Routes>
  );
}
