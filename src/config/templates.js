/**
 * BuzzCard Studio — Template Registry
 *
 * Central configuration mapping each of the 20 vCard templates to its
 * layout type, category, theme tokens, and thumbnail asset.
 *
 * Layout Types:
 *   - "banner-overlay"  → Full banner + overlapping circular avatar (Layout A)
 *   - "split-hero"      → Partial banner + offset avatar (Layout B)
 *   - "full-bleed"      → Full-screen banner + overlaid text (Layout C)
 *   - "minimal-card"    → No/small banner + large centered avatar (Layout D)
 */

// ── Thumbnail imports (static assets via Vite) ──
import vcard12 from "@/assets/templates/vcard12.png";
import vcard13 from "@/assets/templates/vcard13.png";
import vcard14 from "@/assets/templates/vcard14.png";
import vcard15 from "@/assets/templates/vcard15.png";
import vcard16 from "@/assets/templates/vcard16.png";
import vcard17 from "@/assets/templates/vcard17.png";
import vcard18 from "@/assets/templates/vcard18.png";
import vcard19 from "@/assets/templates/vcard19.png";
import vcard20 from "@/assets/templates/vcard20.png";
import vcard21 from "@/assets/templates/vcard21.png";
import vcard22 from "@/assets/templates/vcard22.png";
import vcard23 from "@/assets/templates/vcard23.png";
import vcard24 from "@/assets/templates/vcard24.png";
import vcard25 from "@/assets/templates/vcard25.png";
import vcard26 from "@/assets/templates/vcard26.png";
import vcard27 from "@/assets/templates/vcard27.png";
import vcard28 from "@/assets/templates/vcard28.png";
import vcard29 from "@/assets/templates/vcard29.png";
import vcard30 from "@/assets/templates/vcard30.png";
import vcard31 from "@/assets/templates/vcard31.png";

