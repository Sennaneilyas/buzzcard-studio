import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminProducts,
  fetchAdminCategories,
  updateProductFeatured,
  toggleProductActive,
  toggleCategoryActive,
  saveCategoryPositions,
  updateProductBadge,
  updateProductStock,
} from "../api/adminProducts";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../mockData";

// Set to false once your Supabase data is connected and populated.
const USE_MOCK = true;

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_PRODUCTS;
      return fetchAdminProducts();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_CATEGORIES;
      return fetchAdminCategories();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useToggleProductFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isFeatured }) => {
      if (USE_MOCK) return Promise.resolve();
      return updateProductFeatured(productId, isFeatured);
    },
    onMutate: async ({ productId, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const prev = queryClient.getQueryData(["admin", "products"]);
      queryClient.setQueryData(["admin", "products"], (old) =>
        old?.map((p) => (p.id === productId ? { ...p, isFeatured } : p))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "products"], ctx.prev);
    },
    onSettled: () => {
      if (!USE_MOCK) {
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
      }
    },
  });
}

export function useToggleProductActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isActive }) => {
      if (USE_MOCK) return Promise.resolve();
      return toggleProductActive(productId, isActive);
    },
    onMutate: async ({ productId, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const prev = queryClient.getQueryData(["admin", "products"]);
      queryClient.setQueryData(["admin", "products"], (old) =>
        old?.map((p) => (p.id === productId ? { ...p, isActive } : p))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "products"], ctx.prev);
    },
    onSettled: () => {
      if (!USE_MOCK) {
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
      }
    },
  });
}

export function useToggleCategoryActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, isActive }) => {
      if (USE_MOCK) return Promise.resolve();
      return toggleCategoryActive(categoryId, isActive);
    },
    onMutate: async ({ categoryId, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "categories"] });
      const prev = queryClient.getQueryData(["admin", "categories"]);
      queryClient.setQueryData(["admin", "categories"], (old) =>
        old?.map((c) => (c.id === categoryId ? { ...c, is_active: isActive } : c))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "categories"], ctx.prev);
    },
    onSettled: () => {
      if (!USE_MOCK) {
        queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
        queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
      }
    },
  });
}

export function useSaveCategoryPositions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates) => {
      if (USE_MOCK) return Promise.resolve();
      return saveCategoryPositions(updates);
    },
    onSettled: () => {
      if (!USE_MOCK) {
        queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
        queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
      }
    },
  });
}

export function useUpdateProductBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, badge }) => {
      if (USE_MOCK) return Promise.resolve();
      return updateProductBadge(productId, badge);
    },
    onMutate: async ({ productId, badge }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const prev = queryClient.getQueryData(["admin", "products"]);
      queryClient.setQueryData(["admin", "products"], (old) =>
        old?.map((p) => (p.id === productId ? { ...p, badge } : p))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "products"], ctx.prev);
    },
    onSettled: () => {
      if (!USE_MOCK) {
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
      }
    },
  });
}

export function useUpdateProductStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stockCount }) => {
      if (USE_MOCK) return Promise.resolve();
      return updateProductStock(productId, stockCount);
    },
    onMutate: async ({ productId, stockCount }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const prev = queryClient.getQueryData(["admin", "products"]);
      queryClient.setQueryData(["admin", "products"], (old) =>
        old?.map((p) =>
          p.id === productId
            ? { ...p, stockCount, stock: stockCount > 0 ? "in_stock" : "out_of_stock" }
            : p
        )
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "products"], ctx.prev);
    },
    onSettled: () => {
      if (!USE_MOCK) {
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
      }
    },
  });
}
