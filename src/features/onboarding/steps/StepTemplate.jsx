import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TEMPLATE_CATEGORIES } from "@/config/categories";
import { TEMPLATES, getTemplatesByCategory } from "@/config/templates";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import {
  Check,
  Eye,
  X,
  Sparkles,
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  Palette,
  ShoppingCart,
} from "lucide-react";

function AddToCartButton({ isSelected, onClick }) {
  if (isSelected) {
    return (
      <button
        onClick={onClick}
        className="group relative h-9 w-[120px] bg-mint text-navy rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      >
        <div className="h-full flex items-center justify-between px-3">
          <span className="text-[11px] font-bold tracking-wide">Selected</span>
          <div className="w-[1px] h-3 bg-navy/20" />
          <Check className="w-3.5 h-3.5" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative h-9 w-[120px] bg-[#1a1a1a] text-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-white/5"
    >
      <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-9">
        {/* Default State */}
        <div className="h-9 shrink-0 flex items-center justify-between px-3">
          <span className="text-[11px] font-semibold tracking-wide text-white/90">Add to Cart</span>
          <div className="w-[1px] h-3 bg-white/15" />
          <ShoppingCart className="w-3.5 h-3.5 text-white/90" />
        </div>

        {/* Hover State */}
        <div className="h-9 shrink-0 flex items-center justify-between px-3">
          <div className="relative flex items-center justify-center">
            <ShoppingCart className="w-3.5 h-3.5 text-white/90" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00e676] text-[#0a192f] rounded-full flex items-center justify-center text-[8px] font-bold">
              1
            </span>
          </div>
          <div className="w-[1px] h-3 bg-white/15" />
          <span className="text-[11px] font-semibold tracking-wide text-white/90">Add to Cart</span>
        </div>
      </div>
    </button>
  );
}

/**
 * StepTemplate — Step 1 of the onboarding wizard.
 *
 * Features:
 *   - Category filter pills with animated active state
 *   - Responsive template grid with accent-colored cards
 *   - Click to select, click again to deselect
 *   - Dedicated "Preview" button opens a full-screen modal with scrollable PNG
 *   - Preview modal includes prev/next navigation between templates
 *   - Selection summary with accent color swatch
 */
export default function StepTemplate({ selectedId, onSelect }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewId, setPreviewId] = useState(null);

  const filteredTemplates = useMemo(
    () => getTemplatesByCategory(activeCategory),
    [activeCategory]
  );

  // Toggle select: click same = deselect, click different = select
  const handleSelect = useCallback(
    (id) => {
      onSelect(selectedId === id ? null : id);
    },
    [selectedId, onSelect]
  );

  // Navigate preview prev/next within filtered list
  const previewTemplate = previewId
    ? TEMPLATES.find((t) => t.id === previewId)
    : null;

  const navigatePreview = useCallback(
    (dir) => {
      const list = filteredTemplates;
      const idx = list.findIndex((t) => t.id === previewId);
      if (idx === -1) return;
      const nextIdx =
        dir === "next"
          ? (idx + 1) % list.length
          : (idx - 1 + list.length) % list.length;
      setPreviewId(list[nextIdx].id);
    },
    [filteredTemplates, previewId]
  );

  // Handle Escape key to close preview modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && previewId) {
        setPreviewId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewId]);

  return (
    <>
      <div className="w-full space-y-4">
        {/* ── Header row: Category pills + count ── */}
        <div className="flex w-full bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05] overflow-x-auto custom-scrollbar">
          <div className="flex w-full gap-1.5 min-w-max sm:min-w-0">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? TEMPLATES.length
                  : TEMPLATES.filter((t) => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-xl transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "text-navy"
                      : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="category-pill-bg"
                      className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_10px_rgba(255,255,255,0.15)]"
                      transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{cat.label}</span>
                  <span
                    className={cn(
                      "relative z-10 text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-0.5",
                      isActive
                        ? "bg-navy/10 text-navy"
                        : "bg-white/10 text-white/50"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Template Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => {
              const isSelected = selectedId === template.id;

              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="relative group"
                >
                  {/* Card container */}
                  <div
                    className={cn(
                      "relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer",
                      "border-2",
                      isSelected
                        ? "border-mint shadow-[0_0_20px_rgba(0,230,118,0.15)] scale-[1.02]"
                        : "border-white/[0.06] hover:border-white/[0.15] hover:shadow-lg"
                    )}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative aspect-[3/4.5] overflow-hidden"
                      onClick={() => handleSelect(template.id)}
                    >
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                      />

                      {/* Gradient overlay — always visible at bottom for text */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                      {/* Hover overlay with actions */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center gap-2 transition-opacity duration-200",
                          "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        {/* Preview button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewId(template.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold hover:bg-white/30 transition-colors border border-white/10"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>

                        {/* Select/Deselect button */}
                        <AddToCartButton
                          isSelected={isSelected}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(template.id);
                          }}
                        />
                      </div>

                      {/* Selected checkmark badge */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-mint flex items-center justify-center shadow-lg ring-2 ring-white/20"
                          >
                            <Check
                              className="w-4 h-4 text-navy"
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom info bar */}
                    <div
                      className={cn(
                        "px-3 py-2.5 flex items-center gap-2 transition-colors duration-200",
                        isSelected ? "bg-mint/[0.08]" : "bg-white/[0.03]"
                      )}
                    >
                      {/* Accent color swatch */}
                      <div
                        className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/10"
                        style={{ backgroundColor: template.theme.accent }}
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-[11px] font-bold truncate leading-tight",
                            isSelected ? "text-mint" : "text-white/70"
                          )}
                        >
                          {template.name}
                        </p>
                        <p className="text-[9px] text-white/30 capitalize leading-tight">
                          {template.category} • {template.layoutType.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PREVIEW MODAL — Full-screen scrollable template
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {previewId && previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setPreviewId(null)}
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50" 
            />

            {/* Modal container */}
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
              className="relative z-10 flex flex-col h-[95vh] w-full max-w-[460px] shadow-[0_0_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10 rounded-[2rem] overflow-hidden bg-navy"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 bg-navy/90 backdrop-blur-md border-b border-white/5 relative z-20">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-white/10 shrink-0"
                    style={{
                      backgroundColor: previewTemplate.theme.accent,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {previewTemplate.name}
                    </p>
                    <p className="text-[10px] text-white/40 capitalize">
                      {previewTemplate.category} •{" "}
                      {previewTemplate.layoutType.replace("-", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Select in preview */}
                  <AddToCartButton
                    isSelected={selectedId === previewId}
                    onClick={() => handleSelect(previewId)}
                  />
                  {/* Close */}
                  <button
                    onClick={() => setPreviewId(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable preview component instead of image */}
              <div className="flex-1 overflow-y-auto bg-gray-100 custom-scrollbar relative py-8 px-4 flex justify-center">
                <TemplateRenderer templateId={previewId} compact={false} />
              </div>

              {/* Modal footer with nav */}
              <div className="flex items-center justify-between px-6 py-4 bg-navy/90 backdrop-blur-md border-t border-white/5 relative z-20">
                <button
                  onClick={() => navigatePreview("prev")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Color palette preview */}
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3 h-3 text-white/30" />
                  <div
                    className="w-4 h-4 rounded-full ring-1 ring-white/20"
                    style={{
                      backgroundColor: previewTemplate.theme.bgPrimary,
                    }}
                    title="Background"
                  />
                  <div
                    className="w-4 h-4 rounded-full ring-1 ring-white/20"
                    style={{
                      backgroundColor: previewTemplate.theme.accent,
                    }}
                    title="Accent"
                  />
                  <div
                    className="w-4 h-4 rounded-full ring-1 ring-white/20"
                    style={{
                      backgroundColor: previewTemplate.theme.textPrimary,
                    }}
                    title="Text"
                  />
                </div>

                <button
                  onClick={() => navigatePreview("next")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
