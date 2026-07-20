import { motion } from "framer-motion";
import { ArrowRight, Wifi } from "lucide-react";

export default function HeroText() {
  return (
    <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center text-center">
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 rounded-full bg-white/80 backdrop-blur-sm border border-ink/[0.06] text-sm font-medium text-ink/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)] uppercase tracking-wider"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
        </span>
        NFC-Powered Connections
      </motion.div>

      {/* Main headline — with inline 3D elements */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-ink leading-[1.05]"
      >
        Your{" "}
        {/* Inline 3D mini card */}
        <span className="inline-block align-middle mx-1 relative">
          <motion.span
            className="inline-block w-[52px] h-[72px] md:w-[60px] md:h-[82px] rounded-xl bg-gradient-to-br from-navy via-[#003599] to-navy border border-white/20 shadow-[0_8px_24px_rgba(0,35,102,0.3),0_2px_8px_rgba(0,0,0,0.1)]"
            style={{ transformStyle: "preserve-3d", perspective: "600px" }}
            animate={{ rotateY: [12, -8, 12], rotateX: [-5, 8, -5], y: [-2, 4, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute inset-0 rounded-xl overflow-hidden">
              <span className="absolute top-2 left-2 md:top-2.5 md:left-2.5">
                <Wifi className="w-3 h-3 md:w-3.5 md:h-3.5 text-mint" />
              </span>
              <span className="absolute bottom-2 left-2 md:bottom-2.5 md:left-2.5 flex flex-col gap-0.5">
                <span className="w-5 h-[2px] bg-white/40 rounded" />
                <span className="w-3 h-[2px] bg-white/25 rounded" />
              </span>
              <motion.span
                className="absolute inset-0 rounded-xl"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              />
            </span>
          </motion.span>
        </span>{" "}
        Card.
        <br />
        <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
          Your{" "}
          {/* Inline 3D mini phone */}
          <span className="inline-block align-middle mx-1 relative">
            <motion.span
              className="inline-block w-[38px] h-[60px] md:w-[44px] md:h-[70px] rounded-[12px] bg-ink border-[2.5px] border-ink shadow-[0_8px_20px_rgba(17,24,39,0.3),0_2px_8px_rgba(0,0,0,0.1)]"
              style={{ transformStyle: "preserve-3d", perspective: "600px" }}
              animate={{ rotateY: [-10, 6, -10], rotateX: [6, -4, 6], y: [3, -3, 3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="absolute inset-[2px] rounded-[9px] bg-gradient-to-b from-cloud to-[#e2e4e8] overflow-hidden">
                <span className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[14px] h-[4px] bg-ink rounded-full" />
                <span className="absolute top-[12px] left-[4px] right-[4px] flex flex-col gap-[3px]">
                  <span className="w-full h-[2px] bg-navy/15 rounded" />
                  <span className="w-3/4 h-[2px] bg-navy/10 rounded" />
                  <span className="w-1/2 h-[2px] bg-mint/20 rounded" />
                </span>
              </span>
            </motion.span>
          </span>{" "}
          Brand.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-ink/55 font-medium leading-relaxed max-w-2xl"
      >
        Tap your premium metal card to any smartphone and instantly share
        your contact info, social links, and portfolio. No app required.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
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
