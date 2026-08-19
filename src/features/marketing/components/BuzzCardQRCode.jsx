import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Download, X } from "lucide-react";

const BUZZCARD_LOGO = "/justlogo.png";

export default function BuzzCardQRCode({ profile = {}, onClose }) {
  const qrRef = useRef(null);
  const qrCodeRef = useRef(null);

  const fullName = profile.fullName || "BuzzCard";
  const slug =
    profile.slug ||
    fullName
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");

  const profileUrl = `https://buzzcard.ma/profile/${slug}`;

  useEffect(() => {
    if (!qrRef.current) return;

    qrCodeRef.current = new QRCodeStyling({
      width: 260,
      height: 260,

      type: "svg",

      data: profileUrl,

      image: BUZZCARD_LOGO,

      dotsOptions: {
        type: "rounded",
        color: "#0A0A0A",
      },

      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#0A0A0A",
      },

      cornersDotOptions: {
        type: "dot",
        color: "#0A0A0A",
      },

      backgroundOptions: {
        color: "transparent",
      },

      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.25,
        margin: 8,
        crossOrigin: "anonymous",
      },

      qrOptions: {
        errorCorrectionLevel: "H",
      },
    });

    const currentRef = qrRef.current;
    currentRef.innerHTML = "";
    qrCodeRef.current.append(currentRef);

    return () => {
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [profileUrl]);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;

    await qrCodeRef.current.download({
      name: `buzzcard-${slug}`,
      extension: "png",
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-5">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* QR Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[360px]
          rounded-[28px]
          bg-white/90
          backdrop-blur-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.20)]
          p-6
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="
            absolute
            right-4
            top-4
            w-9
            h-9
            rounded-full
            bg-black/5
            flex
            items-center
            justify-center
            hover:bg-black/10
            transition-colors
          "
        >
          <X className="w-4 h-4 text-neutral-900" />
        </button>

        {/* Header */}
        <div className="text-center pt-2">
          <h2 className="text-xl font-bold text-neutral-950">Mon QR Code</h2>

          <p className="mt-1 text-xs text-neutral-500">
            Scannez pour ouvrir mon BuzzCard
          </p>
        </div>

        {/* QR */}
        <div
          className="
            mt-6
            flex
            items-center
            justify-center
            rounded-[24px]
            bg-transparent
            min-h-[260px]
          "
        >
          <div ref={qrRef} />
        </div>

        {/* Profile URL */}
        <div
          className="
            mt-4
            rounded-[14px]
            bg-neutral-100
            px-4
            py-3
            text-center
          "
        >
          <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
            Votre profil
          </p>

          <p className="mt-1 text-xs font-medium text-neutral-800 break-all">
            {profileUrl}
          </p>
        </div>

        {/* Download */}
        <button
          type="button"
          onClick={handleDownload}
          className="
            mt-4
            w-full
            h-[48px]
            rounded-[16px]
            bg-neutral-950
            text-white
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-semibold
            hover:bg-neutral-800
            active:scale-[0.98]
            transition-all
          "
        >
          <Download className="w-4 h-4" />
          Télécharger le QR Code
        </button>
      </div>
    </div>
  );
}
