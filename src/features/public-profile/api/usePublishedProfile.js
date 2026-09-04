import { useQuery } from "@tanstack/react-query";
import { getTemplateEditorConfig } from "@/features/editor/config/templateEditorConfigs";
import { hydrateProfileEditor } from "@/features/editor/persistence/templateData";
import { supabase } from "@/lib/supabase";

export const getPublishedProfileQueryKey = (username) => [
  "published-profile",
  username,
];

export async function fetchPublishedProfileByUsername(client, username) {
  if (!username) return null;

  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export function buildPublicProfileViewModel(profile) {
  if (!profile || profile.status !== "published") {
    return { state: "not_found", profileData: null, templateId: null };
  }

  const config = getTemplateEditorConfig(profile.template_id);
  if (!config) {
    return {
      state: "template_unavailable",
      profileData: null,
      templateId: profile.template_id,
    };
  }

  const hydrated = hydrateProfileEditor(profile, config);
  if (!hydrated.data || hydrated.source === "future-document" || hydrated.source === "future-entry") {
    return {
      state: "template_unavailable",
      profileData: null,
      templateId: profile.template_id,
    };
  }

  return {
    state: "ready",
    templateId: profile.template_id,
    warning: hydrated.warning,
    profileData: {
      ...hydrated.data,
      id: profile.id,
      username: profile.username,
      status: profile.status,
      first_published_at: profile.first_published_at,
    },
  };
}

export function usePublishedProfile(username) {
  return useQuery({
    queryKey: getPublishedProfileQueryKey(username),
    queryFn: () => fetchPublishedProfileByUsername(supabase, username),
    enabled: Boolean(username),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
