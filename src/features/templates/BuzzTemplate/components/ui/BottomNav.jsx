import React, { useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserRoundPlus, QrCode, MessageSquare } from "lucide-react";
import { GLASS_SHADOW } from "../../utils/constants";
import { useShareProfile } from "../../hooks/useShareProfile";

/**
 * Fixed bottom tab bar: Enregistrer (share/save profile), QR Code, Avis.
 */
function BottomNav({
  activeTab,
  setActiveTab,
  onSave,
  onQrCode,
  onReview,
  shouldReduceMotion,
}) {
  const { srMessage, share } = useShareProfile(onSave);

  const handleSave = useCallback(async () => {
    setActiveTab("enregistrer");
    await share();
  }, [setActiveTab, share]);

  const items = useMemo(
    () => [
      {
        id: "enregistrer",
        label: "Enregistrer",
        icon: UserRoundPlus,
        action: handleSave,
      },
      {
        id: "qrcode",
        label: "QR Code",
        icon: QrCode,
        action: () => {
          setActiveTab("qrcode");
          if (onQrCode) onQrCode();
        },
      },
      {
        id: "avis",
        label: "Avis",
        icon: MessageSquare,
        action: () => {
          setActiveTab("avis");
          if (onReview) onReview();
        },
      },
    ],
    [handleSave, onReview, onQrCode, setActiveTab]
  );

  return (
    <nav
      className="relative z-20 w-full shrink-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigation principale"
    >
      <div
        className={`absolute inset-x-0 bottom-0 h-[82px] bg-white/50 rounded-t-[25px] backdrop-blur-lg ${GLASS_SHADOW}`}
        aria-hidden="true"
      />

      <div className="relative h-[82px] w-full max-w-[430px] mx-auto flex items-center justify-center gap-x-6 sm:gap-x-8 px-4">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const isSpecial = item.id === "qrcode";
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center justify-center transition-all duration-300 ease-out z-10 outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 active:scale-95 ${
                isSpecial
                  ? "bg-neutral-950 text-white rounded-full shadow-md h-[54px]"
                  : "h-[50px] rounded-full active:bg-white/20"
              } ${
                isActive
                  ? "px-5 w-auto"
                  : isSpecial
                    ? "w-[54px]"
                    : "w-[50px]"
              }`}
            >
              {isActive && !isSpecial && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 rounded-full bg-white/70 shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: shouldReduceMotion ? 0 : 0.4,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 shrink-0 ${
                    isSpecial
                      ? "text-white"
                      : isActive
                        ? "text-neutral-950"
                        : "text-neutral-950/70"
                  }`}
                />

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.25,
                        ease: "easeOut",
                      }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <span
                        className={`block pl-2 text-[13px] font-semibold ${
                          isSpecial ? "text-white" : "text-neutral-950"
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>

      <span className="sr-only" aria-live="polite">
        {srMessage}
      </span>
    </nav>
  );
}

export default React.memo(BottomNav);
