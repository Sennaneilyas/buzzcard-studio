import { useState, useRef } from "react";
import {
  Loader2,
  GripVertical,
  Star,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import {
  useAdminProducts,
  useAdminCategories,
  useToggleProductFeatured,
  useToggleProductActive,
  useToggleCategoryActive,
  useSaveCategoryPositions,
} from "./hooks/useAdminProducts";

// ── Toggle Switch ─────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 ${
        checked ? "bg-navy" : "bg-ink/20"
      } disabled:opacity-50`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Category Row ───────────────────────────────────────────────
function CategoryRow({ cat, onDragStart, onDragOver, onDrop, isDraggingOver }) {
  const { mutate: toggleActive, isPending } = useToggleCategoryActive();

  return (
    <div
      draggable
      onDragStart={() => onDragStart(cat.id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(cat.id); }}
      onDrop={() => onDrop(cat.id)}
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
        isDraggingOver
          ? "border-navy/40 bg-navy/5 scale-[1.01]"
          : "border-ink/8 hover:border-ink/15"
      }`}
    >
      <GripVertical className="w-4 h-4 text-ink/25 shrink-0" />
      <Tag className="w-4 h-4 text-ink/40 shrink-0" />
      <span className="flex-1 font-medium text-sm text-navy truncate">
        {cat.name}
      </span>
      <span className="text-xs text-ink/35 font-mono">pos {cat.position}</span>
      <Toggle
        checked={cat.is_active}
        onChange={(val) =>
          toggleActive({ categoryId: cat.id, isActive: val })
        }
        disabled={isPending}
      />
    </div>
  );
}

// ── Product Row ────────────────────────────────────────────────
function ProductRow({ product }) {
  const { mutate: toggleFeatured, isPending: featPending } =
    useToggleProductFeatured();
  const { mutate: toggleActive, isPending: activePending } =
    useToggleProductActive();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-ink/8 hover:border-ink/15 transition-all">
      {/* Image */}
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink/5 shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/20">
            <Tag className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-navy truncate">{product.name}</p>
        <p className="text-xs text-ink/40 mt-0.5">
          {product.categoryName} · {product.basePrice} MAD
        </p>
      </div>

      {/* Stock badge */}
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          product.stockCount > 0
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        {product.stockCount > 0 ? `${product.stockCount} in stock` : "Out"}
      </span>

      {/* Featured toggle */}
      <button
        onClick={() =>
          toggleFeatured({ productId: product.id, isFeatured: !product.isFeatured })
        }
        disabled={featPending}
        title={product.isFeatured ? "Unpin from top" : "Pin to top"}
        className={`transition-colors disabled:opacity-50 ${
          product.isFeatured ? "text-amber-500" : "text-ink/20 hover:text-amber-400"
        }`}
      >
        <Star className="w-4 h-4" fill={product.isFeatured ? "currentColor" : "none"} />
      </button>

      {/* Active toggle */}
      <Toggle
        checked={product.isActive}
        onChange={(val) =>
          toggleActive({ productId: product.id, isActive: val })
        }
        disabled={activePending}
      />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { data: products, isLoading: prodLoading } = useAdminProducts();
  const { data: categories, isLoading: catLoading } = useAdminCategories();
  const { mutate: savePositions } = useSaveCategoryPositions();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localCategories, setLocalCategories] = useState(null);
  const dragItem = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  const displayedCategories = localCategories ?? categories ?? [];

  const filteredProducts =
    selectedCategory === "all"
      ? (products ?? [])
      : (products ?? []).filter((p) => p.category === selectedCategory);

  // ── Drag-and-Drop ──
  const handleDragStart = (id) => {
    dragItem.current = id;
  };

  const handleDragOver = (id) => {
    setDragOverId(id);
  };

  const handleDrop = (targetId) => {
    setDragOverId(null);
    if (!dragItem.current || dragItem.current === targetId) return;

    const cats = [...displayedCategories];
    const fromIdx = cats.findIndex((c) => c.id === dragItem.current);
    const toIdx = cats.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    // Reorder
    const [moved] = cats.splice(fromIdx, 1);
    cats.splice(toIdx, 0, moved);

    // Reassign positions
    const updated = cats.map((c, i) => ({ ...c, position: i + 1 }));
    setLocalCategories(updated);

    // Persist to Supabase
    savePositions(updated.map(({ id, position }) => ({ id, position })));
    dragItem.current = null;
  };

  const isLoading = prodLoading || catLoading;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy">Products</h1>
        <p className="text-ink/50 mt-1 text-sm">
          Manage your store catalogue, display order, and visibility.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 text-ink/30 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6 items-start">
          {/* ── Left Panel: Categories ── */}
          <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-ink/5">
              <h2 className="font-bold text-navy text-base">Categories</h2>
              <p className="text-xs text-ink/40 mt-0.5">
                Drag to reorder. Toggle to show/hide.
              </p>
            </div>
            <div className="p-4 space-y-2">
              {displayedCategories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDraggingOver={dragOverId === cat.id}
                />
              ))}
              {displayedCategories.length === 0 && (
                <p className="text-center text-ink/30 text-sm py-8">
                  No categories found
                </p>
              )}
            </div>
          </div>

          {/* ── Right Panel: Products ── */}
          <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-ink/5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold text-navy text-base">Products</h2>
                <p className="text-xs text-ink/40 mt-0.5">
                  ⭐ Pin to feature · Toggle to show/hide.
                </p>
              </div>
              {/* Category filter */}
              <div className="flex items-center gap-1.5 bg-ink/[0.04] rounded-xl p-1 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-white text-navy shadow-sm"
                      : "text-ink/50 hover:text-ink"
                  }`}
                >
                  All
                </button>
                {displayedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-white text-navy shadow-sm"
                        : "text-ink/50 hover:text-ink"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-[640px] overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <p className="text-center text-ink/30 text-sm py-12">
                  No products in this category
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
