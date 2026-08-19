/**
 * BuzzCard Studio — Template Registry
 *
 * Central configuration mapping each of the active vCard templates to its
 * layout type, category, theme tokens, and thumbnail asset.
 */

// ── Thumbnail imports (static assets via Vite) ──
import thumbHotel from "@/assets/templates/thumb_hotel.png";
import thumbDoctor from "@/assets/templates/thumb_doctor.png";
import thumbCoiffeur from "@/assets/templates/thumb_coiffeur.png";
import thumbBuzz from "@/assets/templates/thumb_buzz.png";

export const TEMPLATES = [
  {
    id: "buzz-template",
    name: "BuzzCard Original",
    category: "premium",
    layoutType: "custom",
    thumbnail: thumbBuzz,
    previewUrl: "/template",
    isPremium: true,
    theme: {
      bgPrimary: "#0c0d10",
      textPrimary: "#FFFFFF",
      accent: "#FFFFFF",
    },
    allowedFields: ["avatarUrl", "bannerUrl", "name", "role", "bio", "email", "phone", "socials", "gallery", "custom_sections"],
    allowedSections: [
      { id: "about", label: "About Me" },
      { id: "portfolio", label: "Portfolio" },
      { id: "experience", label: "Experience" }
    ],
  },
  {
    id: "hotel-template",
    name: "Luxury Hotel",
    category: "premium",
    layoutType: "custom",
    thumbnail: thumbHotel,
    previewUrl: "/template-hotel",
    isPremium: true,
    theme: {
      bgPrimary: "#FAF6F0",
      textPrimary: "#3B2A22",
      accent: "#C9A96E",
    },
    allowedFields: ["avatarUrl", "bannerUrl", "name", "bio", "email", "phone", "socials", "gallery", "custom_sections"],
    allowedSections: [
      { id: "rooms", label: "Rooms & Suites" },
      { id: "amenities", label: "Amenities" },
      { id: "dining", label: "Dining & Bar" },
      { id: "events", label: "Events & Spa" }
    ],
  },
  {
    id: "doctor-template",
    name: "Doctor & Clinic",
    category: "premium",
    layoutType: "custom",
    thumbnail: thumbDoctor,
    previewUrl: "/template-doctor",
    isPremium: true,
    theme: {
      bgPrimary: "#F0F9FF",
      textPrimary: "#0F172A",
      accent: "#0284C7",
    },
    allowedFields: ["avatarUrl", "bannerUrl", "name", "role", "bio", "email", "phone", "socials", "gallery", "custom_sections"],
    allowedSections: [
      { id: "services", label: "Medical Services" },
      { id: "insurance", label: "Accepted Insurance" },
      { id: "team", label: "Our Team" },
      { id: "faq", label: "Patient FAQ" }
    ],
  },
  {
    id: "coiffeur-template",
    name: "Barber & Coiffeur",
    category: "premium",
    layoutType: "custom",
    thumbnail: thumbCoiffeur,
    previewUrl: "/template-coiffeur",
    isPremium: true,
    theme: {
      bgPrimary: "#0C0D10",
      textPrimary: "#FFFFFF",
      accent: "#E2B764",
    },
    allowedFields: ["avatarUrl", "bannerUrl", "name", "bio", "email", "phone", "socials", "gallery", "custom_sections"],
    allowedSections: [
      { id: "services", label: "Services & Pricing" },
      { id: "products", label: "Our Products" },
      { id: "team", label: "The Barbers" },
      { id: "gallery", label: "Lookbook" }
    ],
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
