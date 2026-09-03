import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Star,
  Eye,
  EyeOff,
  Search,
  Package,
  Tag,
  ChevronRight,
} from "lucide-react";
import {
  useAdminProducts,
  useToggleProductFeatured,
  useToggleProductActive,
} from "./hooks/useAdminProducts";
import CategoriesPanel from "./components/CategoriesPanel";
import ProductStatsRow from "./components/ProductStatsRow";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:ring-offset-1 ${
        checked ? "bg-navy" : "bg-ink/15"
      } disabled:opacity-40`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function AdminProductCard({ product }) {
  const { mutate: toggleFeatured, isPending: featPending } = useToggleProductFeatured();
  const { mutate: toggleActive, isPending: activePending } = useToggleProductActive();

  const isOutOfStock = product.stockCount === 0 || product.stock === "out_of_stock";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={`group flex items-center gap-4 p-3 pr-4 rounded-2xl border transition-all duration-200 ${
        product.isActive
          ? "bg-white border-ink/8 hover:border-ink/15 hover:shadow-sm"
          : "bg-ink/[0.015] border-ink/5 opacity-55"
      }`}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-cloud shrink-0 relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-5 h-5 text-ink/20" />
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow">
            <Star className="w-2.5 h-2.5 text-white" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-semibold text-sm text-navy truncate">{product.name}</p>
          {product.badge && (
            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-mint/20 text-ink/60 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-ink/40 mt-0.5 truncate">{product.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs font-bold text-navy tabular-nums">
            {product.basePrice} MAD
          </span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            isOutOfStock ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
          }`}>
            {isOutOfStock ? "Rupture" : `${product.stockCount} en stock`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => toggleFeatured({ productId: product.id, isFeatured: !product.isFeatured })}
          disabled={featPending}
          title={product.isFeatured ? "Retirer du haut" : "Épingler en haut"}
          className={`transition-all duration-200 disabled:opacity-40 ${
            product.isFeatured
              ? "text-amber-400 scale-110"
              : "text-ink/20 hover:text-amber-300"
          }`}
        >
          <Star className="w-4 h-4" fill={product.isFeatured ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => toggleActive({ productId: product.id, isActive: !product.isActive })}
          disabled={activePending}
          title={product.isActive ? "Masquer" : "Afficher"}
          className={`transition-colors duration-200 disabled:opacity-40 ${
            product.isActive
              ? "text-ink/30 hover:text-ink/60"
              : "text-ink/20 hover:text-emerald-500"
          }`}
        >
          {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allProducts = products ?? [];

  // Filter by category + search
  const visibleProducts = allProducts.filter((p) => {
    const matchesCategory =
      selectedCategorySlug === "all" || p.category === selectedCategorySlug;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q || `${p.name} ${p.description} ${p.badge ?? ""}`.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Featured products always sort to top
  const sortedProducts = [...visibleProducts].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return 0;
  });

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy">Products</h1>
        <p className="text-sm text-ink/40 mt-1">
          Manage your store catalogue, visibility, and display order.
        </p>
      </div>

      {/* ── Quick Stats ── */}
      <ProductStatsRow products={allProducts} />

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-5 items-start">

        {/* Left — Categories (own component) */}
        <CategoriesPanel
          selectedSlug={selectedCategorySlug}
          onSelect={setSelectedCategorySlug}
          products={allProducts}
        />

        {/* Right — Products Panel */}
        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
          {/* Search + meta */}
          <div className="px-5 py-4 border-b border-ink/5">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="w-3.5 h-3.5 text-ink/30 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-ink/[0.03] border border-ink/8 rounded-xl placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/20 transition-all"
                />
              </div>
              <span className="text-xs text-ink/35 whitespace-nowrap shrink-0">
                {sortedProducts.length} result{sortedProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
            {selectedCategorySlug !== "all" && (
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-ink/40">
                <Tag className="w-3 h-3" />
                <span>{selectedCategorySlug}</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
                <span className="text-navy font-medium">{sortedProducts.length} products</span>
              </div>
            )}
          </div>

          {/* Products List */}
          <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-5 h-5 text-ink/30 animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-ink/[0.04] flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-ink/20" />
                    </div>
                    <p className="text-sm font-medium text-ink/40">No products found</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-xs text-navy hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </motion.div>
                ) : (
                  sortedProducts.map((product) => (
                    <AdminProductCard key={product.id} product={product} />
                  ))
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
