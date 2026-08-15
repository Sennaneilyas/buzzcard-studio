import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthForm, ProtectedRoute } from "@/features/auth";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

// Lazy-loaded page components for code splitting
const LandingPage = React.lazy(() => import("@/features/marketing/LandingPage"));
const ProductsPage = React.lazy(() => import("@/features/products/ProductsPage"));
const OnboardingPage = React.lazy(() => import("@/features/onboarding/OnboardingPage"));
const PublicProfileRoute = React.lazy(() => import("@/app/routes/public-profile"));
const StudioEditor = React.lazy(() => import("@/features/editor/StudioEditor"));

function App() {
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
        <Route
          path="/profile/:slug/edit"
          element={
            <ProtectedRoute>
              <StudioEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
