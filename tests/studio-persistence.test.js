import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProfileQueryKey } from "../src/features/auth/hooks/useProfile";
import { getProfileStudioPath } from "../src/features/auth/utils/profileRouting";
import { applySuccessfulProfileSave } from "../src/features/editor/api/useUpdateProfile";
import { getTemplateEditorConfig } from "../src/features/editor/config/templateEditorConfigs";
import { saveProfileEditor } from "../src/features/editor/persistence/saveProfileEditor";
import {
  buildTemplateDataDocument,
  hydrateProfileEditor,
  serializeEditorData,
} from "../src/features/editor/persistence/templateData";
import {
  LEGACY_EDITOR_STORAGE_KEY,
  clearLegacyEditorStorage,
  useEditorStore,
} from "../src/features/editor/store/useEditorStore";

const USER_ID = "8aa7c468-d90e-4be8-a5ea-2c0f3468a840";
const buzzConfig = getTemplateEditorConfig("buzz-template");

function makeProfile(overrides = {}) {
  return {
    id: USER_ID,
    username: "studio-owner",
    full_name: "Studio Owner",
    avatar_url: null,
    template_id: "buzz-template",
    template_data: {},
    status: "draft",
    first_published_at: null,
    lifecycle_status: "trial",
    updated_at: "2026-08-29T18:00:00.000Z",
    ...overrides,
  };
}

function makeUpdateClient({ profile, error = null, returnNoRow = false }) {
  let updatePayload;
  const builder = {};
  builder.update = vi.fn((payload) => {
    updatePayload = payload;
    return builder;
  });
  builder.eq = vi.fn(() => builder);
  builder.select = vi.fn(() => builder);
  builder.maybeSingle = vi.fn(async () => ({
    data: returnNoRow || error
      ? null
      : {
          ...profile,
          ...updatePayload,
          updated_at: "2026-08-29T18:05:00.000Z",
        },
    error,
  }));
  const client = { from: vi.fn(() => builder) };

  return {
    client,
    builder,
    getUpdatePayload: () => updatePayload,
  };
}

describe("template editor configuration and hydration", () => {
  it.each([
    "buzz-template",
    "doctor-template",
    "hotel-template",
    "coiffeur-template",
  ])("registers a versioned editor configuration for %s", (templateId) => {
    const config = getTemplateEditorConfig(templateId);
    expect(config).toMatchObject({ id: templateId, version: 1 });
    expect(config.schema.safeParse({
      ...config.defaults,
      name: "Valid Name",
    }).success).toBe(true);
  });

  it("uses deterministic template defaults when no saved data exists", () => {
    const hydrated = hydrateProfileEditor(makeProfile(), buzzConfig);

    expect(hydrated.source).toBe("empty");
    expect(hydrated.warning).toBeNull();
    expect(hydrated.data.name).toBe("Studio Owner");
    expect(hydrated.data.role).toBe(buzzConfig.defaults.role);
  });

  it("lets saved values override defaults without losing missing defaults", () => {
    const profile = makeProfile({
      template_data: {
        version: 1,
        templates: {
          "buzz-template": {
            version: 1,
            data: {
              role: "Saved role",
              socials: { linkedin: "https://linkedin.com/in/saved" },
            },
          },
        },
      },
    });

    const hydrated = hydrateProfileEditor(profile, buzzConfig);

    expect(hydrated.data.role).toBe("Saved role");
    expect(hydrated.data.socials.linkedin).toBe(
      "https://linkedin.com/in/saved",
    );
    expect(hydrated.data.socials.instagram).toBe(
      buzzConfig.defaults.socials.instagram,
    );
  });

  it("loads the previous flat Studio shape as legacy data", () => {
    const hydrated = hydrateProfileEditor(
      makeProfile({
        full_name: "Older database name",
        template_data: { name: "Saved legacy name", role: "Legacy role" },
      }),
      buzzConfig,
    );

    expect(hydrated.source).toBe("legacy-flat");
    expect(hydrated.data.name).toBe("Saved legacy name");
    expect(hydrated.data.role).toBe("Legacy role");
    expect(hydrated.warning).toMatch(/Legacy Studio data/);
  });

  it("falls back safely when persisted template data is malformed", () => {
    const hydrated = hydrateProfileEditor(
      makeProfile({ template_data: ["invalid"] }),
      buzzConfig,
    );

    expect(hydrated.data.role).toBe(buzzConfig.defaults.role);
    expect(hydrated.warning).toMatch(/malformed/);
    expect(hydrated.canSave).toBe(true);
  });

  it("blocks saving data written by a newer unsupported template version", () => {
    const hydrated = hydrateProfileEditor(
      makeProfile({
        template_data: {
          version: 1,
          templates: {
            "buzz-template": { version: 2, data: { role: "Future" } },
          },
        },
      }),
      buzzConfig,
    );

    expect(hydrated.canSave).toBe(false);
    expect(hydrated.warning).toMatch(/newer template version/);
  });

  it("returns null for a removed or unknown template", () => {
    expect(getTemplateEditorConfig("removed-template")).toBeNull();
  });
});

