import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { useAuthStore } from "../store/useAuthStore";

export function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (!user) {
    return null;
  }

  return children;
}
