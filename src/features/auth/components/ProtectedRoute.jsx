import { Navigate, useLocation } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { useAuthStore } from "../store/useAuthStore";

export function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (!user) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/auth?mode=login&returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return children;
}
