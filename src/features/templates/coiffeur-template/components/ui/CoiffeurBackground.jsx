import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CoiffeurBackground({ children, className }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("relative w-full flex flex-col min-h-[100dvh]", className)}>
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#FAFAFA]">
        {/* Rich brown gradient to blurred brown/white */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8A6B4E]/20 via-[var(--primary-color, #C5A880)]/10 to-transparent" />
        
        {/* Soft radial overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--primary-color, #C5A880)]/30 via-transparent to-transparent" />
        
        {/* Animated SVG Lines (like 3D ribbons/blobs) */}
        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute top-[-15%] left-[-30%] w-[150%] h-[150%] opacity-[0.06] text-[var(--primary-color, #C5A880)] mix-blend-multiply"
          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
          <path fill="currentColor" d="M424,888C222,865,65,715,14,528C-37,341,92,154,293,73C494,-8,754,-4,874,138C994,280,974,561,847,736C720,911,626,911,424,888Z" />
        </motion.svg>
        
        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute top-[30%] left-[20%] w-[130%] h-[130%] opacity-[0.04] text-[var(--primary-color, #C5A880)] mix-blend-multiply"
          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: -360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          <path fill="currentColor" d="M848,735C722,912,476,989,286,911C96,833,-38,599,10,381C58,163,288,-39,520,6C752,51,984,346,950,555C916,764,974,558,848,735Z" />
        </motion.svg>

        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute bottom-[-20%] right-[-20%] w-[140%] h-[140%] opacity-[0.03] text-black mix-blend-multiply"
          animate={
            shouldReduceMotion
              ? { scale: 1, rotate: 0 }
              : { scale: [1, 1.1, 1], rotate: [0, 90, 0] }
          }
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        >
           <path fill="currentColor" d="M848,735C722,912,476,989,286,911C96,833,-38,599,10,381C58,163,288,-39,520,6C752,51,984,346,950,555C916,764,974,558,848,735Z" />
        </motion.svg>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden w-full">
        {children}
      </div>
    </div>
  );
}
