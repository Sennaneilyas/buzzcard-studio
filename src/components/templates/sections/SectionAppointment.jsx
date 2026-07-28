import { CalendarDays } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionAppointment — Date picker + 2×2 time-slot grid + CTA button.
 * Uniform across all 20 templates.
 */

const DEMO_SLOTS = ["8:10 - 20:00", "8:10 - 20:00", "8:10 - 20:00", "8:10 - 20:00"];

export default function SectionAppointment({ data = {} }) {
  const slots = data.timeSlots?.length ? data.timeSlots : DEMO_SLOTS;

  return (
    <section
      className="px-6 py-8"
      style={{ backgroundColor: "var(--t-bg-section)" }}
    >
      <SectionHeading title="Make an Appointment" icon={CalendarDays} />

      {/* Date picker placeholder */}
      <div className="mb-4">
        <label
          className="text-xs font-medium block mb-1.5"
          style={{ color: "var(--t-text-secondary)" }}
        >
          Date:
        </label>
        <div
          className="flex items-center justify-between px-4 py-2.5 text-sm border"
          style={{
            borderRadius: "var(--t-card-radius)",
            borderColor: "color-mix(in srgb, var(--t-text-secondary) 30%, transparent)",
            color: "var(--t-text-secondary)",
          }}
        >
          <span>Pick a date</span>
          <CalendarDays className="w-4 h-4" />
        </div>
      </div>

      {/* Time slots */}
      <div className="mb-1">
        <label
          className="text-xs font-medium block mb-1.5"
          style={{ color: "var(--t-text-secondary)" }}
        >
          Hour:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot, i) => (
            <button
              key={i}
              className="px-3 py-2 text-sm font-medium border transition-colors hover:opacity-80"
              style={{
                borderRadius: "var(--t-card-radius)",
                borderColor: "color-mix(in srgb, var(--t-text-secondary) 30%, transparent)",
                color: "var(--t-text-primary)",
                backgroundColor: "transparent",
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="w-full mt-4 py-2.5 text-sm font-bold rounded-full transition-colors hover:opacity-90"
        style={{
          backgroundColor: "var(--t-accent)",
          color: "var(--t-bg-primary)",
        }}
      >
        Make an Appointment
      </button>
    </section>
  );
}
