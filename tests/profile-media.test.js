import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTemplateEditorConfig } from "../src/features/editor/config/templateEditorConfigs";
import {
  PROFILE_MEDIA_BUCKET,
  PROFILE_MEDIA_CATEGORIES,
  buildProfileMediaPath,
  containsMediaReference,
  deleteOwnedProfileMedia,
  extractProfileMediaPath,
  uploadProfileMedia,
  validateProfileMediaFile,
} from "../src/features/editor/media/profileMedia";
import {
  hydrateProfileEditor,
  serializeEditorData,
} from "../src/features/editor/persistence/templateData";
import { useEditorStore } from "../src/features/editor/store/useEditorStore";

const USER_ID = "2853a0a6-7a13-4bcb-a3e5-42acd7413b0e";
const OTHER_USER_ID = "0f7263f8-63dc-4b09-9883-184db34ec644";
const TEMPLATE_ID = "buzz-template";

function imageFile(type = "image/webp", size = 128) {
  return new Blob([new Uint8Array(size)], { type });
}

function makeStorageClient({ uploadError = null, removeError = null } = {}) {
  const bucket = {
    upload: vi.fn(async () => ({ data: null, error: uploadError })),
    getPublicUrl: vi.fn((path) => ({
      data: {
        publicUrl: `https://project.supabase.co/storage/v1/object/public/${PROFILE_MEDIA_BUCKET}/${path}`,
      },
    })),
    remove: vi.fn(async () => ({ data: null, error: removeError })),
  };
  const client = { storage: { from: vi.fn(() => bucket) } };
  return { client, bucket };
}

describe("profile media validation and paths", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])(
    "accepts %s",
    (mimeType) => {
      expect(() =>
        validateProfileMediaFile(
          imageFile(mimeType),
          PROFILE_MEDIA_CATEGORIES.GALLERY,
        ),
      ).not.toThrow();
    },
  );

  it("rejects empty, SVG, and oversized files before upload", () => {
    expect(() =>
      validateProfileMediaFile(
        imageFile("image/png", 0),
        PROFILE_MEDIA_CATEGORIES.AVATAR,
      ),
    ).toThrow(/non-empty/i);
    expect(() =>
      validateProfileMediaFile(
        imageFile("image/svg+xml"),
        PROFILE_MEDIA_CATEGORIES.COVER,
      ),
    ).toThrow(/JPEG, PNG, or WebP/i);
    expect(() =>
      validateProfileMediaFile(
        imageFile("image/png", 2 * 1024 * 1024 + 1),
        PROFILE_MEDIA_CATEGORIES.AVATAR,
      ),
    ).toThrow(/2 MB/i);
  });

  it("uses owner-scoped category paths and generated names", () => {
    expect(
      buildProfileMediaPath({
        userId: USER_ID,
        templateId: TEMPLATE_ID,
        category: PROFILE_MEDIA_CATEGORIES.AVATAR,
        file: imageFile("image/jpeg"),
        uniqueId: "avatar-id",
      }),
    ).toBe(`profiles/${USER_ID}/avatar/avatar-id.jpg`);

    expect(
      buildProfileMediaPath({
        userId: USER_ID,
        templateId: TEMPLATE_ID,
        category: PROFILE_MEDIA_CATEGORIES.CUSTOM_SECTION,
        file: imageFile(),
        uniqueId: "section-id",
      }),
    ).toBe(
      `profiles/${USER_ID}/templates/${TEMPLATE_ID}/sections/section-id.webp`,
    );
  });

  it("rejects path-segment spoofing", () => {
    expect(() =>
      buildProfileMediaPath({
        userId: `${USER_ID}/../${OTHER_USER_ID}`,
        templateId: TEMPLATE_ID,
        category: PROFILE_MEDIA_CATEGORIES.GALLERY,
        file: imageFile(),
        uniqueId: "safe-id",
      }),
    ).toThrow(/profile owner/i);
  });

  it("does not collide when two uploads have the same original file", () => {
    const file = imageFile("image/png");
    const first = buildProfileMediaPath({
      userId: USER_ID,
      templateId: TEMPLATE_ID,
      category: PROFILE_MEDIA_CATEGORIES.GALLERY,
      file,
      uniqueId: "generated-one",
    });
    const second = buildProfileMediaPath({
      userId: USER_ID,
      templateId: TEMPLATE_ID,
      category: PROFILE_MEDIA_CATEGORIES.GALLERY,
      file,
      uniqueId: "generated-two",
    });

    expect(first).not.toBe(second);
  });
});

