import { Grid3X3, Briefcase, Palette, MinusSquare, Star } from "lucide-react";

/**
 * Template categories for the Step 1 filter bar.
 * Each entry maps to a pill button in the selection UI.
 */
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All", icon: Grid3X3 },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "minimal", label: "Minimal", icon: MinusSquare },
  { id: "specialty", label: "Specialty", icon: Star },
];
