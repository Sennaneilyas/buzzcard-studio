import { motion } from "framer-motion";
import {
  Sparkles,
  Waves,
  Wifi,
  UtensilsCrossed,
  BellRing,
  Car,
} from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionWrapper } from "../ui/SectionWrapper";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const ICON_MAP = {
  Sparkles,
  Waves,
  Wifi,
  UtensilsCrossed,
  ConciergeBell: BellRing,
  Car,
};

export function AmenitiesSection({ amenities }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <SectionWrapper>
      <SectionHeader subtitle="Nos Services" title="Prestations d'Exception" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-4 mt-10"
      >
        {amenities.map((amenity) => {
          const Icon = ICON_MAP[amenity.icon] || Sparkles;
          return (
            <motion.div
              key={amenity.id}
              variants={fadeInUp}
              className="group relative flex flex-col items-center p-6 rounded-[24px] bg-white/70 backdrop-blur-md border border-[var(--hotel-cappuccino)]/40 shadow-[0_8px_24px_rgba(59,42,34,0.03)] hover:shadow-[0_12px_32px_rgba(59,42,34,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-default"
            >
              {/* Elegant Gold Accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--hotel-gold)] rounded-b-md opacity-30 group-hover:opacity-100 group-hover:w-16 transition-all duration-500" />

              <div className="w-14 h-14 mb-4 rounded-full bg-[var(--hotel-ivory)] flex items-center justify-center text-[var(--hotel-caramel)] group-hover:text-[var(--hotel-espresso)] group-hover:bg-[var(--hotel-latte)] border border-transparent group-hover:border-[var(--hotel-cappuccino)]/50 transition-all duration-500">
                <Icon className="w-6 h-6" strokeWidth={1.2} />
              </div>

              <span className="text-[10px] font-bold text-[var(--hotel-espresso)] text-center uppercase tracking-[0.15em] leading-relaxed font-hotel-body">
                {amenity.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
