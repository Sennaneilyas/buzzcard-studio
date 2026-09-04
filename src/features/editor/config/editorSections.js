export function getEditorSections(config) {
  return Array.isArray(config?.sections) ? config.sections : [];
}

export function getEditorSection(config, sectionId) {
  if (!sectionId) return null;
  const normalizedId = sectionId.startsWith("section:") ? "sections" : sectionId;
  return getEditorSections(config).find(section => section.id === normalizedId) || null;
}

export function getEditorTabForSection(config, sectionId) {
  return getEditorSection(config, sectionId)?.tab || "profile";
}
