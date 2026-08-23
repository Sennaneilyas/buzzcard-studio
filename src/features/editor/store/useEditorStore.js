import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Temporary mock store for Phase 2.
 * In Phase 3, this will be replaced/augmented by TanStack Query and Supabase.
 */
export const useEditorStore = create(
  persist(
    (set) => ({
      slug: "",
      templateId: "buzz-template",
      profileData: {
        name: "John Doe",
        role: "Product Designer",
        bio: "Designing clean and functional digital experiences.",
        email: "john@example.com",
        phone: "+1 234 567 890",
        avatarUrl: "",
        bannerUrl: "",
        socials: {
          twitter: "",
          linkedin: "",
          instagram: "",
        },
        custom_sections: [],
      },
      
      // Actions
      setProfileData: (data) => set((state) => ({ profileData: { ...state.profileData, ...data } })),
      setTemplateId: (id) => set({ templateId: id }),
      setSlug: (slug) => set({ slug }),
    }),
    {
      name: "studio-editor-storage", // name of the item in the storage (must be unique)
    }
  )
);
