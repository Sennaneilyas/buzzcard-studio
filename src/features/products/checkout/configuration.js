export const CONFIGURATION_FIELDS = {
  google_review: {
    key: "reviewDestination",
    label: "Google Review URL or business address",
    placeholder: "https://g.page/r/... or business address",
    inputMode: "url",
  },
  instagram: {
    key: "instagramDestination",
    label: "Instagram URL or username",
    placeholder: "@buzzcard or https://instagram.com/buzzcard",
    inputMode: "text",
  },
  whatsapp: {
    key: "whatsappDestination",
    label: "WhatsApp number or link",
    placeholder: "+212 6... or https://wa.me/...",
    inputMode: "tel",
  },
  website: {
    key: "websiteUrl",
    label: "Website URL",
    placeholder: "https://example.com",
    inputMode: "url",
  },
  custom_url: {
    key: "customUrl",
    label: "Destination URL",
    placeholder: "https://example.com/page",
    inputMode: "url",
  },
};

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const getDefaultConfiguration = (configurationType) => (
  configurationType === "profile"
    ? { profileMode: "new_profile", profileUsername: "" }
    : { [CONFIGURATION_FIELDS[configurationType]?.key ?? "destination"]: "" }
);

export const getDefaultCustomization = () => ({
  designType: "standard",
  designNotes: "",
  businessName: "",
  displayName: "",
  profession: "",
  secondaryText: "",
  logoPreviewUrl: "",
  logoUrl: "",
  previewSide: "front",
  file: null,
  fileName: "",
  fileSize: 0,
  fileType: "",
});

export const isClassiqueProduct = (slug) => (
  slug === "classique" || slug === "carte-nfc-classique"
);

export const getClassiqueDesignType = (variant = {}) => {
  const value = `${variant.slug ?? ""} ${variant.name ?? ""}`.toLowerCase();
  if (value.includes("essential")) return "blank";
  if (value.includes("custom")) return "custom";
  return "standard";
};

export const validateConfiguration = (configurationType, configuration = {}) => {
  if (configurationType === "profile") {
    if (configuration.profileMode === "new_profile") return "";
    return configuration.profileUsername?.trim()
      ? ""
      : "Enter the BuzzCard profile username to link.";
  }

  const field = CONFIGURATION_FIELDS[configurationType];
  if (!field) return "";

  const value = configuration[field.key]?.trim();
  if (!value) return `${field.label} is required.`;

  if ((configurationType === "website" || configurationType === "custom_url") && !isHttpUrl(value)) {
    return "Enter a complete URL beginning with http:// or https://.";
  }

  if (configurationType === "instagram") {
    const isUsername = /^@?[a-zA-Z0-9._]{1,30}$/.test(value);
    if (!isUsername && !isHttpUrl(value)) return "Enter a valid Instagram username or URL.";
  }

  if (configurationType === "whatsapp") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7 && !isHttpUrl(value)) return "Enter a valid WhatsApp number or link.";
  }

  return "";
};

export const validateCustomization = (customizationMode, customization = {}) => {
  if (customizationMode === "none" || customization.designType === "standard" || customization.designType === "blank") return "";
  if (customization.designType !== "custom") return "Choose a design option.";
  return customization.fileName
    || customization.logoPreviewUrl
    || customization.logoUrl
    || customization.displayName?.trim()
    || customization.profession?.trim()
    || customization.businessName?.trim()
    || customization.secondaryText?.trim()
    || customization.designNotes?.trim()
    ? ""
    : "Attach a design reference or describe the custom design.";
};

export const getCartItemErrors = (item) => ({
  configuration: validateConfiguration(item.configurationType, item.configuration),
  customization: validateCustomization(item.customizationMode, item.customization),
});

export const isCartItemConfigured = (item) => {
  const errors = getCartItemErrors(item);
  return !errors.configuration && !errors.customization;
};
