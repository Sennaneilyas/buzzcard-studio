import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

export const getProfileQueryKey = (userId) => ["profile", userId];

export const getProfileQueryOptions = (client, userId) => ({
  queryKey: getProfileQueryKey(userId),
  queryFn: () => fetchProfileByUserId(client, userId),
  staleTime: 1000 * 60 * 5,
});

export async function fetchProfileByUserId(client, userId) {
  if (!userId) return null;

  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export function getProfileState(profile) {
  if (!profile) return "no_profile";
  return profile.status === "published" ? "published" : "draft";
}

/**
 * TanStack Query hook to fetch and cache the authenticated user's row from `profiles` table.
 * Automatically enabled only when a valid user.id exists in the Zustand auth store.
 */
export function useProfile(queryOverrides = {}) {
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    ...getProfileQueryOptions(supabase, user?.id),
    ...queryOverrides,
    enabled: !!user?.id && queryOverrides.enabled !== false,
  });

  const profileState = query.isSuccess
    ? getProfileState(query.data)
    : query.isError
      ? "error"
      : "loading";

  return {
    ...query,
    profileState,
    hasProfile: profileState === "draft" || profileState === "published",
    isNoProfile: profileState === "no_profile",
    isDraft: profileState === "draft",
    isPublished: profileState === "published",
  };
}
