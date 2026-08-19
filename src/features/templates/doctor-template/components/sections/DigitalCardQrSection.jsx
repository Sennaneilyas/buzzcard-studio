import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

export function DigitalCardQrSection({ profile }) {
  const handleDownload = () => {
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
  };
  
  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
      className="bg-[#f0f5fa] px-5 py-12 w-full flex flex-col items-center"
    >
      <motion.div variants={fadeInUp} className="w-full">
        <SectionHeader subtitle="ENREGISTRER LE CONTACT" title="Ma vCard" />
      </motion.div>
      <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center gap-4 p-6 bg-white rounded-[20px] border-[0.67px] border-[var(--primary-color, #4682b4)2e] shadow-[0px_2px_14px_rgba(70,130,180,0.1)] w-full max-w-[320px]">
        <img src="/img/container-1.svg" alt="QR Code" className="w-[200px]" />
        <p className="text-[var(--primary-color, #4682b4)8c] text-xs font-normal">vcards.info/dr-amina-elfassi</p>
        <motion.button 
          whileTap={{ scale: 0.95 }} onClick={handleDownload}
          className="w-full py-3 bg-[var(--primary-color, #4682b4)] text-white rounded-xl font-semibold text-sm mt-2"
        >
          ↓ Télécharger ma vCard
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

