import { supabase } from "@/lib/supabase";

/**
 * Fetches all orders with their items for the admin orders table.
 * Admin RLS policy allows this query to return all rows.
 */
export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_amount,
      customer_name,
      customer_email,
      customer_phone,
      created_at,
      order_items (
        id,
        product_name,
        variant_name,
        quantity,
        unit_price
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Updates the status of a single order.
 * @param {string} orderId
 * @param {'pending' | 'paid' | 'shipped' | 'cancelled'} status
 */
export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
