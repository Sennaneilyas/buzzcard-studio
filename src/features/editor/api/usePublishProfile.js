import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfileQueryKey } from "@/features/auth/hooks/useProfile";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  applySuccessfulProfileSave,
  cleanupReplacedProfileMedia,
} from "@/features/editor/api/useUpdateProfile";
import { publishProfile } from "@/features/editor/persistence/publishProfile";
import { supabase } from "@/lib/supabase";

export function usePublishProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (values) =>
      publishProfile({
        client: supabase,
        userId: user?.id,
        ...values,
      }),
    onSuccess: (result) => {
      applySuccessfulProfileSave(queryClient, result.profile.id, result);
      void cleanupReplacedProfileMedia(result.profile.id, result.profile);
      toast.success("Profile published", {
        description: "Your BuzzCard is now available at its public URL.",
      });
    },
    onError: (error) => {
      const savedResult = error.savedResult;
      const profileId = savedResult?.profile.id || user?.id;

      if (savedResult) {
        applySuccessfulProfileSave(queryClient, savedResult.profile.id, savedResult);
        void cleanupReplacedProfileMedia(
          savedResult.profile.id,
          savedResult.profile,
        );
      }
      if (profileId) {
        void queryClient.invalidateQueries({
          queryKey: getProfileQueryKey(profileId),
        });
      }

      console.error("Failed to publish profile:", error);
      toast.error("Profile was not published", {
        description: savedResult
          ? "Your latest changes were saved safely. Reload Studio before trying to publish again."
          : error.message || "Please review the profile and try again.",
      });
    },
  });
}
