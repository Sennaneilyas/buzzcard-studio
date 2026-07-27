import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

/**
 * TanStack Query hook to fetch and cache the authenticated user's row from `profiles` table.
 * Automatically enabled only when a valid user.id exists in the Zustand auth store.
 */
export function useProfile() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error.message);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    retry: 2, // Retry twice if DB trigger is slightly delayed during initial signup
  });
}
