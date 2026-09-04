import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2 as BarChartIcon,
  LineChart as LineChartIcon,
  Sparkles,
} from "lucide-react";
import {
  useAdminStats,
  useOrdersOverTime,
  useProductPopularity,
} from "./hooks/useAdminAnalytics";
import { useAdminOrders } from "./hooks/useAdminOrders";
import TimePeriodSelector from "./components/TimePeriodSelector";
import RecentOrdersTable from "./components/RecentOrdersTable";

const PIE_COLORS = [
  "#0f172a",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function calcChange(current, previous) {
  if (!previous || previous === 0) return null;
  return (((current - previous) / previous) * 100).toFixed(1);
}

function formatCompact(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-MA", {
    month: "short",
    day: "numeric",
  });

// ─── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  prevValue,
  prefix = "",
  suffix = "",
  color,
}) {
  const change = calcChange(value, prevValue);
  const isPositive = change !== null && parseFloat(change) >= 0;
  const displayValue = prefix + formatCompact(value) + suffix;

  return (
    <div className="bg-white rounded-xl p-5 border border-ink/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
      <Icon
        className="absolute top-4 right-4 w-5 h-5 opacity-15"
        style={{ color }}
      />
      <p className="text-xs text-ink/45 font-medium mb-1">{label}</p>
      <div className="flex items-baseline gap-2.5">
        <p className="text-2xl font-bold text-navy tabular-nums leading-tight">
          {displayValue}
        </p>
        {change !== null && (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-2.5 h-2.5" />
            ) : (
              <ArrowDownRight className="w-2.5 h-2.5" />
            )}
            {Math.abs(parseFloat(change))}%
          </span>
        )}
      </div>
      {prevValue !== undefined && (
        <p className="text-[10px] text-ink/30 mt-1.5">
          Last period: {prefix}
          {formatCompact(prevValue)}
          {suffix}
        </p>
      )}
    </div>
  );
}

// ─── Chart Skeleton ────────────────────────────────────────────────────────────
function ChartSkeleton({ height = 260 }) {
  return (
    <div
      className="flex items-center justify-center bg-ink/[0.02] rounded-xl"
      style={{ height }}
    >
      <Loader2 className="w-5 h-5 text-ink/25 animate-spin" />
    </div>
  );
}

