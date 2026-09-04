import { useState, useRef } from "react";
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
  X,
  ChevronDown,
  Pencil,
  Plus,
} from "lucide-react";
import {
  useAdminProducts,
  useToggleProductFeatured,
  useToggleProductActive,
  useUpdateProductBadge,
  useUpdateProductStock,
} from "./hooks/useAdminProducts";
import CategoriesPanel from "./components/CategoriesPanel";
import ProductStatsRow from "./components/ProductStatsRow";

// ─── Badge Presets ─────────────────────────────────────────────────────────────
const BADGE_PRESETS = [
  "Best Seller",
  "Nouveau",
  "Pro",
  "Promo",
  "Limited",
  "Exclusif",
];

// ─── Inline Badge Editor ───────────────────────────────────────────────────────
function BadgeEditor({ productId, currentBadge }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [value, setValue] = useState(currentBadge || "");
  const inputRef = useRef(null);
  const { mutate: updateBadge } = useUpdateProductBadge();

  const save = (badge) => {
    updateBadge({ productId, badge: badge || null });
    setIsEditing(false);
    setShowPresets(false);
    setValue(badge || "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") save(value);
    if (e.key === "Escape") {
      setIsEditing(false);
      setValue(currentBadge || "");
    }
  };

  // No badge yet — show "+" button
  if (!currentBadge && !isEditing) {
    return (
      <button
        onClick={() => {
          setIsEditing(true);
          setShowPresets(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="inline-flex items-center gap-0.5 text-[10px] text-ink/25 hover:text-ink/50 transition-colors"
        title="Add badge"
      >
        <Plus className="w-3 h-3" />
        Badge
      </button>
    );
  }

  // Editing mode
  if (isEditing) {
    return (
      <div className="relative">
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // Delay to allow preset click
              setTimeout(() => {
                if (!showPresets) save(value);
              }, 150);
            }}
            placeholder="Type badge..."
            className="w-24 px-2 py-0.5 text-[10px] font-bold rounded-full border border-navy/30 bg-white focus:outline-none focus:ring-1 focus:ring-navy/20"
            autoFocus
          />
          <button
            onClick={() => setShowPresets((v) => !v)}
            className="text-ink/30 hover:text-ink/60 transition-colors"
            title="Presets"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Presets dropdown */}
        {showPresets && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPresets(false)}
            />
            <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-ink/10 rounded-xl shadow-lg overflow-hidden w-32">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => save(preset)}
                  className="w-full text-left px-3 py-1.5 text-[11px] font-medium text-ink/70 hover:bg-ink/5 transition-colors"
                >
                  {preset}
                </button>
              ))}
              {currentBadge && (
                <button
                  onClick={() => save(null)}
                  className="w-full text-left px-3 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-50 transition-colors border-t border-ink/5"
                >
                  Remove badge
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Display mode — click to edit
  return (
    <button
      onClick={() => {
        setIsEditing(true);
        setValue(currentBadge || "");
        setTimeout(() => inputRef.current?.focus(), 50);
      }}
      className="group/badge inline-flex items-center gap-1 shrink-0 text-[10px] font-bold px-2 py-0.5 bg-mint/20 text-ink/60 rounded-full hover:bg-mint/30 transition-colors"
      title="Click to edit badge"
    >
      {currentBadge}
      <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
    </button>
  );
}

// ─── Inline Stock Editor ───────────────────────────────────────────────────────
function StockEditor({ productId, currentStock }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(currentStock ?? 0));
  const { mutate: updateStock } = useUpdateProductStock();

  const isOutOfStock = (currentStock ?? 0) === 0;

  const save = () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0) {
      updateStock({ productId, stockCount: n });
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            setIsEditing(false);
            setValue(String(currentStock ?? 0));
          }
        }}
        onBlur={save}
        className="w-16 px-1.5 py-0.5 text-[10px] font-semibold rounded-full border border-navy/30 bg-white text-center focus:outline-none focus:ring-1 focus:ring-navy/20 tabular-nums"
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => {
        setIsEditing(true);
        setValue(String(currentStock ?? 0));
      }}
      className={`group/stock inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-colors ${
        isOutOfStock
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
      }`}
      title="Click to edit stock"
    >
      {isOutOfStock ? "Rupture" : `${currentStock} en stock`}
      <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/stock:opacity-100 transition-opacity" />
    </button>
  );
}

