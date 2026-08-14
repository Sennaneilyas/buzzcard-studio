import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthForm, ProtectedRoute } from "@/features/auth";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

// Lazy-loaded page components for code splitting
const LandingPage = React.lazy(() => import("@/features/marketing/LandingPage"));
const ProductsPage = React.lazy(() => import("@/features/products/ProductsPage"));
const OnboardingPage = React.lazy(() => import("@/features/onboarding/OnboardingPage"));
const PublicProfileRoute = React.lazy(() => import("@/app/routes/public-profile"));

// Lazy-loaded template components
const BuzzTemplate = React.lazy(() => import("@/features/templates/BuzzTemplate/BuzzTemplate"));
const DoctorTemplate = React.lazy(() => import("@/features/templates/doctor-template/DoctorTemplate"));
const CoiffeurTemplate = React.lazy(() => import("@/features/templates/coiffeur-template/CoiffeurTemplate"));
const HotelTemplate = React.lazy(() => import("@/features/templates/hotel-template/HotelTemplate"));

export default function AppRouter() {
  return (
    <Suspense fallback={<GlobalLoader className="bg-cloud" />}>
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
        <Route path="/template-hotel" element={<HotelTemplate />} />
      </Routes>
    </Suspense>
  );
}
