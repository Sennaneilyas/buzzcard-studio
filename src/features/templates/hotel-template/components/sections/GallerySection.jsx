import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, scaleIn } from "../../utils/animations";

export function GallerySection({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  // Asymmetrical masonry layout patterns
  const patterns = [
    "col-span-2 aspect-[16/9]",
    "col-span-1 aspect-[3/4]",
    "col-span-1 aspect-[4/5]",
    "col-span-1 aspect-square",
    "col-span-1 aspect-[4/3]",
    "col-span-2 aspect-[21/9]",
  ];

  return (
    <section className="px-6 py-14 bg-transparent hotel-lazy-section">
      <SectionHeader subtitle="Galerie" title="Moments d'Exception" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-6 grid grid-cols-2 gap-3"
      >
        {images.map((img, index) => {
          const layoutClass = patterns[index % patterns.length];
          return (
            <motion.div
              key={index}
              variants={scaleIn}
              layoutId={`gallery-${index}`}
              onClick={() => setSelectedImage({ src: img, index })}
              className={`relative rounded-[20px] overflow-hidden bg-[#F3E9D7] cursor-pointer group ${layoutClass}`}
            >
              <img
                src={img}
                alt={`Galerie ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#3B2A22]/0 group-hover:bg-[#3B2A22]/15 transition-colors duration-500" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3B2A22]/80 hotel-lightbox-backdrop"
          >
            <motion.img
              layoutId={`gallery-${selectedImage.index}`}
              src={selectedImage.src}
              alt="Galerie"
              className="max-w-full max-h-[85vh] rounded-[16px] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
