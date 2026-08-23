import { useState } from "react";
import { motion } from "framer-motion";

export function ContactRow({ icon: Icon, label, value, actionLabel, href }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-[0.667px] border-[rgba(70,130,180,0.18)] drop-shadow-[0px_2px_7px_rgba(70,130,180,0.1)] rounded-[20px] p-3.5 flex items-center gap-3">
      <div className="w-[38px] h-[38px] rounded-[8px] bg-[rgba(70,130,180,0.08)] flex items-center justify-center shrink-0 text-[var(--primary-color,#4682b4)]">
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-[rgba(70,130,180,0.55)] mb-0.5">{label}</p>
        <p className="text-[13px] font-semibold text-[var(--primary-color,#4682b4)] truncate">{value}</p>
      </div>
      <div className="flex gap-1.5">
        <motion.a 
          whileTap={{ scale: 0.95 }}
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[var(--primary-color,#4682b4)] text-white text-[11px] font-semibold h-[28px] w-[64px] rounded-[8px] hover:bg-[#3b6d96] transition-colors flex items-center justify-center shrink-0"
        >
          {actionLabel}
        </motion.a>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="border-[0.667px] border-[rgba(70,130,180,0.18)] text-[rgba(70,130,180,0.55)] text-[11px] font-semibold h-[28px] w-[64px] rounded-[8px] hover:bg-[rgba(70,130,180,0.05)] transition-colors flex items-center justify-center shrink-0"
        >
          {copied ? "Copié!" : "Copier"}
        </motion.button>
      </div>
    </div>
  );
}

