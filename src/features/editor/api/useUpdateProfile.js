import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfileQueryKey } from "@/features/auth/hooks/useProfile";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { saveProfileEditor } from "@/features/editor/persistence/saveProfileEditor";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import {
  containsMediaReference,
  deleteOwnedProfileMedia,
} from "@/features/editor/media/profileMedia";
import { supabase } from "@/lib/supabase";

export function applySuccessfulProfileSave(queryClient, userId, result) {
  queryClient.setQueryData(getProfileQueryKey(userId), result.profile);
  useEditorStore.getState().markSaved({
    profileData: result.editorData,
    warning: result.warning,
  });
}

export async function cleanupReplacedProfileMedia(userId, savedProfile) {
  const editorState = useEditorStore.getState();
  const queued = editorState.pendingMediaCleanup;
  if (!userId || queued.length === 0) return;

  const persistedMedia = {
    avatar_url: savedProfile?.avatar_url,
    template_data: savedProfile?.template_data,
  };
  const obsolete = queued.filter(
    (reference) => !containsMediaReference(persistedMedia, reference),
  );
  const stillReferenced = queued.filter((reference) =>
    containsMediaReference(persistedMedia, reference),
  );

  if (stillReferenced.length > 0) {
    editorState.clearMediaCleanup(stillReferenced);
  }
  if (obsolete.length === 0) return;

  try {
    await deleteOwnedProfileMedia({
      client: supabase,
      userId,
      references: obsolete,
    });
    useEditorStore.getState().clearMediaCleanup(obsolete);
  } catch (error) {
    // The profile save is authoritative. Cleanup is deliberately best-effort
    // and remains queued for a later successful save if Storage is unavailable.
    console.warn("Profile saved but replaced media cleanup failed", {
      code: error.code,
      message: error.message,
    });
  }
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (values) =>
      saveProfileEditor({
        client: supabase,
        userId: user?.id,
        ...values,
      }),
    onSuccess: (result, variables) => {
      applySuccessfulProfileSave(queryClient, result.profile.id, result);
      void cleanupReplacedProfileMedia(result.profile.id, result.profile);
      const isCandidateSave = variables.mode === "candidate";
      toast.success(isCandidateSave ? "Candidate saved" : "Profile saved successfully!", {
        description: isCandidateSave
          ? "Your new template is saved, but your current profile is still active."
          : "Your Studio changes are stored in Supabase.",
      });
    },
    onError: (error) => {
      if (error.code === "PROFILE_SAVE_CONFLICT" && user?.id) {
        void queryClient.invalidateQueries({
          queryKey: getProfileQueryKey(user.id),
        });
      }
      console.error("Failed to update profile:", error);
      toast.error("Failed to save changes", {
        description:
          error.message || "Your edits are still here. Please try again.",
      });
    },
  });
}
