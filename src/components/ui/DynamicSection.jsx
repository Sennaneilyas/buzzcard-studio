import { motion } from "framer-motion";

/**
 * DynamicSection — A generic section renderer used by all templates
 * to display user-created custom sections from the editor.
 * Renders: title, description text, and an optional image.
 */
export function DynamicSection({ section, theme = "light" }) {
  if (!section.title && !section.description && !section.image) return null;

  const isDark = theme === "dark";

  return (
    <section className="px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col"
      >
        {section.title && (
          <h2
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {section.title}
          </h2>
        )}

        {section.description && (
          <p
            className={`text-[13px] leading-relaxed mb-4 ${
              isDark ? "text-white/70" : "text-gray-600"
            }`}
          >
            {section.description}
          </p>
        )}

        {section.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border border-black/5 shadow-sm"
          >
            <img
              src={section.image}
              alt={section.title || "Section image"}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default DynamicSection;
