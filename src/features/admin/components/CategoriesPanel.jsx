import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Layers, Package, Tag } from "lucide-react";
import {
  useAdminCategories,
  useToggleCategoryActive,
  useSaveCategoryPositions,
} from "../hooks/useAdminProducts";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
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

// ─── Single Category Row ───────────────────────────────────────────────────────
function CategoryRow({
  cat,
  isSelected,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
  productCount,
}) {
  const { mutate: toggleActive, isPending } = useToggleCategoryActive();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -6 }}
      transition={{ duration: 0.15 }}
      draggable
      onDragStart={() => onDragStart(cat.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(cat.id);
      }}
      onDrop={() => onDrop(cat.id)}
      onClick={() => onSelect(cat.slug)}
      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
        isDragTarget
          ? "border-navy/40 bg-navy/5 scale-[1.02] shadow-md"
          : isSelected
          ? "border-navy/20 bg-navy text-white shadow-md"
          : `border-transparent hover:border-ink/8 hover:bg-ink/[0.04] ${
              cat.is_active ? "text-ink/70" : "text-ink/30"
            }`
      }`}
    >
      {/* Drag handle */}
      <GripVertical
        className={`w-3.5 h-3.5 shrink-0 cursor-grab active:cursor-grabbing transition-opacity ${
          isSelected
            ? "opacity-50 text-white"
            : "opacity-0 group-hover:opacity-100 text-ink/30"
        }`}
      />

      {/* Category icon */}
      <Tag
        className={`w-3.5 h-3.5 shrink-0 ${
          isSelected ? "text-white/70" : "text-ink/25"
        }`}
      />

      {/* Name */}
      <span
        className={`flex-1 text-sm font-medium truncate ${
          !cat.is_active && !isSelected ? "line-through opacity-50" : ""
        }`}
      >
        {cat.name}
      </span>

      {/* Product count badge */}
      {productCount !== undefined && (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
            isSelected
              ? "bg-white/20 text-white"
              : "bg-ink/8 text-ink/40"
          }`}
        >
          {productCount}
        </span>
      )}

      {/* Active toggle — stops click propagation so it doesn't also select the category */}
      <div onClick={(e) => e.stopPropagation()}>
        <Toggle
          checked={cat.is_active}
          onChange={(val) =>
            toggleActive({ categoryId: cat.id, isActive: val })
          }
          disabled={isPending}
        />
      </div>
    </motion.div>
  );
}

// ─── Categories Panel ──────────────────────────────────────────────────────────
/**
 * Displays all product categories in a draggable, toggleable list.
 * Handles its own drag-and-drop reorder logic and persists positions to Supabase.
 *
 * Props:
 *  - selectedSlug (string): currently selected category slug ("all" or a category slug)
 *  - onSelect (fn): called with the slug when the user clicks a category
 *  - products (array): full product list, used to count products per category
 */
export default function CategoriesPanel({ selectedSlug, onSelect, products = [] }) {
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: savePositions } = useSaveCategoryPositions();

  // Local state for optimistic drag-and-drop reorder
  const [localCategories, setLocalCategories] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragItem = useRef(null);

  const displayedCategories = localCategories ?? categories ?? [];

  // Helper: count products per category slug
  const countFor = (slug) =>
    products.filter((p) => p.category === slug).length;

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (id) => {
    dragItem.current = id;
  };

  const handleDragOver = (id) => {
    setDragOverId(id);
  };

  const handleDrop = (targetId) => {
    setDragOverId(null);
    if (!dragItem.current || dragItem.current === targetId) return;
    if (displayedCategories.length <= 1) return; // Nothing to reorder

    const cats = [...displayedCategories];
    const fromIdx = cats.findIndex((c) => c.id === dragItem.current);
    const toIdx = cats.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    // Reorder in place
    const [moved] = cats.splice(fromIdx, 1);
    cats.splice(toIdx, 0, moved);

    // Reassign positions (1-based)
    const updated = cats.map((c, i) => ({ ...c, position: i + 1 }));
    setLocalCategories(updated);

    // Persist to Supabase
    savePositions(updated.map(({ id, position }) => ({ id, position })));
    dragItem.current = null;
  };

  return (
    <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden sticky top-6">
      {/* Header */}
      <div className="px-4 py-4 border-b border-ink/5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-ink/30 shrink-0" />
          <h2 className="font-bold text-navy text-sm">Categories</h2>
          <span className="ml-auto text-[10px] font-semibold text-ink/30 bg-ink/[0.04] px-2 py-0.5 rounded-full">
            {displayedCategories.length}
          </span>
        </div>
        <p className="text-[11px] text-ink/35 mt-1.5 leading-snug">
          Drag rows to reorder · toggle to show / hide
        </p>
      </div>

      {/* List */}
      <div className="p-3 space-y-1">
        {/* "All products" shortcut */}
        <button
          onClick={() => onSelect("all")}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            selectedSlug === "all"
              ? "bg-navy text-white shadow-md"
              : "text-ink/60 hover:bg-ink/5"
          }`}
        >
          <Package className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">All products</span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              selectedSlug === "all"
                ? "bg-white/20 text-white"
                : "bg-ink/8 text-ink/40"
            }`}
          >
            {products.length}
          </span>
        </button>

        <div className="border-t border-ink/5 pt-1">
          {isLoading ? (
            <div className="space-y-1.5 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-xl bg-ink/[0.04] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedCategories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  isSelected={selectedSlug === cat.slug}
                  onSelect={onSelect}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragTarget={dragOverId === cat.id}
                  productCount={countFor(cat.slug)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-ink/5 bg-ink/[0.01]">
        <p className="text-[10px] text-ink/25 leading-snug">
          Changes to position and visibility are saved automatically.
        </p>
      </div>
    </div>
  );
}
