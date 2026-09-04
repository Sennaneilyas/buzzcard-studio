export const BUZZ_EDIT_TARGETS = Object.freeze({
  cover: Object.freeze({
    id: "cover",
    label: "Cover image",
    description: "Replace or remove the profile cover image.",
    tab: "profile",
    fields: Object.freeze(["bannerUrl"]),
  }),
  quote: Object.freeze({
    id: "quote",
    label: "Quote",
    description: "Edit the short quote displayed over the cover.",
    tab: "profile",
    fields: Object.freeze(["quote"]),
  }),
  identity: Object.freeze({
    id: "identity",
    label: "Profile identity",
    description: "Edit the avatar, full name, and professional role.",
    tab: "profile",
    fields: Object.freeze(["avatarUrl", "name", "role"]),
  }),
  contact: Object.freeze({
    id: "contact",
    label: "Contact actions",
    description: "Edit the phone, email, and website action buttons.",
    tab: "profile",
    fields: Object.freeze(["email", "phone", "website"]),
  }),
  bio: Object.freeze({
    id: "bio",
    label: "About",
    description: "Edit the biography displayed in the About card.",
    tab: "profile",
    fields: Object.freeze(["bio"]),
  }),
  socials: Object.freeze({
    id: "socials",
    label: "Social links",
    description: "Add, remove, edit, or reorder social links.",
    tab: "links",
    fields: Object.freeze(["socials", "socialOrder"]),
  }),
  gallery: Object.freeze({
    id: "gallery",
    label: "Gallery",
    description: "Upload, replace, remove, or reorder gallery images.",
    tab: "gallery",
    fields: Object.freeze(["gallery"]),
  }),
  sections: Object.freeze({
    id: "sections",
    label: "Custom sections",
    description: "Create and organize additional profile sections.",
    tab: "sections",
    fields: Object.freeze(["custom_sections"]),
  }),
});

export const BUZZ_CUSTOMIZABLE_FIELDS = Object.freeze(
  [...new Set(Object.values(BUZZ_EDIT_TARGETS).flatMap((target) => target.fields))],
);

export function getBuzzEditTarget(targetId) {
  if (!targetId) return null;
  if (targetId.startsWith("section:")) return BUZZ_EDIT_TARGETS.sections;
  return BUZZ_EDIT_TARGETS[targetId] || null;
}

export function getBuzzEditorTabForTarget(targetId) {
  return getBuzzEditTarget(targetId)?.tab || "profile";
}

