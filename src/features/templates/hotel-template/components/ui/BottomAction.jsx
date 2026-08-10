import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Check, Share2, Copy, CheckCheck } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

export function BottomAction({ profile }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://buzzcard.ma";
  const shareText = `Découvrez ${profile.name} — ${profile.tagline}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShowShareMenu(false);
    }, 1500);
  };

  const socialSharePlatforms = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366]",
      icon: <SiWhatsapp className="w-4 h-4 text-white" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2]",
      icon: <SiFacebook className="w-4 h-4 text-white" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "X",
      color: "bg-[#1A1A1A]",
      icon: <SiX className="w-3 h-3 text-white" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "LinkedIn",
      color: "bg-[#0077B5]",
      icon: <FaLinkedin className="w-4 h-4 text-white" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Copy",
      color: "bg-white border border-[#D6BFA6]/30",
      icon: copiedLink ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#3B2A22]" />,
      action: handleCopyLink
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 22 }}
      className="sticky bottom-3.5 sm:bottom-4 px-4 w-full z-40 mt-auto pointer-events-none"
    >
      <div className="bg-[#3B2A22]/95 backdrop-blur-md rounded-[15px] p-1 shadow-[0_6px_22px_rgba(59,42,34,0.35)] border border-[#7A553A]/20 flex items-center gap-1.5 pointer-events-auto">
        {/* Book Now CTA */}
        <motion.a
          whileTap={{ scale: 0.98 }}
          href={`tel:${profile.phones?.[0]}`}
          className="flex-1 h-[42px] bg-[#C9A96E] hover:bg-[#B08968] text-[#3B2A22] rounded-[11px] flex items-center justify-center gap-2 font-bold text-[13px] shadow-sm transition-colors"
          style={{ fontFamily: "var(--hotel-font-body)" }}
        >
          <Phone className="w-[14px] h-[14px]" strokeWidth={2.2} />
          Réserver Maintenant
        </motion.a>

        {/* Share Button & Radial Menu */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            aria-label="Partager ce profil"
            className={`w-[42px] h-[42px] rounded-[11px] flex items-center justify-center shrink-0 transition-colors border ${
              showShareMenu
                ? "bg-[#C9A96E] text-[#3B2A22] border-transparent"
                : "bg-white/10 hover:bg-white/20 text-[#D6BFA6] border-white/10"
            }`}
          >
            <Share2 className="w-[16px] h-[16px]" strokeWidth={2} />
          </motion.button>

          {/* Radial Half-Circle */}
          <AnimatePresence>
            {showShareMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setShowShareMenu(false)}
                />
                {socialSharePlatforms.map((platform, i) => {
                  const angle = (Math.PI / 2) + (i * (Math.PI / 2) / (socialSharePlatforms.length - 1));
                  const radius = 75;
                  const x = Math.cos(angle) * radius;
                  const y = -Math.sin(angle) * radius;

                  return (
                    <motion.a
                      key={platform.name}
                      href={platform.url || "#"}
                      onClick={(e) => {
                        if (platform.action) { e.preventDefault(); platform.action(); }
                        else { setShowShareMenu(false); }
                      }}
                      target={platform.url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: 1, scale: 1, x, y }}
                      exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 25 }}
                      className={`absolute top-0 left-0 w-10 h-10 rounded-full ${platform.color} flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-transform`}
                    >
                      {platform.icon}
                    </motion.a>
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
