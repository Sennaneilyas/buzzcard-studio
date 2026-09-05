import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllOrders, updateOrderStatus } from "../api/adminOrders";
import { MOCK_ORDERS } from "../mockData";

// Set to false once your Supabase data is connected and populated.
const USE_MOCK = true;

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_ORDERS;
      return fetchAllOrders();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in memory for 1 hour
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => {
      if (USE_MOCK) {
        // In mock mode, just resolve instantly
        return Promise.resolve({ id: orderId, status });
      }
      return updateOrderStatus(orderId, status);
    },
    // Optimistic update so status change feels instant
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "orders"] });
      const prev = queryClient.getQueryData(["admin", "orders"]);
      queryClient.setQueryData(["admin", "orders"], (old) =>
        old?.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["admin", "orders"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
