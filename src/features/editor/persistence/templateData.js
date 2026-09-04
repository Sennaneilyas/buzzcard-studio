export const TEMPLATE_DATA_DOCUMENT_VERSION = 1;

const PROFILE_LEVEL_EDITOR_FIELDS = new Set(["name", "avatarUrl"]);

export function isPlainObject(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype,
  );
}

function cloneJsonValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(defaultValue, savedValue) {
  if (!isPlainObject(defaultValue) || !isPlainObject(savedValue)) {
    return cloneJsonValue(savedValue);
  }

  const result = cloneJsonValue(defaultValue);
  Object.entries(savedValue).forEach(([key, value]) => {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }
    result[key] =
      isPlainObject(result[key]) && isPlainObject(value)
        ? deepMerge(result[key], value)
        : cloneJsonValue(value);
  });
  return result;
}

function isEmptyObject(value) {
  return isPlainObject(value) && Object.keys(value).length === 0;
}

function isAllowedDynamicField(config, key) {
  return config.dynamicFieldPatterns.some((pattern) => pattern.test(key));
}

function selectConfiguredFields(
  config,
  data,
  { includeProfileFields = false } = {},
) {
  if (!isPlainObject(data)) return {};

  const allowedFields = new Set(config.persistedFields);
  if (includeProfileFields) {
    PROFILE_LEVEL_EDITOR_FIELDS.forEach((field) => allowedFields.add(field));
  }

  return Object.fromEntries(
    Object.entries(data)
      .filter(
        ([key, value]) =>
          value !== undefined &&
          (allowedFields.has(key) || isAllowedDynamicField(config, key)),
      )
      .map(([key, value]) => [key, cloneJsonValue(value)]),
  );
}

function readSavedTemplateEntry(rawTemplateData, templateId, config) {
  if (rawTemplateData == null || isEmptyObject(rawTemplateData)) {
    return { savedData: null, source: "empty", warning: null, canSave: true };
  }

  if (!isPlainObject(rawTemplateData)) {
    return {
      savedData: null,
      source: "malformed",
      warning: "Saved template data was malformed, so safe defaults were loaded.",
      canSave: true,
    };
  }

  if (rawTemplateData.version === TEMPLATE_DATA_DOCUMENT_VERSION) {
    if (!isPlainObject(rawTemplateData.templates)) {
      return {
        savedData: null,
        source: "malformed",
        warning: "Saved template data had an invalid templates map, so safe defaults were loaded.",
        canSave: true,
      };
    }

    const entry = rawTemplateData.templates[templateId];
    if (entry == null) {
      return { savedData: null, source: "empty", warning: null, canSave: true };
    }

    // Accept the early v1 shape where the template value was the data object
    // directly, then rewrite it to the explicit { version, data } contract on save.
    if (isPlainObject(entry) && entry.version == null && entry.data == null) {
      return {
        savedData: entry,
        source: "v1-direct",
        warning: "This template used an early v1 shape and will be normalized on save.",
        canSave: true,
      };
    }

    if (!isPlainObject(entry) || !isPlainObject(entry.data)) {
      return {
        savedData: null,
        source: "malformed",
        warning: "The active template entry was malformed, so safe defaults were loaded.",
        canSave: true,
      };
    }

    const entryVersion = Number(entry.version);
    if (!Number.isInteger(entryVersion) || entryVersion < 1) {
      return {
        savedData: entry.data,
        source: "older-entry",
        warning: "Older template data was loaded and will be upgraded on save.",
        canSave: true,
      };
    }

    if (entryVersion > config.version) {
      return {
        savedData: null,
        source: "future-entry",
        warning:
          "This profile was saved by a newer template version. Update the app before editing it.",
        canSave: false,
      };
    }

    return {
      savedData: entry.data,
      source: entryVersion < config.version ? "older-entry" : "saved",
      warning:
        entryVersion < config.version
          ? "Older template data was loaded and will be upgraded on save."
          : null,
      canSave: true,
    };
  }

  if (typeof rawTemplateData.version === "number") {
    return {
      savedData: null,
      source: "future-document",
      warning:
        "This profile uses an unsupported template-data version. Update the app before editing it.",
      canSave: false,
    };
  }

  // Milestone 2 and the previous Studio saved one flat object. Treat it as the
  // selected template's data once, then rewrite it into the versioned document.
  return {
    savedData: rawTemplateData,
    source: "legacy-flat",
    warning: "Legacy Studio data was loaded and will be upgraded on save.",
    canSave: true,
  };
}

