import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useProfile } from "@/features/auth";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import {
  Sparkles,
  UserCircle,
  Share2,
  Rocket,
  ArrowRight,
  CheckCircle,
  Home,
  Edit3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StepTemplate from "./steps/StepTemplate";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepSocials from "./steps/StepSocials";
import StepLaunch from "./steps/StepLaunch";

const ONBOARDING_STEPS = [
  { id: "template", label: "Template", icon: Sparkles },
  { id: "info", label: "Basic Info", icon: UserCircle },
  { id: "socials", label: "Social Links", icon: Share2 },
  { id: "launch", label: "Launch", icon: Rocket },
];

export default function OnboardingPage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const spotlightRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
      spotlightRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
    }
  };

  const [profileData, setProfileData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    phone: "",
    avatarUrl: "",
    bannerUrl: "",
  });

  const rawDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    profile?.full_name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const displayName = rawDisplayName.split(" ")[0];

  const setEditorProfile = useEditorStore((s) => s.setProfileData);
  const setEditorTemplate = useEditorStore((s) => s.setTemplateId);
  const setEditorSlug = useEditorStore((s) => s.setSlug);

  const handleNext = () => {
    if (activeTabIndex < ONBOARDING_STEPS.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
    } else {
      // Save data to mock store for Phase 2 Routing
      setEditorProfile(profileData);
      setEditorTemplate(selectedTemplateId || "buzz-template");
      setEditorSlug(displayName.toLowerCase());
      setIsSuccess(true);
    }
  };

  const handleBack = () => {
    if (activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  return (
    <div 
      className="min-h-[100dvh] w-full bg-[#e0e5ec] relative overflow-hidden flex flex-col font-sans"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background Orbs Removed for Simplicity ── */}

      {/* ── Subtle Dot Pattern Overlay (Base) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(17, 24, 39, 0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Interactive Dot Pattern Overlay (Mouse Spotlight) ── */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          backgroundImage: "radial-gradient(rgba(17, 24, 39, 0.3) 2px, transparent 2px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage: "radial-gradient(350px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)",
          maskImage: "radial-gradient(350px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)",
        }}
      />

      {/* ── Noise Texture Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Linktree-Style Top Navigation Bar ── */}
      <div className="w-full h-20 px-6 sm:px-10 flex items-center justify-between shrink-0 z-20">
        {!isSuccess && (
          <>
            {/* Back Button */}
            <button
              onClick={handleBack}
              className={cn(
                "text-navy font-bold text-sm tracking-wide hover:text-navy/60 transition-colors px-2 py-1 rounded-md",
                activeTabIndex === 0 && "opacity-0 pointer-events-none",
              )}
            >
              Back
            </button>

            {/* Centered Segmented Progress Bar */}
            <div className="flex items-center gap-2 flex-1 max-w-[200px] mx-auto">
              {ONBOARDING_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className="h-1.5 flex-1 rounded-full bg-white/40 overflow-hidden shadow-[inset_1px_1px_3px_rgba(163,177,198,0.5)]"
                >
                  <motion.div
                    className="h-full bg-mint shadow-[0_0_8px_rgba(107,151,255,0.6)]"
                    initial={{ width: index < activeTabIndex ? "100%" : "0%" }}
                    animate={{ width: index <= activeTabIndex ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>

            {/* Skip Button */}
            <button
              onClick={handleNext}
              className={cn(
                "text-navy/40 font-bold text-sm tracking-wide hover:text-navy transition-colors px-2 py-1 rounded-md",
                activeTabIndex === ONBOARDING_STEPS.length - 1 &&
                  "opacity-0 pointer-events-none",
              )}
            >
              Skip
            </button>
          </>
        )}
      </div>

      {/* ── Main Content Area ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col z-10 pb-10 justify-center">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="onboarding-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col"
            >
              {/* Title Section */}
              <div className="text-center mb-10 shrink-0 pt-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
                  {activeTabIndex === 0
                    ? `Welcome, ${displayName}!`
                    : activeTabIndex === 1
                      ? "Add your details"
                      : activeTabIndex === 2
                        ? "Connect your world"
                        : "Ready for Launch"}
                </h1>
                <p className="text-navy/60 font-medium mt-2 max-w-md mx-auto">
                  {activeTabIndex === 0
                    ? "Select a foundation to start building your digital presence."
                    : activeTabIndex === 1
                      ? "Complete the fields below to add your basic content."
                      : activeTabIndex === 2
                        ? "Add your social media and contact links."
                        : "Review your choices and publish your public profile."}
                </p>
              </div>

              {/* Dynamic Content Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "w-full mx-auto flex-1 flex flex-col",
                    activeTabIndex === 0 ? "max-w-7xl" : "max-w-2xl",
                  )}
                >
                  {activeTabIndex === 0 ? (
                    /* Phase 1: Template Gallery */
                    <div className="flex-1 flex flex-col">
                      <StepTemplate
                        selectedId={selectedTemplateId}
                        onSelect={setSelectedTemplateId}
                      />
                    </div>
                  ) : (
                    /* Phase 2: Form Cards */
                    <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
                      {activeTabIndex === 1 ? (
                        <StepBasicInfo
                          data={profileData}
                          onChange={setProfileData}
                        />
                      ) : activeTabIndex === 2 ? (
                        <StepSocials
                          data={profileData}
                          onChange={setProfileData}
                        />
                      ) : (
                        <StepLaunch
                          data={profileData}
                          selectedTemplateId={selectedTemplateId}
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Linktree-Style Big Continue Button */}
              <div className="w-full max-w-2xl mx-auto mt-8 shrink-0 flex justify-center">
                <button
                  onClick={handleNext}
                  disabled={activeTabIndex === 0 && !selectedTemplateId}
                  className="w-full max-w-[280px] sm:max-w-[320px] h-12 rounded-full bg-[#6B97FF] hover:bg-[#5A85EB] text-white font-bold text-base shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.8),inset_2px_2px_4px_rgba(255,255,255,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {activeTabIndex === ONBOARDING_STEPS.length - 1
                    ? "Publish Profile"
                    : "Continue"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.2 }}
              className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 text-center shadow-xl shadow-black/[0.03] border border-black/[0.04] relative"
            >
              {/* Top Badge */}
              <div className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-navy">
                <Rocket className="h-3.5 w-3.5 text-mint" />
                <span>Mission Complete</span>
              </div>

              {/* Minimal Animated Success Checkmark */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.3 }}
                className="mx-auto mb-6 mt-10 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-mint bg-transparent"
              >
                <svg viewBox="0 0 52 52" className="w-12 h-12 text-mint">
                  <motion.path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l8 8 16-16"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>

              <h2 className="mb-2 flex items-center justify-center gap-2 text-2xl font-extrabold text-navy">
                <Zap className="h-6 w-6 text-mint" fill="currentColor" />
                Profile Created!
              </h2>

              <p className="text-navy/70 text-sm font-medium mb-8 leading-relaxed px-2">
                Your foundation is laid out. You can return home, or dive into
                the Studio Editor to add custom sections, galleries, and
                advanced styling.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    navigate(`/profile/${displayName.toLowerCase()}/edit`)
                  }
                  className="w-full px-8 py-3.5 rounded-xl bg-ink hover:bg-ink/90 text-white text-[15px] font-bold shadow-md transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-5 h-5" />
                  Go to Studio Editor
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full px-8 py-3 rounded-xl bg-transparent text-navy/60 hover:text-navy text-[15px] font-bold transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
