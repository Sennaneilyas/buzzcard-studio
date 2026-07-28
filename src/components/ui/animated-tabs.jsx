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
      <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 min-h-[65vh] bg-navy/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-white backdrop-blur-md rounded-3xl border border-white/10 ring-1 ring-white/5">
        {/* Subtle background glow effect inside the card */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/10 blur-[100px] rounded-full pointer-events-none" />
        
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
      </div>
    </motion.div>
  );
};

export { AnimatedTabs };
