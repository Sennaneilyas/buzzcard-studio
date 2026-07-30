import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { SocialCard } from "@/components/ui/social-card";
import { 
  SiInstagram, 
  SiX, 
  SiFacebook, 
  SiTiktok, 
  SiSnapchat, 
  SiYoutube, 
  SiGithub, 
  SiDribbble 
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

const SOCIAL_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: SiInstagram, colorClass: "text-[#E1306C]", placeholder: "https://instagram.com/..." },
  { id: "twitter", name: "X (Twitter)", icon: SiX, colorClass: "text-black", placeholder: "https://x.com/..." },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedin, colorClass: "text-[#0A66C2]", placeholder: "https://linkedin.com/in/..." },
  { id: "tiktok", name: "TikTok", icon: SiTiktok, colorClass: "text-[#000000]", placeholder: "https://tiktok.com/@..." },
  { id: "facebook", name: "Facebook", icon: SiFacebook, colorClass: "text-[#1877F2]", placeholder: "https://facebook.com/..." },
  { id: "snapchat", name: "Snapchat", icon: SiSnapchat, colorClass: "text-[#FFFC00]", placeholder: "https://snapchat.com/add/..." },
  { id: "youtube", name: "YouTube", icon: SiYoutube, colorClass: "text-[#FF0000]", placeholder: "https://youtube.com/..." },
  { id: "github", name: "GitHub", icon: SiGithub, colorClass: "text-[#181717]", placeholder: "https://github.com/..." },
  { id: "dribbble", name: "Dribbble", icon: SiDribbble, colorClass: "text-[#EA4C89]", placeholder: "https://dribbble.com/..." },
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
    <div className="space-y-8 relative">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-navy">Social Links</h3>
        <p className="text-navy/60 mt-1">Connect your digital presence.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOCIAL_PLATFORMS.map((platform) => {
          const isActive = activePlatform === platform.id;
          const value = socialsData[platform.id] || "";

          return (
            <div key={platform.id} className="relative">
              <SocialCard
                title={platform.name}
                value={value}
                icon={platform.icon}
                colorClass={platform.colorClass}
                state={isActive ? "active" : "default"}
                onClick={() => setActivePlatform(isActive ? null : platform.id)}
              />

              {/* Expandable Input Popup */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 10, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-[80%] left-0 right-0 z-30 p-4 bg-[#e0e5ec] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-navy flex items-center gap-2">
                        <platform.icon className={platform.colorClass} />
                        Add {platform.name}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlatform(null);
                        }}
                        className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 text-navy/50 hover:text-navy"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="url"
                        autoFocus
                        value={value}
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