// ─── Tooltips ──────────────────────────────────────────────────────────────────
const CustomCursor = (props) => {
  const { x, y, width, height } = props;
  return (
    <line
      x1={x + width / 2}
      y1={y}
      x2={x + width / 2}
      y2={y + height}
      stroke="#EA580C"
      strokeDasharray="4 4"
      strokeWidth={1}
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="relative flex flex-col items-center -translate-y-[calc(100%+8px)] pb-2 pointer-events-none z-10">
      <div className="bg-[#EA580C] text-white text-xs font-bold py-1.5 px-2.5 rounded-lg shadow-sm whitespace-nowrap">
        {Number(payload[0].value).toLocaleString("fr-MA")} MAD
      </div>
      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#EA580C]" />
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


// ─── Interactive SVG Donut (Framer Motion) ────────────────────────────────────
const springConfig = { type: "spring", stiffness: 300, damping: 20 };
const getPieCoords = (percent) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

function InteractiveDonut({ data, totalLabel = "TOTAL", isLoading }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (isLoading) {
    return <ChartSkeleton height={240} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-ink/25 text-sm">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulativePercent = 0;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-2">
        <motion.svg
          viewBox="-1.2 -1.2 2.4 2.4"
          className="-rotate-90 overflow-visible w-full h-full"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: -90, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.1,
          }}
        >
          {data.map((slice) => {
            const slicePercent = slice.value / total;
            const startPercent = cumulativePercent;
            const endPercent = cumulativePercent + slicePercent;
            cumulativePercent = endPercent;

            if (slicePercent === 0) return null;

            const [startX, startY] = getPieCoords(startPercent);
            const [endX, endY] = getPieCoords(endPercent);
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            let pathData;
            if (slicePercent >= 0.999) {
              pathData = `M 1 0 A 1 1 0 0 1 -1 0 A 1 1 0 0 1 1 0`;
            } else {
              pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(" ");
            }

            const isHovered = hoveredSlice === slice.name;
            const isDimmed = hoveredSlice !== null && !isHovered;

            return (
              <motion.path
                key={slice.name}
                d={pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="0.04"
                strokeLinejoin="round"
                animate={{
                  translateX: isHovered ? (startX + endX) * 0.05 : 0,
                  translateY: isHovered ? (startY + endY) * 0.05 : 0,
                  scale: isHovered ? 1.05 : 1,
                  opacity: isDimmed ? 0.3 : 1,
                }}
                transition={springConfig}
                onMouseEnter={() => setHoveredSlice(slice.name)}
                onMouseLeave={() => setHoveredSlice(null)}
                className="cursor-pointer"
              />
            );
          })}

          <motion.circle
            cx="0"
            cy="0"
            r="0.78"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, ...springConfig }}
          />
        </motion.svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="popLayout">
            {hoveredSlice ? (
              <motion.div
                key="hover-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center text-center px-4"
              >
                <span className="text-3xl font-black text-navy leading-none tabular-nums">
                  {data.find((d) => d.name === hoveredSlice)?.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/50 mt-1 truncate max-w-[120px]">
                  {hoveredSlice}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="default-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <span className="text-3xl font-black text-navy leading-none tabular-nums">
                  {total}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mt-1">
                  {totalLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full mt-auto grid grid-cols-2 gap-3 border-t border-ink/5 pt-4">
        {data.map((item) => (
          <motion.div
            key={item.name}
            onMouseEnter={() => setHoveredSlice(item.name)}
            onMouseLeave={() => setHoveredSlice(null)}
            animate={{
              opacity: hoveredSlice && hoveredSlice !== item.name ? 0.4 : 1,
            }}
            className="flex flex-col p-2 rounded-lg hover:bg-ink/[0.02] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] font-semibold text-ink/50 truncate uppercase tracking-wide">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-bold text-navy tabular-nums">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("30d");
  const [chartType, setChartType] = useState("area");

  const { data: stats, isLoading: statsLoading } = useAdminStats(period);
  const { data: ordersTime, isLoading: timeLoading } =
    useOrdersOverTime(period);
  const { data: popularity, isLoading: popLoading } = useProductPopularity();
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();

  // Responsive bar chart X-axis interval
  const xInterval = useMemo(() => {
    const days = parseInt(period, 10) || 30;
    if (days <= 7) return 0; // Show every day
    if (days <= 30) return 4;
    return 29; // Monthly ticks for yearly view
  }, [period]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-navy">Sales Overview</h1>
        <p className="text-ink/40 mt-0.5 text-sm">
          Your BuzzCard business at a glance.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-7">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-ink/5 shadow-sm h-24 animate-pulse"
            />
          ))
        ) : (
          <>
            <KpiCard
              icon={ShoppingBag}
              label="Total Orders"
              value={stats?.totalOrders ?? 0}
              prevValue={stats?.prevOrders}
              color="#3b82f6"
            />
            <KpiCard
              icon={Users}
              label="Total Profiles"
              value={stats?.totalProfiles ?? 0}
              prevValue={stats?.prevProfiles}
              color="#0f172a"
            />
            <KpiCard
              icon={TrendingUp}
              label="Revenue"
              value={stats?.totalRevenue ?? 0}
              prevValue={stats?.prevRevenue}
              suffix=" MAD"
              color="#f59e0b"
            />
            <KpiCard
              icon={CheckCircle2}
              label="Published"
              value={stats?.publishedProfiles ?? 0}
              color="#10b981"
            />
          </>
        )}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-7">
        {/* ── Bar Chart — Revenue Analytics ── */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-ink/5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-navy">Revenue Analytics</h2>
              <p className="text-[11px] text-ink/35 mt-0.5">
                Daily order volume
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-ink/[0.04] p-1 rounded-xl">
                <button
                  onClick={() => setChartType("bar")}
                  className={`p-1.5 rounded-lg transition-all ${
                    chartType === "bar"
                      ? "bg-white shadow-sm text-navy"
                      : "text-ink/40 hover:text-ink/60"
                  }`}
                  title="Bar chart"
                >
                  <BarChartIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType("area")}
                  className={`p-1.5 rounded-lg transition-all ${
                    chartType === "area"
                      ? "bg-white shadow-sm text-navy"
                      : "text-ink/40 hover:text-ink/60"
                  }`}
                  title="Smooth curve chart"
                >
                  <LineChartIcon className="w-4 h-4" />
                </button>
              </div>
              <TimePeriodSelector value={period} onChange={setPeriod} />
            </div>
          </div>
          {timeLoading ? (
            <ChartSkeleton height={240} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                {chartType === "bar" ? (
                    <BarChart
                      data={ordersTime}
                      margin={{ top: 20, right: 0, left: -16, bottom: 0 }}
                    >
                      <defs>
                        <pattern
                          id="stripePattern"
                          patternUnits="userSpaceOnUse"
                          width="8"
                          height="8"
                          patternTransform="rotate(45)"
                        >
                          <rect width="8" height="8" fill="#F97316" />
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="8"
                            stroke="#EA580C"
                            strokeWidth="2"
                          />
                        </pattern>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(val) => {
                          if (period === "7d" || period === "3d") {
                            return new Date(val).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                            });
                          }
                          return new Date(val).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                        tick={{
                          fontSize: 11,
                          fill: "#94a3b8",
                          fontWeight: 500,
                        }}
                        tickLine={false}
                        axisLine={false}
                        interval={xInterval}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={(val) =>
                          val === 0
                            ? "0k"
                            : val >= 1000
                              ? `${(val / 1000).toFixed(0)}k`
                              : val
                        }
                        tick={{
                          fontSize: 11,
                          fill: "#94a3b8",
                          fontWeight: 500,
                        }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        dx={-10}
                      />
                      <Tooltip
                        cursor={<CustomCursor />}
                        content={<CustomTooltip />}
                        isAnimationActive={false}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#stripePattern)"
                        radius={[100, 100, 100, 100]}
                        maxBarSize={32}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart
                      data={ordersTime}
                      margin={{ top: 20, right: 0, left: -16, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F97316"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F97316"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(val) => {
                          if (period === "7d" || period === "3d") {
                            return new Date(val).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                            });
                          }
                          return new Date(val).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                        tick={{
                          fontSize: 11,
                          fill: "#94a3b8",
                          fontWeight: 500,
                        }}
                        tickLine={false}
                        axisLine={false}
                        interval={xInterval}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={(val) =>
                          val === 0
                            ? "0k"
                            : val >= 1000
                              ? `${(val / 1000).toFixed(0)}k`
                              : val
                        }
                        tick={{
                          fontSize: 11,
                          fill: "#94a3b8",
                          fontWeight: 500,
                        }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        dx={-10}
                      />
                      <Tooltip
                        cursor={<CustomCursor />}
                        content={<CustomTooltip />}
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#EA580C"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{
                          r: 6,
                          fill: "#EA580C",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>

              {/* ── Recent Orders (compact, embedded) ── */}
              <div className="mt-5 pt-5 border-t border-ink/5">
                <RecentOrdersTable orders={orders ?? []} isLoading={ordersLoading} compact />
              </div>

              {/* Summary strip */}
              {(() => {
                const totalRevenue =
                  ordersTime?.reduce((s, d) => s + d.revenue, 0) ?? 0;
                const avgRevenue = ordersTime?.length
                  ? (totalRevenue / ordersTime.length).toFixed(0)
                  : "0";
                const peakDay = ordersTime?.reduce(
                  (max, d) => (d.revenue > max.revenue ? d : max),
                  { revenue: 0, date: "" },
                );

                return (
                  <div className="mt-auto pt-6 pb-2 border-t border-ink/5 grid grid-cols-3 gap-8">
                    <div>
                      <p className="text-[11px] text-ink/40 font-medium mb-1">
                          Total Revenue
                        </p>
                        <p className="text-xl font-bold text-navy tabular-nums">
                          {Number(totalRevenue).toLocaleString("fr-MA")}{" "}
                          <span className="text-xs text-ink/40 ml-0.5">
                            MAD
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-ink/40 font-medium mb-1">
                          Avg. Daily Revenue
                        </p>
                        <p className="text-xl font-bold text-navy tabular-nums">
                          {Number(avgRevenue).toLocaleString("fr-MA")}{" "}
                          <span className="text-xs text-ink/40 ml-0.5">
                            MAD
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-ink/40 font-medium mb-1">
                          Peak Day
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-navy tabular-nums">
                            {Number(peakDay?.revenue ?? 0).toLocaleString(
                              "fr-MA",
                            )}{" "}
                            <span className="text-xs text-ink/40 ml-0.5">
                              MAD
                            </span>
                          </p>
                          <p className="text-[10px] font-medium text-[#EA580C] bg-[#EA580C]/10 px-1.5 py-0.5 rounded">
                            {peakDay?.date
                              ? new Date(peakDay.date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" },
                                )
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                );
              })()}
            </>
          )}
        </div>

        {/* ── Right Column — Gauge + Donut ── */}
        <div className="space-y-5">
          {/* Profile Completion Donut */}
          <div className="bg-white rounded-xl p-5 border border-ink/5 shadow-sm">
            <h3 className="text-sm font-bold text-navy mb-5">
              Profile Completion
            </h3>
            <InteractiveDonut
              isLoading={statsLoading}
              totalLabel="TOTAL PROFILES"
              data={[
                {
                  name: "Published",
                  value: stats?.publishedProfiles ?? 0,
                  color: "#10b981",
                },
                {
                  name: "Drafts",
                  value:
                    (stats?.totalProfiles ?? 0) -
                    (stats?.publishedProfiles ?? 0),
                  color: "#f1f5f9",
                },
              ]}
            />
          </div>

          {/* Product Popularity Donut */}
          <div className="bg-white rounded-xl p-5 border border-ink/5 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-navy mb-5">
              Product Popularity
            </h3>
            <InteractiveDonut
              isLoading={popLoading}
              totalLabel="TOTAL SOLD"
              data={
                popularity?.slice(0, 4).map((item, i) => ({
                  name: item.name,
                  value: item.value,
                  color: PIE_COLORS[i % PIE_COLORS.length],
                })) || []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
