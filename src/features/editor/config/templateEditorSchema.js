import * as z from "zod";

const optionalText = z.string().max(10000).optional();
const optionalUrl = z
  .union([z.literal(""), z.string().url("Must be a valid URL")])
  .optional();

const customSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(200),
  description: z.string().max(5000).optional(),
  image: z.string().optional(),
});

export const baseEditorShape = {
  name: z.string().trim().min(1, "Full name is required").max(160),
  avatarUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  role: z.string().max(240).optional(),
  bio: optionalText,
  email: z
    .union([z.literal(""), z.string().email("Invalid email address")])
    .optional(),
  phone: z.string().max(80).optional(),
  emails: z.array(z.union([z.literal(""), z.string().email("Invalid email address")])).max(3).optional(),
  phones: z.array(z.string().max(80)).max(3).optional(),
  location: z.string().max(500).optional(),
  website: optionalUrl,
  quote: z.string().max(500).optional(),
  socials: z.record(z.string(), optionalUrl).optional(),
  socialOrder: z.array(z.string()).optional(),
  gallery: z.array(z.string()).max(7, "Maximum 7 images allowed").optional(),
  custom_sections: z
    .array(customSectionSchema)
    .max(8, "Maximum 8 custom sections allowed")
    .optional(),
  appearance: z
    .object({
      themeColor: z.string().optional(),
      font: z.string().optional(),
    })
    .optional(),
};

export function createTemplateEditorSchema(additionalShape = {}) {
  return z.object({ ...baseEditorShape, ...additionalShape }).passthrough();
}

export function defineTemplateEditorConfig(config) {
  return Object.freeze({
    version: 1,
    dynamicFieldPatterns: [],
    sections: [],
    ...config,
    publicationSchema: config.publicationSchema || config.schema,
  });
}