// ─── Product Row ───────────────────────────────────────────────────────────────
function AdminProductCard({ product }) {
  const { mutate: toggleFeatured, isPending: featPending } = useToggleProductFeatured();
  const { mutate: toggleActive, isPending: activePending } = useToggleProductActive();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`group flex items-center gap-4 p-3 pr-4 rounded-xl border transition-all duration-200 ${
        product.isActive
          ? "bg-white border-ink/6 hover:border-ink/12 hover:shadow-sm"
          : "bg-ink/[0.015] border-ink/4 opacity-50"
      }`}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-cloud shrink-0 relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-4 h-4 text-ink/15" />
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
            <Star className="w-2 h-2 text-white" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-semibold text-[13px] text-navy truncate">
            {product.name}
          </p>
          <BadgeEditor productId={product.id} currentBadge={product.badge} />
        </div>
        <p className="text-[11px] text-ink/35 mt-0.5 truncate">
          {product.description}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[11px] font-bold text-navy tabular-nums">
            {product.basePrice} MAD
          </span>
          <StockEditor
            productId={product.id}
            currentStock={product.stockCount}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Featured star */}
        <button
          onClick={() =>
            toggleFeatured({
              productId: product.id,
              isFeatured: !product.isFeatured,
            })
          }
          disabled={featPending}
          title={product.isFeatured ? "Retirer du haut" : "Épingler en haut"}
          className={`transition-all duration-200 disabled:opacity-40 ${
            product.isFeatured
              ? "text-amber-400 scale-110"
              : "text-ink/15 hover:text-amber-300"
          }`}
        >
          <Star
            className="w-4 h-4"
            fill={product.isFeatured ? "currentColor" : "none"}
          />
        </button>

        {/* Visibility */}
        <button
          onClick={() =>
            toggleActive({
              productId: product.id,
              isActive: !product.isActive,
            })
          }
          disabled={activePending}
          title={product.isActive ? "Masquer" : "Afficher"}
          className={`transition-colors duration-200 disabled:opacity-40 ${
            product.isActive
              ? "text-ink/25 hover:text-ink/60"
              : "text-ink/15 hover:text-emerald-500"
          }`}
        >
          {product.isActive ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
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

  const visibleProducts = allProducts.filter((p) => {
    const matchesCategory =
      selectedCategorySlug === "all" || p.category === selectedCategorySlug;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      `${p.name} ${p.description} ${p.badge ?? ""}`
        .toLowerCase()
        .includes(q);
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...visibleProducts].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return 0;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Products</h1>
        <p className="text-sm text-ink/40 mt-0.5">
          Manage your catalogue — badges, stock, visibility, and display order.
        </p>
      </div>

      {/* Stats */}
      <ProductStatsRow products={allProducts} />

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-5 items-start">
        {/* Categories */}
        <CategoriesPanel
          selectedSlug={selectedCategorySlug}
          onSelect={setSelectedCategorySlug}
          products={allProducts}
        />

        {/* Products Panel */}
        <div className="bg-white rounded-xl border border-ink/5 shadow-sm overflow-hidden">
          {/* Search */}
          <div className="px-5 py-4 border-b border-ink/5">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="w-3.5 h-3.5 text-ink/25 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-ink/[0.02] border border-ink/6 rounded-lg placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy/15 transition-all"
                />
              </div>
              <span className="text-[11px] text-ink/30 whitespace-nowrap shrink-0 tabular-nums">
                {sortedProducts.length} result{sortedProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
            {selectedCategorySlug !== "all" && (
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-ink/35">
                <Tag className="w-3 h-3" />
                <span>{selectedCategorySlug}</span>
                <ChevronRight className="w-3 h-3 opacity-40" />
                <span className="text-navy font-medium">
                  {sortedProducts.length} products
                </span>
              </div>
            )}
          </div>

          {/* Products List */}
          <div className="p-3 space-y-1.5 max-h-[calc(100vh-300px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-5 h-5 text-ink/25 animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-11 h-11 rounded-xl bg-ink/[0.03] flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-ink/15" />
                    </div>
                    <p className="text-sm font-medium text-ink/35">
                      No products found
                    </p>
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
