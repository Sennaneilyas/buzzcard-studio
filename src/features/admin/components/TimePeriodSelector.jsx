/**
 * TimePeriodSelector
 * Pill-button group for switching dashboard time periods.
 *
 * Props:
 *  - value (string): current period key ("3d" | "7d" | "30d" | "365d")
 *  - onChange (fn): called with the new period key
 */

const PERIODS = [
  { key: "3d", label: "3 Days" },
  { key: "7d", label: "Week" },
  { key: "30d", label: "Month" },
  { key: "365d", label: "Year" },
];

export default function TimePeriodSelector({ value = "30d", onChange }) {
  return (
    <div className="inline-flex items-center gap-1 bg-ink/[0.04] rounded-xl p-1">
      {PERIODS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
            value === key
              ? "bg-black text-white shadow-sm"
              : "text-ink/50 hover:text-ink/80"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
