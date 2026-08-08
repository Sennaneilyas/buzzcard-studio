import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRoundPlus, Check } from "lucide-react";

export function BottomAction({ profile }) {
  const [saved, setSaved] = useState(false);

  const handleSaveContact = useCallback(() => {
    const { fullName, phones, emails } = profile;
    const vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${fullName ?? ""}`,
      ...(phones || []).map((p) => `TEL:${p}`),
      ...(emails || []).map((e) => `EMAIL:${e}`),
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `${fullName ?? "contact"}.vcf` });
    a.click();
    URL.revokeObjectURL(url);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [profile]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      className="absolute bottom-6 left-5 right-5 z-50"
    >
      <div className="bg-[#4682b4] rounded-[16px] p-[2px] shadow-[0_8px_32px_rgba(70,130,180,0.25)] border-[0.667px] border-[rgba(255,255,255,0.25)]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveContact}
          className="w-full h-[52px] bg-[#4682b4] text-white rounded-[14px] flex items-center justify-center gap-2 font-semibold text-[15px] hover:bg-[#3b6d96] transition-colors relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center gap-2"
              >
                <Check className="w-[18px] h-[18px]" />
                Contact Enregistré!
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center gap-2"
              >
                <UserRoundPlus className="w-[18px] h-[18px]" />
                Enregistrer Contact
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
