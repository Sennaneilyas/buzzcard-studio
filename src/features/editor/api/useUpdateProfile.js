import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { toast } from "sonner";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ templateId, profileData, slug }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          template_id: templateId,
          template_data: profileData,
          slug: slug, // Assuming slug might also be updated or initialized
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate queries to update public profile view if needed
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profile saved successfully!", {
        description: "Your digital business card is up to date.",
      });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast.error("Failed to save changes", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
}
