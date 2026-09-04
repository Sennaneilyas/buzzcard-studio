import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  fetchProfileByUserId,
  getProfileQueryKey,
} from "@/features/auth/hooks/useProfile";

const normalizeOptionalText = (value) => {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || null;
};

export function createProfileUsername(displayName, userId) {
  const base = String(displayName || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "buzzcard";
  const ownerSuffix = String(userId || "").replace(/-/g, "").slice(0, 8);
  return ownerSuffix ? `${base}-${ownerSuffix}` : base;
}

export function buildDraftProfilePayload({
  user,
  templateId,
  displayName,
  profileLabel,
  avatarUrl,
}) {
  if (!user?.id) throw new Error("User not authenticated");
  if (!templateId) throw new Error("Select a template before creating your profile");

  const fullName = String(displayName || "").trim();
  if (!fullName) throw new Error("Display name is required");

  return {
    id: user.id,
    username: createProfileUsername(fullName, user.id),
    full_name: fullName,
    profile_label: normalizeOptionalText(profileLabel),
    avatar_url: normalizeOptionalText(avatarUrl),
    template_id: templateId,
    status: "draft",
    template_data: {},
  };
}

export async function createDraftProfile({
  client,
  user,
  templateId,
  displayName,
  profileLabel,
  avatarUrl,
  existingProfile,
}) {
  let currentProfile = existingProfile;

  // `undefined` means the caller has no authoritative query result yet.
  // `null` means TanStack already confirmed that no profile exists.
  if (currentProfile === undefined) {
    currentProfile = await fetchProfileByUserId(client, user?.id);
  }

  if (currentProfile) {
    return { profile: currentProfile, created: false };
  }

  const payload = buildDraftProfilePayload({
    user,
    templateId,
    displayName,
    profileLabel,
    avatarUrl,
  });

  const { data, error } = await client
    .from("profiles")
    .insert(payload)
    .select("*")
    .single();

  if (!error) return { profile: data, created: true };

  if (error.code === "23505") {
    const profile = await fetchProfileByUserId(client, user.id);
    if (profile) return { profile, created: false };
  }

  throw error;
}

export function useCreateDraftProfile() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => createDraftProfile({
      client: supabase,
      user,
      ...values,
    }),
    onSuccess: ({ profile }) => {
      queryClient.setQueryData(getProfileQueryKey(user?.id), profile);
    },
  });
}
