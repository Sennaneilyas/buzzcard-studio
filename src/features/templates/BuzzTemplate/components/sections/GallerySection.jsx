import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { useGalleryCarousel } from "../../hooks/useGalleryCarousel";
import GalleryArrow from "../ui/GalleryArrow";

/**
 * Swipeable stacked-photo gallery (max 5 images) with prev/next arrows
 * and dot indicators.
 */
export default function GallerySection({ gallery, shouldReduceMotion }) {
  const images = useMemo(() => gallery?.slice(0, 5) ?? [], [gallery]);
  const { active, setActive, handleNext, handlePrev, handleDragEnd } =
    useGalleryCarousel(images.length);

  if (!images.length) return null;

  return (
    <section className="relative w-full h-[220px]" aria-label="Galerie de photos">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[46vw] h-[190px] max-w-[180px]">
          <AnimatePresence mode="popLayout">
            {images.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                className={`absolute inset-0 origin-bottom will-change-transform ${
                  index === active
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-[6px] z-20">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Voir l'image ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className={`w-[6px] h-[6px] rounded-full transition-colors ${
              i === active ? "bg-neutral-950" : "bg-neutral-950/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
