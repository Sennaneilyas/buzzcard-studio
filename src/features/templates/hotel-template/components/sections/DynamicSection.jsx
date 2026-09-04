import { motion } from "framer-motion";

export function DynamicSection({ section }) {
  if (!section.title && !section.description && !section.image) return null;

  return (
    <section className="mx-5 my-4 rounded-[25px] border border-white/60 bg-white/55 px-5 py-8 text-black shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center mb-6"
      >
        <h2 className="text-black text-2xl mb-1 font-hotel-display font-semibold text-center">
          {section.title}
        </h2>
        <div className="w-12 h-px bg-[var(--hotel-gold)]/60 mb-2" />
        {section.description && (
          <p className="text-black text-center text-[13px] font-hotel-body leading-relaxed max-w-[280px]">
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
