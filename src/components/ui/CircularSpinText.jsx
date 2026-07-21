"use client";

import { useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const getRotationTransition = (duration, from, direction, loop = true) => ({
  from,
  to: direction === "clockwise" ? from + 360 : from - 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration, from, direction) => ({
  rotate: getRotationTransition(duration, from, direction),
  scale: { type: "spring", damping: 20, stiffness: 300 },
});

export default function CircularSpinText({
  text = "BUZZCARD STUDIO • DIGITAL BUSINESS CARDS • ",
  spinDuration = 20,
  onHover = "speedUp",
  size = 140,
  fontSize = 11,
  fontWeight = 700,
  textColor = "currentColor",
  radius = 55,
  letterSpacing = 2.5,
  direction = "clockwise",
  showCircleBorder = true,
  className,
}) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const inverseRotation = useTransform(rotation, (r) => -r);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: direction === "clockwise" ? start + 360 : start - 360,
      scale: 1,
      transition: getTransition(spinDuration, start, direction),
    });
  }, [spinDuration, text, onHover, controls, direction, rotation]);

  const handleHoverStart = () => {
    if (onHover === "none") return;
    const start = rotation.get();

    if (onHover === "pause") {
      controls.start({
        rotate: start,
        scale: 1.05,
        transition: {
          rotate: { type: "spring", damping: 25, stiffness: 400 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        },
      });
      return;
    }

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start, direction);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start, direction);
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start, direction);
        scaleVal = 0.85;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start, direction);
    }
    controls.start({
      rotate: direction === "clockwise" ? start + 360 : start - 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    if (onHover === "none") return;
    const start = rotation.get();
    controls.start({
      rotate: direction === "clockwise" ? start + 360 : start - 360,
      scale: 1,
      transition: getTransition(spinDuration, start, direction),
    });
  };

  return (
    <div
      className={cn("flex items-center justify-center text-slate-600", className)}
      style={{ width: size, height: size }}
    >
      <motion.div
        style={{
          margin: "0 auto",
          borderRadius: "50%",
          width: size,
          position: "relative",
          height: size,
          fontWeight,
          color: textColor,
          textAlign: "center",
          cursor: onHover !== "none" ? "pointer" : "default",
          transformOrigin: "50% 50%",
          WebkitTransformOrigin: "50% 50%",
          rotate: rotation,
          backgroundColor: showCircleBorder
            ? "rgba(15, 23, 42, 0.02)"
            : "transparent",
          border: showCircleBorder ? "1px solid rgba(15, 23, 42, 0.05)" : "none",
        }}
        initial={{ rotate: 0 }}
        animate={controls}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        {letters.map((letter, i) => {
          const rotationDeg = (360 / letters.length) * i;
          const angle = (rotationDeg * Math.PI) / 180;
          const x = Math.sin(angle) * radius;
          const y = -Math.cos(angle) * radius;
          const transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotationDeg}deg)`;

          return (
            <span
              key={i}
              style={{
                position: "absolute",
                display: "inline-block",
                left: "50%",
                top: "50%",
                fontSize,
                letterSpacing,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform,
                WebkitTransform: transform,
                userSelect: "none",
                textTransform: "uppercase",
              }}
            >
              {letter}
            </span>
          );
        })}
        
        {/* Center Logo (Counters the rotation so it stays upright) */}
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
                rotate: inverseRotation
            }}
        >
            <div className="w-10 h-10 flex items-center justify-center drop-shadow-sm">
                <img 
                    src="/justlogo.png" 
                    alt="BuzzCard" 
                    className="w-full h-full object-contain"
                />
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
