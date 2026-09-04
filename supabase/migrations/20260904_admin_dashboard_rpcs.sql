-- ─── 1. admin_get_stats ────────────────────────────────────────────────────────
-- Returns KPI stats for a given period with comparison to previous period.
-- p_period: '3d', '7d', '30d', '90d', '365d'
CREATE OR REPLACE FUNCTION public.admin_get_stats(p_period text DEFAULT '30d')
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_days int;
  v_now timestamptz := now();
  v_period_start timestamptz;
  v_prev_start timestamptz;
  result json;
BEGIN
  -- Auth check
  IF NOT coalesce((current_setting('request.jwt.claims', true)::json -> 'app_metadata' ->> 'is_admin')::boolean, false) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Parse period
  v_days := regexp_replace(p_period, '[^0-9]', '', 'g')::int;
  v_period_start := v_now - (v_days || ' days')::interval;
  v_prev_start := v_period_start - (v_days || ' days')::interval;

  SELECT json_build_object(
    'totalProfiles',     (SELECT count(*) FROM public.profiles),
    'publishedProfiles', (SELECT count(*) FROM public.profiles WHERE status = 'published'),
    'totalOrders',       (SELECT count(*) FROM public.orders WHERE created_at >= v_period_start),
    'totalRevenue',      coalesce((SELECT sum(total_amount) FROM public.orders WHERE created_at >= v_period_start AND status IN ('paid', 'shipped')), 0),
    'prevOrders',        (SELECT count(*) FROM public.orders WHERE created_at >= v_prev_start AND created_at < v_period_start),
    'prevRevenue',       coalesce((SELECT sum(total_amount) FROM public.orders WHERE created_at >= v_prev_start AND created_at < v_period_start AND status IN ('paid', 'shipped')), 0),
    'prevProfiles',      (SELECT count(*) FROM public.profiles WHERE created_at < v_period_start)
  ) INTO result;

  RETURN result;
END;
$$;

-- ─── 2. admin_get_orders_over_time ─────────────────────────────────────────────
-- Returns daily order counts and revenue for the last N days, zero-filled.
CREATE OR REPLACE FUNCTION public.admin_get_orders_over_time(p_days int DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  IF NOT coalesce((current_setting('request.jwt.claims', true)::json -> 'app_metadata' ->> 'is_admin')::boolean, false) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_agg(row_to_json(t) ORDER BY t.date) INTO result
  FROM (
    SELECT
      d.date::date::text AS date,
      coalesce(count(o.id), 0)::int AS orders,
      coalesce(sum(o.total_amount), 0)::numeric AS revenue
    FROM generate_series(
      (now() - (p_days || ' days')::interval)::date,
      now()::date,
      '1 day'
    ) AS d(date)
    LEFT JOIN public.orders o ON o.created_at::date = d.date AND o.status IN ('paid', 'shipped')
    GROUP BY d.date
  ) t;

  RETURN coalesce(result, '[]'::json);
END;
$$;

-- ─── 3. admin_get_product_popularity ───────────────────────────────────────────
-- Returns top N products by quantity ordered.
CREATE OR REPLACE FUNCTION public.admin_get_product_popularity(p_limit int DEFAULT 8)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  IF NOT coalesce((current_setting('request.jwt.claims', true)::json -> 'app_metadata' ->> 'is_admin')::boolean, false) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_agg(row_to_json(t)) INTO result
  FROM (
    SELECT
      product_name AS name,
      sum(quantity)::int AS value
    FROM public.order_items
    GROUP BY product_name
    ORDER BY value DESC
    LIMIT p_limit
  ) t;

  RETURN coalesce(result, '[]'::json);
END;
$$;

-- Grant execute to authenticated users (RLS is handled inside the function)
GRANT EXECUTE ON FUNCTION public.admin_get_stats(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_orders_over_time(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_product_popularity(int) TO authenticated;
