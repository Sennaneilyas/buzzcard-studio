import { cn } from "@/lib/utils";

/**
 * Zellige Marocain SVG shapes — 3D-effect geometric Moroccan tile patterns.
 * Each shape uses the hotel brand palette with inner shadows/gradients for depth.
 */

/* ── 8-Pointed Star (Najma) ────────────────────────────── */
function ZelligeNajma({ size = 60, className = "", opacity = 0.12 }) {
  const id = `najma-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={{ opacity }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="var(--hotel-gold)" />
          <stop offset="100%" stopColor="var(--hotel-caramel)" />
        </linearGradient>
        <linearGradient id={`${id}-shadow`} x1="50" y1="0" x2="50" y2="100">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--hotel-mocha)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Outer star */}
      <polygon
        points="50,5 61,35 95,35 68,55 78,88 50,68 22,88 32,55 5,35 39,35"
        fill={`url(#${id}-fill)`}
      />
      {/* 3D highlight overlay */}
      <polygon
        points="50,5 61,35 95,35 68,55 78,88 50,68 22,88 32,55 5,35 39,35"
        fill={`url(#${id}-shadow)`}
      />
      {/* Inner diamond for depth */}
      <polygon
        points="50,25 65,50 50,75 35,50"
        fill="var(--hotel-ivory)"
        opacity="0.35"
      />
    </svg>
  );
}

/* ── Diamond Lattice ───────────────────────────────────── */
function ZelligeDiamond({ size = 50, className = "", opacity = 0.10 }) {
  const id = `diamond-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} style={{ opacity }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="var(--hotel-cappuccino)" />
          <stop offset="100%" stopColor="var(--hotel-gold)" />
        </linearGradient>
      </defs>
      <rect x="15" y="15" width="50" height="50" rx="2" transform="rotate(45 40 40)" fill={`url(#${id}-fill)`} />
      {/* Inner cut for 3D bevel */}
      <rect x="22" y="22" width="36" height="36" rx="1" transform="rotate(45 40 40)" fill="var(--hotel-ivory)" opacity="0.25" />
      <rect x="28" y="28" width="24" height="24" rx="1" transform="rotate(45 40 40)" fill={`url(#${id}-fill)`} opacity="0.5" />
    </svg>
  );
}

/* ── Hexagonal Rosette ─────────────────────────────────── */
function ZelligeHexagon({ size = 55, className = "", opacity = 0.10 }) {
  const id = `hex-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={{ opacity }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="var(--hotel-caramel)" />
          <stop offset="100%" stopColor="var(--hotel-mocha)" />
        </linearGradient>
      </defs>
      <polygon
        points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
        fill={`url(#${id}-fill)`}
      />
      {/* 3D highlight — top half lighter */}
      <polygon
        points="50,5 93,27.5 93,50 7,50 7,27.5"
        fill="#ffffff"
        opacity="0.15"
      />
      {/* Inner hexagon */}
      <polygon
        points="50,22 78,36 78,64 50,78 22,64 22,36"
        fill="var(--hotel-ivory)"
        opacity="0.2"
      />
    </svg>
  );
}

/* ── Cross / Plus Pattern ──────────────────────────────── */
function ZelligeCross({ size = 45, className = "", opacity = 0.09 }) {
  const id = `cross-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} style={{ opacity }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="var(--hotel-gold)" />
          <stop offset="100%" stopColor="var(--hotel-cappuccino)" />
        </linearGradient>
      </defs>
      {/* Cross shape */}
      <path d="M30,0 L50,0 L50,30 L80,30 L80,50 L50,50 L50,80 L30,80 L30,50 L0,50 L0,30 L30,30 Z" fill={`url(#${id}-fill)`} />
      {/* 3D bevel highlight */}
      <path d="M30,0 L50,0 L50,30 L80,30 L80,40 L40,40 L40,0 Z" fill="#ffffff" opacity="0.18" />
      {/* Inner square cutout */}
      <rect x="32" y="32" width="16" height="16" rx="2" fill="var(--hotel-ivory)" opacity="0.25" />
    </svg>
  );
}

/* ── Arch / Moorish Arch ───────────────────────────────── */
function ZelligeArch({ size = 50, className = "", opacity = 0.08 }) {
  const id = `arch-${size}`;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78" fill="none" className={className} style={{ opacity }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="30" y1="0" x2="30" y2="78">
          <stop offset="0%" stopColor="var(--hotel-caramel)" />
          <stop offset="100%" stopColor="var(--hotel-cappuccino)" />
        </linearGradient>
      </defs>
      {/* Horseshoe arch */}
      <path d="M5,78 L5,30 C5,10 30,0 30,0 C30,0 55,10 55,30 L55,78 Z" fill={`url(#${id}-fill)`} />
      {/* Inner cutout */}
      <path d="M15,78 L15,35 C15,20 30,12 30,12 C30,12 45,20 45,35 L45,78 Z" fill="var(--hotel-ivory)" opacity="0.3" />
      {/* Top highlight */}
      <path d="M5,30 C5,10 30,0 30,0 C30,0 55,10 55,30 L30,25 Z" fill="#ffffff" opacity="0.12" />
    </svg>
  );
}


/**
 * HotelBackground — Centralized background wrapper for the hotel template.
 * Contains the gradient base + scattered Zellige Marocain shapes with 3D effect.
 * All decorative elements live here — no separate divider components needed.
 */
export function HotelBackground({ children, className }) {
  return (
    <div className={cn("relative w-full flex flex-col min-h-[100dvh] bg-[var(--hotel-ivory)] overflow-hidden", className)}>

      {/* ── Background Layer ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hotel-ivory)] via-[var(--hotel-latte)] to-[var(--hotel-ivory)]" />

        {/* ── Zellige Shapes — scattered at different depths ── */}

        {/* Top-left cluster */}
        <div className="absolute top-[8%] left-[2%]">
          <ZelligeNajma size={90} opacity={0.18} />
        </div>
        <div className="absolute top-[14%] left-[22%]">
          <ZelligeDiamond size={45} opacity={0.14} />
        </div>

        {/* Right side accent */}
        <div className="absolute top-[20%] right-[0%]">
          <ZelligeHexagon size={70} opacity={0.15} />
        </div>

        {/* Mid-left */}
        <div className="absolute top-[32%] left-[-3%]">
          <ZelligeArch size={60} opacity={0.16} />
        </div>

        {/* Center-right cluster */}
        <div className="absolute top-[42%] right-[3%]">
          <ZelligeCross size={55} opacity={0.14} />
        </div>
        <div className="absolute top-[46%] right-[25%]">
          <ZelligeDiamond size={35} opacity={0.12} />
        </div>

        {/* Lower-left */}
        <div className="absolute top-[55%] left-[3%]">
          <ZelligeNajma size={75} opacity={0.15} />
        </div>

        {/* Bottom-right */}
        <div className="absolute top-[65%] right-[1%]">
          <ZelligeArch size={55} opacity={0.14} />
        </div>

        {/* Deep bottom accents */}
        <div className="absolute top-[75%] left-[10%]">
          <ZelligeHexagon size={60} opacity={0.12} />
        </div>
        <div className="absolute top-[82%] right-[8%]">
          <ZelligeCross size={50} opacity={0.10} />
        </div>

        {/* Very bottom — subtle star */}
        <div className="absolute top-[90%] left-[35%]">
          <ZelligeNajma size={55} opacity={0.10} />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
