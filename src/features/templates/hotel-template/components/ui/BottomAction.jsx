import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, QrCode, Share2, X, Copy, CheckCheck, Mail } from "lucide-react";
import {
  SiWhatsapp,
  SiFacebook,
  SiX,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { CircleMenu } from "@/components/ui/circle-menu";
import { QrCodePopup } from "./QrCodePopup";
import { resolveProfileUrl } from "../../utils/profileUrl";

export function BottomAction({ profile, isEditMode = false }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [useNativeShare, setUseNativeShare] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateShareMode = () => {
      setUseNativeShare(mediaQuery.matches && typeof navigator.share === "function");
    };

    updateShareMode();
    mediaQuery.addEventListener("change", updateShareMode);
    return () => mediaQuery.removeEventListener("change", updateShareMode);
  }, []);

  const shareUrl = resolveProfileUrl(profile);
  const shareText = `Découvrez ${profile.name} — ${profile.tagline}`;

  const handleCopyLink = async (event) => {
    event?.preventDefault();

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.warn("Hotel profile link copy failed", error);
    }
  };

  const shareItems = [
    {
      label: "WhatsApp",
      icon: <SiWhatsapp className="w-4 h-4 text-[#25D366]" />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "X",
      icon: <SiX className="w-4 h-4 text-black" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
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
    },
  ];

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: profile.name,
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("Hotel profile sharing failed", error);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 22 }}
        className="relative z-50 mt-auto w-full shrink-0 px-4 pt-2 pointer-events-none"
        style={{
          paddingBottom: isEditMode
            ? "16px"
            : "max(14px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="bg-[var(--hotel-espresso)]/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_10px_30px_rgba(59,42,34,0.5)] border border-[var(--hotel-mocha)]/30 flex items-center justify-between gap-3 pointer-events-auto w-full">
        {/* Book Now CTA */}
        {profile.phones?.[0] && <motion.a
          whileTap={{ scale: 0.96 }}
          href={`tel:${profile.phones?.[0]}`}
          className="flex-1 h-[46px] bg-white/10 hover:bg-white/20 text-[var(--hotel-latte)] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] shadow-sm transition-all font-hotel-body"
        >
          <Phone className="w-4 h-4" strokeWidth={2.2} />
          <span>Réserver</span>
        </motion.a>}

          {/* Native sharing on mobile; existing menu remains the desktop fallback. */}
          <div className="shrink-0 flex justify-center items-center relative -mt-6">
            <div className="bg-[var(--hotel-ivory)] p-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[var(--hotel-cappuccino)]/40">
              {useNativeShare ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={handleNativeShare}
                  aria-label="Partager cet hôtel"
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                >
                  <Share2 size={20} className="text-[var(--hotel-espresso)]" />
                </motion.button>
              ) : (
                <CircleMenu
                  items={shareItems}
                  openIcon={
                    <Share2 size={20} className="text-[var(--hotel-espresso)]" />
                  }
                  closeIcon={
                    <X size={20} className="text-[var(--hotel-espresso)]" />
                  }
                />
              )}
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowQrCode(true)}
            className="flex-1 h-[46px] bg-white/10 hover:bg-white/20 text-[var(--hotel-latte)] rounded-full flex items-center justify-center gap-2 transition-colors font-bold text-[13px] font-hotel-body"
            aria-label="Afficher le QR code de l'hôtel"
          >
            <QrCode className="w-[18px] h-[18px]" strokeWidth={2} />
            <span>QR</span>
          </motion.button>
        </div>
      </motion.div>

      <QrCodePopup
        open={showQrCode}
        onClose={() => setShowQrCode(false)}
        profile={profile}
      />
    </>
  );
}
