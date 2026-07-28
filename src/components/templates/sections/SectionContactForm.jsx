import { Send } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionContactForm — Contact form with name, email, phone, message + submit.
 */

export default function SectionContactForm() {
  return (
    <section className="px-6 py-8">
      <SectionHeading title="Contact Us" icon={Send} />

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-2.5 text-sm border outline-none transition-colors"
            style={{
              borderRadius: "var(--t-card-radius)",
              borderColor:
                "color-mix(in srgb, var(--t-text-secondary) 30%, transparent)",
              backgroundColor: "transparent",
              color: "var(--t-text-primary)",
            }}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="px-4 py-2.5 text-sm border outline-none transition-colors"
            style={{
              borderRadius: "var(--t-card-radius)",
              borderColor:
                "color-mix(in srgb, var(--t-text-secondary) 30%, transparent)",
              backgroundColor: "transparent",
              color: "var(--t-text-primary)",
            }}
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number"
          className="px-4 py-2.5 text-sm border outline-none transition-colors"
          style={{
            borderRadius: "var(--t-card-radius)",
            borderColor:
              "color-mix(in srgb, var(--t-text-secondary) 30%, transparent)",
            backgroundColor: "transparent",
            color: "var(--t-text-primary)",
          }}
        />
        <textarea
          placeholder="Your Message"
          rows={3}
          className="px-4 py-2.5 text-sm border outline-none resize-none transition-colors"
          style={{
            borderRadius: "var(--t-card-radius)",
            borderColor:
              "color-mix(in srgb, var(--t-text-secondary) 30%, transparent)",
            backgroundColor: "transparent",
            color: "var(--t-text-primary)",
          }}
        />

        <button
          className="w-full py-2.5 text-sm font-bold rounded-full transition-colors hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--t-accent)",
            color: "var(--t-bg-primary)",
          }}
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </div>
    </section>
  );
}
