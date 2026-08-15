import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Eye } from "lucide-react";
import TemplateRegistry from "@/config/TemplateRegistry";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { useAuthStore, useProfile } from "@/features/auth";

export default function PublicProfileRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // 1. Fetch Auth State to determine ownership
  const user = useAuthStore((s) => s.user);
  const { data: userProfile } = useProfile();
  
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    userProfile?.full_name ||
    (user?.email ? user.email.split("@")[0] : "");
  
  const isOwner = displayName.toLowerCase() === slug?.toLowerCase();

  // 2. Fetch Profile Data & Template ID
  // In Phase 3, this will use TanStack Query based on the `slug`. 
  // For Phase 2, we mock it using useEditorStore if it matches the current user.
  const storeSlug = useEditorStore((s) => s.slug);
  const storeTemplateId = useEditorStore((s) => s.templateId);
  const storeProfileData = useEditorStore((s) => s.profileData);

  // If we are looking at our own mocked profile from onboarding
  const profileData = (isOwner || slug === storeSlug) ? storeProfileData : null;
  const templateId = (isOwner || slug === storeSlug) ? storeTemplateId : "buzz-template";

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cloud text-navy">
        <h1>Profile not found (404)</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-cloud font-sans overflow-x-hidden">
      {/* ── The Rendered Template ── */}
      <TemplateRegistry templateId={templateId} profileData={profileData} isEditMode={false} />

      {/* ── Owner Floating Actions (Preview | Edit Toggle) ── */}
      <AnimatePresence>
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/50"
          >
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => navigate(`/profile/${slug}/edit`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-navy hover:bg-black/5 font-medium text-sm transition-colors active:scale-95"
            >
              <Edit3 className="w-4 h-4 opacity-70" />
              Edit Mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
