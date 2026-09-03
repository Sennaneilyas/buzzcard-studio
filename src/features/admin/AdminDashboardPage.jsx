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
  Legend,
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

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + "18" }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink/50 font-medium">{label}</p>
        <p className="text-3xl font-bold text-navy mt-0.5 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-ink/40 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-64 bg-ink/[0.02] rounded-xl">
      <Loader2 className="w-6 h-6 text-ink/30 animate-spin" />
    </div>
  );
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-MA", { month: "short", day: "numeric" });
};

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
              className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm h-28 animate-pulse bg-ink/[0.03]"
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
        {/* Line Chart — Orders Over Time */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-1">
            Orders — Last 30 Days
          </h2>
          <p className="text-xs text-ink/40 mb-6">Daily order volume trend</p>
          {timeLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={ordersTime} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
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
          )}
        </div>

        {/* Pie Chart — Product Popularity */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
          <h2 className="text-base font-bold text-navy mb-1">
            Product Popularity
          </h2>
          <p className="text-xs text-ink/40 mb-4">By number of items ordered</p>
          {popLoading ? (
            <ChartSkeleton />
          ) : popularity?.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-ink/30 text-sm">
              No orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={popularity}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
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
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
