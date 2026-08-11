import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionWrapper } from "../ui/SectionWrapper";
import { staggerContainer, scaleIn } from "../../utils/animations";

export function GallerySection({ images }) {
  if (!images || images.length === 0) return null;

  // Asymmetrical masonry layout patterns
  const patterns = [
    "col-span-2 md:col-span-1 lg:col-span-2 aspect-[16/9]",
    "col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4]",
    "col-span-1 md:col-span-1 lg:col-span-1 aspect-[4/5]",
    "col-span-1 md:col-span-1 lg:col-span-1 aspect-square",
    "col-span-1 md:col-span-2 lg:col-span-1 aspect-[4/3]",
    "col-span-2 md:col-span-3 lg:col-span-2 aspect-[21/9]",
  ];

  return (
    <SectionWrapper>
      <SectionHeader subtitle="Galerie" title="Moments d'Exception" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {images.map((img, index) => {
          const layoutClass = patterns[index % patterns.length];
          return (
            <motion.div
              key={index}
              variants={scaleIn}
              className={`relative rounded-[20px] overflow-hidden bg-[var(--hotel-latte)] group ${layoutClass}`}
            >
              <ZoomableImage
                src={img}
                alt={`Galerie ${index + 1}`}
                className="w-full h-full"
                imageClassName="transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[var(--hotel-espresso)]/0 group-hover:bg-[var(--hotel-espresso)]/15 transition-colors duration-500 pointer-events-none" />
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
