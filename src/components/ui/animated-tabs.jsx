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
    <div className={cn("w-full max-w-3xl flex flex-col gap-y-1", className)}>
      {/* Tab pills row */}
      <div className="flex gap-2 flex-wrap bg-navy/90 backdrop-blur-sm p-1.5 rounded-xl">
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
      <div className="p-5 sm:p-6 bg-navy/90 shadow-[0_0_30px_rgba(0,35,102,0.15)] text-white backdrop-blur-sm rounded-xl border border-white/5 min-h-60 h-full">
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
  );
};

export { AnimatedTabs };
