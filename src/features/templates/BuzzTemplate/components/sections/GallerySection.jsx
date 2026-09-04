import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { useGalleryCarousel } from "../../hooks/useGalleryCarousel";
import GalleryArrow from "../ui/GalleryArrow";
import PreviewEditRegion from "@/features/editor/contextual/PreviewEditRegion";

/**
 * Swipeable stacked-photo gallery (max 5 images) with prev/next arrows
 * and dot indicators.
 */
function GallerySection({
  gallery,
  shouldReduceMotion,
  contextualEditing = false,
  activeEditTarget,
  onEditTargetSelect,
}) {
  const images = useMemo(() => gallery?.slice(0, 5) ?? [], [gallery]);
  const { active, setActive, handleNext, handlePrev, handleDragEnd } =
    useGalleryCarousel(images.length);

  if (!images.length && !contextualEditing) return null;

  return (
    <PreviewEditRegion
      as="section"
      targetId="gallery"
      label="Gallery"
      isEditMode={contextualEditing}
      isActive={activeEditTarget === "gallery"}
      onSelect={onEditTargetSelect}
      className={`relative w-full ${images.length ? "h-[290px]" : "min-h-24"}`}
      aria-label="Galerie de photos"
    >
      {images.length ? <>
        <div className="absolute inset-x-0 top-0 flex items-center justify-center">
        <div className="relative w-[65vw] h-[230px] max-w-[260px]">
          <AnimatePresence mode="popLayout">
            {images.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                className={`absolute inset-0 origin-bottom will-change-transform ${index === active
                    ? "cursor-grab active:cursor-grabbing z-10"
                    : "z-0"
                  }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === active ? 1 : 0.55,
                  scale: index === active ? 1 : 0.93,
                  rotate: shouldReduceMotion
                    ? 0
                    : index === active
                      ? 0
                      : index % 2 === 0
                        ? 3
                        : -3,
                  zIndex: index === active ? 10 : images.length - index,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: "easeOut",
                }}
                drag={index === active ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
              >
                <ZoomableImage
                  src={src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full"
                  imageClassName="rounded-[18px] select-none bg-neutral-200"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        </div>

        <GalleryArrow direction="prev" onClick={handlePrev} />
        <GalleryArrow direction="next" onClick={handleNext} />

      {/* Dots with more vertical spacing */}
        <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex gap-[6px] z-20">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`w-[6px] h-[6px] rounded-full transition-colors ${i === active ? "bg-neutral-950" : "bg-neutral-950/30"
                }`}
            />
          ))}
        </div>
      </> : (
        <div className="flex min-h-24 items-center justify-center rounded-[18px] border border-dashed border-neutral-300 bg-white/60 text-xs font-semibold text-neutral-500">
          Add gallery photos
        </div>
      )}
    </PreviewEditRegion>
  );
}

export default React.memo(GallerySection);
