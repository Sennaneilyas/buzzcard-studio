import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { letterReveal, staggerFast } from "../../utils/animations";

export function HeroSection({ profile }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8]);

  const nameLetters = (profile.name || "").split("");

  return (
    <section ref={heroRef} className="relative w-full h-[320px] sm:h-[360px] overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y: imageY }}
        className="absolute inset-0 w-full h-[130%]"
      >
        <img 
          src={profile.bannerUrl}
          alt={profile.name}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <motion.div 
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-[#F3E9D7] via-[#F3E9D7]/80 to-transparent"
      />


      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-6 z-10">
        {/* Avatar / Logo */}
        {profile.avatarUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden relative border border-[#D6BFA6]/30">
              <img 
                src={profile.avatarUrl} 
                alt={`${profile.name} Logo`}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Star Rating */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-1 mb-3"
        >
          {Array.from({ length: profile.stars || 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
              className="hotel-star text-lg"
            >
              ★
            </motion.span>
          ))}
        </motion.div>

        {/* Hotel Name — Letter by Letter */}
        <motion.h1
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          className="text-center text-[#3B2A22] leading-tight"
          style={{ fontFamily: "var(--hotel-font-display)", fontWeight: 600, fontSize: "clamp(1.8rem, 6vw, 2.5rem)" }}
        >
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterReveal}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>

      </div>
    </section>
  );
}
