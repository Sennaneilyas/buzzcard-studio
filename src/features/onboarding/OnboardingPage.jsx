import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useProfile } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { LogOut, ChevronDown, Mail, Search, Sparkles, UserCircle, Share2, Rocket, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import StepTemplate from "./steps/StepTemplate";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepSocials from "./steps/StepSocials";

const ONBOARDING_STEPS = [
  { id: "template", label: "Template", icon: Sparkles },
  { id: "info", label: "Basic Info", icon: UserCircle },
  { id: "socials", label: "Social Links", icon: Share2 },
  { id: "launch", label: "Launch", icon: Rocket },
];

export default function OnboardingPage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    phone: "",
    avatarUrl: "",
    bannerUrl: "",
  });

  const profileRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Get user profile photo from Google / Facebook / OAuth metadata or profiles table
  const userPhotoUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    profile?.avatar_url;

  const rawDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    profile?.full_name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const displayName = rawDisplayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-cloud flex flex-col justify-between">
      {/* ── Navbar ── */}
      <header className="top-0 inset-x-0 z-50">
        <div
          className="
            w-full flex items-center justify-between
            px-6 py-5 lg:px-10 bg-transparent
          "
        >
          {/* ── Logo ── */}
          <a href="/" className="flex items-center shrink-0 group">
            <img
              src="/logoHB.svg"
              alt="BuzzCard Studio"
              className="h-8 w-auto"
            />
          </a>

          {/* ── Right: User Profile ── */}
          <div className="flex items-center gap-3 relative" ref={profileRef}>
            {/* User Profile Pill */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="
                flex items-center gap-2 rounded-full
                px-2 py-1 bg-ink/[0.05] hover:bg-ink/[0.08] backdrop-blur-md border border-ink/[0.06] transition-colors
              "
            >
              {userPhotoUrl ? (
                <img
                  src={userPhotoUrl}
                  alt="Account"
                  className="size-7 rounded-full object-cover ring-1 ring-white/50"
                />
              ) : (
                <div className="flex size-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-ink/80 hidden sm:inline truncate max-w-[120px] capitalize">
                {displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-ink/50 mr-1" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-ink/5 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-ink/5 bg-ink/[0.02]">
                    <div className="flex items-center gap-3 mb-2">
                      {userPhotoUrl ? (
                        <img
                          src={userPhotoUrl}
                          alt="Account"
                          className="size-10 rounded-full object-cover ring-2 ring-mint/50"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-navy truncate">
                          {rawDisplayName}
                        </span>
                        <span className="text-xs text-ink/50 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{user?.email}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center max-w-[1600px] mx-auto">
        
        {/* Title */}
        <div className="text-center mb-10 shrink-0 mt-4">
          <h1 
            className="text-3xl sm:text-4xl tracking-tight text-ink italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Welcome, {displayName}! Let's set up your digital profile.
          </h1>
        </div>

        {/* Global Stepper Navigation */}
        <div className="w-full max-w-5xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto custom-scrollbar pb-2">
            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = activeTabIndex === index;
              const isPassed = index < activeTabIndex;
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap",
                      isActive
                        ? "bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),_inset_-3px_-3px_6px_rgba(255,255,255,0.8)] border border-mint/20"
                        : isPassed
                        ? "bg-[#e0e5ec] shadow-[3px_3px_6px_rgba(163,177,198,0.6),_-3px_-3px_6px_rgba(255,255,255,0.8)] opacity-70"
                        : "opacity-40"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold",
                        isActive || isPassed ? "text-mint" : "text-navy"
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-navy" : "text-navy/70"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {/* Separator line between steps */}
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <div className="w-4 sm:w-8 h-[2px] mx-2 bg-navy/10 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Dynamic Content Area ── */}
        {activeTabIndex === 0 ? (
          /* PHASE 1: The Full-Screen Template Gallery */
          <div className="w-full max-w-7xl mx-auto bg-[#e0e5ec] rounded-[2.5rem] relative border border-white/50 p-6 sm:p-10 flex flex-col shadow-[9px_9px_16px_rgba(163,177,198,0.6),_-9px_-9px_16px_rgba(255,255,255,0.8)]">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-navy">Select a Foundation</h2>
              <p className="text-navy/60 mt-1">Choose a template to start building your digital profile.</p>
            </div>
            
            <StepTemplate
              selectedId={selectedTemplateId}
              onSelect={setSelectedTemplateId}
            />

            {/* Floating Action Bar for Step 1 */}
            <div className="mt-10 flex justify-center sticky bottom-8 z-20">
              <button
                onClick={() => setActiveTabIndex(1)}
                disabled={!selectedTemplateId}
                className="px-10 py-4 text-base font-bold text-white bg-ink hover:bg-black rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-3"
              >
                Continue to Editor
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* PHASE 2: The Studio Editor (Wizard) */
          <div className="w-full max-w-4xl mx-auto h-auto bg-[#e0e5ec] rounded-[2rem] relative border border-white/50 p-8 flex flex-col shadow-[9px_9px_16px_rgba(163,177,198,0.6),_-9px_-9px_16px_rgba(255,255,255,0.8)] mt-10">
            
            <div className="px-2 pb-8">
              {activeTabIndex === 1 ? (
                <StepBasicInfo data={profileData} onChange={setProfileData} />
              ) : activeTabIndex === 2 ? (
                <StepSocials data={profileData} onChange={setProfileData} />
              ) : (
                <div className="space-y-6">
                  {/* Neomorphic Content Placeholders */}
                  <div className="p-6 rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_10px_rgba(163,177,198,0.6),_-6px_-6px_10px_rgba(255,255,255,0.8)]">
                    <h4 className="text-navy/80 font-bold mb-4">Configure {ONBOARDING_STEPS[activeTabIndex].label}</h4>
                    <div className="space-y-4">
                      <div className="h-12 w-full bg-[#e0e5ec] rounded-xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),_inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" />
                      <div className="h-12 w-full bg-[#e0e5ec] rounded-xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),_inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" />
                      <div className="h-32 w-full bg-[#e0e5ec] rounded-xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),_inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

                {/* Action Buttons */}
                <div className="shrink-0 pt-6 mt-6 border-t border-navy/5 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTabIndex(Math.max(0, activeTabIndex - 1))}
                    disabled={activeTabIndex === 0}
                    className="px-6 py-3 text-sm font-semibold text-navy/50 hover:text-navy transition-colors disabled:opacity-30"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveTabIndex(Math.min(ONBOARDING_STEPS.length - 1, activeTabIndex + 1))}
                    disabled={activeTabIndex === ONBOARDING_STEPS.length - 1}
                    className="px-8 py-3 text-sm font-bold text-white bg-ink hover:bg-black rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                  >
                    Next Step
                  </button>
                </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/5 bg-white/40 py-4 text-center text-xs text-ink/40">
        BuzzCard Studio • Digital NFC Profile Creation
      </footer>
    </div>
  );
}
