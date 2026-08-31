import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

export default function AdminProtectedRoute() {
  const user = useAuthStore((s) => s.user);

  // Check the app_metadata for the is_admin flag injected via JWT
  const isAdmin = user?.app_metadata?.is_admin === true;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
