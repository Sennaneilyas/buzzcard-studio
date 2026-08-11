import { motion } from "framer-motion";
import { Scan } from "lucide-react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { fadeInUp } from "../../utils/animations";

export function QRSection({ profile }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://buzzcard.ma";
  // The QR code API is a fast, reliable, open source way to get QR codes without adding deps.
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}&color=3B2A22&bgcolor=FAF6F0`;

  return (
    <SectionWrapper className="flex flex-col items-center py-12">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full max-w-[320px] bg-white/70 backdrop-blur-md rounded-[32px] p-8 border border-[var(--hotel-cappuccino)]/40 shadow-[0_15px_40px_rgba(59,42,34,0.06)] flex flex-col items-center relative overflow-hidden"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--hotel-gold)]/60 rounded-tl-[32px] opacity-70 m-2 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--hotel-gold)]/60 rounded-tr-[32px] opacity-70 m-2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--hotel-gold)]/60 rounded-bl-[32px] opacity-70 m-2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--hotel-gold)]/60 rounded-br-[32px] opacity-70 m-2 pointer-events-none" />
        
        <div className="mb-5 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[var(--hotel-ivory)] border border-[var(--hotel-cappuccino)]/50 flex items-center justify-center text-[var(--hotel-caramel)] mb-3 shadow-sm">
            <Scan className="w-4 h-4" strokeWidth={2} />
          </div>
          <h3 className="text-xl text-[var(--hotel-espresso)] text-center font-hotel-display font-semibold">
            Passeport Digital
          </h3>
          <p className="text-[11px] text-[var(--hotel-mocha)] text-center mt-1 uppercase tracking-widest font-hotel-body">
            Scannez pour partager
          </p>
        </div>

        <div className="relative bg-white p-3 rounded-2xl shadow-inner border border-[var(--hotel-latte)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--hotel-gold)]/10 to-transparent rounded-2xl pointer-events-none" />
          <img 
            src={qrCodeUrl} 
            alt={`QR Code pour ${profile.name}`} 
            className="w-40 h-40 object-contain rounded-xl mix-blend-multiply"
            loading="lazy"
          />
          {/* Small logo overlay in the center of the QR code */}
          {profile.avatarUrl && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
              <img src={profile.avatarUrl} alt="Logo" className="w-full h-full rounded-full object-cover" />
            </div>
          )}
        </div>

        <div className="mt-6 w-full flex items-center justify-center gap-3">
           <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--hotel-cappuccino)]/50" />
           <p className="text-[10px] text-[var(--hotel-caramel)] font-bold tracking-widest uppercase truncate max-w-[120px] font-hotel-body">
             {profile.name}
           </p>
           <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--hotel-cappuccino)]/50" />
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
