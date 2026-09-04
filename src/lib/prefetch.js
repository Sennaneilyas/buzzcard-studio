/**
 * BuzzCard Studio — Hover-to-Preload Engine
 *
 * Pre-downloads route and template JavaScript bundles during the natural
 * ~150-300ms human delay between mouse hover and mouse click.
 */

// Cache of already prefetched modules to avoid redundant import calls
const prefetchedSet = new Set();

/**
 * Route-to-chunk import mapping
 */
const ROUTE_PRELOADERS = {
  "/": () => import("@/features/marketing/LandingPage"),
  "/auth": () => import("@/features/auth"),
  "/products": () => import("@/features/products/ProductsPage"),
  "/onboarding": () => import("@/features/onboarding/OnboardingPage"),
  "/dashboard": () => import("@/app/routes/dashboard"),
  "/template": () => import("@/app/routes/template-preview/BuzzTemplatePreview"),
  "/template-doctor": () => import("@/features/templates/doctor-template/DoctorTemplate"),
  "/template-coiffeur": () => import("@/features/templates/coiffeur-template/CoiffeurTemplate"),
  "/template-hotel": () => import("@/features/templates/hotel-template/HotelTemplate"),
};

/**
 * Template ID to component import mapping
 */
export const TEMPLATE_LOADERS = {
  "buzz-template": () => import("@/features/templates/BuzzTemplate/BuzzTemplate"),
  "doctor-template": () => import("@/features/templates/doctor-template/DoctorTemplate"),
  "coiffeur-template": () => import("@/features/templates/coiffeur-template/CoiffeurTemplate"),
  "hotel-template": () => import("@/features/templates/hotel-template/HotelTemplate"),
};

/**
 * Prefetches a route's JS chunk on hover/focus.
 * @param {string} path Route path (e.g. "/products", "/auth?mode=login")
 */
export function prefetchRoute(path) {
  if (!path || typeof path !== "string") return;

  // Clean pathname (strip query params and hashes)
  const cleanPath = path.split("?")[0].split("#")[0] || "/";

  if (prefetchedSet.has(cleanPath)) return;

  const loader = ROUTE_PRELOADERS[cleanPath];
  if (loader) {
    prefetchedSet.add(cleanPath);
    // Execute dynamic import in background idle time
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        loader().catch(() => prefetchedSet.delete(cleanPath));
      });
    } else {
      setTimeout(() => {
        loader().catch(() => prefetchedSet.delete(cleanPath));
      }, 0);
    }
  }
}

/**
 * Prefetches a specific template chunk by its ID.
 * @param {string} templateId e.g. "hotel-template", "doctor-template"
 */
export function prefetchTemplate(templateId) {
  if (!templateId) return;

  const key = `tpl:${templateId}`;
  if (prefetchedSet.has(key)) return;

  const loader = TEMPLATE_LOADERS[templateId];
  if (loader) {
    prefetchedSet.add(key);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        loader().catch(() => prefetchedSet.delete(key));
      });
    } else {
      setTimeout(() => {
        loader().catch(() => prefetchedSet.delete(key));
      }, 0);
    }
  }
}
