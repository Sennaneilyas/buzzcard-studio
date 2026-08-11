import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionWrapper } from "../ui/SectionWrapper";
import { fadeInUp, staggerContainer } from "../../utils/animations";

export function RoomsSection({ rooms }) {
  if (!rooms || rooms.length === 0) return null;

  return (
    <SectionWrapper fullWidth={true}>
      <div className="px-6">
        <SectionHeader subtitle="Hébergement" title="Nos Chambres & Suites" />
      </div>

      {/* Horizontal Scroll Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="hotel-scroll-snap flex gap-4 overflow-x-auto px-6 pb-4 mt-6 snap-x snap-mandatory"
      >
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            variants={fadeInUp}
            className="flex-shrink-0 w-[280px] sm:w-[300px] snap-center rounded-[24px] overflow-hidden bg-white border border-[var(--hotel-cappuccino)]/20 shadow-[0_8px_32px_-8px_rgba(59,42,34,0.08)] group"
          >
            {/* Room Image */}
            <div className="relative h-[200px] overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hotel-espresso)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Amenity Pills (on hover) */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {room.amenities?.map((a) => (
                  <span
                    key={a}
                    className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-[var(--hotel-espresso)] font-hotel-body"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg text-[var(--hotel-espresso)] leading-tight font-hotel-display font-semibold">
                  {room.name}
                </h3>
                <span className="text-[10px] font-bold text-[var(--hotel-caramel)] bg-[var(--hotel-latte)] px-2 py-1 rounded-full shrink-0 font-hotel-body">
                  {room.size}
                </span>
              </div>

              <p className="text-[12px] text-[var(--hotel-mocha)]/70 leading-relaxed mb-4 font-hotel-body">
                {room.description}
              </p>

              <div className="flex items-baseline gap-1 pt-3 border-t border-[var(--hotel-cappuccino)]/20">
                <span className="text-xl text-[var(--hotel-espresso)] font-hotel-display font-bold">
                  {room.price}
                </span>
                {room.perNight && (
                  <span className="text-[11px] text-[var(--hotel-caramel)] font-hotel-body">
                    / nuit
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
