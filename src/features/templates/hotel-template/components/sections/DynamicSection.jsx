import { motion } from "framer-motion";

export function DynamicSection({ section }) {
  if (!section.title && !section.description && !section.image) return null;

  return (
    <section className="px-5 py-8 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center mb-6"
      >
        <h2 className="text-[var(--hotel-espresso)] text-2xl mb-1 font-hotel-display font-semibold text-center">
          {section.title}
        </h2>
        <div className="w-12 h-px bg-[var(--hotel-gold)]/60 mb-2" />
        {section.description && (
          <p className="text-[var(--hotel-mocha)] text-center text-[13px] font-hotel-body leading-relaxed max-w-[280px]">
            {section.description}
          </p>
        )}
      </motion.div>

      {section.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[var(--hotel-cappuccino)]/20"
        >
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </section>
  );
}
