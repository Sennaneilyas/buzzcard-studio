import { useAuthStore, useProfile } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { LogOut, Layout, UserCircle, Image, Share2, Rocket } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

export default function OnboardingPage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Get user profile photo from Google / Facebook / OAuth metadata or profiles table
  const userPhotoUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    profile?.avatar_url;

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email;

  const onboardingTabs = [
    {
      id: "template",
      label: "Template",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=800&auto=format&fit=crop"
            alt="Choose your card template"
            className="rounded-lg w-full h-52 object-cover !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
          />
          <div className="flex flex-col gap-y-2 justify-center">
            <div className="flex items-center gap-2 text-mint">
              <Layout className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 1</span>
            </div>
            <h2 className="text-xl font-bold !m-0 text-white">
              Choose Your Card Style
            </h2>
            <p className="text-sm text-gray-300 mt-0 leading-relaxed">
              Select from Personal Profile, Review Card, or Smart Bracelet. Each template is designed for a specific use-case — pick the one that fits your brand.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "info",
      label: "Basic Info",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop"
            alt="Enter your basic info"
            className="rounded-lg w-full h-52 object-cover !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
          />
          <div className="flex flex-col gap-y-2 justify-center">
            <div className="flex items-center gap-2 text-mint">
              <UserCircle className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 2</span>
            </div>
            <h2 className="text-xl font-bold !m-0 text-white">
              Personal & Business Details
            </h2>
            <p className="text-sm text-gray-300 mt-0 leading-relaxed">
              Enter your first name, last name, job title, company, bio, and choose a brand accent color. This information appears front-and-center on your digital card.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
            alt="Upload your profile photo"
            className="rounded-lg w-full h-52 object-cover !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
          />
          <div className="flex flex-col gap-y-2 justify-center">
            <div className="flex items-center gap-2 text-mint">
              <Image className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 3</span>
            </div>
            <h2 className="text-xl font-bold !m-0 text-white">
              Avatar & Hero Banner
            </h2>
            <p className="text-sm text-gray-300 mt-0 leading-relaxed">
              Upload a crisp profile photo and hero banner image. These visuals personalize your NFC card and make a lasting first impression on anyone who taps it.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contacts",
      label: "Contacts",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=800&auto=format&fit=crop"
            alt="Add your contact info"
            className="rounded-lg w-full h-52 object-cover !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
          />
          <div className="flex flex-col gap-y-2 justify-center">
            <div className="flex items-center gap-2 text-mint">
              <Share2 className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 4</span>
            </div>
            <h2 className="text-xl font-bold !m-0 text-white">
              Contacts & Socials
            </h2>
            <p className="text-sm text-gray-300 mt-0 leading-relaxed">
              Add your phone numbers, emails, and social media links — LinkedIn, WhatsApp, Instagram, and more. Anyone who taps your card can connect with you instantly.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "launch",
      label: "Launch",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
            alt="Preview and launch your card"
            className="rounded-lg w-full h-52 object-cover !m-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none"
          />
          <div className="flex flex-col gap-y-2 justify-center">
            <div className="flex items-center gap-2 text-mint">
              <Rocket className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 5</span>
            </div>
            <h2 className="text-xl font-bold !m-0 text-white">
              Preview & Launch
            </h2>
            <p className="text-sm text-gray-300 mt-0 leading-relaxed">
              See a live preview of your completed digital profile card. Once you're happy, hit launch — your NFC BuzzCard goes live and is ready to share with the world.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cloud flex flex-col justify-between">
      {/* ── Navbar — Same style as LandingPage Navbar ── */}
      <header className="top-0 inset-x-0 z-50">
        <div
          className="
            mx-auto flex items-center justify-between
            max-w-7xl px-6 py-5 lg:px-10 bg-transparent
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

          {/* ── Right: User Icon + Logout ── */}
          <div className="flex items-center gap-2">
            <div
              className="
                flex items-center gap-0.5 rounded-full
                px-1.5 py-1.5 bg-ink/[0.05] backdrop-blur-md border border-ink/[0.06]
              "
            >
              {/* User avatar / initials pill */}
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-full">
                {userPhotoUrl ? (
                  <img
                    src={userPhotoUrl}
                    alt="Account"
                    className="size-7 rounded-full object-cover ring-1 ring-white/50"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                    {(displayName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-ink/60 hidden sm:inline truncate max-w-[120px]">
                  {displayName}
                </span>
              </div>

              {/* Logout button inside the pill */}
              <button
                onClick={handleLogout}
                className="
                  relative px-3 py-1.5 text-sm font-medium rounded-full
                  text-ink/60 transition-colors duration-200
                  hover:text-ink hover:bg-ink/[0.04]
                "
                title="Sign Out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Onboarding Content ── */}
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl flex flex-col items-center">
          {/* Welcome heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
              Let's set up your digital profile
            </h1>
            <p className="mt-2 text-sm text-ink/55 max-w-md mx-auto">
              Follow these five steps to create, customize, and launch your NFC BuzzCard. Tap a step below to see what's ahead.
            </p>
          </div>

          {/* Animated Tabs — Onboarding Steps */}
          <AnimatedTabs
            tabs={onboardingTabs}
            defaultTab="template"
            className="w-full max-w-3xl"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/5 bg-white/40 py-4 text-center text-xs text-ink/40">
        BuzzCard Studio • Digital NFC Profile Creation
      </footer>
    </div>
  );
}

