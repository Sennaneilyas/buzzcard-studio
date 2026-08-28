import { motion } from "framer-motion";
import PhoneMockupBasic from "@/components/ui/phone-mockups-1";
import { TEMPLATES } from "@/config/templates";
import { prefetchTemplate } from "@/lib/prefetch";

const templateImages = TEMPLATES.map((template) => ({
  id: template.id,
  src: template.thumbnail,
  alt: `${template.name} digital profile template`,
  label: template.name,
  category: template.category,
}));

export default function TemplateShowcase() {
  return (
    <section
      className="py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden bg-transparent"
      id="templates"
    >
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
            <span className="font-serif italic text-lg sm:text-xl tracking-wide text-ink/60">
              Premium Designs
            </span>
            <div className="w-12 h-[1px] bg-ink/10"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Crafted for{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              excellence
            </span>
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-ink/50 text-lg">
            Choose from our collection of meticulously designed flagship
            templates. Every pixel perfected for your professional image.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <PhoneMockupBasic
            images={templateImages}
            onItemIntent={(item) => prefetchTemplate(item.id)}
          />
        </motion.div>
      </div>
    </section>
  );
}
