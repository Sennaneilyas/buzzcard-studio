import { motion } from "framer-motion";
import { Sparkles, Waves, Wifi, UtensilsCrossed, BellRing, Car } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, springBounce } from "../../utils/animations";

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
    <section className="px-6 py-14 bg-transparent hotel-lazy-section">
      <SectionHeader subtitle="Nos Services" title="Prestations d'Exception" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-3 gap-4 mt-6"
      >
        {amenities.map((amenity) => {
          const Icon = ICON_MAP[amenity.icon] || Sparkles;
          return (
            <motion.div
              key={amenity.id}
              variants={springBounce}
              className="flex flex-col items-center gap-3 p-5 rounded-[20px] bg-[#F3E9D7]/60 border border-[#D6BFA6]/30 hover:border-[#B08968]/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#F3E9D7] border border-[#D6BFA6]/50 flex items-center justify-center group-hover:bg-[#3B2A22] group-hover:text-[#F3E9D7] text-[#7A553A] transition-all duration-300 shadow-sm">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span 
                className="text-[11px] font-bold text-[#3B2A22] text-center leading-tight"
                style={{ fontFamily: "var(--hotel-font-body)" }}
              >
                {amenity.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
