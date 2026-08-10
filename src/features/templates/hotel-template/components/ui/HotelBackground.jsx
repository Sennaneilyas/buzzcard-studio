import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HotelBackground({ children, className }) {
  return (
    <div className={cn("relative w-full flex flex-col min-h-[100dvh]", className)}>
      {/* Base background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#FAF6F0]">
        {/* Warm gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F3E9D7] via-[#FAF6F0] to-[#F3E9D7]" />
        
        {/* Zellige tile pattern overlay */}
        <div className="absolute inset-0 hotel-zellige opacity-100" />
        
        {/* Soft radial glow from top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-[#D6BFA6]/20 via-transparent to-transparent" />
        
        {/* Slow-rotating organic shapes */}
        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute top-[-20%] right-[-25%] w-[140%] h-[140%] opacity-[0.025] text-[#B08968]"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <path fill="currentColor" d="M424,888C222,865,65,715,14,528C-37,341,92,154,293,73C494,-8,754,-4,874,138C994,280,974,561,847,736C720,911,626,911,424,888Z" />
        </motion.svg>
        
        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute bottom-[-15%] left-[-20%] w-[120%] h-[120%] opacity-[0.02] text-[#7A553A]"
          animate={{ rotate: -360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        >
          <path fill="currentColor" d="M848,735C722,912,476,989,286,911C96,833,-38,599,10,381C58,163,288,-39,520,6C752,51,984,346,950,555C916,764,974,558,848,735Z" />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
