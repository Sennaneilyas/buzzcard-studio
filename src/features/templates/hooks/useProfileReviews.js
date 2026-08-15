import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Hook to fetch reviews and their replies for a specific profile.
 */
export function useProfileReviews(profileId) {
  return useQuery({
    queryKey: ["profile_reviews", profileId],
    queryFn: async () => {
      if (!profileId) return [];

      const { data, error } = await supabase
        .from("profile_reviews")
        .select(
          `
          *,
          reviewer:reviewer_id(id, full_name, avatar_url),
          reply:profile_review_replies(id, comment, created_at, updated_at)
        `
        )
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profileId,
  });
}

/**
 * Hook to submit a new review for a profile.
 */
export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, rating, comment }) => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user) {
        throw new Error("Vous devez être connecté pour laisser un avis.");
      }

      const reviewerId = userData.user.id;

      const { data, error } = await supabase
        .from("profile_reviews")
        .insert({
          profile_id: profileId,
          reviewer_id: reviewerId,
          rating,
          comment,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: ["profile_reviews", profileId] });
    },
  });
}

/**
 * Hook to update a review.
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, rating, comment }) => {
      const { data, error } = await supabase
        .from("profile_reviews")
        .update({ rating, comment })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile_reviews", data.profile_id] });
    },
  });
}

/**
 * Hook to delete a review.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, profileId }) => {
      const { error } = await supabase
        .from("profile_reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
      return { reviewId, profileId };
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: ["profile_reviews", profileId] });
    },
  });
}

/**
 * Hook to submit a reply to a review.
 */
export function useSubmitReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, comment }) => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user) {
        throw new Error("Vous devez être connecté.");
      }

      const { data, error } = await supabase
        .from("profile_review_replies")
        .insert({
          review_id: reviewId,
          author_id: userData.user.id,
          comment,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // We don't have profileId directly here easily unless we pass it, so invalidate all reviews
      queryClient.invalidateQueries({ queryKey: ["profile_reviews"] });
    },
  });
}

/**
 * Hook to update a reply.
 */
export function useUpdateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ replyId, comment }) => {
      const { data, error } = await supabase
        .from("profile_review_replies")
        .update({ comment, updated_at: new Date().toISOString() })
        .eq("id", replyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile_reviews"] });
    },
  });
}

/**
 * Hook to delete a reply.
 */
export function useDeleteReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ replyId }) => {
      const { error } = await supabase
        .from("profile_review_replies")
        .delete()
        .eq("id", replyId);

      if (error) throw error;
      return { replyId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile_reviews"] });
    },
  });
}

/**
 * Hook to report a review.
 */
export function useReportReview() {
  return useMutation({
    mutationFn: async ({ reviewId, reason }) => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user) {
        throw new Error("Vous devez être connecté.");
      }

      const { data, error } = await supabase
        .from("profile_review_reports")
        .insert({
          review_id: reviewId,
          reporter_id: userData.user.id,
          reason,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}
