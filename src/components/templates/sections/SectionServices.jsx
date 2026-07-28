import { Wrench } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionServices — 2-column card grid with icon + title + description.
 * Supports variant: "card-grid" (default) or "list-row".
 */

const DEMO_SERVICES = [
  {
    title: "Web Design",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking.",
  },
  {
    title: "Branding Design",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking.",
  },
];

export default function SectionServices({ data = {}, variant = "card-grid" }) {
  const services = data.services?.length ? data.services : DEMO_SERVICES;

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Our Services" icon={Wrench} />

      {variant === "card-grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {services.map((svc, i) => (
            <div
              key={i}
              className="p-4 flex flex-col gap-2"
              style={{
                backgroundColor: "var(--t-bg-section)",
                borderRadius: "var(--t-card-radius)",
                boxShadow: "var(--t-card-shadow)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "var(--t-accent)",
                  color: "var(--t-bg-primary)",
                }}
              >
                <Wrench className="w-5 h-5" />
              </div>
              <h3
                className="text-sm font-bold"
                style={{
                  fontFamily: "var(--t-font-heading)",
                  color: "var(--t-text-primary)",
                }}
              >
                {svc.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--t-text-secondary)" }}
              >
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* list-row variant */
        <div className="flex flex-col gap-3">
          {services.map((svc, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3"
              style={{
                backgroundColor: "var(--t-bg-section)",
                borderRadius: "var(--t-card-radius)",
                boxShadow: "var(--t-card-shadow)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--t-accent)",
                  color: "var(--t-bg-primary)",
                }}
              >
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3
                  className="text-sm font-bold mb-0.5"
                  style={{
                    fontFamily: "var(--t-font-heading)",
                    color: "var(--t-text-primary)",
                  }}
                >
                  {svc.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--t-text-secondary)" }}
                >
                  {svc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
