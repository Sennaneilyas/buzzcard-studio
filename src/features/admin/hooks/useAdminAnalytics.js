import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminStats,
  fetchOrdersOverTime,
  fetchProductPopularity,
} from "../api/adminAnalytics";
import { fetchProductCatalog } from "../../products/api/products";
import {
  MOCK_STATS,
  MOCK_ORDERS_OVER_TIME,
  MOCK_PRODUCT_POPULARITY,
} from "../mockData";

// Set to false once your Supabase RPCs are deployed.
const USE_MOCK = true;

/**
 * @param {string} period - "3d" | "7d" | "30d" | "365d"
 */
export function useAdminStats(period = "30d") {
  return useQuery({
    queryKey: ["admin", "stats", period],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_STATS;
      return fetchAdminStats(period);
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * @param {string} period - "3d" | "7d" | "30d" | "365d"
 */
export function useOrdersOverTime(period = "30d") {
  return useQuery({
    queryKey: ["admin", "orders-over-time", period],
    queryFn: async () => {
      const days = parseInt(period, 10) || 30;
      if (USE_MOCK) return MOCK_ORDERS_OVER_TIME.slice(-days);
      return fetchOrdersOverTime(period);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductPopularity() {
  return useQuery({
    queryKey: ["admin", "product-popularity"],
    queryFn: async () => {
      if (USE_MOCK) {
        const catalog = await fetchProductCatalog();
        return catalog.products.map((p, i) => ({
          name: p.name,
          value: Math.floor(100 / (i + 1)) + Math.floor(Math.random() * 20) // Fake value decreasing
        }));
      }
      return fetchProductPopularity();
    },
    staleTime: 1000 * 60 * 5,
  });
}
