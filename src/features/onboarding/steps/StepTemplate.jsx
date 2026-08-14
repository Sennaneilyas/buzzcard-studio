import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTemplatesByCategory } from "@/config/templates";
import { Check, MousePointerClick, Eye, X, Filter, Crown } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy hidden sm:block">Template Gallery</h2>
        <div className="ml-auto w-full sm:w-auto">
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
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelect(isSelected ? null : template.id)}
              className={cn(
                "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col group",
                isSelected
                  ? "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.8)] border-2 border-mint ring-2 ring-mint/20"
                  : "bg-[#e0e5ec] shadow-[6px_6px_10px_rgba(163,177,198,0.6),_-6px_-6px_10px_rgba(255,255,255,0.8)] border-2 border-transparent hover:border-mint/30"
              )}
            >
              {/* High Quality Thumbnail Image (Large Aspect Ratio) */}
              <div className="w-full aspect-[9/16] relative overflow-hidden rounded-t-xl bg-[#e0e5ec]">
                {template.isPremium && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                    <Crown className="w-3.5 h-3.5 text-white drop-shadow-md" strokeWidth={2} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md">Premium</span>
                  </div>
                )}
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300",
                    isSelected ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent onClick
                      setPreviewTemplate(template);
                    }}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#e0e5ec] text-navy shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all"
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-ink text-white shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                    <MousePointerClick className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Neomorphic Info Bar */}
              <div className="px-3 py-2.5 flex flex-col items-center justify-center gap-1 bg-[#e0e5ec] relative z-10 rounded-b-2xl border-t border-white/40 transition-colors group-hover:bg-[#d8dee6]">
                <p className="text-[14px] font-serif italic font-bold text-navy/90 truncate tracking-wide">
                  {template.name}
                </p>

                {/* Selected checkmark badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-4 ring-white/50"
                    >
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
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
            className="px-4 py-2 rounded-xl font-bold text-sm text-navy disabled:opacity-30 bg-[#e0e5ec] shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all active:scale-95"
          >
            Previous
          </button>
          
          <span className="text-sm font-bold text-navy/60">
            {page + 1} / {totalPages}
          </span>
          
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-xl font-bold text-sm text-navy disabled:opacity-30 bg-[#e0e5ec] shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      )}

      {/* ── Full Screen Preview Modal ── */}
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-[#e0e5ec] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="shrink-0 p-3 px-5 flex items-center justify-between border-b border-navy/10">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-navy">{previewTemplate.name}</h2>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e0e5ec] text-navy shadow-[3px_3px_6px_rgba(163,177,198,0.6),_-3px_-3px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Exact Template Image or Interactive Iframe */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 shadow-inner py-8 px-4 relative">
                {previewTemplate.previewUrl ? (
                  <iframe 
                    src={previewTemplate.previewUrl} 
                    className="w-full max-w-[450px] mx-auto h-[1200px] block rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] ring-1 ring-black/5 bg-white border-0"
                    title={previewTemplate.name}
                  />
                ) : (
                  <img
                    src={previewTemplate.thumbnail}
                    alt={previewTemplate.name}
                    className="w-full max-w-[450px] mx-auto h-auto block rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
                  />
                )}
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-3 px-5 flex items-center justify-end bg-[#e0e5ec]">
                <button
                  onClick={() => {
                    onSelect(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-ink hover:bg-black rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Select this template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
