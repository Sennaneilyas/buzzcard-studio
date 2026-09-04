import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTemplateEditorConfig } from "../src/features/editor/config/templateEditorConfigs";
import {
  canPublishProfile,
  publishProfile,
  validateProfileForPublication,
} from "../src/features/editor/persistence/publishProfile";
import { saveProfileEditor } from "../src/features/editor/persistence/saveProfileEditor";
import { hydrateProfileEditor } from "../src/features/editor/persistence/templateData";
import { useEditorStore } from "../src/features/editor/store/useEditorStore";
import {
  buildPublicProfileViewModel,
  fetchPublishedProfileByUsername,
} from "../src/features/public-profile/api/usePublishedProfile";

const USER_ID = "db793b32-719a-4339-a5f1-02f7704c5827";
const FIRST_PUBLISHED_AT = "2026-08-29T19:45:00.000Z";
const config = getTemplateEditorConfig("buzz-template");

function makeProfile(overrides = {}) {
  return {
    id: USER_ID,
    username: "published-owner",
    full_name: "Published Owner",
    avatar_url: null,
    template_id: "buzz-template",
    template_data: {},
    status: "draft",
    first_published_at: null,
    lifecycle_status: "trial",
    updated_at: "2026-08-29T19:30:00.000Z",
    ...overrides,
  };
}

function makeEditorData(profile = makeProfile(), overrides = {}) {
  return {
    ...hydrateProfileEditor(profile, config).data,
    ...overrides,
  };
}

function makeMutationClient(profile, responses = []) {
  const updates = [];
  const builders = [];
  const client = {
    from: vi.fn(() => {
      const callIndex = builders.length;
      const builder = {};
      builder.update = vi.fn((payload) => {
        updates.push(payload);
        return builder;
      });
      builder.eq = vi.fn(() => builder);
      builder.select = vi.fn(() => builder);
      builder.maybeSingle = vi.fn(async () => {
        const response = responses[callIndex];
        if (response?.error) return { data: null, error: response.error };
        if (response?.noRow) return { data: null, error: null };

        const previouslySaved = updates
          .slice(0, callIndex)
          .reduce((row, payload) => ({ ...row, ...payload }), profile);
        const payload = updates[callIndex];
        return {
          data: {
            ...previouslySaved,
            ...payload,
            updated_at: `2026-08-29T19:${35 + callIndex}:00.000Z`,
            first_published_at:
              payload.status === "published"
                ? FIRST_PUBLISHED_AT
                : previouslySaved.first_published_at,
          },
          error: null,
        };
      });
      builders.push(builder);
      return builder;
    }),
  };

  return { client, updates, builders };
}

function makePublicReadClient(response) {
  const builder = {};
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.maybeSingle = vi.fn(async () => response);
  return { client: { from: vi.fn(() => builder) }, builder };
}

