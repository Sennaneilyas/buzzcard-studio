import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTemplatesByCategory } from "@/config/templates";
import { prefetchTemplate } from "@/lib/prefetch";
import { Check, Eye, X, Filter, Crown } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { PhoneMockupFrame } from "@/components/ui/phone-mockups-1-utils/phone-carousel";

const TEMPLATE_PREVIEW_WIDTH = 390;

function ResponsiveTemplatePreview({ template }) {
  const viewportRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const updateViewportSize = () => {
      const nextSize = {
        width: Math.round(viewport.clientWidth),
        height: Math.round(viewport.clientHeight),
      };

      setViewportSize((currentSize) => (
        currentSize.width === nextSize.width && currentSize.height === nextSize.height
          ? currentSize
          : nextSize
      ));
    };

    updateViewportSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateViewportSize);
      return () => window.removeEventListener("resize", updateViewportSize);
    }

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);

  const scale = viewportSize.width > 0
    ? viewportSize.width / TEMPLATE_PREVIEW_WIDTH
    : 1;
  const iframeHeight = viewportSize.height > 0
    ? viewportSize.height / scale
    : 0;

  return (
    <div ref={viewportRef} className="size-full overflow-hidden bg-white">
      {template.previewUrl ? (
        <iframe
          src={template.previewUrl}
          className="block max-w-none border-0 bg-white"
          style={{
            width: `${TEMPLATE_PREVIEW_WIDTH}px`,
            height: `${iframeHeight}px`,
            opacity: viewportSize.width > 0 ? 1 : 0,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          title={template.name}
        />
      ) : (
        <img
          src={template.thumbnail}
          alt={template.name}
          className="block size-full object-cover object-top"
        />
      )}
    </div>
  );
}

export default function StepTemplate({ selectedId, onSelect }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const [page, setPage] = useState(0);
  const itemsPerPage = 8; // Full gallery view

  const filteredTemplates = useMemo(() => {
    return getTemplatesByCategory(activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="w-full space-y-8 flex flex-col h-full">

      {/* ── Top Bar: Filter ── */}
      <div className="flex items-center justify-end">
        <div className="w-full sm:w-auto">
          <Select value={activeCategory} onValueChange={(v) => { setActiveCategory(v); setPage(0); }}>
            <SelectTrigger icon={Filter} placeholder="Filter by category" variant="bordered" className="w-full sm:w-[220px]" />
            <SelectContent>
              <SelectItem index={0} value="all">All Templates</SelectItem>
              <SelectItem index={1} value="premium">Premium Flagships</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Template Gallery Grid ── */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10 w-full">
        {paginatedTemplates.map((template, index) => {
          const isSelected = selectedId === template.id;

          return (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onMouseEnter={() => prefetchTemplate(template.id)}
              onClick={() => onSelect(isSelected ? null : template.id)}
              className={cn(
                "relative rounded-2xl cursor-pointer transition-all duration-300 flex flex-col group border-2",
                isSelected
                  ? "bg-white border-gray-900 shadow-lg"
                  : "bg-white border-gray-200 shadow-sm hover:border-gray-400 hover:shadow-md"
              )}
            >
              <div className={cn(
                "flex flex-col w-full h-full overflow-hidden transition-all duration-300 relative",
                isSelected ? "rounded-xl" : "rounded-2xl"
              )}>
                {/* Template Thumbnail */}
                <div className="w-full aspect-[9/16] relative bg-gray-100 rounded-t-xl overflow-hidden">
                {template.isPremium && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                    <Crown className="w-3.5 h-3.5 text-white drop-shadow-md" strokeWidth={2} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md">Premium</span>
                  </div>
                )}

                {/* Apple-Style Animated Success Badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      className="absolute right-3 top-3 z-30 w-8 h-8 rounded-full bg-ink flex items-center justify-center shadow-lg border-2 border-white"
                    >
                      <svg viewBox="0 0 52 52" className="w-5 h-5 text-white">
                        <motion.path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 27l8 8 16-16"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    isSelected ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                  )}
                  style={{ backgroundColor: `${template.theme.accent}30` }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent onClick
                      setPreviewTemplate(template);
                    }}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl hover:scale-110 transition-transform"
                  >
                    <Eye 
                      className="w-6 h-6" 
                      style={{ color: template.theme.accent === "#FFFFFF" ? "#111827" : template.theme.accent }} 
                    />
                  </button>
                </div>
              </div>

              {/* Template Name Bar */}
              <div className="px-3 py-2.5 flex flex-col items-center justify-center gap-1 bg-white relative z-10 border-t border-gray-100 rounded-b-2xl transition-colors group-hover:bg-gray-50">
                <p className="text-[14px] font-serif italic font-bold text-navy/90 truncate tracking-wide">
                  {template.name}
                </p>
              </div>
            </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-4 shrink-0">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-xl font-bold text-sm text-gray-700 disabled:opacity-30 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
          >
            Previous
          </button>
          
          <span className="text-sm font-bold text-navy/60">
            {page + 1} / {totalPages}
          </span>
          
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-xl font-bold text-sm text-gray-700 disabled:opacity-30 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      )}

      {/* ── Full Screen Preview Modal ── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {previewTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setPreviewTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full h-full max-w-lg flex flex-col items-center justify-center pointer-events-none"
              >
                {/* Floating Close Button */}
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="absolute -top-4 sm:top-4 right-0 sm:-right-16 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors pointer-events-auto backdrop-blur-md"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Scrollable template inside the shared iPhone frame */}
                <div className="relative flex w-full flex-col items-center">
                  <PhoneMockupFrame
                    className="pointer-events-auto w-[min(82vw,37dvh,360px)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ResponsiveTemplatePreview template={previewTemplate} />
                  </PhoneMockupFrame>

                  {/* Floating Select Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                    className="absolute bottom-0 translate-y-1/2 px-6 py-3 text-sm font-semibold text-white bg-slate-900/80 hover:bg-black backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 pointer-events-auto z-10"
                  >
                    <Check className="w-5 h-5" />
                    Sélectionner
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
