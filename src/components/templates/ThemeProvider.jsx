import { cn } from "@/lib/utils";

/**
 * ThemeProvider — Injects a template's theme tokens as CSS custom properties
 * so all child section components can style themselves via `var(--t-*)`.
 *
 * Usage:
 *   <ThemeProvider theme={template.theme}>
 *     <HeroComponent />
 *     <SectionContact />
 *   </ThemeProvider>
 */
export default function ThemeProvider({ theme, className, children }) {
  const cssVars = {
    "--t-bg-primary": theme.bgPrimary,
    "--t-bg-section": theme.bgSection,
    "--t-text-primary": theme.textPrimary,
    "--t-text-secondary": theme.textSecondary,
    "--t-accent": theme.accent,
    "--t-accent-hover": theme.accentHover,
    "--t-avatar-border": theme.heroAvatarBorder,
    "--t-card-radius": theme.cardBorderRadius,
    "--t-card-shadow": theme.cardShadow,
    "--t-font-heading": theme.fontHeading,
    "--t-font-body": theme.fontBody,
  };

  return (
    <div
      className={cn("w-full", className)}
      style={{
        ...cssVars,
        backgroundColor: "var(--t-bg-primary)",
        color: "var(--t-text-primary)",
        fontFamily: "var(--t-font-body)",
      }}
    >
      {children}
    </div>
  );
}
