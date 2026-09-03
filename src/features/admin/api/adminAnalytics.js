import { supabase } from "@/lib/supabase";

/**
 * Fetches aggregated KPI stats for the admin dashboard.
 * Returns total users, published profiles, order count, and revenue.
 */
export async function fetchAdminStats() {
  const [profilesResult, ordersResult] = await Promise.all([
    supabase.from("profiles").select("id, status", { count: "exact" }),
    supabase
      .from("orders")
      .select("id, total_amount, status", { count: "exact" }),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (ordersResult.error) throw ordersResult.error;

  const profiles = profilesResult.data ?? [];
  const orders = ordersResult.data ?? [];

  const totalProfiles = profilesResult.count ?? 0;
  const publishedProfiles = profiles.filter((p) => p.status === "published").length;
  const totalOrders = ordersResult.count ?? 0;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );

  return { totalProfiles, publishedProfiles, totalOrders, totalRevenue };
}

/**
 * Fetches orders grouped by day for the last 30 days.
 * Returns an array of { date, count } objects for the LineChart.
 */
export async function fetchOrdersOverTime() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Group by date string (YYYY-MM-DD)
  const grouped = (data ?? []).reduce((acc, order) => {
    const date = order.created_at.slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Fill in all 30 days so chart has no gaps
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({ date: dateStr, orders: grouped[dateStr] || 0 });
  }

  return result;
}

/**
 * Fetches order_items grouped by product name for the PieChart.
 * Returns an array of { name, value } objects.
 */
export async function fetchProductPopularity() {
  const { data, error } = await supabase
    .from("order_items")
    .select("product_name, quantity");

  if (error) throw error;

  const grouped = (data ?? []).reduce((acc, item) => {
    const name = item.product_name || "Unknown";
    acc[name] = (acc[name] || 0) + (item.quantity || 1);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 for a clean chart
}
