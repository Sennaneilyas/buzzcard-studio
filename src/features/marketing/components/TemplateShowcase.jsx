import { motion } from "framer-motion";
import { TEMPLATES } from "@/config/templates";

export default function TemplateShowcase() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-4 opacity-80">
            <div className="w-12 h-[1px] bg-ink/10"></div>
            <span className="font-serif italic text-lg sm:text-xl tracking-wide text-ink/60">Premium Designs</span>
            <div className="w-12 h-[1px] bg-ink/10"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Crafted for <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">excellence</span>
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-ink/50 text-lg">
            Choose from our collection of meticulously designed flagship templates. Every pixel perfected for your professional image.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TEMPLATES.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              className="group flex flex-col cursor-pointer"
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[9/16] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-ink/5 bg-white mb-6">
                <img 
                  src={tpl.thumbnail} 
                  alt={tpl.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Minimalist overlay on hover */}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
              </div>
              <div className="px-2 text-center sm:text-left">
                <h3 className="text-lg font-bold text-ink">{tpl.name}</h3>
                <p className="text-xs text-ink/40 uppercase tracking-widest mt-1.5 font-semibold">{tpl.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
