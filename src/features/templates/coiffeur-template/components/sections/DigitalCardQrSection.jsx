import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

export function DigitalCardQrSection({ profile }) {
  const handleDownload = () => {
    const { fullName, phones, emails, location, title } = profile;
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fullName ?? ""}`,
      `TITLE:${title ?? ""}`,
      ...(phones || []).map((p) => `TEL;TYPE=CELL:${p}`),
      ...(emails || []).map((e) => `EMAIL;TYPE=WORK:${e}`),
      location ? `ADR;TYPE=WORK:;;${location};;;;` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `${fullName ?? "contact"}.vcf`
    });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <motion.section 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }} 
      variants={staggerContainer}
      className="bg-transparent px-6 py-12 w-full flex flex-col items-center"
    >
      <motion.div variants={fadeInUp} className="w-full">
        <SectionHeader subtitle="Réseau" title="Scanner le profil" align="center" />
      </motion.div>

      <motion.div 
        variants={fadeInUp} 
        className="mt-8 flex flex-col items-center gap-5 p-8 bg-white rounded-[24px] border border-black/5 shadow-sm w-full max-w-[320px]"
      >
        <div className="w-[180px] h-[180px] bg-gray-50 flex items-center justify-center rounded-[16px] border border-black/5 overflow-hidden">
          {/* We use a placeholder image for the QR code, similar to the doctor template */}
          <img src="/img/container-coiffeur.svg" alt="QR Code" className="w-[85%] h-[85%] opacity-80" />
        </div>
        
        <p className="text-gray-400 text-xs font-medium tracking-wide">
          buzzcard.ma/{profile.fullName?.toLowerCase().replace(/\s+/g, '-')}
        </p>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }} 
          onClick={handleDownload}
          className="w-full py-3.5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-[12px] font-semibold text-[13px] tracking-wide transition-colors mt-2"
        >
          Enregistrer ma vCard
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
