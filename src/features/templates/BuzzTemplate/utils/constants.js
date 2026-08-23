// Shared design tokens for the Buzz template.
// Centralized here to keep all sections and previews in sync.

import {
  SiInstagram,
  SiX,
  SiWhatsapp,
  SiDiscord,
  SiTripadvisor,
  SiFacebook,
  SiTiktok,
  SiYoutube,
  SiGithub,
  SiDribbble,
  SiBehance,
  SiSnapchat,
  SiThreads,
} from "react-icons/si";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

export const GLASS_SHADOW =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),_0px_12px_12px_-6px_rgba(0,0,0,0.06),_0px_24px_24px_-12px_rgba(0,0,0,0.06)]";

export const GLASS_BORDER =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[25px] before:p-px before:content-[''] before:[background:conic-gradient(from_90deg_at_100%_100%,rgba(255,255,255,0.5)_12%,rgba(255,255,255,0)_37%,rgba(255,255,255,0.5)_62%,rgba(255,255,255,0)_87%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]";

export const SOCIAL_ICONS = {
  instagram: { icon: SiInstagram, color: "#E1306C", bg: "#FFF0F5" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2", bg: "#EBF4FC" },
  whatsapp: { icon: SiWhatsapp, color: "#25D366", bg: "#E8FAF0" },
  x: { icon: SiX, color: "#000000", bg: "#F2F2F2" },
  twitter: { icon: FaTwitter, color: "#1DA1F2", bg: "#EBF7FE" },
  discord: { icon: SiDiscord, color: "#5865F2", bg: "#EEF0FD" },
  tripadvisor: { icon: SiTripadvisor, color: "#00AF87", bg: "#EBFDF6" },
  facebook: { icon: SiFacebook, color: "#1877F2", bg: "#EBF3FE" },
  tiktok: { icon: SiTiktok, color: "#000000", bg: "#F2F2F2" },
  youtube: { icon: SiYoutube, color: "#FF0000", bg: "#FFF0F0" },
  github: { icon: SiGithub, color: "#181717", bg: "#F2F2F2" },
  dribbble: { icon: SiDribbble, color: "#EA4C89", bg: "#FDF0F6" },
  behance: { icon: SiBehance, color: "#1769FF", bg: "#EBF2FF" },
  snapchat: { icon: SiSnapchat, color: "#E5DE00", bg: "#FFFDE6" },
  threads: { icon: SiThreads, color: "#000000", bg: "#F2F2F2" },
};
