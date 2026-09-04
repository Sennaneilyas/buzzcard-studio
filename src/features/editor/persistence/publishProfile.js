import { saveProfileEditor } from "./saveProfileEditor";
import { serializeEditorData } from "./templateData";

export function canPublishProfile(profile) {
  return profile?.status === "draft";
}

function formatValidationIssues(issues) {
  const fields = issues.map((issue) => issue.path.join(".") || "profile");
  const uniqueFields = [...new Set(fields)];
  return {
    fields: uniqueFields,
    message: issues
      .slice(0, 3)
      .map((issue) => {
        const field = issue.path.join(".") || "Profile";
        return `${field}: ${issue.message}`;
      })
      .join(" · "),
  };
}

export function validateProfileForPublication(config, editorData) {
  if (!config?.publicationSchema) {
    const error = new Error(
      "This template does not have a publication validation contract.",
    );
    error.code = "PUBLICATION_CONFIG_MISSING";
    throw error;
  }

  const validation = config.publicationSchema.safeParse(editorData);
  if (!validation.success) {
    const details = formatValidationIssues(validation.error.issues);
    const error = new Error(details.message || "Profile data is incomplete.");
    error.code = "PUBLICATION_VALIDATION_FAILED";
    error.fields = details.fields;
    throw error;
  }

  return validation.data;
}

export async function publishProfile({
  client,
  userId,
  profile,
  templateId,
  config,
  editorData,
  isDirty,
}) {
  if (!userId) throw new Error("User not authenticated");
  if (!profile || profile.id !== userId) {
    throw new Error("The authenticated user does not own this profile");
  }
  if (!canPublishProfile(profile)) {
    throw new Error("Only a draft profile can be published for the first time.");
  }
  if (!config || config.id !== templateId || profile.template_id !== templateId) {
    throw new Error("The active template configuration is unavailable.");
  }

  validateProfileForPublication(config, editorData);
  // Apply the normal persistence boundary even when there is nothing dirty to
  // save, so a legacy/local-only media value cannot be published accidentally.
  serializeEditorData(config, editorData);

  let currentProfile = profile;
  let currentEditorData = editorData;
  let warning = null;
  let savedBeforePublish = false;

  if (isDirty) {
    const saved = await saveProfileEditor({
      client,
      userId,
      profile,
      templateId,
      config,
      editorData,
    });
    currentProfile = saved.profile;
    currentEditorData = saved.editorData;
    warning = saved.warning;
    savedBeforePublish = true;
  }

  const savedResult = savedBeforePublish
    ? {
        profile: currentProfile,
        editorData: currentEditorData,
        warning,
      }
    : null;

  try {
    let query = client
      .from("profiles")
      .update({ status: "published" })
      .eq("id", userId)
      .eq("status", "draft")
      .eq("template_id", templateId);

    if (currentProfile.updated_at) {
      query = query.eq("updated_at", currentProfile.updated_at);
    }

    const { data, error } = await query.select("*").maybeSingle();
    if (error) throw error;

    if (!data) {
      const conflictError = new Error(
        "This profile changed in another session or was already published. Reload Studio and try again.",
      );
      conflictError.code = "PROFILE_PUBLISH_CONFLICT";
      throw conflictError;
    }

    return {
      profile: data,
      editorData: currentEditorData,
      warning,
      savedBeforePublish,
    };
  } catch (error) {
    if (savedResult && error && typeof error === "object") {
      error.savedResult = savedResult;
    }
    throw error;
  }
}
