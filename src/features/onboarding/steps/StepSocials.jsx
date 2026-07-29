import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Music2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
    placeholder: "@username",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: TwitterIcon,
    gradient: "from-gray-800 to-black",
    placeholder: "@username",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    gradient: "from-[#1877f2] to-[#145ce6]",
    placeholder: "Profile URL",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: Ghost,
    gradient: "from-[#fffc00] to-[#e6e300]",
    iconColor: "text-black", // specific for snapchat
    placeholder: "username",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    gradient: "from-[#000000] via-[#25F4EE] to-[#FE2C55]",
    placeholder: "@username",
  },
];

export default function StepSocials({ data, onChange }) {
  const [activePlatform, setActivePlatform] = useState(null);

  const handleUpdate = (platformId, value) => {
    onChange({
      ...data,
      socials: {
        ...(data.socials || {}),
        [platformId]: value,
      },
    });
  };

  const socialsData = data.socials || {};

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-navy">Social Links</h3>
        <p className="text-navy/60 mt-1">Connect your digital presence.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          const isActive = activePlatform === platform.id;
          const hasValue = !!socialsData[platform.id];

          return (
            <div key={platform.id} className="relative flex flex-col items-center">
              {/* iOS Squircle App Icon */}
              <button
                type="button"
                onClick={() => setActivePlatform(isActive ? null : platform.id)}
                className={cn(
                  "relative group w-20 h-20 sm:w-24 sm:h-24 rounded-[1.25rem] sm:rounded-[1.75rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform active:scale-95",
                  hasValue ? "ring-4 ring-mint/50" : "",
                  isActive ? "scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-20" : "hover:scale-105"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-[1.25rem] sm:rounded-[1.75rem] bg-gradient-to-tr overflow-hidden",
                    platform.gradient
                  )}
                >
                  {/* Subtle inner reflection (glassmorphism) */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[1.75rem]" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className={cn("w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md", platform.iconColor || "text-white")} />
                  </div>
                </div>

                {hasValue && !isActive && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-mint rounded-full flex items-center justify-center ring-4 ring-[#e0e5ec] shadow-lg">
                    <Check className="w-4 h-4 text-navy font-bold" strokeWidth={3} />
                  </div>
                )}
              </button>
              
              <span className="mt-3 text-sm font-bold text-navy/70">{platform.name}</span>

              {/* Expandable Input Field */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 10, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 z-30 w-[280px] sm:w-[320px] p-4 bg-[#e0e5ec] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-navy">Add {platform.name}</span>
                      <button 
                        onClick={() => setActivePlatform(null)}
                        className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 text-navy/50 hover:text-navy"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={socialsData[platform.id] || ""}
                        onChange={(e) => handleUpdate(platform.id, e.target.value)}
                        placeholder={platform.placeholder}
                        className="w-full px-4 py-3 bg-[#e0e5ec] text-sm font-bold text-navy placeholder-navy/30 rounded-xl focus:outline-none shadow-[inset_4px_4px_10px_rgba(163,177,198,0.6),_inset_-4px_-4px_10px_rgba(255,255,255,0.8)] border border-transparent focus:border-mint/40 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
