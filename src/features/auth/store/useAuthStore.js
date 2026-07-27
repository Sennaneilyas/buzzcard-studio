import { create } from "zustand";

/**
 * Zustand store for client-side authentication state.
 * Syncs directly with Supabase auth session events via AuthProvider.
 */
export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  isLoading: true, // Defaults to true while initial session check runs on app mount
  error: null,

  /**
   * Update store with a new Supabase session (or null if logged out).
   */
  setAuth: (session) =>
    set({
      session: session ?? null,
      user: session?.user ?? null,
      isLoading: false,
      error: null,
    }),

  /**
   * Toggle loading status (e.g., during async sign-in or session refresh).
   */
  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  /**
   * Set an authentication error message and stop loading.
   */
  setError: (error) =>
    set({
      error: error ?? null,
      isLoading: false,
    }),

  /**
   * Clear auth identity on sign-out or session expiration.
   */
  clearAuth: () =>
    set({
      session: null,
      user: null,
      isLoading: false,
      error: null,
    }),
}));
