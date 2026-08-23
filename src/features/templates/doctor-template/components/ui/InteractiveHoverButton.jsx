import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const InteractiveHoverButton = React.forwardRef(({ text = "Button", className, ...props }, ref) => {
  // Switched to blue and white based on template palette
  const glowColors = ["rgba(70, 130, 180, 0.4)", "rgba(255, 255, 255, 0.4)"];
  const scale = 1.6;
  const duration = 6;

  const breatheEffect = {
    background: glowColors.map(
      (color) =>
        `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
    ),
    scale: [1 * scale, 1.05 * scale, 1 * scale],
    transition: {
      repeat: Infinity,
      duration: duration,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2 font-semibold transition-all duration-300",
        "border-[0.667px] border-white/40 bg-white/90 backdrop-blur-md text-[var(--primary-color,#4682b4)]",
        "hover:shadow-[0px_8px_16px_rgba(0,0,0,0.12)]",
        className
      )}
      {...props}
    >
      {/* Embedded Glow Effect */}
      <motion.div
        animate={breatheEffect}
        className={cn(
          "pointer-events-none absolute inset-0 z-0 transform-gpu blur-xl scale-[1.6]"
        )}
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Foreground Text */}
      <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
        {text}
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

