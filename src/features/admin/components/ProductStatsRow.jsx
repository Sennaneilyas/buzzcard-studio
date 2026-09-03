import { Eye, Package, Star } from "lucide-react";

/**
 * ProductStatsRow
 * Displays three quick-stat cards for the Products admin page:
 * Total products, Active products, and Featured products.
 *
 * Props:
 *  - products (array): the full admin product list from useAdminProducts()
 */
export default function ProductStatsRow({ products = [] }) {
  const stats = [
    {
      key: "total",
      label: "Total",
      value: products.length,
      icon: Package,
      description: "Products in catalogue",
      color: "text-navy",
      bg: "bg-navy/5",
    },
    {
      key: "active",
      label: "Active",
      value: products.filter((p) => p.isActive).length,
      icon: Eye,
      description: "Visible in store",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      key: "featured",
      label: "Featured",
      value: products.filter((p) => p.isFeatured).length,
      icon: Star,
      description: "Pinned to top",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {stats.map(({ key, label, value, icon: Icon, description, color, bg }) => (
        <div
          key={key}
          className="bg-white rounded-xl px-4 py-3 border border-ink/5 shadow-sm flex items-center gap-3 group hover:shadow-md transition-shadow duration-200 w-44"
        >
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
            <p className="text-xs text-ink/40 truncate">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
