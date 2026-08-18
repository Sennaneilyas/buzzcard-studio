import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AuthForm,
  ForgotPasswordPage,
  ProtectedRoute,
  ResetPasswordPage,
} from "@/features/auth";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

const LandingPage = React.lazy(() => import("@/features/marketing/LandingPage"));
const ProductsPage = React.lazy(() => import("@/features/products/ProductsPage"));
const OnboardingPage = React.lazy(() => import("@/features/onboarding/OnboardingPage"));
const PublicProfileRoute = React.lazy(() => import("@/app/routes/public-profile"));
const StudioEditor = React.lazy(() => import("@/features/editor/StudioEditor"));
const BuzzTemplatePreview = React.lazy(() =>
  import("@/app/routes/template-preview/BuzzTemplatePreview"),
);
const DoctorTemplate = React.lazy(() =>
  import("@/features/templates/doctor-template/DoctorTemplate"),
);
const CoiffeurTemplate = React.lazy(() =>
  import("@/features/templates/coiffeur-template/CoiffeurTemplate"),
);
const HotelTemplate = React.lazy(() =>
  import("@/features/templates/hotel-template/HotelTemplate"),
);

export default function AppRouter() {
  return (
    <Suspense fallback={<GlobalLoader className="bg-cloud" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/reset-password"
          element={
            <ProtectedRoute>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
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
        <Route path="/template" element={<BuzzTemplatePreview />} />
        <Route path="/template-doctor" element={<DoctorTemplate />} />
        <Route path="/template-coiffeur" element={<CoiffeurTemplate />} />
        <Route path="/template-hotel" element={<HotelTemplate />} />
      </Routes>
    </Suspense>
  );
}
