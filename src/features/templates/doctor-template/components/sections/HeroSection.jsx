import { useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { staggerContainer, fadeInUp } from "../../utils/animations";
import { InteractiveHoverButton } from "../ui/InteractiveHoverButton";
import EditableImage from "@/components/ui/EditableImage";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

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

export function HeroSection({ profile, isEditMode }) {
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "À propos" },
    { id: "education", label: "Formation" },
    { id: "awards", label: "Distinctions" },
  ];

  const handleScrollToAppointments = () => {
    const el = document.getElementById("appointments-section");
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.pageYOffset - 16;
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const duration = 750;
      let startTime = null;

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }
  };

  return (
    <div className="bg-[var(--primary-color,#4682b4)] relative w-full flex flex-col pb-[32px]">
      <div className="relative w-full h-[160px]">
        <EditableImage
          src={profile.bannerUrl || ""}
          alt="Banner"
          isEditMode={isEditMode}
          onChange={(val) => setProfileData({ bannerUrl: val })}
          className="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(70,130,180,0.1)] to-[rgba(70,130,180,0.8)] pointer-events-none" />
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
              className="w-[104px] h-[104px] overflow-hidden bg-[#F8FAFC]"
              style={{ borderRadius: "46% 54% 39% 61% / 54% 42% 58% 46%" }}
            >
              <EditableImage
                src={profile.avatarUrl || ""}
                alt={profile.fullName}
                isEditMode={isEditMode}
                onChange={(val) => setProfileData({ avatarUrl: val })}
                className="w-full h-full object-cover"
              />
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
              onClick={handleScrollToAppointments}
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
            <EditableText
              as="h1"
              value={profile.fullName || ""}
              onChange={(val) => setProfileData({ name: val })}
              isEditMode={isEditMode}
              placeholder="Doctor Name"
              className="font-poppins font-bold text-[22px] text-white leading-tight"
            />
            <div className="flex items-center gap-2.5">
              {profile.phones?.[0] && (
                <motion.a 
                  href={`tel:${profile.phones[0]}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Appeler"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </motion.a>
              )}
              {profile.emails?.[0] && (
                <motion.a 
                  href={`mailto:${profile.emails[0]}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Envoyer un email"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </motion.a>
              )}
              {profile.location && (
                <motion.a 
                  href={`https://maps.google.com/?q=${profile.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Itinéraire"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                </motion.a>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3.5 w-full"
          >
            <EditableText
              as="p"
              value={profile.title || ""}
              onChange={(val) => setProfileData({ role: val })}
              isEditMode={isEditMode}
              placeholder="Specialty / Title"
              className="text-[14px] font-medium text-[rgba(255,255,255,0.92)]"
            />
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex gap-1.5 mb-5 flex-wrap"
          >
            {["Cardiologie", "Soins Préventifs", "ECG"].map((tag) => (
              <motion.span 
                key={tag}
                variants={fadeInUp}
                className="bg-[rgba(255,255,255,0.14)] border-[0.667px] border-[rgba(255,255,255,0.22)] rounded-full px-[10px] py-[3px] font-medium text-[11px] text-white"
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
                className={`flex-1 rounded-[8px] py-1.5 font-semibold text-[12px] transition-all ${activeTab === tab.id ? "bg-white text-[var(--primary-color,#4682b4)] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]" : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)]"}`}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
          
          <div className="min-h-[76px] w-full relative py-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[13px] text-[rgba(255,255,255,0.88)] leading-relaxed whitespace-pre-line"
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
              <span className="font-poppins font-bold text-[18px] text-white leading-tight">
                <AnimatedCounter to={14} delay={0.7} suffix="+" />
              </span>
              <span className="text-[11px] text-[rgba(255,255,255,0.7)] mt-0.5">Ans Exp.</span>
            </div>
            <div className="flex-1 flex flex-col items-start border-l-[0.667px] border-[rgba(255,255,255,0.2)] pl-4">
              <span className="font-poppins font-bold text-[18px] text-white leading-tight">
                <AnimatedCounter to={2800} delay={1.5} suffix="+" />
              </span>
              <span className="text-[11px] text-[rgba(255,255,255,0.7)] mt-0.5">Patients</span>
            </div>
            <div className="flex-1 flex flex-col items-start border-l-[0.667px] border-[rgba(255,255,255,0.2)] pl-4">
              <span className="font-poppins font-bold text-[18px] text-white leading-tight">
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

