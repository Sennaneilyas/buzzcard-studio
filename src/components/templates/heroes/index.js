/**
 * Hero Layout barrel export.
 * Maps layoutType string → React component for the TemplateRenderer.
 */
import HeroBannerOverlay from "./HeroBannerOverlay";
import HeroSplit from "./HeroSplit";
import HeroFullBleed from "./HeroFullBleed";
import HeroMinimal from "./HeroMinimal";

export const HERO_LAYOUTS = {
  "banner-overlay": HeroBannerOverlay,
  "split-hero": HeroSplit,
  "full-bleed": HeroFullBleed,
  "minimal-card": HeroMinimal,
};

export { HeroBannerOverlay, HeroSplit, HeroFullBleed, HeroMinimal };
