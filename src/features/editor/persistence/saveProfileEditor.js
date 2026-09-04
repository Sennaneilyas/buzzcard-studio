import {
  buildTemplateDataDocument,
  hydrateProfileEditor,
  serializeEditorData,
} from "./templateData";

export async function saveProfileEditor({
  client,
  userId,
  profile,
  templateId,
  config,
  editorData,
  mode = "active",
}) {
  if (!userId) throw new Error("User not authenticated");
  if (!profile || profile.id !== userId) {
    throw new Error("The authenticated user does not own this profile");
  }
  if (!config || config.id !== templateId) {
    throw new Error("The selected template configuration is unavailable");
  }
  if (mode !== "active" && mode !== "candidate") {
    throw new Error("The Studio save mode is invalid");
  }
  if (mode === "active" && profile.template_id !== templateId) {
    throw new Error(
      "The selected template changed elsewhere. Reload Studio before saving.",
    );
  }
  if (mode === "candidate" && profile.template_id === templateId) {
    throw new Error("This template is already active. Return to the normal Studio editor.");
  }

  const { profileFields, templateFields } = serializeEditorData(
    config,
    editorData,
  );
  const templateData = buildTemplateDataDocument(
    profile.template_data,
    templateId,
    config,
    templateFields,
  );
  // Candidate saves deliberately leave profile-wide identity and the active
  // template untouched, so a published profile cannot change before Apply.
  const updatePayload = mode === "candidate"
    ? { template_data: templateData }
    : { ...profileFields, template_data: templateData };

  let query = client
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId)
    .eq("template_id", profile.template_id);

  // Detect cross-device edits instead of silently overwriting a newer row.
  if (profile.updated_at) {
    query = query.eq("updated_at", profile.updated_at);
  }

  const { data, error } = await query.select("*").maybeSingle();
  if (error) throw error;

  if (!data) {
    const conflictError = new Error(
      "This profile changed in another session. Reload Studio, review the latest version, and try again.",
    );
    conflictError.code = "PROFILE_SAVE_CONFLICT";
    throw conflictError;
  }

  const hydrated = hydrateProfileEditor(
    mode === "candidate" ? { ...data, template_id: templateId } : data,
    config,
  );
  if (!hydrated.data) {
    throw new Error("The saved profile could not be rehydrated safely");
  }

  return {
    profile: data,
    editorData: hydrated.data,
    warning: hydrated.warning,
    updatePayload,
  };
}
