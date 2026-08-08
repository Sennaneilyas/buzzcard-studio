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
            const isLarge = index === 0; // First image spans 2 columns
            return (
              <motion.div 
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 0.98 }}
                className={`relative rounded-[16px] overflow-hidden bg-[#F9F9F9] ${isLarge ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}
              >
                <img 
                  src={img} 
                  alt={`Réalisation ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
