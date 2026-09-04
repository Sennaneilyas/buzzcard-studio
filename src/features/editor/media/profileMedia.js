export const PROFILE_MEDIA_BUCKET = "profile-media";

export const PROFILE_MEDIA_CATEGORIES = Object.freeze({
  AVATAR: "avatar",
  COVER: "cover",
  GALLERY: "gallery",
  CUSTOM_SECTION: "custom-section",
});

export const PROFILE_MEDIA_ALLOWED_MIME_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const PROFILE_MEDIA_MAX_BYTES = Object.freeze({
  [PROFILE_MEDIA_CATEGORIES.AVATAR]: 2 * 1024 * 1024,
  [PROFILE_MEDIA_CATEGORIES.COVER]: 5 * 1024 * 1024,
  [PROFILE_MEDIA_CATEGORIES.GALLERY]: 5 * 1024 * 1024,
  [PROFILE_MEDIA_CATEGORIES.CUSTOM_SECTION]: 5 * 1024 * 1024,
});

const EXTENSION_BY_MIME = Object.freeze({
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
});

const PUBLIC_URL_MARKER = `/storage/v1/object/public/${PROFILE_MEDIA_BUCKET}/`;

function generateMediaId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`
  );
}

export class ProfileMediaError extends Error {
  constructor(message, code, cause) {
    super(message, { cause });
    this.name = "ProfileMediaError";
    this.code = code;
  }
}

function assertSafeSegment(value, label) {
  if (
    typeof value !== "string" ||
    !value ||
    value === "." ||
    value === ".." ||
    value.includes("/") ||
    value.includes("\\")
  ) {
    throw new ProfileMediaError(`Invalid ${label}.`, "INVALID_MEDIA_PATH");
  }
  return value;
}

function categoryDirectory(category, templateId) {
  switch (category) {
    case PROFILE_MEDIA_CATEGORIES.AVATAR:
      return "avatar";
    case PROFILE_MEDIA_CATEGORIES.COVER:
      return `templates/${assertSafeSegment(templateId, "template")}/cover`;
    case PROFILE_MEDIA_CATEGORIES.GALLERY:
      return `templates/${assertSafeSegment(templateId, "template")}/gallery`;
    case PROFILE_MEDIA_CATEGORIES.CUSTOM_SECTION:
      return `templates/${assertSafeSegment(templateId, "template")}/sections`;
    default:
      throw new ProfileMediaError(
        "This image category is not supported.",
        "INVALID_MEDIA_CATEGORY",
      );
  }
}

export function validateProfileMediaFile(file, category) {
  const maxBytes = PROFILE_MEDIA_MAX_BYTES[category];
  if (!maxBytes) {
    throw new ProfileMediaError(
      "This image category is not supported.",
      "INVALID_MEDIA_CATEGORY",
    );
  }
  if (!file || typeof file.size !== "number" || file.size <= 0) {
    throw new ProfileMediaError(
      "Choose a non-empty image file.",
      "EMPTY_MEDIA_FILE",
    );
  }
  if (!PROFILE_MEDIA_ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new ProfileMediaError(
      "Use a JPEG, PNG, or WebP image.",
      "UNSUPPORTED_MEDIA_TYPE",
    );
  }
  if (file.size > maxBytes) {
    const maxMegabytes = Math.floor(maxBytes / (1024 * 1024));
    throw new ProfileMediaError(
      `This image is too large. The limit is ${maxMegabytes} MB.`,
      "MEDIA_FILE_TOO_LARGE",
    );
  }
  return file;
}

export function buildProfileMediaPath({
  userId,
  templateId,
  category,
  file,
  uniqueId = generateMediaId(),
}) {
  validateProfileMediaFile(file, category);
  const owner = assertSafeSegment(userId, "profile owner");
  const id = assertSafeSegment(uniqueId, "file identifier");
  const directory = categoryDirectory(category, templateId);
  return `profiles/${owner}/${directory}/${id}.${EXTENSION_BY_MIME[file.type]}`;
}

export async function uploadProfileMedia({
  client,
  userId,
  templateId,
  category,
  file,
  uniqueId,
}) {
  if (!client?.storage) {
    throw new ProfileMediaError(
      "Image uploads are unavailable right now.",
      "MEDIA_CLIENT_UNAVAILABLE",
    );
  }

  const path = buildProfileMediaPath({
    userId,
    templateId,
    category,
    file,
    uniqueId,
  });
  const { error } = await client.storage.from(PROFILE_MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new ProfileMediaError(
      "The image could not be uploaded. Your previous image is still saved.",
      "MEDIA_UPLOAD_FAILED",
      error,
    );
  }

  const { data } = client.storage.from(PROFILE_MEDIA_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new ProfileMediaError(
      "The uploaded image URL could not be created.",
      "MEDIA_PUBLIC_URL_FAILED",
    );
  }

  return {
    bucket: PROFILE_MEDIA_BUCKET,
    path,
    publicUrl: data.publicUrl,
  };
}

export function extractProfileMediaPath(reference) {
  if (typeof reference !== "string" || !reference) return null;
  if (reference.startsWith("profiles/")) return reference;

  try {
    const url = new URL(reference);
    const markerIndex = url.pathname.indexOf(PUBLIC_URL_MARKER);
    if (markerIndex === -1) return null;
    return decodeURIComponent(
      url.pathname.slice(markerIndex + PUBLIC_URL_MARKER.length),
    );
  } catch {
    return null;
  }
}

export function isOwnedProfileMedia(reference, userId) {
  const path = extractProfileMediaPath(reference);
  if (!path || !userId) return false;
  return path.startsWith(`profiles/${userId}/`);
}

function isCanonicalPublicReference(client, reference, path) {
  if (reference === path) return true;
  try {
    const { data } = client.storage
      .from(PROFILE_MEDIA_BUCKET)
      .getPublicUrl(path);
    const expected = new URL(data.publicUrl);
    const actual = new URL(reference);
    return (
      actual.origin === expected.origin &&
      decodeURIComponent(actual.pathname) === decodeURIComponent(expected.pathname)
    );
  } catch {
    return false;
  }
}

export function containsMediaReference(value, reference) {
  if (value === reference) return true;
  if (Array.isArray(value)) {
    return value.some((entry) => containsMediaReference(entry, reference));
  }
  if (value && typeof value === "object") {
    return Object.values(value).some((entry) =>
      containsMediaReference(entry, reference),
    );
  }
  return false;
}

export async function deleteOwnedProfileMedia({ client, userId, references }) {
  const paths = [
    ...new Set(
      (references || [])
        .filter((reference) => isOwnedProfileMedia(reference, userId))
        .map((reference) => ({
          path: extractProfileMediaPath(reference),
          reference,
        }))
        .filter(({ path, reference }) =>
          isCanonicalPublicReference(client, reference, path),
        )
        .map(({ path }) => path),
    ),
  ];

  if (paths.length === 0) return { deletedPaths: [], skipped: true };

  const { error } = await client.storage.from(PROFILE_MEDIA_BUCKET).remove(paths);
  if (error) {
    throw new ProfileMediaError(
      "Saved successfully, but an older image could not be cleaned up.",
      "MEDIA_CLEANUP_FAILED",
      error,
    );
  }
  return { deletedPaths: paths, skipped: false };
}
