import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AnimatedTabs — Pill-based tab switcher with smooth animated content transitions.
 * Adapted from shadcn-style component for BuzzCard Studio (JSX, no TypeScript).
 *
 * Props:
 *   tabs       — Array of { id, label, content } objects
 *   defaultTab — ID of the initially active tab
 *   className  — Optional wrapper className override
 */
const AnimatedTabs = ({ tabs = [], defaultTab, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("w-full flex flex-col gap-y-3", className)}
    >
      {/* Tab pills row */}
      <div className="flex gap-2 flex-wrap bg-navy/90 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-lg text-white/70 outline-none transition-colors hover:text-white"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white/15 shadow-[0_0_20px_rgba(0,230,118,0.08)] backdrop-blur-sm rounded-lg"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content area */}
      <div className="relative flex-1 w-full text-white flex flex-col mt-4">
        
        <div className="relative z-10 w-full h-full flex flex-col">
          {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  x: -10,
                  filter: "blur(10px)",
                }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
                transition={{
                  duration: 0.5,
                  ease: "circInOut",
                  type: "spring",
                }}
              >
                {tab.content}
              </motion.div>
            )
        )}
        </div>

        {/* Global Onboarding Navigation Buttons */}
        <div className="relative z-10 w-full flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => {
              const idx = tabs.findIndex(t => t.id === activeTab);
              if (idx > 0) setActiveTab(tabs[idx - 1].id);
            }}
            disabled={tabs.findIndex(t => t.id === activeTab) === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <button
            onClick={() => {
              const idx = tabs.findIndex(t => t.id === activeTab);
              if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
            }}
            disabled={tabs.findIndex(t => t.id === activeTab) === tabs.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mint text-navy font-bold text-sm hover:bg-[#00c968] transition-colors shadow-[0_0_15px_rgba(0,230,118,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export { AnimatedTabs };
