import { motion } from "framer-motion";

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-[#d3d3d3] flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 flex items-center justify-center"
      >
        <img src="/logoHB.svg" alt="BuzzCard Logo" className="w-full h-full object-contain" />
      </motion.div>
    </div>
  );
}
