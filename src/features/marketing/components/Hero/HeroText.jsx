import { motion } from "framer-motion";
import { ArrowRight, Wifi } from "lucide-react";
import CircularSpinText from "@/components/ui/CircularSpinText";
import { TextReveal } from "@/components/ui/cascade-text";

export default function HeroText() {
  return (
    <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center text-center">
      {/* Top Spinning Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="mb-6"
      >
        <CircularSpinText 
          text="BUZZCARD STUDIO • REINVENTED • " 
          size={110} 
          radius={42} 
          fontSize={10} 
        />
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter leading-[1] relative z-10"
        style={{ perspective: 1200 }}
      >
        <div className="inline-block text-ink pb-4 px-4 transition-all duration-300">
          <div className="block">
            <TextReveal 
              text="Your Card." 
              direction="up" 
              hoverColor="#00e676" 
              className="normal-case tracking-tighter"
            />
          </div>
          <div className="block">
            <TextReveal 
              text="Your Brand." 
              direction="up" 
              hoverColor="#00e676" 
              className="normal-case tracking-tighter"
              staggerDelay={35}
            />
          </div>
        </div>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-lg md:text-xl text-ink/55 font-medium leading-relaxed max-w-2xl"
      >
        Tap your premium metal card to any smartphone and instantly share
        your contact info, social links, and portfolio. No app required.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center"
      >
        <a
          href="#pricing"
          className="group inline-flex items-center justify-center gap-2.5 px-9 py-4.5 text-base font-semibold text-white bg-ink rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,230,118,0.2)] hover:scale-[1.02] active:scale-[0.98]"
        >
          Get Your Card
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-ink/60 transition-all duration-300 hover:text-ink"
        >
          See How It Works
        </a>
      </motion.div>
    </div>
  );
}