describe("profile publication", () => {
  beforeEach(() => {
    useEditorStore.getState().resetEditor();
  });

  it("publishes an existing valid draft without writing first_published_at", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile);

    const result = await publishProfile({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: profile.template_id,
      config,
      editorData: makeEditorData(profile),
      isDirty: false,
    });

    expect(fake.updates).toEqual([{ status: "published" }]);
    expect(fake.updates[0]).not.toHaveProperty("first_published_at");
    expect(result.profile.status).toBe("published");
    expect(result.profile.first_published_at).toBe(FIRST_PUBLISHED_AT);
  });

  it("saves visible unsaved changes before publishing", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile);

    const result = await publishProfile({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: profile.template_id,
      config,
      editorData: makeEditorData(profile, { role: "Saved before publish" }),
      isDirty: true,
    });

    expect(fake.updates).toHaveLength(2);
    expect(fake.updates[0]).toMatchObject({
      template_data: {
        templates: {
          "buzz-template": {
            data: expect.objectContaining({ role: "Saved before publish" }),
          },
        },
      },
    });
    expect(fake.updates[1]).toEqual({ status: "published" });
    expect(result.savedBeforePublish).toBe(true);
  });

  it("does not publish when saving unsaved changes fails", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile, [
      { error: { code: "42501", message: "save denied" } },
    ]);

    await expect(
      publishProfile({
        client: fake.client,
        userId: USER_ID,
        profile,
        templateId: profile.template_id,
        config,
        editorData: makeEditorData(profile, { role: "Still dirty" }),
        isDirty: true,
      }),
    ).rejects.toMatchObject({ code: "42501" });

    expect(fake.updates).toHaveLength(1);
    expect(fake.updates[0]).not.toHaveProperty("status");
  });

  it("returns the successful save when the later publication request fails", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile, [
      null,
      { error: { code: "503", message: "publish unavailable" } },
    ]);

    await expect(
      publishProfile({
        client: fake.client,
        userId: USER_ID,
        profile,
        templateId: profile.template_id,
        config,
        editorData: makeEditorData(profile, { role: "Saved despite outage" }),
        isDirty: true,
      }),
    ).rejects.toMatchObject({
      code: "503",
      savedResult: {
        profile: expect.objectContaining({ status: "draft" }),
        editorData: expect.objectContaining({ role: "Saved despite outage" }),
      },
    });
    expect(fake.updates).toHaveLength(2);
  });

  it("reports template-owned validation fields before any write", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile);

    expect(() =>
      validateProfileForPublication(config, {
        ...makeEditorData(profile),
        name: "",
      }),
    ).toThrow(/name/i);

    await expect(
      publishProfile({
        client: fake.client,
        userId: USER_ID,
        profile,
        templateId: profile.template_id,
        config,
        editorData: { ...makeEditorData(profile), name: "" },
        isDirty: true,
      }),
    ).rejects.toMatchObject({ code: "PUBLICATION_VALIDATION_FAILED" });
    expect(fake.client.from).not.toHaveBeenCalled();
  });

  it("does not publish browser-local media that cannot render cross-device", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile);

    await expect(
      publishProfile({
        client: fake.client,
        userId: USER_ID,
        profile,
        templateId: profile.template_id,
        config,
        editorData: makeEditorData(profile, {
          bannerUrl: "data:image/png;base64,local-preview",
        }),
        isDirty: false,
      }),
    ).rejects.toMatchObject({ code: "LOCAL_MEDIA_NOT_PERSISTABLE" });
    expect(fake.client.from).not.toHaveBeenCalled();
  });

  it("does not offer the first-publish action for an already published profile", () => {
    expect(canPublishProfile(makeProfile())).toBe(true);
    expect(canPublishProfile(makeProfile({ status: "published" }))).toBe(false);
  });

  it("keeps publication fields unchanged when editing published content", async () => {
    const profile = makeProfile({
      status: "published",
      first_published_at: FIRST_PUBLISHED_AT,
    });
    const fake = makeMutationClient(profile);
    const result = await saveProfileEditor({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: profile.template_id,
      config,
      editorData: makeEditorData(profile, { role: "Live profile update" }),
    });

    expect(fake.updates[0]).not.toHaveProperty("status");
    expect(fake.updates[0]).not.toHaveProperty("first_published_at");
    expect(result.profile.status).toBe("published");
    expect(result.profile.first_published_at).toBe(FIRST_PUBLISHED_AT);
  });
});

describe("Supabase-backed public profile rendering", () => {
  it("looks up exactly one published profile by username", async () => {
    const profile = makeProfile({ status: "published" });
    const fake = makePublicReadClient({ data: profile, error: null });

    await expect(
      fetchPublishedProfileByUsername(fake.client, profile.username),
    ).resolves.toEqual(profile);
    expect(fake.client.from).toHaveBeenCalledWith("profiles");
    expect(fake.builder.eq).toHaveBeenNthCalledWith(
      1,
      "username",
      profile.username,
    );
    expect(fake.builder.eq).toHaveBeenNthCalledWith(2, "status", "published");
    expect(fake.builder.maybeSingle).toHaveBeenCalledOnce();
  });

  it("renders persisted Supabase template data without editor-store state", () => {
    useEditorStore.getState().hydrateEditor({
      profileId: USER_ID,
      slug: "local-only",
      templateId: "buzz-template",
      profileData: makeEditorData(makeProfile(), { role: "Local Zustand value" }),
      hydrationKey: "local-session",
    });
    const profile = makeProfile({
      status: "published",
      template_data: {
        version: 1,
        templates: {
          "buzz-template": {
            version: 1,
            data: { role: "Persisted Supabase value" },
          },
        },
      },
    });

    const viewModel = buildPublicProfileViewModel(profile);
    expect(viewModel.state).toBe("ready");
    expect(viewModel.profileData.role).toBe("Persisted Supabase value");
  });

  it("treats drafts and unknown usernames as unavailable", async () => {
    expect(buildPublicProfileViewModel(makeProfile()).state).toBe("not_found");
    const fake = makePublicReadClient({ data: null, error: null });
    await expect(
      fetchPublishedProfileByUsername(fake.client, "missing-user"),
    ).resolves.toBeNull();
  });

  it("fails safely for an unknown template", () => {
    const viewModel = buildPublicProfileViewModel(
      makeProfile({ status: "published", template_id: "removed-template" }),
    );
    expect(viewModel.state).toBe("template_unavailable");
    expect(viewModel.profileData).toBeNull();
  });

  it("keeps authenticated draft preview separate from the public view model", () => {
    const draft = makeProfile();
    const liveDraftData = makeEditorData(draft, { role: "Unsaved preview" });

    expect(canPublishProfile(draft)).toBe(true);
    expect(liveDraftData.role).toBe("Unsaved preview");
    expect(buildPublicProfileViewModel(draft).state).toBe("not_found");
  });
});
