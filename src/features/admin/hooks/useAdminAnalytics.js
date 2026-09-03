import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminStats,
  fetchOrdersOverTime,
  fetchProductPopularity,
} from "../api/adminAnalytics";
import {
  MOCK_STATS,
  MOCK_ORDERS_OVER_TIME,
  MOCK_PRODUCT_POPULARITY,
} from "../mockData";

// Set to false once your Supabase data is connected and populated.
const USE_MOCK = true;

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_STATS;
      return fetchAdminStats();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrdersOverTime() {
  return useQuery({
    queryKey: ["admin", "orders-over-time"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_ORDERS_OVER_TIME;
      return fetchOrdersOverTime();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductPopularity() {
  return useQuery({
    queryKey: ["admin", "product-popularity"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_PRODUCT_POPULARITY;
      return fetchProductPopularity();
    },
    staleTime: 1000 * 60 * 5,
  });
}
