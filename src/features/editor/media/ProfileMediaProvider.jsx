import { useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import {
  containsMediaReference,
  deleteOwnedProfileMedia,
  isOwnedProfileMedia,
  uploadProfileMedia,
} from "./profileMedia";
import { ProfileMediaContext } from "./useProfileMedia";

export function ProfileMediaProvider({ userId, templateId, children }) {
  const lastSavedData = useEditorStore((state) => state.lastSavedData);
  const beginMediaUpload = useEditorStore((state) => state.beginMediaUpload);
  const finishMediaUpload = useEditorStore((state) => state.finishMediaUpload);
  const queueMediaCleanup = useEditorStore((state) => state.queueMediaCleanup);

  const stageRemoval = useCallback(
    (reference) => {
      if (!isOwnedProfileMedia(reference, userId)) return;

      if (containsMediaReference(lastSavedData, reference)) {
        queueMediaCleanup(reference);
        return;
      }

      // A session upload that was replaced before save has no database
      // reference, so it can be removed immediately without risking data loss.
      void deleteOwnedProfileMedia({
        client: supabase,
        userId,
        references: [reference],
      }).catch((error) => {
        console.warn("Could not clean up an unused profile-media upload", {
          code: error.code,
          message: error.message,
        });
      });
    },
    [lastSavedData, queueMediaCleanup, userId],
  );

  const uploadReplacement = useCallback(
    async ({ file, category, currentValue = null }) => {
      beginMediaUpload();
      try {
        const uploaded = await uploadProfileMedia({
          client: supabase,
          userId,
          templateId,
          category,
          file,
        });
        if (currentValue && currentValue !== uploaded.publicUrl) {
          stageRemoval(currentValue);
        }
        return uploaded.publicUrl;
      } finally {
        finishMediaUpload();
      }
    },
    [beginMediaUpload, finishMediaUpload, stageRemoval, templateId, userId],
  );

  const value = useMemo(
    () => ({ stageRemoval, uploadReplacement }),
    [stageRemoval, uploadReplacement],
  );

  return (
    <ProfileMediaContext.Provider value={value}>
      {children}
    </ProfileMediaContext.Provider>
  );
}
