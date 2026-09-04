import { buzzTemplateEditorConfig } from "@/features/templates/BuzzTemplate/editorConfig";
import { coiffeurTemplateEditorConfig } from "@/features/templates/coiffeur-template/editorConfig";
import { doctorTemplateEditorConfig } from "@/features/templates/doctor-template/editorConfig";
import { hotelTemplateEditorConfig } from "@/features/templates/hotel-template/editorConfig";

export const TEMPLATE_EDITOR_CONFIGS = Object.freeze({
  [buzzTemplateEditorConfig.id]: buzzTemplateEditorConfig,
  [doctorTemplateEditorConfig.id]: doctorTemplateEditorConfig,
  [hotelTemplateEditorConfig.id]: hotelTemplateEditorConfig,
  [coiffeurTemplateEditorConfig.id]: coiffeurTemplateEditorConfig,
});

export function getTemplateEditorConfig(templateId) {
  return TEMPLATE_EDITOR_CONFIGS[templateId] || null;
}

