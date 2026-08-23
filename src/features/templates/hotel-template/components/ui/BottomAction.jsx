import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, QrCode, Share2, X, Copy, CheckCheck, Mail } from "lucide-react";
import {
  SiWhatsapp,
  SiFacebook,
  SiInstagram,
  SiTripadvisor,
} from "react-icons/si";
import { CircleMenu } from "@/components/ui/circle-menu";

export function BottomAction({ profile, isEditMode = false }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isVisible, setIsVisible] = useState(isEditMode || false);

  useEffect(() => {
    if (isEditMode) return;
    
    const handleScroll = () => {
      setIsVisible(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEditMode]);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://buzzcard.ma";
  const shareText = `Découvrez ${profile.name} — ${profile.tagline}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareItems = [
    {
      label: "WhatsApp",
      icon: <SiWhatsapp className="w-4 h-4 text-[#25D366]" />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      label: "Instagram",
      icon: <SiInstagram className="w-4 h-4 text-[#E1306C]" />,
      href: "#",
    },
    {
      label: "TripAdvisor",
      icon: <SiTripadvisor className="w-4 h-4 text-[#34E0A1]" />,
      href: "#",
    },
    {
      label: "Facebook",
      icon: <SiFacebook className="w-4 h-4 text-[#1877F2]" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Email",
      icon: <Mail className="w-4 h-4 text-[#EA4335]" />,
      href: `mailto:?subject=${encodeURIComponent(profile.name)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
    {
      label: "Copier",
      icon: copiedLink ? (
        <CheckCheck className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-gray-700" />
      ),
      action: handleCopyLink,
      href: "#",
    },
  ];

  const handleDownloadQR = () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}&color=3B2A22&bgcolor=FAF6F0`;

    fetch(qrCodeUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_${profile.name.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(console.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
      transition={{ delay: 0, type: "spring", stiffness: 220, damping: 22 }}
      className="sticky bottom-4 w-full px-4 sm:px-6 z-50 pointer-events-none flex justify-center pb-2 mt-auto"
    >
      <div className="bg-[var(--hotel-espresso)]/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_10px_30px_rgba(59,42,34,0.5)] border border-[var(--hotel-mocha)]/30 flex items-center justify-between gap-3 pointer-events-auto w-full">
        {/* Book Now CTA */}
        <motion.a
          whileTap={{ scale: 0.96 }}
          href={`tel:${profile.phones?.[0]}`}
          className="flex-1 h-[46px] bg-white/10 hover:bg-white/20 text-[var(--hotel-latte)] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] shadow-sm transition-all font-hotel-body"
        >
          <Phone className="w-4 h-4" strokeWidth={2.2} />
          <span className="hidden xs:inline">Réserver</span>
        </motion.a>

        {/* Share Circle Menu (Middle) */}
        <div className="shrink-0 flex justify-center items-center relative -mt-6">
          <div className="bg-[var(--hotel-ivory)] p-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[var(--hotel-cappuccino)]/40">
            <CircleMenu
              items={shareItems}
              openIcon={
                <Share2 size={20} className="text-[var(--hotel-espresso)]" />
              }
              closeIcon={
                <X size={20} className="text-[var(--hotel-espresso)]" />
              }
            />
          </div>
        </div>

        {/* QR Code Downloader */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleDownloadQR}
          className="flex-1 h-[46px] bg-white/10 hover:bg-white/20 text-[var(--hotel-latte)] rounded-full flex items-center justify-center gap-2 transition-colors font-bold text-[13px] font-hotel-body"
          title="Télécharger le QR Code"
        >
          <QrCode className="w-[18px] h-[18px]" strokeWidth={2} />
          <span className="hidden xs:inline">QR</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
