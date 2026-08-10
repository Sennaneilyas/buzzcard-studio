import { motion } from "framer-motion";
import { fadeInUp, slideInLeft, slideInRight } from "../../utils/animations";
import { SectionHeader } from "../ui/SectionHeader";

export function AboutSection({ profile }) {
  return (
    <section className="px-6 py-14 bg-transparent">
      <SectionHeader subtitle="Notre Histoire" title="L'Art de l'Hospitalité" />
      
      <div className="mt-6 space-y-8">
        {/* Story Text */}
        <motion.p
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[#3B2A22]/80 text-[15px] leading-[1.8]"
          style={{ fontFamily: "var(--hotel-font-body)" }}
        >
          {profile.about}
        </motion.p>

        {/* Pull Quote */}
        <motion.blockquote
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative pl-6 py-4"
        >
          {/* Gold accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full hotel-shimmer-line" />
          
          <p 
            className="text-[#7A553A] text-xl sm:text-2xl italic leading-relaxed"
            style={{ fontFamily: "var(--hotel-font-display)", fontWeight: 400 }}
          >
            {profile.quote}
          </p>
        </motion.blockquote>

        {/* Established Badge */}
        {profile.established && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div className="flex items-baseline gap-2.5 px-6 py-2.5 rounded-full border border-[#D6BFA6] bg-[#F3E9D7]/50">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B08968] leading-none"
                style={{ fontFamily: "var(--hotel-font-body)" }}
              >
                Établi en
              </span>
              <span 
                className="text-[#3B2A22] text-xl leading-none"
                style={{ fontFamily: "var(--hotel-font-display)", fontWeight: 600 }}
              >
                {profile.established}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