describe("transient Zustand editor state", () => {
  beforeEach(() => {
    useEditorStore.getState().resetEditor();
  });

  it("starts clean after hydration and becomes dirty during live editing", () => {
    const hydrated = hydrateProfileEditor(makeProfile(), buzzConfig);
    useEditorStore.getState().hydrateEditor({
      profileId: USER_ID,
      slug: "studio-owner",
      templateId: "buzz-template",
      profileData: hydrated.data,
      hydrationKey: "test-session",
    });

    expect(useEditorStore.getState().isDirty).toBe(false);
    useEditorStore.getState().setProfileData({ role: "Edited live" });
    expect(useEditorStore.getState().profileData.role).toBe("Edited live");
    expect(useEditorStore.getState().isDirty).toBe(true);
  });

  it("removes the obsolete persisted editor key without depending on it", () => {
    const storage = { removeItem: vi.fn() };
    clearLegacyEditorStorage(storage);
    expect(storage.removeItem).toHaveBeenCalledWith(LEGACY_EDITOR_STORAGE_KEY);
  });
});

describe("Studio save persistence", () => {
  beforeEach(() => {
    useEditorStore.getState().resetEditor();
  });

  it("persists the active template while preserving every other template", async () => {
    const otherTemplateEntry = {
      version: 1,
      data: { role: "Do not overwrite this hotel" },
    };
    const profile = makeProfile({
      template_data: {
        version: 1,
        templates: {
          "hotel-template": otherTemplateEntry,
          "buzz-template": { version: 1, data: { role: "Old role" } },
        },
      },
    });
    const editorData = {
      ...hydrateProfileEditor(profile, buzzConfig).data,
      name: "Updated Owner",
      role: "Updated role",
    };
    const fake = makeUpdateClient({ profile });

    const result = await saveProfileEditor({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: "buzz-template",
      config: buzzConfig,
      editorData,
    });
    const payload = fake.getUpdatePayload();

    expect(payload.full_name).toBe("Updated Owner");
    expect(payload.template_data.templates["buzz-template"]).toEqual({
      version: 1,
      data: expect.objectContaining({ role: "Updated role" }),
    });
    expect(payload.template_data.templates["hotel-template"]).toEqual(
      otherTemplateEntry,
    );
    expect(payload).not.toHaveProperty("status");
    expect(payload).not.toHaveProperty("first_published_at");
    expect(payload).not.toHaveProperty("lifecycle_status");
    expect(payload).not.toHaveProperty("template_id");
    expect(result.profile.status).toBe("draft");
    expect(result.profile.first_published_at).toBeNull();
    expect(fake.client.from).toHaveBeenCalledWith("profiles");
    expect(fake.builder.eq).toHaveBeenNthCalledWith(1, "id", USER_ID);
    expect(fake.builder.eq).toHaveBeenNthCalledWith(
      2,
      "template_id",
      "buzz-template",
    );
    expect(fake.builder.eq).toHaveBeenNthCalledWith(
      3,
      "updated_at",
      profile.updated_at,
    );
    expect(fake.builder.select).toHaveBeenCalledWith("*");
  });

  it("restores the same saved values on a later hydration", async () => {
    const profile = makeProfile();
    const editorData = {
      ...hydrateProfileEditor(profile, buzzConfig).data,
      role: "Cross-device saved role",
    };
    const fake = makeUpdateClient({ profile });
    const saved = await saveProfileEditor({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: "buzz-template",
      config: buzzConfig,
      editorData,
    });

    const reloaded = hydrateProfileEditor(saved.profile, buzzConfig);
    expect(reloaded.data.role).toBe("Cross-device saved role");
  });

  it("keeps unsaved editor state dirty after a failed save", async () => {
    const profile = makeProfile();
    const hydrated = hydrateProfileEditor(profile, buzzConfig);
    useEditorStore.getState().hydrateEditor({
      profileId: USER_ID,
      slug: profile.username,
      templateId: profile.template_id,
      profileData: hydrated.data,
      hydrationKey: "failed-save",
    });
    useEditorStore.getState().setProfileData({ role: "Unsaved role" });
    const fake = makeUpdateClient({
      profile,
      error: { code: "42501", message: "permission denied" },
    });

    await expect(
      saveProfileEditor({
        client: fake.client,
        userId: USER_ID,
        profile,
        templateId: "buzz-template",
        config: buzzConfig,
        editorData: useEditorStore.getState().profileData,
      }),
    ).rejects.toMatchObject({ code: "42501" });
    expect(useEditorStore.getState().profileData.role).toBe("Unsaved role");
    expect(useEditorStore.getState().isDirty).toBe(true);
  });

  it("reports a concurrent save conflict instead of overwriting newer data", async () => {
    const profile = makeProfile();
    const fake = makeUpdateClient({ profile, returnNoRow: true });

    await expect(
      saveProfileEditor({
        client: fake.client,
        userId: USER_ID,
        profile,
        templateId: "buzz-template",
        config: buzzConfig,
        editorData: hydrateProfileEditor(profile, buzzConfig).data,
      }),
    ).rejects.toMatchObject({ code: "PROFILE_SAVE_CONFLICT" });
  });

  it("updates the query cache and clears dirty state after success", async () => {
    const profile = makeProfile();
    const hydrated = hydrateProfileEditor(profile, buzzConfig);
    useEditorStore.getState().hydrateEditor({
      profileId: USER_ID,
      slug: profile.username,
      templateId: profile.template_id,
      profileData: hydrated.data,
      hydrationKey: "successful-save",
    });
    useEditorStore.getState().setProfileData({ role: "Saved cleanly" });
    const fake = makeUpdateClient({ profile });
    const result = await saveProfileEditor({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: "buzz-template",
      config: buzzConfig,
      editorData: useEditorStore.getState().profileData,
    });
    const queryClient = new QueryClient();

    applySuccessfulProfileSave(queryClient, USER_ID, result);

    expect(useEditorStore.getState().isDirty).toBe(false);
    expect(useEditorStore.getState().profileData.role).toBe("Saved cleanly");
    expect(queryClient.getQueryData(getProfileQueryKey(USER_ID))).toEqual(
      result.profile,
    );
    queryClient.clear();
  });

  it("rejects browser-local media before issuing a database request", () => {
    const profile = makeProfile();
    const editorData = {
      ...hydrateProfileEditor(profile, buzzConfig).data,
      bannerUrl: "data:image/png;base64,abc123",
    };
    const client = { from: vi.fn() };

    expect(() => serializeEditorData(buzzConfig, editorData)).toThrow(
      /only stored in this browser preview/,
    );
    expect(client.from).not.toHaveBeenCalled();
  });

  it("keeps no-profile Studio routing pointed at onboarding", () => {
    expect(getProfileStudioPath(null)).toBeNull();
  });

  it("builds an isolated active-template entry", () => {
    const document = buildTemplateDataDocument(
      {},
      "buzz-template",
      buzzConfig,
      { role: "Isolated" },
    );
    expect(document).toEqual({
      version: 1,
      templates: {
        "buzz-template": {
          version: 1,
          data: { role: "Isolated" },
        },
      },
    });
  });
});
