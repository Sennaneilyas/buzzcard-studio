import { motion } from "framer-motion";
import { ArrowRight, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [tapped, setTapped] = useState(false);

  // Auto-play the tap animation loop for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setTapped(false);
      // Wait for card to pull back, then tap
      setTimeout(() => setTapped(true), 1500); 
    }, 4500);
    
    // Initial tap trigger
    setTimeout(() => setTapped(true), 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 lg:pt-20 pb-16" id="hero">
      {/* ── Simple Optimized Background ── */}
      <div className="absolute inset-0 -z-10 bg-cloud overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mint/10 via-cloud to-cloud" />
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-mint/20 mix-blend-multiply blur-[120px] opacity-70" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-navy/10 mix-blend-multiply blur-[100px] opacity-70" />
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center z-10 max-w-7xl">
        
        {/* Left: Text Content */}
        <div className="text-left w-full max-w-2xl mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-mint/15 border border-mint/30 text-sm font-semibold text-navy shadow-sm backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            NFC-Powered Connections
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-ink leading-[1.05]"
          >
            Your Card. <br className="hidden lg:block"/>
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              Your Brand.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-ink/70 font-medium leading-relaxed"
          >
            Tap your premium metal card to any smartphone and instantly share your contact info, social links, and portfolio. No app required.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-start"
          >
            <a href="#pricing" className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-ink bg-mint rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.35)] hover:scale-[1.02] active:scale-[0.98]">
              Get Your Card
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-navy border-2 border-navy/15 rounded-2xl transition-all duration-300 hover:border-navy/30 hover:bg-navy/5 bg-white/50 backdrop-blur-sm">
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Right: Animation Interactive Element */}
        <div className="relative h-[450px] sm:h-[550px] lg:h-[650px] w-full flex items-center justify-center lg:justify-end perspective-[1000px]">
          
          {/* Phone Mockup */}
          <div className="relative w-[240px] sm:w-[280px] h-[500px] sm:h-[580px] bg-ink rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-ink shadow-2xl overflow-hidden flex flex-col transform-gpu z-10">
            {/* Screen */}
            <div className="flex-1 bg-surface relative w-full flex flex-col items-center pt-10 sm:pt-12 overflow-hidden">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-6 sm:h-7 bg-ink rounded-b-2xl sm:rounded-b-3xl z-20"></div>
              
              {/* Fake Content on Screen (Blurred) */}
              <div className="w-full px-5 sm:px-6 flex flex-col gap-4 sm:gap-5 mt-10 opacity-30 blur-[1px]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-navy/20"></div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-3/4 h-3 sm:h-4 rounded bg-navy/20"></div>
                    <div className="w-1/2 h-2 sm:h-3 rounded bg-navy/10"></div>
                  </div>
                </div>
                <div className="w-full h-24 sm:h-32 bg-navy/10 rounded-2xl"></div>
                <div className="w-full h-10 sm:h-12 bg-navy/10 rounded-xl"></div>
                <div className="w-full h-10 sm:h-12 bg-navy/10 rounded-xl"></div>
              </div>

              {/* Notification Banner */}
              <motion.div 
                initial={{ y: -120, opacity: 0, scale: 0.9 }}
                animate={tapped ? { y: 16, opacity: 1, scale: 1 } : { y: -120, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
                className="absolute top-0 w-[90%] bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_20px_40px_rgba(0,35,102,0.15)] border border-white flex items-center gap-2 sm:gap-3 z-30"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-mint flex items-center justify-center shrink-0 shadow-inner">
                  <img src="/logoHB.svg" alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5 invert mix-blend-luminosity" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs sm:text-sm font-bold text-ink leading-tight">BuzzCard Studio</p>
                  <p className="text-[10px] sm:text-[11px] text-ink/60 font-medium mt-0.5">Alex shared their profile</p>
                </div>
              </motion.div>
              
              {/* Scan Overlay (active when not tapped) */}
              <motion.div 
                animate={{ opacity: tapped ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 flex items-center justify-center flex-col gap-4"
              >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-mint/20 flex items-center justify-center"
                >
                  <Wifi className="w-6 h-6 sm:w-8 sm:h-8 text-mint" />
                </motion.div>
                <span className="text-xs sm:text-sm font-semibold text-navy/70">Ready to scan</span>
              </motion.div>
            </div>
          </div>

          {/* Floating NFC Card (The Flip Card) */}
          <motion.div 
            initial={{ x: 150, y: 150, rotateY: 180, rotateZ: 20, opacity: 0, scale: 0.8 }}
            animate={tapped 
              ? { x: -20, y: 0, rotateY: 15, rotateZ: -5, opacity: 1, scale: 0.95 } // Tapped state
              : { x: 100, y: 80, rotateY: 190, rotateZ: 15, opacity: 1, scale: 1.05 } // Hovering state (showing back)
            }
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="absolute right-[5%] sm:right-[10%] lg:right-5 top-[20%] sm:top-[25%] lg:top-[35%] w-[150px] sm:w-[180px] lg:w-[220px] h-[240px] sm:h-[280px] lg:h-[340px] rounded-2xl shadow-[0_30px_60px_rgba(0,35,102,0.3)] z-20"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Inner rotating container */}
            <motion.div 
              className="w-full h-full rounded-2xl relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: tapped ? 0 : 180 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              {/* Front of Card */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-navy via-[#003599] to-navy border border-white/20 p-4 sm:p-5 lg:p-6 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <Wifi className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-mint" />
                  <img src="/logoHB.svg" alt="Logo" className="h-3 sm:h-4 invert opacity-50" />
                </div>

                <div className="relative z-10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-mint/10 border border-mint/20 mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center">
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-mint">A</span>
                  </div>
                  <p className="text-white font-bold text-sm sm:text-base lg:text-lg">Alex Designer</p>
                  <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm">Creative Director</p>
                </div>
              </div>

              {/* Back of Card */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tl from-ink via-[#1a1a1a] to-ink border border-white/10 flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-2xl"></div>
                <div className="w-3/4 h-8 sm:h-10 lg:h-12 bg-[#222] flex items-center justify-center">
                  <div className="w-full h-px bg-[#333]"></div>
                </div>
                <div className="absolute bottom-4 sm:bottom-5 lg:bottom-6 right-4 sm:right-5 lg:right-6 text-[8px] sm:text-[9px] lg:text-[10px] text-white/30 tracking-widest font-mono">
                  BUZZCARD
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Tap Effect Ripples */}
          {tapped && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute right-[15%] sm:right-[20%] lg:right-[150px] top-[50%] w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-mint z-15 pointer-events-none"
            />
          )}

        </div>
      </div>
    </section>
  );
}
