import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// CVA for card variants
const cardVariants = cva(
  "relative flex flex-col justify-between w-full p-4 overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 ease-in-out group hover:shadow-lg border border-black/5",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        red: "bg-red-500/90 text-white",
        blue: "bg-[#4682B4]/90 text-white",
        gray: "bg-gray-100 text-gray-900",
        gold: "bg-[#C5A880]/90 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ServiceCard = React.forwardRef(
  ({ className, variant, title, href = "#", imgSrc, imgAlt, price, duration, ...props }, ref) => {
    
    // Animation variants for Framer Motion
    const cardAnimation = {
      hover: {
        scale: 1.02,
        transition: { duration: 0.3 },
      },
    };

    const imageAnimation = {
      hover: {
        scale: 1.1,
        rotate: 3,
        x: 10,
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    };
    
    const arrowAnimation = {
        hover: {
            x: 5,
            transition: { duration: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
        }
    }

    return (
      <motion.div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        variants={cardAnimation}
        whileHover="hover"
        {...props}
      >
        <div className="relative z-10 flex flex-col h-full">
          <h3 className="text-[13px] font-times font-bold tracking-tight mb-1 leading-tight">{title}</h3>
          
          {(price || duration) && (
            <div className="mb-3">
              {price && <span className="font-semibold text-[12px]">{price}</span>}
              {duration && <span className="text-[10px] opacity-80 block">{duration}</span>}
            </div>
          )}

          <a
            href={href}
            onClick={(e) => {
              if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
            aria-label={`En savoir plus sur ${title}`}
            className="mt-auto flex items-center text-[10px] uppercase tracking-wider font-semibold opacity-80 group-hover:opacity-100 transition-opacity"
          >
            Réserver
            <motion.div variants={arrowAnimation}>
                <ArrowRight className="ml-1 h-3 w-3" />
            </motion.div>
          </a>
        </div>
        
        {imgSrc && (
          <motion.img
            src={imgSrc}
            alt={imgAlt}
            style={{ 
              WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)', 
              maskImage: 'radial-gradient(circle, black 50%, transparent 80%)' 
            }}
            className="absolute -right-3 -bottom-3 w-20 h-20 object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 drop-shadow-xl"
            variants={imageAnimation}
          />
        )}
      </motion.div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
