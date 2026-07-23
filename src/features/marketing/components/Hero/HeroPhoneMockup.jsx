import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Wifi,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Camera,
  ExternalLink,
  MapPin,
  Share2,
} from "lucide-react";

export default function HeroPhoneMockup() {
  const animationRef = useRef(null);

  // GSAP animation refs
  const cardRef = useRef(null);
  const cardInnerRef = useRef(null);
  const notificationRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const ripple3Ref = useRef(null);

  // Scroll-driven animation sequence
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.normalizeScroll(true);

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (min-height: 781px)", () => {
        // 1. Initial setups for purely GSAP-driven elements
        // Card initial state ("left")
        gsap.set(cardRef.current, {
          xPercent: -50,
          x: "-35vw",
          opacity: 1,
          rotationY: 30,
          rotationZ: -15,
          scale: 0.8,
          transformPerspective: 800,
          force3D: true,
        });
        // Card inner (front/back flip)
        gsap.set(cardInnerRef.current, { rotationY: 0, force3D: true });

        // Notification initial state
        gsap.set(notificationRef.current, {
          y: -120,
          opacity: 0,
          scale: 0.9,
          xPercent: -50,
          force3D: true,
        });

        // Ripples initial state
        gsap.set([ripple1Ref.current, ripple2Ref.current, ripple3Ref.current], {
          scale: 1,
          opacity: 0,
          force3D: true,
        });

        // 2. The Master Scrub Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRef.current,
            start: "top 60px",
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            scrub: 1.5,
          },
        });

        // Phase 1: Left -> Behind (0% to 25%)
        tl.to(
          cardRef.current,
          {
            x: "0vw",
            rotationY: 0,
            rotationZ: -5,
            scale: 1,
            duration: 25,
            ease: "power2.inOut",
          },
          0,
        );

        // Phase 2: Behind -> Tapping (25% to 55%)
        tl.to(
          cardRef.current,
          {
            rotationY: 15,
            rotationZ: -8,
            scale: 0.95,
            duration: 30,
            ease: "power1.inOut",
          },
          25,
        );

        // Flip card over completely hidden behind the phone (25 to 45)
        tl.to(
          cardInnerRef.current,
          {
            rotationY: 180,
            duration: 20,
            ease: "power2.inOut",
          },
          25,
        );

        // Trigger ripples during Tapping
        tl.to(
          ripple1Ref.current,
          {
            scale: 1.8,
            opacity: 0.4,
            duration: 15,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          35,
        );
        tl.to(
          ripple2Ref.current,
          {
            scale: 2.2,
            opacity: 0.3,
            duration: 15,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          40,
        );
        tl.to(
          ripple3Ref.current,
          {
            scale: 2.6,
            opacity: 0.2,
            duration: 15,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          45,
        );

        // Notification drops down
        tl.to(
          notificationRef.current,
          {
            y: 46,
            opacity: 1,
            scale: 1,
            duration: 15,
            ease: "back.out(1.5)",
          },
          45,
        );

        // Phase 3: Tapping -> Right (55% to 80%)
        tl.to(
          cardRef.current,
          {
            x: "35vw",
            rotationY: -30,
            rotationZ: 15,
            scale: 0.8,
            duration: 25,
            ease: "power2.inOut",
          },
          55,
        );

        // Notification goes back up
        tl.to(
          notificationRef.current,
          {
            y: -120,
            opacity: 0,
            scale: 0.9,
            duration: 10,
            ease: "power2.in",
          },
          70,
        );

        // Phase 4: Emerge to the Right (60% to 100%)
        tl.to(
          cardRef.current,
          {
            x: "35vw", // Move to the right side
            opacity: 1,
            rotationY: -25, // Angled toward the camera
            rotationZ: 15,
            scale: 1, // Return to normal scale
            duration: 40,
            ease: "power2.out",
          },
          60,
        );
      });

      // Recalculate trigger positions after initial Framer Motion mount animations finish
      setTimeout(() => ScrollTrigger.refresh(), 100);
      setTimeout(() => ScrollTrigger.refresh(), 1000);
    }, animationRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── GSAP Pin Wrapper ── */}
      <div ref={animationRef} className="w-full relative pt-8 sm:pt-10 pb-6">
        {/* ── Phone Mockup and Animation Sequence ── */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 0.85 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.3,
          }}
          className="relative flex justify-center origin-top"
        >
          {/* Animated NFC card — Passes behind the phone */}
          <div
            ref={cardRef}
            className="absolute left-1/2 top-[10%] sm:top-[12%] w-[220px] sm:w-[300px] lg:w-[380px] h-[340px] sm:h-[460px] lg:h-[580px] z-[5] hidden sm:block origin-center will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={cardInnerRef}
              className="w-full h-full relative will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 drop-shadow-[0_25px_40px_rgba(0,0,0,0.3)]"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img src="/Card front.svg" alt="BuzzCard Front" className="w-full h-full object-contain" />
                {/* Light Glare Effect clipped to SVG */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
                  style={{
                    maskImage: 'url("/Card front.svg")',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url("/Card front.svg")',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 55%, rgba(255,255,255,0) 100%)",
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 drop-shadow-[0_25px_40px_rgba(0,0,0,0.3)]"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <img src="/Card back.svg" alt="BuzzCard Back" className="w-full h-full object-contain" />
                {/* Light Glare Effect clipped to SVG */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
                  style={{
                    maskImage: 'url("/Card back.svg")',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url("/Card back.svg")',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 55%, rgba(255,255,255,0) 100%)",
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 2, // Offset the back glare
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tap ripple effect (Behind Phone) */}
          <div className="absolute left-1/2 top-[30%] -translate-x-1/2 z-[2] hidden sm:flex items-center justify-center pointer-events-none">
            <div
              ref={ripple1Ref}
              className="absolute rounded-full border border-navy/[0.08] will-change-transform"
              style={{ width: 140, height: 140 }}
            />
            <div
              ref={ripple2Ref}
              className="absolute rounded-full border border-navy/[0.08] will-change-transform"
              style={{ width: 140, height: 140 }}
            />
            <div
              ref={ripple3Ref}
              className="absolute rounded-full border border-navy/[0.08] will-change-transform"
              style={{ width: 140, height: 140 }}
            />
          </div>

          {/* Phone mockup — center (z-10) */}
          <div className="relative z-10 w-[300px] sm:w-[340px] md:w-[380px]">
            {/* Phone body */}
            <div className="relative bg-[#1a1a1a] rounded-[2.8rem] sm:rounded-[3rem] border-[5px] sm:border-[6px] border-[#2a2a2a] shadow-[0_30px_80px_rgba(0,0,0,0.25),0_10px_30px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
              {/* Side buttons */}
              <div className="absolute -right-[7px] sm:-right-[8px] top-[100px] sm:top-[120px] w-[3px] h-[50px] bg-[#333] rounded-r" />
              <div className="absolute -left-[7px] sm:-left-[8px] top-[80px] sm:top-[90px] w-[3px] h-[26px] bg-[#333] rounded-l" />
              <div className="absolute -left-[7px] sm:-left-[8px] top-[115px] sm:top-[130px] w-[3px] h-[26px] bg-[#333] rounded-l" />

              {/* Screen */}
              <div className="relative bg-white overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] sm:w-[120px] h-[28px] sm:h-[32px] bg-[#1a1a1a] rounded-full z-40 flex items-center justify-center">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#0d0d0d] ring-1 ring-[#333]" />
                </div>

                {/* Status bar */}
                <div className="flex items-end justify-between px-7 sm:px-8 pt-3 pb-1 z-20 relative">
                  <span className="text-[10px] font-semibold text-ink/70">
                    9:41
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-semibold text-ink/50">
                      5G
                    </span>
                  </div>
                </div>

                {/* ── Notification Banner (Triggers on Tap) ── */}
                <div
                  ref={notificationRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-2xl rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_40px_rgba(0,35,102,0.12),0_4px_12px_rgba(0,0,0,0.06)] border border-black/[0.04] flex items-center gap-3 z-30 will-change-transform"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-gradient-to-br from-mint to-[#00c864] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,230,118,0.3)]">
                    <img
                      src="/logoHB.svg"
                      alt="Icon"
                      className="w-4 h-4 sm:w-5 sm:h-5 invert mix-blend-luminosity"
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-ink leading-tight">
                      BuzzCard Studio
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-ink/50 font-medium mt-0.5 truncate">
                      Alex shared their profile with you
                    </p>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-ink/30 font-medium shrink-0">
                    now
                  </span>
                </div>

                {/* ── Real BuzzCard Profile Screen ── */}
                <div className="px-5 sm:px-6 pt-6 pb-8 sm:pb-10 space-y-4">
                  {/* Profile header */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-navy to-[#003599] flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(0,35,102,0.3)]">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        A
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      Alex Designer
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/50 font-medium">
                      Creative Director
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-ink/40">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] sm:text-xs">
                        San Francisco, CA
                      </span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2.5 justify-center pt-2">
                    {[
                      {
                        icon: Phone,
                        label: "Call",
                        color: "bg-mint/10 text-mint",
                      },
                      {
                        icon: Mail,
                        label: "Email",
                        color: "bg-navy/10 text-navy",
                      },
                      {
                        icon: Share2,
                        label: "Share",
                        color: "bg-ink/[0.06] text-ink/60",
                      },
                    ].map((action) => (
                      <div
                        key={action.label}
                        className={`flex flex-col items-center gap-1 px-4 sm:px-5 py-2.5 rounded-xl ${action.color}`}
                      >
                        <action.icon className="w-4 h-4" />
                        <span className="text-[9px] sm:text-[10px] font-semibold">
                          {action.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Contact info card */}
                  <div className="bg-cloud/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Phone className="w-3.5 h-3.5 text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] sm:text-[10px] text-ink/40 font-medium">
                          Phone
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-ink truncate">
                          +1 (415) 555-0132
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-ink/[0.06]" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Mail className="w-3.5 h-3.5 text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] sm:text-[10px] text-ink/40 font-medium">
                          Email
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-ink truncate">
                          alex@designstudio.co
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-ink/[0.06]" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Globe className="w-3.5 h-3.5 text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] sm:text-[10px] text-ink/40 font-medium">
                          Website
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-ink truncate">
                          alexdesigner.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="space-y-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-ink/40 uppercase tracking-wider">
                      Socials
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          icon: Briefcase,
                          label: "LinkedIn",
                          handle: "@alexdesigner",
                          bg: "bg-[#0A66C2]/10 text-[#0A66C2]",
                        },
                        {
                          icon: Camera,
                          label: "Instagram",
                          handle: "@alex.design",
                          bg: "bg-[#E4405F]/10 text-[#E4405F]",
                        },
                      ].map((social) => (
                        <div
                          key={social.label}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${social.bg}`}
                        >
                          <social.icon className="w-4 h-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-semibold truncate">
                              {social.label}
                            </p>
                            <p className="text-[8px] sm:text-[9px] opacity-60 truncate">
                              {social.handle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save contact button */}
                  <button className="w-full py-3 sm:py-3.5 bg-ink rounded-2xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(17,24,39,0.15)]">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Save Contact
                  </button>
                </div>

                {/* Screen reflection */}
                <div
                  className="absolute inset-0 pointer-events-none z-[5]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
