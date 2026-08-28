import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import QRCodeStyling from "qr-code-styling";

const BUZZCARD_LOGO = "/justlogo.png";

function resolveProfileUrl(profile) {
  if (profile.profileUrl || profile.publicUrl) {
    return profile.profileUrl || profile.publicUrl;
  }

  if (typeof window === "undefined") return "";

  if (profile.slug) {
    return `${window.location.origin}/profile/${encodeURIComponent(profile.slug)}`;
  }

  const currentUrl = new URL(window.location.href);
  currentUrl.pathname = currentUrl.pathname.replace(/\/edit\/?$/, "");
  return currentUrl.toString();
}

export function QrCodePopup({ open, onClose, profile }) {
  const qrContainerRef = useRef(null);
  const qrCodeRef = useRef(null);
  const profileUrl = resolveProfileUrl(profile);

  useEffect(() => {
    if (!open || !qrContainerRef.current || !profileUrl) return undefined;

    const container = qrContainerRef.current;
    const qrCode = new QRCodeStyling({
      width: 230,
      height: 230,
      type: "svg",
      data: profileUrl,
      image: BUZZCARD_LOGO,
      dotsOptions: {
        type: "rounded",
        color: "#4682b4",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#315f87",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#315f87",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.24,
        margin: 8,
        crossOrigin: "anonymous",
      },
      qrOptions: {
        errorCorrectionLevel: "H",
      },
    });

    qrCodeRef.current = qrCode;
    container.innerHTML = "";
    qrCode.append(container);

    return () => {
      container.innerHTML = "";
      qrCodeRef.current = null;
    };
  }, [open, profileUrl]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;

    const fileName = (profile.slug || profile.fullName || "profil")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await qrCodeRef.current.download({
      name: `buzzcard-${fileName || "profil"}`,
      extension: "png",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="doctor-qr-title"
        >
          <motion.button
            type="button"
            aria-label="Fermer le QR code"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-[350px] rounded-[26px] border border-[var(--primary-color,#4682b4)20] bg-white p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="pr-10">
              <h2
                id="doctor-qr-title"
                className="font-poppins text-lg font-bold text-[var(--primary-color,#4682b4)]"
              >
                QR Code du profil
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Scannez pour ouvrir le profil de {profile.fullName}.
              </p>
            </div>

            <div
              className="mt-5 flex min-h-[230px] items-center justify-center overflow-hidden rounded-[20px] bg-white"
              role="img"
              aria-label={`QR code vers ${profileUrl}`}
            >
              <div ref={qrContainerRef} />
            </div>

            <p className="mt-3 truncate rounded-xl bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500">
              {profileUrl}
            </p>

            <button
              type="button"
              onClick={handleDownload}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-color,#4682b4)] text-sm font-semibold text-white transition-colors hover:bg-[#3b6d96]"
            >
              <Download className="size-4" aria-hidden="true" />
              Télécharger le QR Code
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
