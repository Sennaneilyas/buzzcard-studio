import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminProducts,
  fetchAdminCategories,
  updateProductFeatured,
  toggleProductActive,
  toggleCategoryActive,
  saveCategoryPositions,
} from "../api/adminProducts";

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchAdminProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchAdminCategories,
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleProductFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isFeatured }) =>
      updateProductFeatured(productId, isFeatured),
    // Optimistic update — feels instant
    onMutate: async ({ productId, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const prev = queryClient.getQueryData(["admin", "products"]);
      queryClient.setQueryData(["admin", "products"], (old) =>
        old?.map((p) =>
          p.id === productId ? { ...p, isFeatured } : p
        )
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "products"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
    },
  });
}

export function useToggleProductActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isActive }) =>
      toggleProductActive(productId, isActive),
    onMutate: async ({ productId, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const prev = queryClient.getQueryData(["admin", "products"]);
      queryClient.setQueryData(["admin", "products"], (old) =>
        old?.map((p) =>
          p.id === productId ? { ...p, isActive } : p
        )
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "products"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
    },
  });
}

export function useToggleCategoryActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, isActive }) =>
      toggleCategoryActive(categoryId, isActive),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
    },
  });
}

export function useSaveCategoryPositions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates) => saveCategoryPositions(updates),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
    },
  });
}
