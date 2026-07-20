import { motion, useReducedMotion } from "framer-motion";

export default function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-cloud pointer-events-none">
      {/* ── Grid layer ── */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e5eb_1px,transparent_1px),linear-gradient(to_bottom,#e2e5eb_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />

      {/* ── Half-circle gradient glow, anchored at the very top ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: "-45%",
          width: "1100px",
          height: "1100px",
          maxWidth: "160vw",
          background:
            "radial-gradient(circle, rgba(0,87,255,0.28) 0%, rgba(0,87,255,0.14) 30%, rgba(0,230,118,0.10) 55%, transparent 72%)",
          filter: "blur(60px)",
          willChange: "transform, opacity",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Thin arc line tracing the edge of the glow, for definition ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full border-t"
        style={{
          top: "-45%",
          width: "1100px",
          height: "1100px",
          maxWidth: "160vw",
          borderColor: "rgba(0,87,255,0.12)",
          borderTopWidth: "1px",
        }}
      />

      {/* ── Base fade so content near the bottom of the hero stays clean ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: "linear-gradient(to bottom, transparent, #f4f5f7)",
        }}
      />
    </div>
  );
}
