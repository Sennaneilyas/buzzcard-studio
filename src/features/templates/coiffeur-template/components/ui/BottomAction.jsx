import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRoundPlus, Check, Share2, X, Copy, CheckCheck, Mail, MessageSquare } from "lucide-react";

export function BottomAction({ profile }) {
  const [saved, setSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://buzzcard.ma";
  const shareTitle = `${profile.fullName} · ${profile.title}`;
  const shareText = `Découvrez la carte digitale de ${profile.fullName} (${profile.title}) :`;

  const handleSaveContact = useCallback(() => {
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

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [profile]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const socialSharePlatforms = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366] text-white hover:bg-[#20bd5a]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.101.005.241-.039.377.29.144.35.49 1.199.534 1.285.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.181-.076.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
    },
    {
      name: "LinkedIn",
      color: "bg-[#0077B5] text-white hover:bg-[#00669c]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.65 1.65 0 0 0-1.66 1.64c0 .91.74 1.65 1.66 1.65.9 0 1.64-.74 1.64-1.65A1.65 1.65 0 0 0 7.83 6.2Z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2] text-white hover:bg-[#166fe5]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "X",
      color: "bg-[#1A1A1A] text-white hover:bg-black",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "E-mail",
      color: "bg-[#ea4335] text-white hover:bg-[#d93025]",
      icon: <Mail className="w-4 h-4" />,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
    },
    {
      name: "SMS",
      color: "bg-[#1A1A1A] text-white hover:bg-black",
      icon: <MessageSquare className="w-4 h-4" />,
      url: `sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`
    }
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 22 }}
        className="sticky bottom-3.5 sm:bottom-4 px-4 w-full z-40 mt-auto pointer-events-none"
      >
        <div className="bg-[#1A1A1A]/95 backdrop-blur-md rounded-[15px] p-1 shadow-[0_6px_22px_rgba(0,0,0,0.25)] border border-white/10 flex items-center gap-1.5 pointer-events-auto">
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

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowShareModal(true)}
            aria-label="Partager ce profil"
            className="w-[40px] h-[40px] bg-white/10 hover:bg-white/20 text-white rounded-[11px] flex items-center justify-center shrink-0 transition-colors border border-white/10"
          >
            <Share2 className="w-[16px] h-[16px]" strokeWidth={2} />
          </motion.button>
        </div>
      </motion.div>

      {/* Share Modal Sheet */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-[420px] bg-white rounded-t-[28px] sm:rounded-[24px] p-5 shadow-2xl z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-times text-[#1A1A1A] text-[18px] leading-none mb-1">
                      Partager le profil
                    </h3>
                    <p className="text-[12px] text-gray-500">
                      {profile.fullName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-[#1A1A1A] hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {socialSharePlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareModal(false)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-[16px] bg-[#F9F9F9] hover:bg-[#F0F0F0] border border-black/5 transition-all group active:scale-95"
                  >
                    <div className={`w-9 h-9 rounded-full ${platform.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      {platform.icon}
                    </div>
                    <span className="text-[11px] font-medium text-[#1A1A1A]">
                      {platform.name}
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#F9F9F9] rounded-[14px] border border-black/5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent px-2 text-[12px] text-gray-600 outline-none truncate select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#1A1A1A] text-white rounded-[10px] text-[12px] font-semibold flex items-center gap-1 hover:bg-[#C5A880] transition-colors shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
