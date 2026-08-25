import { motion } from "framer-motion";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

/**
 * Testimonials — Replaces the old Work showcase component
 */
export default function Work() {
  return (
    <section className="py-24 md:py-32 bg-transparent overflow-hidden" id="work">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-4 mb-4 opacity-80">
            <div className="w-12 h-[1px] bg-ink/20"></div>
            <span className="font-serif italic text-lg sm:text-xl tracking-wide text-ink/80">Testimonials</span>
            <div className="w-12 h-[1px] bg-ink/20"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-2">
            Loved by{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="mt-2 max-w-lg mx-auto text-ink/50 text-lg">
            See what professionals are saying about their experience with BuzzCard.
          </p>
        </motion.div>

        {/* Staggered Testimonials Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto"
        >
          <StaggerTestimonials />
        </motion.div>
      </div>
    </section>
  );
}
