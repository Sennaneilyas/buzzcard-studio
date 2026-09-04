import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  AuthForm,
  ForgotPasswordPage,
  ProtectedRoute,
  ResetPasswordPage,
} from "@/features/auth";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

const LandingPage = React.lazy(() => import("@/features/marketing/LandingPage"));
const ProductsPage = React.lazy(() => import("@/features/products/ProductsPage"));
const ProductsRoute = React.lazy(() => import("@/features/products/ProductsRoute"));
const CheckoutPage = React.lazy(() => import("@/features/products/CheckoutPage"));
const OnboardingPage = React.lazy(() => import("@/features/onboarding/OnboardingPage"));
const DashboardPage = React.lazy(() => import("@/app/routes/dashboard"));
const TemplatesPage = React.lazy(() =>
  import("@/features/templates/catalogue/TemplatesPage"),
);
const PublicProfileRoute = React.lazy(() => import("@/app/routes/public-profile"));
const ProfileEditorRoute = React.lazy(() => import("@/features/editor/ProfileEditorRoute"));
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

// Admin Routes
const AdminProtectedRoute = React.lazy(() => import("@/features/admin/components/AdminProtectedRoute"));
const AdminLayout = React.lazy(() => import("@/features/admin/components/AdminLayout"));
const AdminDashboardPage = React.lazy(() => import("@/features/admin/AdminDashboardPage"));
const AdminOrdersPage = React.lazy(() => import("@/features/admin/AdminOrdersPage"));
const AdminProductsPage = React.lazy(() => import("@/features/admin/AdminProductsPage"));

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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductsRoute />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/profile/:slug" element={<PublicProfileRoute />} />
        <Route
          path="/profile/:slug/edit"
          element={
            <ProtectedRoute>
              <ProfileEditorRoute />
            </ProtectedRoute>
          }
        />
        <Route path="/template" element={<BuzzTemplatePreview />} />
        <Route path="/template-doctor" element={<DoctorTemplate />} />
        <Route path="/template-coiffeur" element={<CoiffeurTemplate />} />
        <Route path="/template-hotel" element={<HotelTemplate />} />
        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
