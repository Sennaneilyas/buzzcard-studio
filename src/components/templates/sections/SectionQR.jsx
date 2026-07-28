import { QrCode, Download } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionQR — QR code image + download button.
 */

export default function SectionQR({ data = {} }) {
  const qrUrl =
    data.qrUrl ||
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://buzzcard.studio";

  return (
    <section className="px-6 py-8">
      <SectionHeading title="QR Code" icon={QrCode} />

      <div className="flex flex-col items-center gap-4">
        {/* QR Image */}
        <div
          className="p-4"
          style={{
            backgroundColor: "var(--t-bg-section)",
            borderRadius: "var(--t-card-radius)",
            boxShadow: "var(--t-card-shadow)",
          }}
        >
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* Download button */}
        <button
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-colors hover:opacity-90"
          style={{
            backgroundColor: "var(--t-accent)",
            color: "var(--t-bg-primary)",
          }}
        >
          <Download className="w-4 h-4" />
          Download My QR Code
        </button>
      </div>
    </section>
  );
}
