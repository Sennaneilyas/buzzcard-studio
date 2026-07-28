import { cn } from "@/lib/utils";
import {
  Globe,
  Camera,
  Briefcase,
  MessageCircle,
  MessageSquare,
} from "lucide-react";

/**
 * HeroSplit — Layout B
 *
 * Banner fills ~60% → avatar positioned to the right / offset → name left-aligned.
 * Used by: vcard15, 17, 18, 24
 */

const DEFAULT_SOCIALS = [
  { icon: Globe, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: Briefcase, label: "LinkedIn" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: MessageSquare, label: "Twitter" },
];

export default function HeroSplit({ data = {}, theme = {} }) {
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
      {/* Split layout: banner + avatar side-by-side */}
      <div className="relative flex items-end gap-0">
        {/* Banner — takes ~65% width */}
        <div className="relative w-[65%] h-52 sm:h-60 overflow-hidden rounded-br-3xl">
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
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, transparent 50%, var(--t-bg-primary) 100%)`,
            }}
          />
        </div>

        {/* Avatar — positioned to overlap the right edge */}
        <div className="absolute right-6 bottom-4 z-10">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1"
            style={{ backgroundColor: "var(--t-avatar-border)" }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold"
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
      </div>

      {/* Name + Role — left-aligned */}
      <div className="px-6 mt-5 space-y-2">
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
          className="text-sm leading-relaxed max-w-sm"
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
