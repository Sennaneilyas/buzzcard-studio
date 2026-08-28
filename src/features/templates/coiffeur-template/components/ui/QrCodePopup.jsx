import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { resolveProfileUrl } from "../../utils/profileUrl";

const BUZZCARD_LOGO = "/justlogo.png";

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
        color: "#1A1A1A",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#C5A880",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#1A1A1A",
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
          aria-labelledby="coiffeur-qr-title"
        >
          <motion.button
            type="button"
            aria-label="Fermer le QR code"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-[350px] rounded-[26px] border border-black/5 bg-white p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-[#F5F5F5] text-[#1A1A1A] transition-colors hover:bg-[#EDEDED]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="pr-10">
              <h2
                id="coiffeur-qr-title"
                className="font-times text-xl font-bold text-[#1A1A1A]"
              >
                QR Code du profil
              </h2>
              <p className="mt-1 text-xs text-gray-500">
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

            <p className="mt-3 truncate rounded-xl bg-[#F8F8F8] px-3 py-2 text-center text-[11px] text-gray-500">
              {profileUrl}
            </p>

            <button
              type="button"
              onClick={handleDownload}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-color,#C5A880)]"
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
