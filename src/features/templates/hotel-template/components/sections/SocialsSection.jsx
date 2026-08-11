import { motion } from "framer-motion";
import { SiInstagram, SiTripadvisor, SiFacebook, SiGooglemaps, SiAirbnb, SiBookingdotcom } from "react-icons/si";
import { SectionWrapper } from "../ui/SectionWrapper";
import { fadeInUp } from "../../utils/animations";

const iconMap = {
  Instagram: <SiInstagram className="w-[22px] h-[22px]" />,
  TripAdvisor: <SiTripadvisor className="w-[24px] h-[24px]" />,
  Facebook: <SiFacebook className="w-[20px] h-[20px]" />,
  GoogleMaps: <SiGooglemaps className="w-[22px] h-[22px]" />,
  Airbnb: <SiAirbnb className="w-[22px] h-[22px]" />,
  Booking: <SiBookingdotcom className="w-[20px] h-[20px]" />,
};

const colorMap = {
  Instagram: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888]",
  TripAdvisor: "hover:bg-[#34E0A1]",
  Facebook: "hover:bg-[#1877F2]",
  GoogleMaps: "hover:bg-[#4285F4]",
  Airbnb: "hover:bg-[#FF5A5F]",
  Booking: "hover:bg-[#003580]",
};

export function SocialsSection({ socials }) {
  if (!socials || socials.length === 0) return null;

  return (
    <SectionWrapper className="py-6 flex flex-col items-center">
      <div className="w-16 h-[1px] bg-[var(--hotel-cappuccino)]/30 mb-8" />
      
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4"
      >
        {socials.map((social, idx) => (
          <motion.a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`w-[50px] h-[50px] rounded-full border border-[var(--hotel-cappuccino)]/40 bg-white/60 shadow-[0_4px_12px_rgba(59,42,34,0.05)] flex items-center justify-center text-[var(--hotel-mocha)] hover:text-white hover:border-transparent transition-all duration-300 ${colorMap[social.platform] || "hover:bg-[var(--hotel-caramel)]"}`}
          >
            {iconMap[social.platform] || <span className="text-[10px] font-bold uppercase font-hotel-body">{social.platform}</span>}
          </motion.a>
        ))}
      </motion.div>
      
      <div className="w-16 h-[1px] bg-[var(--hotel-cappuccino)]/30 mt-8" />
    </SectionWrapper>
  );
}
