import { cn } from "@/lib/utils";

/**
 * HotelBackground — Centralized background wrapper for the hotel template.
 *
 * Uses layered CSS gradients and a subtle inline SVG Zellige repeating tile
 * to create an elegant, warm Moroccan-inspired depth without oversized
 * floating shapes that clip at card edges.
 */
export function HotelBackground({ children, className }) {
  return (
    <div
      className={cn(
        "relative w-full flex flex-col min-h-[100dvh] bg-[var(--hotel-ivory)] overflow-hidden",
        className
      )}
    >
      {/* ── Background Layer ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* 1. Base warm gradient — latte → ivory → latte diagonal */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hotel-latte)]/60 via-[var(--hotel-ivory)] to-[var(--hotel-latte)]/40" />

        {/* 2. Radial warm spot — top center glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, var(--hotel-cappuccino) 0%, transparent 70%)",
            opacity: 0.08,
          }}
        />

        {/* 3. Radial warm spot — bottom right glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 85% 90%, var(--hotel-gold) 0%, transparent 70%)",
            opacity: 0.06,
          }}
        />

        {/* 4. Subtle Zellige repeating tile — inline SVG cross+diamond pattern */}
        <div
          className="absolute inset-0 hotel-zellige"
          style={{ opacity: 1 }}
        />

        {/* 5. Fine grain noise texture for printed-paper luxury feel */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.025,
          }}
        />

        {/* 6. Very soft vertical vignette — darker at edges, lighter center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--hotel-cappuccino) 0%, transparent 12%, transparent 88%, var(--hotel-cappuccino) 100%)",
            opacity: 0.04,
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 w-full">
        {children}
      </div>
    </div>
  );
}

