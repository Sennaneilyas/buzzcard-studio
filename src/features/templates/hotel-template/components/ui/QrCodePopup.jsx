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
        color: "#3B2A22",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#C9A96E",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#7A553A",
      },
      backgroundOptions: {
        color: "#FAF6F0",
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

    const fileName = (profile.slug || profile.name || "hotel")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await qrCodeRef.current.download({
      name: `buzzcard-${fileName || "hotel"}`,
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
          aria-labelledby="hotel-qr-title"
        >
          <motion.button
            type="button"
            aria-label="Fermer le QR code"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--hotel-espresso)]/55 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-[350px] rounded-[26px] border border-[var(--hotel-cappuccino)]/40 bg-white p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-[var(--hotel-latte)] text-[var(--hotel-espresso)] transition-colors hover:bg-[var(--hotel-cappuccino)]/50"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="pr-10">
              <h2
                id="hotel-qr-title"
                className="text-xl font-semibold text-[var(--hotel-espresso)] font-hotel-display"
              >
                QR Code de l'hôtel
              </h2>
              <p className="mt-1 text-xs text-[var(--hotel-mocha)]/70 font-hotel-body">
                Scannez pour ouvrir la carte de {profile.name}.
              </p>
            </div>

            <div
              className="mt-5 flex min-h-[230px] items-center justify-center overflow-hidden rounded-[20px] bg-[var(--hotel-ivory)]"
              role="img"
              aria-label={`QR code vers ${profileUrl}`}
            >
              <div ref={qrContainerRef} />
            </div>

            <p className="mt-3 truncate rounded-xl bg-[var(--hotel-latte)]/60 px-3 py-2 text-center text-[11px] text-[var(--hotel-mocha)]/70">
              {profileUrl}
            </p>

            <button
              type="button"
              onClick={handleDownload}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--hotel-espresso)] text-sm font-semibold text-white transition-colors hover:bg-[var(--hotel-mocha)]"
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
