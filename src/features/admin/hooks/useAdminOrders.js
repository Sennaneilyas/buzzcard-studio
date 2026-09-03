import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllOrders, updateOrderStatus } from "../api/adminOrders";

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAllOrders,
    staleTime: 1000 * 60 * 1, // 1 min — orders need to feel live
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Invalidate both the orders list and the stats (revenue/count may change)
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
