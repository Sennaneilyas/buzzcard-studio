import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeInUp, staggerContainer, scaleIn } from "../../utils/animations";

export function GallerySection({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-transparent">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
      >
        <SectionHeader subtitle="Portfolio" title="Nos Réalisations" />
        
        <motion.div 
          variants={staggerContainer}
          className="mt-8 grid grid-cols-2 gap-3"
        >
          {images.map((img, index) => {
            // Curated layout pattern for a "Mood Board" feel
            const patterns = [
              'col-span-2 aspect-[16/9]',
              'col-span-1 aspect-[3/4]',
              'col-span-1 aspect-[4/5]',
              'col-span-1 aspect-square',
              'col-span-1 aspect-[4/3]',
              'col-span-2 aspect-[21/9]'
            ];
            const layoutClass = patterns[index % patterns.length];

            return (
              <motion.div 
                key={index}
                variants={scaleIn}
                className={`relative rounded-[20px] overflow-hidden bg-[#F9F9F9] group ${layoutClass}`}
              >
                <motion.img 
                  src={img} 
                  alt={`Réalisation ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
