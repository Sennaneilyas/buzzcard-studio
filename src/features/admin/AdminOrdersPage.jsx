import { useState } from "react";
import { Loader2, ChevronDown, MessageCircle, ShoppingBag } from "lucide-react";
import { useAdminOrders, useUpdateOrderStatus } from "./hooks/useAdminOrders";

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

const ALL_STATUSES = ["pending", "paid", "shipped", "cancelled"];
const FILTERS = ["all", ...ALL_STATUSES];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function StatusDropdown({ orderId, currentStatus, onUpdate, isUpdating }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isUpdating}
        className="flex items-center gap-1.5 text-xs font-medium text-ink/60 hover:text-navy transition-colors disabled:opacity-50"
      >
        {isUpdating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
        Change
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-ink/10 rounded-xl shadow-lg overflow-hidden w-36">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onUpdate(orderId, s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-ink/5 ${
                  s === currentStatus ? "text-navy font-bold" : "text-ink/70"
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? (orders ?? [])
      : (orders ?? []).filter((o) => o.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-navy">Orders</h1>
          <p className="text-ink/50 mt-1 text-sm">
            Manage and process WhatsApp-confirmed orders.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-ink/[0.04] rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? "bg-white text-navy shadow-sm"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-ink/30 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-ink/40">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/5 bg-ink/[0.02]">
                  {["Customer", "Items", "Total", "Status", "Date", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-ink/[0.015] transition-colors"
                  >
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy">
                        {order.customer_name || "—"}
                      </p>
                      <p className="text-xs text-ink/40 mt-0.5">
                        {order.customer_email || order.customer_phone || "—"}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4 max-w-[220px]">
                      <div className="space-y-0.5">
                        {(order.order_items ?? []).slice(0, 2).map((item) => (
                          <p key={item.id} className="text-ink/70 truncate">
                            {item.quantity}× {item.product_name}
                            {item.variant_name ? ` (${item.variant_name})` : ""}
                          </p>
                        ))}
                        {(order.order_items?.length ?? 0) > 2 && (
                          <p className="text-xs text-ink/40">
                            +{order.order_items.length - 2} more
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-navy tabular-nums">
                        {Number(order.total_amount || 0).toLocaleString("fr-MA")} MAD
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-ink/50">
                      {formatDate(order.created_at)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <StatusDropdown
                          orderId={order.id}
                          currentStatus={order.status}
                          onUpdate={(id, status) =>
                            updateStatus({ orderId: id, status })
                          }
                          isUpdating={isUpdating}
                        />
                        {order.customer_phone && (
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Contact on WhatsApp"
                            className="text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
