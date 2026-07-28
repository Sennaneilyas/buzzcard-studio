import { UserPlus, ExternalLink } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionCreateVCard — URL display + "Add to Contact" CTA button.
 * Always the last section in every template.
 */

export default function SectionCreateVCard({ data = {} }) {
  const vcardUrl = data.vcardUrl || "https://vcards.infyom.com/marlonbrasil";

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Create Your VCard" icon={UserPlus} />

      <div className="flex flex-col items-center gap-4">
        {/* URL display */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 text-sm w-full"
          style={{
            backgroundColor: "var(--t-bg-section)",
            borderRadius: "var(--t-card-radius)",
            boxShadow: "var(--t-card-shadow)",
          }}
        >
          <ExternalLink
            className="w-4 h-4 shrink-0"
            style={{ color: "var(--t-accent)" }}
          />
          <span
            className="truncate text-xs"
            style={{ color: "var(--t-text-secondary)" }}
          >
            {vcardUrl}
          </span>
        </div>

        {/* Add to Contact CTA */}
        <button
          className="w-full py-3 text-sm font-bold rounded-full transition-colors hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--t-accent)",
            color: "var(--t-bg-primary)",
          }}
        >
          <UserPlus className="w-4 h-4" />
          Add to Contact
        </button>
      </div>
    </section>
  );
}
