import { motion } from "framer-motion";
import { fadeInUp, slideInLeft, slideInRight } from "../../utils/animations";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionWrapper } from "../ui/SectionWrapper";

export function AboutSection({ profile }) {
  return (
    <SectionWrapper>
      <SectionHeader subtitle="Notre Histoire" title="L'Art de l'Hospitalité" />

      <div className="mt-6 space-y-8">
        {/* Story Text */}
        <motion.p
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[var(--hotel-espresso)]/80 text-[15px] leading-[1.8]"
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

          <p className="text-[var(--hotel-mocha)] text-xl sm:text-2xl italic leading-relaxed font-normal">
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
            <div className="flex items-baseline gap-2.5 px-6 py-2.5 rounded-full border border-[var(--hotel-cappuccino)] bg-[var(--hotel-latte)]/50">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--hotel-caramel)] leading-none">
                Établi en
              </span>
              <span className="text-[var(--hotel-espresso)] text-xl leading-none font-semibold">
                {profile.established}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