describe("profile media Storage service", () => {
  it("uploads without upsert and returns a canonical public URL", async () => {
    const { client, bucket } = makeStorageClient();
    const file = imageFile();
    const result = await uploadProfileMedia({
      client,
      userId: USER_ID,
      templateId: TEMPLATE_ID,
      category: PROFILE_MEDIA_CATEGORIES.GALLERY,
      file,
      uniqueId: "gallery-id",
    });

    expect(client.storage.from).toHaveBeenCalledWith(PROFILE_MEDIA_BUCKET);
    expect(bucket.upload).toHaveBeenCalledWith(
      `profiles/${USER_ID}/templates/${TEMPLATE_ID}/gallery/gallery-id.webp`,
      file,
      {
        cacheControl: "31536000",
        contentType: "image/webp",
        upsert: false,
      },
    );
    expect(result.publicUrl).toContain("/profile-media/profiles/");
  });

  it("surfaces upload failure without producing a replacement value", async () => {
    const { client, bucket } = makeStorageClient({
      uploadError: { message: "policy rejected" },
    });

    await expect(
      uploadProfileMedia({
        client,
        userId: USER_ID,
        templateId: TEMPLATE_ID,
        category: PROFILE_MEDIA_CATEGORIES.COVER,
        file: imageFile(),
        uniqueId: "failed-id",
      }),
    ).rejects.toMatchObject({ code: "MEDIA_UPLOAD_FAILED" });
    expect(bucket.getPublicUrl).not.toHaveBeenCalled();
  });

  it("deletes only deduplicated objects owned by the authenticated user", async () => {
    const { client, bucket } = makeStorageClient();
    const owned = `https://project.supabase.co/storage/v1/object/public/profile-media/profiles/${USER_ID}/avatar/old.webp`;
    const crossUser = `https://project.supabase.co/storage/v1/object/public/profile-media/profiles/${OTHER_USER_ID}/avatar/other.webp`;
    const provider = "https://lh3.googleusercontent.com/provider-avatar";
    const spoofed = `https://evil.example/storage/v1/object/public/profile-media/profiles/${USER_ID}/avatar/spoofed.webp`;

    await deleteOwnedProfileMedia({
      client,
      userId: USER_ID,
      references: [owned, owned, crossUser, provider, spoofed],
    });

    expect(bucket.remove).toHaveBeenCalledWith([
      `profiles/${USER_ID}/avatar/old.webp`,
    ]);
    expect(extractProfileMediaPath(provider)).toBeNull();
  });
});

describe("profile media persistence contract", () => {
  const config = getTemplateEditorConfig(TEMPLATE_ID);
  const profile = {
    id: USER_ID,
    username: "media-owner",
    full_name: "Media Owner",
    avatar_url: null,
    template_id: TEMPLATE_ID,
    template_data: {},
  };

  beforeEach(() => useEditorStore.getState().resetEditor());

  it("serializes stable avatar, cover, gallery, and section URLs in order", () => {
    const baseUrl = `https://project.supabase.co/storage/v1/object/public/profile-media/profiles/${USER_ID}`;
    const editorData = {
      ...hydrateProfileEditor(profile, config).data,
      avatarUrl: `${baseUrl}/avatar/avatar.webp`,
      bannerUrl: `${baseUrl}/templates/${TEMPLATE_ID}/cover/cover.webp`,
      gallery: [
        `${baseUrl}/templates/${TEMPLATE_ID}/gallery/second.webp`,
        `${baseUrl}/templates/${TEMPLATE_ID}/gallery/first.webp`,
      ],
      custom_sections: [
        {
          id: "about",
          title: "About",
          description: "Persisted section",
          image: `${baseUrl}/templates/${TEMPLATE_ID}/sections/about.webp`,
        },
      ],
    };

    const serialized = serializeEditorData(config, editorData);
    expect(serialized.profileFields.avatar_url).toBe(editorData.avatarUrl);
    expect(serialized.templateFields.bannerUrl).toBe(editorData.bannerUrl);
    expect(serialized.templateFields.gallery).toEqual(editorData.gallery);
    expect(serialized.templateFields.custom_sections[0].image).toBe(
      editorData.custom_sections[0].image,
    );
  });

  it("tracks uploads and defers saved-reference cleanup", () => {
    const store = useEditorStore.getState();
    store.beginMediaUpload();
    store.beginMediaUpload();
    expect(useEditorStore.getState().activeMediaUploads).toBe(2);
    store.finishMediaUpload();
    store.finishMediaUpload();
    store.finishMediaUpload();
    expect(useEditorStore.getState().activeMediaUploads).toBe(0);

    store.queueMediaCleanup("old-a");
    store.queueMediaCleanup("old-a");
    store.queueMediaCleanup("old-b");
    expect(useEditorStore.getState().pendingMediaCleanup).toEqual([
      "old-a",
      "old-b",
    ]);
    store.clearMediaCleanup(["old-a"]);
    expect(useEditorStore.getState().pendingMediaCleanup).toEqual(["old-b"]);
  });

  it("detects media references recursively before cleanup", () => {
    const reference = "https://example.com/saved.webp";
    expect(
      containsMediaReference(
        { templates: { [TEMPLATE_ID]: { data: { gallery: [reference] } } } },
        reference,
      ),
    ).toBe(true);
    expect(containsMediaReference({ gallery: [] }, reference)).toBe(false);
  });
});
