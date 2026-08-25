import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useProfile } from "@/features/auth";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import {
  Sparkles,
  UserCircle,
  Share2,
  Rocket,
  Home,
  Edit3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StepTemplate from "./steps/StepTemplate";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepSocials from "./steps/StepSocials";
import StepLaunch from "./steps/StepLaunch";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const onboardingSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  email: z.union([z.literal(""), z.string().email("Invalid email format")]).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  socials: z.record(z.union([z.literal(""), z.string().url("Must be a valid URL")])).optional()
});

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
  const methods = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      bio: "",
      socials: {}
    }
  });

  const { trigger, getValues } = methods;

  const rawDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    profile?.full_name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const displayName = rawDisplayName.split(" ")[0];

  const setEditorProfile = useEditorStore((s) => s.setProfileData);
  const setEditorTemplate = useEditorStore((s) => s.setTemplateId);
  const setEditorSlug = useEditorStore((s) => s.setSlug);

  const handleNext = async () => {
    if (activeTabIndex === 1) {
      const valid = await trigger(["name", "role", "email", "phone", "bio"]);
      if (!valid) return;
    }
    if (activeTabIndex === 2) {
      const valid = await trigger(["socials"]);
      if (!valid) return;
    }

    if (activeTabIndex < ONBOARDING_STEPS.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
    } else {
      const finalData = getValues();
      setEditorProfile({
        ...finalData,
        avatarUrl: "",
        bannerUrl: "",
      });
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
      className="min-h-[100dvh] w-full bg-white relative overflow-hidden flex flex-col font-sans"
    >
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
                      <FormProvider {...methods}>
                        {activeTabIndex === 1 ? (
                          <StepBasicInfo />
                        ) : activeTabIndex === 2 ? (
                          <StepSocials />
                        ) : (
                          <StepLaunch
                            data={getValues()}
                            selectedTemplateId={selectedTemplateId}
                          />
                        )}
                      </FormProvider>
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
