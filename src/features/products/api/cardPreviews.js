import { supabase } from "@/lib/supabase";

const CARD_PREVIEWS_BUCKET = "card-previews";

const CUSTOM_PREVIEW_PATHS = {
  black: {
    front: "buzzcard/custom/Black/BuzzCard Custom Black:Base design.webp",
    back: "buzzcard/custom/Black/BuzzCard Custom Black:Back.webp",
  },
  white: {
    front: "buzzcard/custom/White/DocumentBuzzCard Custom White:Base design.webp",
    back: "buzzcard/custom/White/BuzzCard Custom White:Back.webp",
  },
};

export const getBuzzCardVariantKey = (variant = {}) => {
  const value = `${variant.slug ?? ""} ${variant.name ?? ""}`.toLowerCase();

  if (value.includes("essential")) return "essential";
  if (value.includes("custom")) return "custom";
  return "standard";
};

export const getBuzzCardPreviewPath = ({ variant, color, side = "front" }) => {
  const variantKey = typeof variant === "string"
    ? variant.toLowerCase()
    : getBuzzCardVariantKey(variant);
  const colorKey = color === "white" ? "white" : "black";
  const sideKey = variantKey === "essential" || side !== "back" ? "front" : "back";

  if (variantKey === "custom") {
    return CUSTOM_PREVIEW_PATHS[colorKey][sideKey];
  }

  return `buzzcard/${variantKey}/${colorKey}/${sideKey}.webp`;
};

export const getBuzzCardPreviewUrl = (selection) => {
  const path = getBuzzCardPreviewPath(selection);

  return supabase.storage
    .from(CARD_PREVIEWS_BUCKET)
    .getPublicUrl(path).data.publicUrl;
};
