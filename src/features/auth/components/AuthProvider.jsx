import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Global authentication listener component.
 * Mounts once at root layout to sync Supabase auth state into Zustand.
 */
export function AuthProvider({ children }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setError = useAuthStore((s) => s.setError);

  useEffect(() => {
    let mounted = true;

    // 1. Fetch current session on initial mount
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) {
          setAuth(session);
        }
      } catch (err) {
        console.error("Failed to retrieve initial Supabase session:", err);
        if (mounted) {
          setError(err.message || "Failed to initialize authentication.");
        }
      }
    };

    initializeAuth();

    // 2. Subscribe to real-time auth state changes (login, logout, token refresh, OAuth redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        clearAuth();
      } else {
        setAuth(session);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setAuth, clearAuth, setError]);

  return children;
}
