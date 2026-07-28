import { Clock } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionHours — Business hours display.
 * Supports variant: "table" (default) or "pill-grid".
 */

const DEMO_HOURS = [
  { day: "Sunday", time: "08:10 - 20:00" },
  { day: "Monday", time: "08:10 - 20:00" },
  { day: "Tuesday", time: "08:10 - 20:00" },
  { day: "Wednesday", time: "08:10 - 10:00" },
  { day: "Thursday", time: "08:10 - 20:00" },
  { day: "Friday", time: "08:10 - 20:00" },
  { day: "Saturday", time: "Closed" },
];

export default function SectionHours({ data = {}, variant = "table" }) {
  const hours = data.hours?.length ? data.hours : DEMO_HOURS;

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Business Hours" icon={Clock} />

      {variant === "table" ? (
        <div className="flex flex-col gap-1">
          {hours.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
              style={{
                backgroundColor:
                  i % 2 === 0 ? "var(--t-bg-section)" : "transparent",
                borderRadius: "var(--t-card-radius)",
              }}
            >
              <span
                className="font-medium"
                style={{ color: "var(--t-text-primary)" }}
              >
                {entry.day}:
              </span>
              <span
                className="text-xs"
                style={{
                  color:
                    entry.time === "Closed"
                      ? "var(--t-accent)"
                      : "var(--t-text-secondary)",
                }}
              >
                {entry.time}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* pill-grid variant */
        <div className="grid grid-cols-2 gap-2">
          {hours.map((entry, i) => (
            <div
              key={i}
              className="flex flex-col items-center px-3 py-2.5 text-sm"
              style={{
                backgroundColor: "var(--t-bg-section)",
                borderRadius: "var(--t-card-radius)",
                boxShadow: "var(--t-card-shadow)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "var(--t-text-primary)" }}
              >
                {entry.day}
              </span>
              <span
                className="text-[10px]"
                style={{
                  color:
                    entry.time === "Closed"
                      ? "var(--t-accent)"
                      : "var(--t-text-secondary)",
                }}
              >
                {entry.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
