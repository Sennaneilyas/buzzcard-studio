import { cn } from "@/lib/utils";
import {
  Globe,
  Camera,
  Briefcase,
  MessageCircle,
  MessageSquare,
} from "lucide-react";

/**
 * HeroMinimal — Layout D
 *
 * No/small banner → large centered avatar → prominent name + role with generous whitespace.
 * Used by: vcard13, 21, 27
 */

const DEFAULT_SOCIALS = [
  { icon: Globe, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: Briefcase, label: "LinkedIn" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: MessageSquare, label: "Twitter" },
];

export default function HeroMinimal({ data = {}, theme = {} }) {
  const {
    name = "Your Name",
    role = "Your Role",
    bio = "A short bio about yourself that will appear on your digital card.",
    avatarUrl,
    socials = DEFAULT_SOCIALS,
  } = data;

  return (
    <section className="relative w-full pt-10 pb-4">
      {/* Large centered avatar */}
      <div className="flex justify-center">
        <div
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1"
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
              className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold"
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

      {/* Name + Role + Bio — centered */}
      <div className="text-center px-6 mt-5 space-y-2">
        <h1
          className="text-2xl sm:text-3xl font-bold"
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
