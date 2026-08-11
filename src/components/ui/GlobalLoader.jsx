import { motion } from "framer-motion";

export function GlobalLoader({ className = "" }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] bg-transparent flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Centered Minimalist Logo */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        {/* 1. Base Subtle Silhouette */}
        <img
          src="/justlogo.png"
          alt="BuzzCard Logo"
          className="w-full h-full object-contain opacity-25"
        />

        {/* 2. Minimalist & Subtle Shimmer Sheen */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            maskImage: "url(/justlogo.png)",
            WebkitMaskImage: "url(/justlogo.png)",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-[#111827]/85 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.3,
            }}
          />
        </div>
      </div>
    </div>
  );
}




