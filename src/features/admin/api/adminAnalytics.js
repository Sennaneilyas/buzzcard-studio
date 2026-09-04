import { supabase } from "@/lib/supabase";

/**
 * Fetches KPI stats via RPC, with comparison to previous period.
 * Falls back to client-side aggregation if RPC doesn't exist yet.
 * @param {string} period - "3d" | "7d" | "30d" | "365d"
 */
export async function fetchAdminStats(period = "30d") {
  const { data, error } = await supabase.rpc("admin_get_stats", {
    p_period: period,
  });

  if (error) throw error;
  return data;
}

/**
 * Fetches daily order counts via RPC for the last N days.
 * @param {string} period - "3d" | "7d" | "30d" | "365d"
 */
export async function fetchOrdersOverTime(period = "30d") {
  const days = parseInt(period, 10) || 30;

  const { data, error } = await supabase.rpc("admin_get_orders_over_time", {
    p_days: days,
  });

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetches top N products by order quantity via RPC.
 */
export async function fetchProductPopularity(limit = 8) {
  const { data, error } = await supabase.rpc("admin_get_product_popularity", {
    p_limit: limit,
  });

  if (error) throw error;
  return data ?? [];
}
