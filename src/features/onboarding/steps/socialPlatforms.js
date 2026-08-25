import {
  SiBehance,
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiSnapchat,
  SiThreads,
  SiTiktok,
  SiTripadvisor,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

export const SOCIAL_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: SiInstagram, colorClass: "text-[#E1306C]", placeholder: "https://instagram.com/..." },
  { id: "twitter", name: "X (Twitter)", icon: SiX, colorClass: "text-black", placeholder: "https://x.com/..." },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedin, colorClass: "text-[#0A66C2]", placeholder: "https://linkedin.com/in/..." },
  { id: "tiktok", name: "TikTok", icon: SiTiktok, colorClass: "text-[#000000]", placeholder: "https://tiktok.com/@..." },
  { id: "facebook", name: "Facebook", icon: SiFacebook, colorClass: "text-[#1877F2]", placeholder: "https://facebook.com/..." },
  { id: "snapchat", name: "Snapchat", icon: SiSnapchat, colorClass: "text-[#FFFC00]", placeholder: "https://snapchat.com/add/..." },
  { id: "youtube", name: "YouTube", icon: SiYoutube, colorClass: "text-[#FF0000]", placeholder: "https://youtube.com/..." },
  { id: "github", name: "GitHub", icon: SiGithub, colorClass: "text-[#181717]", placeholder: "https://github.com/..." },
  { id: "dribbble", name: "Dribbble", icon: SiDribbble, colorClass: "text-[#EA4C89]", placeholder: "https://dribbble.com/..." },
  { id: "behance", name: "Behance", icon: SiBehance, colorClass: "text-[#1769ff]", placeholder: "https://behance.net/..." },
  { id: "tripadvisor", name: "TripAdvisor", icon: SiTripadvisor, colorClass: "text-[#34E0A1]", placeholder: "https://tripadvisor.com/..." },
  { id: "threads", name: "Threads", icon: SiThreads, colorClass: "text-black", placeholder: "https://threads.net/..." },
];
