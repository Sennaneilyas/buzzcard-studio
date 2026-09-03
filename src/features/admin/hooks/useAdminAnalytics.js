import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminStats,
  fetchOrdersOverTime,
  fetchProductPopularity,
} from "../api/adminAnalytics";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60 * 2, // 2 min — stats should feel fresh
  });
}

export function useOrdersOverTime() {
  return useQuery({
    queryKey: ["admin", "orders-over-time"],
    queryFn: fetchOrdersOverTime,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductPopularity() {
  return useQuery({
    queryKey: ["admin", "product-popularity"],
    queryFn: fetchProductPopularity,
    staleTime: 1000 * 60 * 5,
  });
}