export const TEMPLATES = [
  // ═══════════════════════════════════════════════
  //  LAYOUT A — Banner Overlay (10 templates)
  // ═══════════════════════════════════════════════
  {
    id: "vcard12",
    name: "Midnight Gym",
    category: "professional",
    layoutType: "banner-overlay",
    thumbnail: vcard12,
    theme: {
      bgPrimary: "#1a1a2e",
      bgSection: "#1f1f35",
      textPrimary: "#ffffff",
      textSecondary: "#9ca3af",
      accent: "#39ff14",
      accentHover: "#2de610",
      heroAvatarBorder: "#39ff14",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 4px 20px rgba(0,0,0,0.3)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard14",
    name: "Ember Nights",
    category: "creative",
    layoutType: "banner-overlay",
    thumbnail: vcard14,
    theme: {
      bgPrimary: "#0f0f0f",
      bgSection: "#1a1a1a",
      textPrimary: "#ffffff",
      textSecondary: "#b0b0b0",
      accent: "#e65100",
      accentHover: "#ff6d00",
      heroAvatarBorder: "#e65100",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 4px 24px rgba(230,81,0,0.15)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard16",
    name: "Iron Justice",
    category: "professional",
    layoutType: "banner-overlay",
    thumbnail: vcard16,
    theme: {
      bgPrimary: "#0a0a0a",
      bgSection: "#141414",
      textPrimary: "#ffffff",
      textSecondary: "#a0a0a0",
      accent: "#ffffff",
      accentHover: "#e0e0e0",
      heroAvatarBorder: "#ffffff",
      heroAvatarShape: "circle",
      cardBorderRadius: "8px",
      cardShadow: "0 2px 12px rgba(0,0,0,0.4)",
      socialIconStyle: "plain",
      sectionDivider: "none",
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard22",
    name: "Neon Interface",
    category: "professional",
    layoutType: "banner-overlay",
    thumbnail: vcard22,
    theme: {
      bgPrimary: "#0d1b2a",
      bgSection: "#112240",
      textPrimary: "#ffffff",
      textSecondary: "#8892b0",
      accent: "#c0ff00",
      accentHover: "#a8e600",
      heroAvatarBorder: "#c0ff00",
      heroAvatarShape: "circle",
      cardBorderRadius: "16px",
      cardShadow: "0 4px 20px rgba(192,255,0,0.08)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard23",
    name: "Sunset Consultant",
    category: "professional",
    layoutType: "banner-overlay",
    thumbnail: vcard23,
    theme: {
      bgPrimary: "#ffffff",
      bgSection: "#f8f9fa",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      accent: "#e65100",
      accentHover: "#ff6d00",
      heroAvatarBorder: "#e65100",
      heroAvatarShape: "circle",
      cardBorderRadius: "16px",
      cardShadow: "0 2px 16px rgba(0,0,0,0.06)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard25",
    name: "Golden Cause",
    category: "minimal",
    layoutType: "banner-overlay",
    thumbnail: vcard25,
    theme: {
      bgPrimary: "#fffaf0",
      bgSection: "#fff8f0",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      accent: "#f5a623",
      accentHover: "#e6951a",
      heroAvatarBorder: "#f5a623",
      heroAvatarShape: "circle",
      cardBorderRadius: "16px",
      cardShadow: "0 2px 16px rgba(245,166,35,0.08)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard26",
    name: "Chalk & Gold",
    category: "creative",
    layoutType: "banner-overlay",
    thumbnail: vcard26,
    theme: {
      bgPrimary: "#1e1e2e",
      bgSection: "#252538",
      textPrimary: "#ffffff",
      textSecondary: "#a0a0b8",
      accent: "#ffd600",
      accentHover: "#ffca00",
      heroAvatarBorder: "#ffd600",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 4px 20px rgba(255,214,0,0.08)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
      backgroundPattern: "chalk-doodles",
    },
  },
  {
    id: "vcard28",
    name: "Pastel Paws",
    category: "specialty",
    layoutType: "banner-overlay",
    thumbnail: vcard28,
    theme: {
      bgPrimary: "#faf5ff",
      bgSection: "#f3e8ff",
      textPrimary: "#1e1b4b",
      textSecondary: "#6b7280",
      accent: "#7c4dff",
      accentHover: "#651fff",
      heroAvatarBorder: "#7c4dff",
      heroAvatarShape: "circle",
      cardBorderRadius: "20px",
      cardShadow: "0 4px 20px rgba(124,77,255,0.08)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Nunito', sans-serif",
      fontBody: "'Inter', sans-serif",
      backgroundPattern: "pet-toys",
    },
  },
  {
    id: "vcard30",
    name: "Night Rider",
    category: "specialty",
    layoutType: "banner-overlay",
    thumbnail: vcard30,
    theme: {
      bgPrimary: "#121212",
      bgSection: "#1a1a1a",
      textPrimary: "#ffffff",
      textSecondary: "#9ca3af",
      accent: "#ffd600",
      accentHover: "#ffca00",
      heroAvatarBorder: "#ffd600",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 4px 20px rgba(255,214,0,0.1)",
      socialIconStyle: "plain",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
      backgroundPattern: "taxi-icons",
    },
  },
  {
    id: "vcard31",
    name: "Craftsman Pro",
    category: "professional",
    layoutType: "banner-overlay",
    thumbnail: vcard31,
    theme: {
      bgPrimary: "#ffffff",
      bgSection: "#f9fafb",
      textPrimary: "#1f2937",
      textSecondary: "#6b7280",
      accent: "#e53935",
      accentHover: "#c62828",
      heroAvatarBorder: "#e53935",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 2px 12px rgba(0,0,0,0.06)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },

  // ═══════════════════════════════════════════════
  //  LAYOUT B — Split Hero (4 templates)
  // ═══════════════════════════════════════════════
  {
    id: "vcard15",
    name: "Teal Salon",
    category: "creative",
    layoutType: "split-hero",
    thumbnail: vcard15,
    theme: {
      bgPrimary: "#fdf8f0",
      bgSection: "#fef9f0",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      accent: "#00897b",
      accentHover: "#00796b",
      heroAvatarBorder: "#00897b",
      heroAvatarShape: "circle",
      cardBorderRadius: "16px",
      cardShadow: "0 2px 16px rgba(0,137,123,0.08)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard17",
    name: "Blush Couture",
    category: "creative",
    layoutType: "split-hero",
    thumbnail: vcard17,
    theme: {
      bgPrimary: "#fff5f7",
      bgSection: "#fff0f3",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      accent: "#e91e63",
      accentHover: "#c2185b",
      heroAvatarBorder: "#e91e63",
      heroAvatarShape: "circle",
      cardBorderRadius: "20px",
      cardShadow: "0 4px 20px rgba(233,30,99,0.08)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard18",
    name: "Luxe Estate",
    category: "professional",
    layoutType: "split-hero",
    thumbnail: vcard18,
    theme: {
      bgPrimary: "#0f1923",
      bgSection: "#162231",
      textPrimary: "#ffffff",
      textSecondary: "#8899aa",
      accent: "#00e676",
      accentHover: "#00c853",
      heroAvatarBorder: "#00e676",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 4px 20px rgba(0,230,118,0.1)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard24",
    name: "Rainbow Campus",
    category: "specialty",
    layoutType: "split-hero",
    thumbnail: vcard24,
    theme: {
      bgPrimary: "#ffffff",
      bgSection: "#f0fdf4",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      accent: "#0ea5e9",
      accentHover: "#0284c7",
      heroAvatarBorder: "#f59e0b",
      heroAvatarShape: "circle",
      cardBorderRadius: "24px",
      cardShadow: "0 4px 20px rgba(0,0,0,0.05)",
      socialIconStyle: "circle-filled",
      sectionDivider: "none",
      fontHeading: "'Nunito', sans-serif",
      fontBody: "'Inter', sans-serif",
      backgroundPattern: "school-supplies",
    },
  },

  // ═══════════════════════════════════════════════
  //  LAYOUT C — Full-Bleed Hero (3 templates)
  // ═══════════════════════════════════════════════
  {
    id: "vcard19",
    name: "Midnight Lens",
    category: "creative",
    layoutType: "full-bleed",
    thumbnail: vcard19,
    theme: {
      bgPrimary: "#0a1628",
      bgSection: "#0f1d32",
      textPrimary: "#ffffff",
      textSecondary: "#8899aa",
      accent: "#00bcd4",
      accentHover: "#0097a7",
      heroAvatarBorder: "#00bcd4",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 4px 20px rgba(0,188,212,0.1)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard20",
    name: "Desert Melody",
    category: "creative",
    layoutType: "full-bleed",
    thumbnail: vcard20,
    theme: {
      bgPrimary: "#faf5ef",
      bgSection: "#f5ede3",
      textPrimary: "#3e2723",
      textSecondary: "#795548",
      accent: "#bf360c",
      accentHover: "#a62c08",
      heroAvatarBorder: "#bf360c",
      heroAvatarShape: "circle",
      cardBorderRadius: "16px",
      cardShadow: "0 2px 16px rgba(191,54,12,0.08)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard29",
    name: "Velvet Hearts",
    category: "specialty",
    layoutType: "full-bleed",
    thumbnail: vcard29,
    theme: {
      bgPrimary: "#1a0a2e",
      bgSection: "#241040",
      textPrimary: "#ffffff",
      textSecondary: "#c0a0d8",
      accent: "#e91e63",
      accentHover: "#c2185b",
      heroAvatarBorder: "#e91e63",
      heroAvatarShape: "circle",
      cardBorderRadius: "20px",
      cardShadow: "0 4px 20px rgba(233,30,99,0.15)",
      socialIconStyle: "circle-filled",
      sectionDivider: "none",
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Inter', sans-serif",
      backgroundPattern: "hearts",
    },
  },

  // ═══════════════════════════════════════════════
  //  LAYOUT D — Minimal Card (3 templates)
  // ═══════════════════════════════════════════════
  {
    id: "vcard13",
    name: "Clean Clinic",
    category: "minimal",
    layoutType: "minimal-card",
    thumbnail: vcard13,
    theme: {
      bgPrimary: "#f8f9fa",
      bgSection: "#ffffff",
      textPrimary: "#1a237e",
      textSecondary: "#6b7280",
      accent: "#1a237e",
      accentHover: "#0d1457",
      heroAvatarBorder: "#1a237e",
      heroAvatarShape: "circle",
      cardBorderRadius: "12px",
      cardShadow: "0 2px 12px rgba(0,0,0,0.04)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard21",
    name: "Royal Beats",
    category: "creative",
    layoutType: "minimal-card",
    thumbnail: vcard21,
    theme: {
      bgPrimary: "#0a0014",
      bgSection: "#150028",
      textPrimary: "#ffffff",
      textSecondary: "#a080c0",
      accent: "#ffd700",
      accentHover: "#e6c200",
      heroAvatarBorder: "#ffd700",
      heroAvatarShape: "circle",
      cardBorderRadius: "16px",
      cardShadow: "0 4px 24px rgba(255,215,0,0.1)",
      socialIconStyle: "circle-filled",
      sectionDivider: "line",
      fontHeading: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  },
  {
    id: "vcard27",
    name: "Pawprint Haven",
    category: "specialty",
    layoutType: "minimal-card",
    thumbnail: vcard27,
    theme: {
      bgPrimary: "#fffaf5",
      bgSection: "#fff5eb",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      accent: "#ff6d00",
      accentHover: "#e65100",
      heroAvatarBorder: "#ff6d00",
      heroAvatarShape: "circle",
      cardBorderRadius: "20px",
      cardShadow: "0 4px 20px rgba(255,109,0,0.08)",
      socialIconStyle: "circle-outline",
      sectionDivider: "line",
      fontHeading: "'Nunito', sans-serif",
      fontBody: "'Inter', sans-serif",
      backgroundPattern: "paw-prints",
    },
  },
];

/**
 * Helper: look up a template by ID
 */
export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Helper: filter templates by category
 */
export function getTemplatesByCategory(categoryId) {
  if (categoryId === "all") return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === categoryId);
}
