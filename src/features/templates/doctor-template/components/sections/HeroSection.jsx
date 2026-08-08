import { useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { staggerContainer, fadeInUp } from "../../utils/animations";
import { InteractiveHoverButton } from "../ui/InteractiveHoverButton";

function AnimatedCounter({ from = 0, to, duration = 1, delay = 0, suffix = "" }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      delay,
      onUpdate(value) {
        setCount(Math.round(value));
      }
    });
    return () => controls.stop();
  }, [from, to, duration, delay]);

  const formatted = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return <>{formatted}{suffix}</>;
}

export function HeroSection({ profile }) {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "À propos" },
    { id: "education", label: "Formation" },
    { id: "awards", label: "Distinctions" },
  ];

  return (
    <div className="bg-[#4682b4] relative w-full flex flex-col pb-[32px]">
      <div className="relative w-full h-[160px]">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#f0f5fa]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(70,130,180,0.1)] to-[rgba(70,130,180,0.8)]" />
        

      </div>
      
      <div className="px-5 w-full relative">
        <div className="flex justify-between items-end -mt-[50px] mb-3 relative z-10">
          <motion.div 
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="p-[2px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={{ borderRadius: "46% 54% 39% 61% / 54% 42% 58% 46%" }}
          >
            <div 
              className="w-[104px] h-[104px] overflow-hidden bg-[#f0f5fa]"
              style={{ borderRadius: "46% 54% 39% 61% / 54% 42% 58% 46%" }}
            >
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2 mb-2"
          >
            <InteractiveHoverButton 
              text="Prendre RDV"
              onClick={() => document.getElementById("appointments-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-[13px] h-[36px]"
            />
          </motion.div>
        </div>

        <div className="flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between w-full mb-1"
          >
            <h1 className="font-['Poppins'] font-bold text-[24px] text-white leading-tight">
              {profile.fullName}
            </h1>
            <div className="flex gap-3">
              <motion.a href="#" whileHover={{ scale: 1.15, y: -2 }} className="text-[rgba(255,255,255,0.7)] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.15, y: -2 }} className="text-[rgba(255,255,255,0.7)] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.15, y: -2 }} className="text-[rgba(255,255,255,0.7)] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </motion.a>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[15px] font-medium text-[rgba(255,255,255,0.9)] mb-4"
          >
            {profile.title}
          </motion.p>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex gap-2 mb-6 flex-wrap"
          >
            {["Cardiologie", "Soins Préventifs", "ECG"].map((tag) => (
              <motion.span 
                key={tag}
                variants={fadeInUp}
                className="bg-[rgba(255,255,255,0.15)] border-[0.667px] border-[rgba(255,255,255,0.25)] rounded-full px-[12px] py-[4px] font-medium text-[11px] text-white"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[rgba(255,255,255,0.1)] border-[0.667px] border-[rgba(255,255,255,0.2)] rounded-[12px] p-1 flex w-full mb-4"
          >
            {tabs.map((tab) => (
              <motion.button 
                key={tab.id}
                whileTap={{ scale: 0.95 }} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-[8px] py-1.5 font-semibold text-[12px] transition-all ${activeTab === tab.id ? "bg-white text-[#4682b4] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]" : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)]"}`}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
          
          <div className="h-[80px] w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 text-[13px] text-[rgba(255,255,255,0.85)] leading-relaxed whitespace-pre-line"
              >
                {profile[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex w-full mt-6 pt-5 border-t-[0.667px] border-[rgba(255,255,255,0.2)]"
          >
            <div className="flex-1 flex flex-col items-start">
              <span className="font-['Poppins'] font-bold text-[18px] text-white leading-tight">
                <AnimatedCounter to={14} delay={0.7} suffix="+" />
              </span>
              <span className="text-[11px] text-[rgba(255,255,255,0.7)] mt-0.5">Ans Exp.</span>
            </div>
            <div className="flex-1 flex flex-col items-start border-l-[0.667px] border-[rgba(255,255,255,0.2)] pl-4">
              <span className="font-['Poppins'] font-bold text-[18px] text-white leading-tight">
                <AnimatedCounter to={2800} delay={1.5} suffix="+" />
              </span>
              <span className="text-[11px] text-[rgba(255,255,255,0.7)] mt-0.5">Patients</span>
            </div>
            <div className="flex-1 flex flex-col items-start border-l-[0.667px] border-[rgba(255,255,255,0.2)] pl-4">
              <span className="font-['Poppins'] font-bold text-[18px] text-white leading-tight">
                <AnimatedCounter to={98} delay={2.3} suffix="%" />
              </span>
              <span className="text-[11px] text-[rgba(255,255,255,0.7)] mt-0.5">Satisfaction</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