function applyProfileFields(editorData, profile, source, savedData) {
  const legacyName = source === "legacy-flat" ? savedData?.name : null;
  const legacyAvatar = source === "legacy-flat" ? savedData?.avatarUrl : null;

  return {
    ...editorData,
    name: String(legacyName || profile.full_name || editorData.name || "").trim(),
    avatarUrl: legacyAvatar || profile.avatar_url || "",
  };
}

export function hydrateProfileEditor(profile, config) {
  if (!profile || !config) {
    return {
      data: null,
      warning: "Profile or template configuration is missing.",
      canSave: false,
      source: "missing",
    };
  }

  const savedEntry = readSavedTemplateEntry(
    profile.template_data,
    profile.template_id,
    config,
  );
  const savedFields = selectConfiguredFields(config, savedEntry.savedData, {
    includeProfileFields: savedEntry.source === "legacy-flat",
  });
  const mergedData = deepMerge(config.defaults, savedFields);
  const editorData = applyProfileFields(
    mergedData,
    profile,
    savedEntry.source,
    savedFields,
  );
  const validation = config.schema.safeParse(editorData);

  if (!validation.success) {
    const safeDefaults = applyProfileFields(
      cloneJsonValue(config.defaults),
      profile,
      "empty",
      null,
    );
    const defaultsValidation = config.schema.safeParse(safeDefaults);

    return {
      data: defaultsValidation.success ? defaultsValidation.data : safeDefaults,
      warning:
        "Saved template values failed validation, so safe defaults were loaded. Saving will replace the invalid active-template values.",
      canSave: defaultsValidation.success,
      source: "invalid-saved-data",
    };
  }

  return {
    data: validation.data,
    warning: savedEntry.warning,
    canSave: savedEntry.canSave,
    source: savedEntry.source,
  };
}

function findLocalMedia(value, path = []) {
  if (typeof value === "string") {
    if (value.startsWith("data:") || value.startsWith("blob:")) {
      return path.join(".") || "media";
    }
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const found = findLocalMedia(value[index], [...path, String(index)]);
      if (found) return found;
    }
    return null;
  }

  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      const found = findLocalMedia(nestedValue, [...path, key]);
      if (found) return found;
    }
  }

  return null;
}

export function serializeEditorData(config, editorData) {
  const validation = config.schema.safeParse(editorData);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    const field = firstIssue?.path?.join(".");
    throw new Error(
      `${field ? `${field}: ` : ""}${firstIssue?.message || "Template data is invalid"}`,
    );
  }

  const profileFields = {
    full_name: validation.data.name.trim(),
    avatar_url: validation.data.avatarUrl?.trim() || null,
  };
  const templateFields = selectConfiguredFields(config, validation.data);
  const localMediaPath = findLocalMedia({
    avatarUrl: validation.data.avatarUrl,
    ...templateFields,
  });

  if (localMediaPath) {
    const error = new Error(
      `The image at ${localMediaPath} is only stored in this browser preview. Remove it or use a remote URL until Supabase Storage uploads are available.`,
    );
    error.code = "LOCAL_MEDIA_NOT_PERSISTABLE";
    throw error;
  }

  return { profileFields, templateFields };
}

export function buildTemplateDataDocument(
  existingDocument,
  templateId,
  config,
  templateFields,
) {
  let existingTemplates = {};

  if (existingDocument == null || isEmptyObject(existingDocument)) {
    existingTemplates = {};
  } else if (
    isPlainObject(existingDocument) &&
    existingDocument.version === TEMPLATE_DATA_DOCUMENT_VERSION &&
    isPlainObject(existingDocument.templates)
  ) {
    existingTemplates = cloneJsonValue(existingDocument.templates);
  } else if (
    isPlainObject(existingDocument) &&
    typeof existingDocument.version === "number"
  ) {
    const error = new Error(
      "This profile uses a newer template-data document version and cannot be saved safely.",
    );
    error.code = "UNSUPPORTED_TEMPLATE_DATA_VERSION";
    throw error;
  }

  return {
    version: TEMPLATE_DATA_DOCUMENT_VERSION,
    templates: {
      ...existingTemplates,
      [templateId]: {
        version: config.version,
        data: cloneJsonValue(templateFields),
      },
    },
  };
}

