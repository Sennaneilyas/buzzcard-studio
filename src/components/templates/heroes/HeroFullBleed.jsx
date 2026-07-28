import { cn } from "@/lib/utils";
import {
  Globe,
  Camera,
  Briefcase,
  MessageCircle,
  MessageSquare,
} from "lucide-react";

/**
 * HeroFullBleed — Layout C
 *
 * Full-viewport banner → name + role + bio overlaid directly on the image.
 * Used by: vcard19, 20, 29
 */

const DEFAULT_SOCIALS = [
  { icon: Globe, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: Briefcase, label: "LinkedIn" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: MessageSquare, label: "Twitter" },
];

export default function HeroFullBleed({ data = {}, theme = {} }) {
  const {
    name = "Your Name",
    role = "Your Role",
    bio = "A short bio about yourself that will appear on your digital card.",
    bannerUrl,
    avatarUrl,
    socials = DEFAULT_SOCIALS,
  } = data;

  return (
    <section className="relative w-full">
      {/* Full-bleed banner */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden">
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
              background: `linear-gradient(135deg, var(--t-accent) 0%, var(--t-bg-primary) 60%, var(--t-bg-primary) 100%)`,
            }}
          />
        )}
        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--t-bg-primary) 10%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
          }}
        />

        {/* Name + Role + Avatar overlaid on the banner */}
        <div className="absolute bottom-0 inset-x-0 p-6 z-10">
          <div className="flex items-end gap-4">
            {/* Optional avatar */}
            {avatarUrl && (
              <div
                className="w-20 h-20 rounded-full p-0.5 shrink-0"
                style={{ backgroundColor: "var(--t-avatar-border)" }}
              >
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
            <div className="space-y-1">
              <h1
                className="text-2xl sm:text-3xl font-bold drop-shadow-lg"
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
            </div>
          </div>
        </div>
      </div>

      {/* Bio below banner */}
      <div className="px-6 mt-4">
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--t-text-secondary)" }}
        >
          {bio}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex gap-3 mt-5 px-6">
        {socials.map((s, i) => {
          const Icon = s.icon;
          return (
            <a
              key={i}
              href={s.url || "#"}
              aria-label={s.label}
              className={cn(
                "flex items-center justify-center w-10 h-10 transition-transform hover:scale-110",
                theme.socialIconStyle === "circle-filled" && "rounded-full",
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
