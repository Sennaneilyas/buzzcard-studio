import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRoundPlus, Check, Share2, Copy, CheckCheck } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

export function BottomAction({ profile, isEditMode = false }) {
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://buzzcard.ma";
  const shareText = `Découvrez la carte digitale de ${profile?.fullName || ""} (${profile?.title || ""}) :`;

  const handleSaveContact = useCallback(() => {
    const { fullName, phones, emails, location, title } = profile || {};
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

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [profile]);

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
      color: "bg-[#25D366] text-white hover:bg-[#20bd5a]",
      icon: <SiWhatsapp className="w-4 h-4" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
    },
    {
      name: "LinkedIn",
      color: "bg-[#0077B5] text-white hover:bg-[#00669c]",
      icon: <FaLinkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2] text-white hover:bg-[#166fe5]",
      icon: <SiFacebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "X",
      color: "bg-[#1A1A1A] text-white hover:bg-black",
      icon: <SiX className="w-3 h-3" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Copy",
      color: "bg-white text-[#1A1A1A] hover:bg-gray-100",
      icon: copiedLink ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />,
      action: handleCopyLink
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 22 }}
      className={`sticky px-4 w-full z-50 mt-auto pointer-events-none ${isEditMode ? "bottom-4" : "bottom-3.5 sm:bottom-4"}`}
    >
      <div className="bg-[#1A1A1A]/95 backdrop-blur-md rounded-[15px] p-1 shadow-[0_6px_22px_rgba(0,0,0,0.25)] border border-white/10 flex items-center gap-1.5 pointer-events-auto relative">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveContact}
          className="flex-1 h-[40px] bg-white text-[#1A1A1A] rounded-[11px] flex items-center justify-center gap-1.5 font-semibold text-[13px] shadow-sm hover:bg-gray-100 transition-colors"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 text-[#10b981]"
              >
                <Check className="w-[15px] h-[15px]" strokeWidth={2.5} />
                <span>Contact Enregistré !</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5"
              >
                <UserRoundPlus className="w-[15px] h-[15px]" strokeWidth={2.2} />
                <span>Enregistrer Contact</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Share Button & Radial Menu Wrapper */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            aria-label="Partager ce profil"
            className={`w-[40px] h-[40px] rounded-[11px] flex items-center justify-center shrink-0 transition-colors border ${
              showShareMenu 
                ? "bg-white text-[#1A1A1A] border-transparent" 
                : "bg-white/10 hover:bg-white/20 text-white border-white/10"
            }`}
          >
            <Share2 className="w-[16px] h-[16px]" strokeWidth={2} />
          </motion.button>

          {/* Radial Half-Circle Menu */}
          <AnimatePresence>
            {showShareMenu && (
              <>
                {/* Backdrop to close menu on outside click */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setShowShareMenu(false)}
                />
                
                {socialSharePlatforms.map((platform, i) => {
                  // Calculate quarter-circle arc (90 degrees to 180 degrees)
                  // So it blooms up and to the left of the share button.
                  const angle = (Math.PI / 2) + (i * (Math.PI / 2) / (socialSharePlatforms.length - 1));
                  const radius = 75; // Distance from the share button
                  const x = Math.cos(angle) * radius;
                  const y = -Math.sin(angle) * radius;

                  return (
                    <motion.a
                      key={platform.name}
                      href={platform.url || "#"}
                      onClick={(e) => {
                        if (platform.action) {
                          e.preventDefault();
                          platform.action();
                        } else {
                          setShowShareMenu(false);
                        }
                      }}
                      target={platform.url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: 1, scale: 1, x, y }}
                      exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      transition={{ 
                        delay: i * 0.04, 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25 
                      }}
                      className={`absolute top-0 left-0 w-10 h-10 rounded-full ${platform.color} flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.2)] border border-black/5 hover:scale-110 active:scale-95 transition-transform`}
                      style={{ originX: 0.5, originY: 0.5 }}
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
