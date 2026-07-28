import { cn } from "@/lib/utils";
import {
  Globe,
  Camera,
  Briefcase,
  MessageCircle,
  MessageSquare,
} from "lucide-react";

/**
 * HeroBannerOverlay — Layout A
 *
 * Full-width banner → circular avatar overlapping the bottom → centered name + role.
 * Used by: vcard12, 14, 16, 22, 23, 25, 26, 28, 30, 31
 */

const DEFAULT_SOCIALS = [
  { icon: Globe, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: Briefcase, label: "LinkedIn" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: MessageSquare, label: "Twitter" },
];

export default function HeroBannerOverlay({ data = {}, theme = {} }) {
  const {
    name = "Your Name",
    role = "Your Role",
    bio = "A short bio about yourself that will appear on your digital card.",
    bannerUrl,
    avatarUrl,
    socials = DEFAULT_SOCIALS,
  } = data;

  const avatarShape =
    theme.heroAvatarShape === "rounded-xl" ? "rounded-2xl" : "rounded-full";

  return (
    <section className="relative w-full">
      {/* Banner */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, var(--t-accent) 0%, var(--t-bg-primary) 100%)`,
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--t-bg-primary) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Avatar — overlapping */}
      <div className="relative flex justify-center -mt-16 z-10">
        <div
          className={cn("w-28 h-28 p-1", avatarShape)}
          style={{ backgroundColor: "var(--t-avatar-border)" }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className={cn("w-full h-full object-cover", avatarShape)}
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center text-3xl font-bold",
                avatarShape
              )}
              style={{
                backgroundColor: "var(--t-bg-section)",
                color: "var(--t-accent)",
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name + Role + Bio */}
      <div className="text-center px-6 mt-4 space-y-2">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--t-font-heading)",
            color: "var(--t-text-primary)",
          }}
        >
          {name}
        </h1>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--t-accent)" }}
        >
          {role}
        </p>
        <p
          className="text-sm leading-relaxed max-w-md mx-auto"
          style={{ color: "var(--t-text-secondary)" }}
        >
          {bio}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-3 mt-5 px-6">
        {socials.map((s, i) => {
          const Icon = s.icon;
          return (
            <a
              key={i}
              href={s.url || "#"}
              aria-label={s.label}
              className={cn(
                "flex items-center justify-center w-10 h-10 transition-transform hover:scale-110",
                theme.socialIconStyle === "circle-filled" &&
                  "rounded-full",
                theme.socialIconStyle === "circle-outline" &&
                  "rounded-full border-2",
                theme.socialIconStyle === "plain" && "rounded-none"
              )}
              style={{
                backgroundColor:
                  theme.socialIconStyle === "circle-filled"
                    ? "var(--t-accent)"
                    : "transparent",
                borderColor:
                  theme.socialIconStyle === "circle-outline"
                    ? "var(--t-accent)"
                    : "transparent",
                color:
                  theme.socialIconStyle === "circle-filled"
                    ? "var(--t-bg-primary)"
                    : "var(--t-accent)",
              }}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
