import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between w-full h-[140px] p-5 overflow-hidden rounded-3xl transition-all duration-300 ease-in-out group cursor-pointer border border-transparent",
  {
    variants: {
      state: {
        default: "bg-[#e0e5ec] shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.8)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.9)] hover:scale-[1.02]",
        active: "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),_inset_-6px_-6px_12px_rgba(255,255,255,0.8)] border-mint/20 scale-[0.98]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const SocialCard = React.forwardRef(
  ({ className, state, title, value, icon: Icon, colorClass, onClick, ...props }, ref) => {
    
    // Animation for the background brand icon
    const iconAnimation = {
      default: {
        scale: 1,
        rotate: -10,
        x: 0,
        y: 0,
      },
      hover: {
        scale: 1.2,
        rotate: 0,
        x: -10,
        y: -10,
        transition: { duration: 0.4, ease: "easeOut" },
      },
      active: {
        scale: 0.9,
        transition: { duration: 0.2 },
      }
    };

    const hasValue = !!value;

    return (
      <motion.div
        className={cn(cardVariants({ state, className }))}
        ref={ref}
        onClick={onClick}
        whileHover={state === "default" ? "hover" : ""}
        initial="default"
        {...props}
      >
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <h3 className="text-lg font-bold text-navy tracking-tight">{title}</h3>
          
          <div className="mt-auto flex items-center text-sm font-semibold">
            {hasValue ? (
              <span className={cn("flex items-center gap-1 bg-[#e0e5ec] px-2 py-1 rounded-md shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)]", colorClass || "text-navy")}>
                <Check className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{value}</span>
              </span>
            ) : (
              <span className="text-navy/50 flex items-center gap-1 group-hover:text-navy transition-colors">
                <Plus className="w-4 h-4" /> Connect
              </span>
            )}
          </div>
        </div>
        
        <motion.div
          variants={iconAnimation}
          className={cn(
            "absolute -right-6 -bottom-6 w-24 h-24 opacity-20 group-hover:opacity-35 transition-opacity",
            colorClass
          )}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      </motion.div>
    );
  }
);
SocialCard.displayName = "SocialCard";

export { SocialCard };
