import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfileQueryKey } from "@/features/auth/hooks/useProfile";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  applySuccessfulProfileSave,
  cleanupReplacedProfileMedia,
} from "@/features/editor/api/useUpdateProfile";
import { applyTemplateSwitch } from "@/features/editor/persistence/applyTemplateSwitch";
import { supabase } from "@/lib/supabase";

export function useApplyTemplate() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (values) =>
      applyTemplateSwitch({
        client: supabase,
        userId: user?.id,
        ...values,
      }),
    onSuccess: (result) => {
      applySuccessfulProfileSave(queryClient, result.profile.id, result);
      void cleanupReplacedProfileMedia(result.profile.id, result.profile);
      toast.success("Template applied", {
        description: "Your profile now uses the selected template.",
      });
    },
    onError: (error) => {
      const profileId = error.savedResult?.profile.id || user?.id;
      if (error.savedResult) {
        applySuccessfulProfileSave(
          queryClient,
          error.savedResult.profile.id,
          error.savedResult,
        );
        void cleanupReplacedProfileMedia(
          error.savedResult.profile.id,
          error.savedResult.profile,
        );
      }
      if (profileId) {
        void queryClient.invalidateQueries({
          queryKey: getProfileQueryKey(profileId),
        });
      }

      console.error("Failed to apply template:", error);
      toast.error("Template was not applied", {
        description: error.savedResult
          ? "Your candidate changes were saved safely. We are refreshing the latest profile state before you retry."
          : error.message || "Your current template is still active.",
      });
    },
  });
}
