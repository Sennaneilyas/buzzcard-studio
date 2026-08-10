import { motion } from "framer-motion";
import { fadeInUp } from "../../utils/animations";

export function SectionHeader({ title, subtitle, align = "center", light = false }) {
  const textColor = light ? "text-[#F3E9D7]" : "text-[#3B2A22]";
  const subtitleColor = light ? "text-[#D6BFA6]" : "text-[#B08968]";

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {subtitle && (
        <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${subtitleColor} mb-3 block`}
          style={{ fontFamily: "var(--hotel-font-body)" }}
        >
          {subtitle}
        </span>
      )}
      <h2 
        className={`text-3xl sm:text-4xl ${textColor} leading-tight`}
        style={{ fontFamily: "var(--hotel-font-display)", fontWeight: 600 }}
      >
        {title}
      </h2>

      {/* Gold Ornament Divider */}
      {align === "center" && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[1px] w-8 hotel-shimmer-line rounded-full" />
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#C9A96E]">
            <path
              fill="currentColor"
              d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
            />
          </svg>
          <div className="h-[1px] w-8 hotel-shimmer-line rounded-full" />
        </div>
      )}
    </motion.div>
  );
}
