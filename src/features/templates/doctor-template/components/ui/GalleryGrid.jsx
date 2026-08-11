import { motion } from "framer-motion";
import { ZoomableImage } from "@/components/ui/ZoomableImage";

export function GalleryGrid({ images }) {
  const displayImages = images.slice(0, 4);
  
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      {displayImages.map((src, index) => (
        <motion.div
          key={src}
          whileHover={{ scale: 1.02 }}
          className="relative aspect-square overflow-hidden rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        >
          <ZoomableImage
            src={src}
            alt={`Galerie ${index + 1}`}
            className="w-full h-full"
          />
        </motion.div>
      ))}
    </div>
  );
}
