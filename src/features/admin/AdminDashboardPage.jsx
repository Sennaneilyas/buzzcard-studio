import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  CheckCircle2,
  ShoppingBag,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  useAdminStats,
  useOrdersOverTime,
  useProductPopularity,
} from "./hooks/useAdminAnalytics";

const PIE_COLORS = [
  "#0f172a", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#06b6d4", "#f97316",
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color }) {
  // Shorten very large MAD amounts to keep layout stable
  const display =
    typeof value === "string" && value.includes("MAD")
      ? value.replace(/(\d+(?:[,\s]\d+)*)/, (m) => {
          const n = Number(m.replace(/[^\d]/g, ""));
          if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
          if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
          return m;
        })
      : value;

  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm flex items-start gap-4">
      <Icon className="w-5 h-5 mt-1 shrink-0" style={{ color }} />
      <div className="min-w-0">
        <p className="text-sm text-ink/50 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-navy mt-0.5 tabular-nums leading-tight break-all">
          {display}
        </p>
        {sub && <p className="text-xs text-ink/40 mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Chart Skeleton ────────────────────────────────────────────────────────────
function ChartSkeleton({ height = 340 }) {
  return (
    <div
      className="flex items-center justify-center bg-ink/[0.02] rounded-xl"
      style={{ height }}
    >
      <Loader2 className="w-6 h-6 text-ink/30 animate-spin" />
    </div>
  );
}

// ─── Tooltips ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-MA", { month: "short", day: "numeric" });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-ink/10 rounded-xl px-4 py-2.5 shadow-lg text-sm">
      <p className="text-ink/50 mb-1">{formatDate(label)}</p>
      <p className="font-bold text-navy">{payload[0].value} orders</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-ink/10 rounded-xl px-4 py-2.5 shadow-lg text-sm">
      <p className="font-bold text-navy">{payload[0].name}</p>
      <p className="text-ink/60">{payload[0].value} sold</p>
    </div>
  );
};

// ─── Custom Pie Legend ────────────────────────────────────────────────────────
const PIE_LEGEND_MAX = 6; // Max visible rows before showing overflow count

function PieLegend({ data }) {
  const visible = data.slice(0, PIE_LEGEND_MAX);
  const overflow = data.length - PIE_LEGEND_MAX;

  return (
    <div className="space-y-2">
      {visible.map((entry, i) => (
        <div key={entry.name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
            />
            <span className="text-xs text-ink/60 truncate">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-navy tabular-nums shrink-0">
            {entry.value}
          </span>
        </div>
      ))}
      {overflow > 0 && (
        <p className="text-[11px] text-ink/35 pt-1">+{overflow} more products</p>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: ordersTime, isLoading: timeLoading } = useOrdersOverTime();
  const { data: popularity, isLoading: popLoading } = useProductPopularity();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-ink/50 mt-1 text-sm">
          Your BuzzCard business at a glance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm h-28 animate-pulse"
            />
          ))
        ) : (
          <>
            <KpiCard
              icon={Users}
              label="Total Profiles"
              value={stats?.totalProfiles ?? 0}
              sub="Registered accounts"
              color="#0f172a"
            />
            <KpiCard
              icon={CheckCircle2}
              label="Published"
              value={stats?.publishedProfiles ?? 0}
              sub="Live public profiles"
              color="#10b981"
            />
            <KpiCard
              icon={ShoppingBag}
              label="Total Orders"
              value={stats?.totalOrders ?? 0}
              sub="Via WhatsApp"
              color="#3b82f6"
            />
            <KpiCard
              icon={TrendingUp}
              label="Revenue"
              value={`${(stats?.totalRevenue ?? 0).toLocaleString("fr-MA")} MAD`}
              sub="Confirmed orders only"
              color="#f59e0b"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Line Chart — Orders Over Time ── */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-1">
            Orders — Last 30 Days
          </h2>
          <p className="text-xs text-ink/40 mb-6">Daily order volume trend</p>
          {timeLoading ? (
            <ChartSkeleton height={280} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={ordersTime}
                  margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#0f172a", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Summary strip */}
              {(() => {
                const total = ordersTime?.reduce((s, d) => s + d.orders, 0) ?? 0;
                const avg = ordersTime?.length ? (total / ordersTime.length).toFixed(1) : "0";
                const peak = ordersTime?.reduce((max, d) => d.orders > max.orders ? d : max, { orders: 0, date: "" });
                return (
                  <div className="mt-5 pt-4 border-t border-ink/5 grid grid-cols-3 gap-4">
                    {[
                      { label: "Total orders", value: total },
                      { label: "Daily average", value: avg },
                      { label: "Peak day", value: peak?.orders ?? 0, sub: peak?.date ? formatDate(peak.date) : "—" },
                    ].map(({ label, value, sub }) => (
                      <div key={label}>
                        <p className="text-[11px] text-ink/40 font-medium">{label}</p>
                        <p className="text-xl font-bold text-navy tabular-nums mt-0.5">{value}</p>
                        {sub && <p className="text-[11px] text-ink/35 mt-0.5">{sub}</p>}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>

        {/* ── Pie Chart — Product Popularity ── */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm flex flex-col">
          <h2 className="text-base font-bold text-navy mb-1">
            Product Popularity
          </h2>
          <p className="text-xs text-ink/40 mb-4">By number of items ordered</p>

          {popLoading ? (
            <ChartSkeleton height={200} />
          ) : popularity?.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-ink/30 text-sm">
              No orders yet
            </div>
          ) : (
            <>
              {/* Donut */}
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={popularity}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {popularity?.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Clean legend list */}
              <div className="border-t border-ink/5 pt-4 mt-2 flex-1 overflow-y-auto">
                <PieLegend data={popularity} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
