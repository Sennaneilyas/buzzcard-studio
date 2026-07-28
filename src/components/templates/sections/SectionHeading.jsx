/**
 * SectionHeading — Reusable section title with optional divider.
 * Used by every section component for consistent heading treatment.
 */
export default function SectionHeading({ title, icon: Icon, divider = "line" }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-5">
      {divider === "line" && (
        <div
          className="w-12 h-0.5 rounded-full mb-1"
          style={{ backgroundColor: "var(--t-accent)" }}
        />
      )}
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            className="w-5 h-5"
            style={{ color: "var(--t-accent)" }}
          />
        )}
        <h2
          className="text-lg sm:text-xl font-bold"
          style={{
            fontFamily: "var(--t-font-heading)",
            color: "var(--t-text-primary)",
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
