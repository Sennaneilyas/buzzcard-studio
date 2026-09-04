import { hydrateProfileEditor } from "./templateData";
import { saveProfileEditor } from "./saveProfileEditor";

function attachSavedCandidate(error, savedResult) {
  error.savedResult = savedResult;
  return error;
}

export async function applyTemplateSwitch({
  client,
  userId,
  profile,
  candidateTemplateId,
  config,
  editorData,
}) {
  if (!userId) throw new Error("User not authenticated");
  if (!profile || profile.id !== userId) {
    throw new Error("The authenticated user does not own this profile");
  }
  if (!config || config.id !== candidateTemplateId) {
    throw new Error("The candidate template is not registered in Studio");
  }
  if (profile.template_id === candidateTemplateId) {
    throw new Error("This template is already active");
  }

  const savedResult = await saveProfileEditor({
    client,
    userId,
    profile,
    templateId: candidateTemplateId,
    config,
    editorData,
    mode: "candidate",
  });

  let query = client
    .from("profiles")
    .update({ template_id: candidateTemplateId })
    .eq("id", userId)
    .eq("template_id", profile.template_id);

  if (savedResult.profile.updated_at) {
    query = query.eq("updated_at", savedResult.profile.updated_at);
  }

  const { data, error } = await query.select("*").maybeSingle();
  if (error) throw attachSavedCandidate(error, savedResult);

  if (!data) {
    const conflictError = new Error(
      "This profile changed in another session. Your candidate was saved, but the template was not applied. Reload and try again.",
    );
    conflictError.code = "PROFILE_TEMPLATE_SWITCH_CONFLICT";
    throw attachSavedCandidate(conflictError, savedResult);
  }

  const hydrated = hydrateProfileEditor(data, config);
  if (!hydrated.data) {
    const hydrationError = new Error(
      "The template was applied, but Studio could not reload its saved data safely.",
    );
    hydrationError.code = "PROFILE_TEMPLATE_SWITCH_HYDRATION_FAILED";
    throw hydrationError;
  }

  return {
    profile: data,
    editorData: hydrated.data,
    warning: hydrated.warning,
    savedCandidateResult: savedResult,
  };
}
