import { motion } from "framer-motion";
import { SiInstagram, SiTripadvisor, SiFacebook } from "react-icons/si";
import { fadeInUp } from "../../utils/animations";

const iconMap = {
  Instagram: <SiInstagram className="w-[22px] h-[22px]" />,
  TripAdvisor: <SiTripadvisor className="w-[24px] h-[24px]" />,
  Facebook: <SiFacebook className="w-[20px] h-[20px]" />,
};

export function SocialsSection({ socials }) {
  if (!socials || socials.length === 0) return null;

  return (
    <section className="px-6 py-6 bg-transparent flex flex-col items-center relative">
      <div className="w-16 h-[1px] bg-[#D6BFA6]/30 mb-8" />
      
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex gap-5"
      >
        {socials.map((social, idx) => (
          <motion.a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="w-[50px] h-[50px] rounded-full border border-[#D6BFA6]/40 bg-white/60 shadow-[0_4px_12px_rgba(59,42,34,0.05)] flex items-center justify-center text-[#7A553A] hover:bg-[#B08968] hover:text-white hover:border-transparent transition-all duration-300"
          >
            {iconMap[social.platform] || <span className="text-[10px] font-bold uppercase">{social.platform}</span>}
          </motion.a>
        ))}
      </motion.div>
      
      <div className="w-16 h-[1px] bg-[#D6BFA6]/30 mt-8" />
    </section>
  );
}
