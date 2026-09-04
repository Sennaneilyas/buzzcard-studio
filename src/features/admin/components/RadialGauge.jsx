/**
 * RadialGauge
 * Pure SVG segmented radial gauge — no external dependencies.
 *
 * Props:
 *  - value (number): current value (e.g. 87 published profiles)
 *  - max (number): maximum value (e.g. 148 total profiles)
 *  - label (string): text below the number (e.g. "published")
 *  - title (string): card title (e.g. "Profile Completion")
 */

export default function RadialGauge({
  value = 0,
  max = 100,
  label = "",
  title = "",
}) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  // SVG config
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filledLength = (percentage / 100) * circumference;

  // Segment gaps — create a dashed pattern
  const totalSegments = 36;
  const segmentArc = circumference / totalSegments;
  const gapSize = 3;
  const dashSize = segmentArc - gapSize;
  const segmentPattern = `${dashSize} ${gapSize}`;

  // How many segments are "filled"
  const filledSegments = Math.round((percentage / 100) * totalSegments);

  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm flex flex-col items-center">
      {title && (
        <h3 className="text-sm font-bold text-navy mb-4 self-start">{title}</h3>
      )}

      {/* SVG Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background ring (empty segments) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeDasharray={segmentPattern}
            strokeLinecap="round"
          />

          {/* Filled ring (active segments) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#0f172a"
            strokeWidth={strokeWidth}
            strokeDasharray={segmentPattern}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{
              // Mask: only show filled portion
              clipPath: `inset(0 ${100 - (filledSegments / totalSegments) * 100}% 0 0)`,
              transition: "clip-path 0.6s ease-out",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-navy tabular-nums">
            {percentage}%
          </span>
          {label && (
            <span className="text-[11px] text-ink/40 font-medium mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>

      {/* Bottom legend */}
      <div className="flex items-center gap-4 mt-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-navy" />
          <span className="text-ink/50">Published ({value})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-ink/10" />
          <span className="text-ink/50">Total ({max})</span>
        </div>
      </div>
    </div>
  );
}
