import { useState } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, GripVertical, Trash2, Type, AlignLeft, Image as ImageLucide } from "lucide-react";
import ImageUploadZone from "@/components/ui/ImageUploadZone";
import { PROFILE_MEDIA_CATEGORIES } from "@/features/editor/media/profileMedia";

/**
 * SectionCard — A collapsible, draggable card for editing a custom section.
 * Contains: title input, description textarea, optional image upload, and delete button.
 */
export default function SectionCard({ section, onUpdate, onRemove, onRemoveImage, forceOpen = false }) {
  const [isOpen, setIsOpen] = useState(true);
  const isExpanded = forceOpen || isOpen;

  return (
    <Reorder.Item
      value={section}
      className="bg-white border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header: drag handle + title preview + collapse + delete */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-500 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-gray-900 truncate">
            {section.title || "Untitled Section"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isExpanded)}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body: editable fields */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Section Title */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Type className="w-3 h-3" />
                  Section Title
                </label>
                <input
                  type="text"
                  value={section.title || ""}
                  onChange={(e) => onUpdate(section.id, "title", e.target.value)}
                  placeholder="E.g. About Me, Our Services, Portfolio..."
                  className="w-full h-11 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              {/* Section Description */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <AlignLeft className="w-3 h-3" />
                  Description
                </label>
                <textarea
                  rows={3}
                  value={section.description || ""}
                  onChange={(e) => onUpdate(section.id, "description", e.target.value)}
                  placeholder="Write the content for this section..."
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-[13px] text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-gray-900 transition-colors resize-none"
                />
              </div>

              {/* Section Image (optional) */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <ImageLucide className="w-3 h-3" />
                  Image (optional)
                </label>
                {section.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveImage(section.image);
                          onUpdate(section.id, "image", "");
                        }}
                        className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageUploadZone
                    label="Add Image"
                    aspectRatio="video"
                    value=""
                    category={PROFILE_MEDIA_CATEGORIES.CUSTOM_SECTION}
                    onChange={(val) => { if (val) onUpdate(section.id, "image", val); }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
