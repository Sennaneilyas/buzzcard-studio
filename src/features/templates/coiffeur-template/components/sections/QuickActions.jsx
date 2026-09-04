import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaMapLocationDot, FaEnvelope } from "react-icons/fa6";
import { scaleIn, staggerContainer } from "../../utils/animations";

export function QuickActions({ profile }) {
  const getSocialUrl = (platform) =>
    profile.socials?.find(
      (social) => social.platform?.toLowerCase() === platform.toLowerCase(),
    )?.href;

  const actions = [
    {
      icon: <FaInstagram className="w-5 h-5" />,
      label: "Instagram",
      href: getSocialUrl("Instagram"),
    },
    {
      icon: <FaTiktok className="w-5 h-5" />,
      label: "TikTok",
      href: getSocialUrl("TikTok"),
    },
    {
      icon: <FaMapLocationDot className="w-5 h-5" />,
      label: "Itinéraire",
      href: profile.location ? `https://maps.google.com/?q=${encodeURIComponent(profile.location)}` : "",
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "E-mail",
      href: profile.emails?.[0] ? `mailto:${profile.emails[0]}` : "",
    }
  ].filter(action => action.href);

  return (
    <section className="px-6 py-8 bg-transparent">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex justify-center gap-4"
      >
        {actions.map((action, index) => (
          <motion.a
            key={index}
            variants={scaleIn}
            href={action.href}
            target={action.label === "Itinéraire" ? "_blank" : "_self"}
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#F9F9F9] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[var(--primary-color, #C5A880)] transition-colors border border-black/5 shadow-sm">
              {action.icon}
            </div>
            <span className="text-[11px] font-medium text-gray-500 group-hover:text-[#1A1A1A] transition-colors">
              {action.label}
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
