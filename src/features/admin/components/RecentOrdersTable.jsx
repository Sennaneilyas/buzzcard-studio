import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "short",
  });
}

/**
 * RecentOrdersTable
 * Mini table showing the 5 most recent orders, embedded on the dashboard.
 *
 * Props:
 *  - orders (array): full orders list (will be sliced to 5)
 *  - isLoading (boolean)
 *  - compact (boolean): tighter padding when embedded inside a card
 */
export default function RecentOrdersTable({ orders = [], isLoading, compact = false, onRowClick }) {
  const navigate = useNavigate();
  const recent = orders.slice(0, 5);

  const px       = compact ? "px-4"   : "px-5";
  const pyHeader = compact ? "py-2.5" : "py-4";
  const pyTh     = compact ? "py-1.5" : "py-2.5";
  const pyTd     = compact ? "py-1.5" : "py-3";


  return (
    <div className={compact ? "overflow-hidden" : "bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden"}>
      {/* Header */}
      <div className={`${px} ${pyHeader} flex items-center justify-between border-b border-ink/5`}>
        <h3 className="text-sm font-bold text-navy">Recent Orders</h3>
        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-1 text-xs font-medium text-ink/40 hover:text-navy transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-ink/[0.03] animate-pulse" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="py-12 text-center text-ink/30 text-sm">
          No orders yet
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/5 bg-ink/[0.015]">
              {["Customer", "Date", "Status", "Total"].map((h) => (
                <th
                  key={h}
                  className={`text-left ${px} ${pyTh} text-[10px] font-semibold text-ink/35 uppercase tracking-wider`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {recent.map((order) => (
              <tr
                key={order.id}
                onClick={() => onRowClick?.(order)}
                className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-ink/[0.02]" : "hover:bg-ink/[0.01]"}`}
              >
                <td className={`${px} ${pyTd}`}>
                  <p className="font-medium text-navy text-xs truncate max-w-[140px]">
                    {order.customer_name || "—"}
                  </p>
                </td>
                <td className={`${px} ${pyTd} text-xs text-ink/45`}>
                  {formatDate(order.created_at)}
                </td>
                <td className={`${px} ${pyTd}`}>
                  <StatusBadge status={order.status} />
                </td>
                <td className={`${px} ${pyTd} text-xs font-bold text-navy tabular-nums`}>
                  {Number(order.total_amount || 0).toLocaleString("fr-MA")} MAD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
