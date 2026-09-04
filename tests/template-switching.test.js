import { describe, expect, it, vi } from "vitest";
import {
  TEMPLATE_CATALOGUE_PATH,
  getProfileStudioPath,
  getTemplateCatalogueActionLabel,
  getTemplateSelectionDestination,
  getTemplateSwitchStudioPath,
} from "../src/features/auth/utils/profileRouting";
import { getTemplateEditorConfig } from "../src/features/editor/config/templateEditorConfigs";
import { applyTemplateSwitch } from "../src/features/editor/persistence/applyTemplateSwitch";
import { saveProfileEditor } from "../src/features/editor/persistence/saveProfileEditor";
import { hydrateProfileEditor } from "../src/features/editor/persistence/templateData";

const USER_ID = "3949453c-224a-410b-b745-fbca3d87ad96";
const FIRST_PUBLISHED_AT = "2026-08-29T19:45:00.000Z";
const buzzConfig = getTemplateEditorConfig("buzz-template");
const hotelConfig = getTemplateEditorConfig("hotel-template");

function makeProfile(overrides = {}) {
  return {
    id: USER_ID,
    username: "template-owner",
    full_name: "Template Owner",
    avatar_url: "https://example.com/avatar.webp",
    template_id: "buzz-template",
    template_data: {},
    status: "draft",
    first_published_at: null,
    lifecycle_status: "trial",
    updated_at: "2026-08-30T11:00:00.000Z",
    ...overrides,
  };
}

function editorDataFor(profile, templateId, config, overrides = {}) {
  return {
    ...hydrateProfileEditor({ ...profile, template_id: templateId }, config).data,
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

        const data = updates
          .slice(0, callIndex + 1)
          .reduce((row, payload) => ({ ...row, ...payload }), profile);
        return {
          data: {
            ...data,
            updated_at: `2026-08-30T11:0${callIndex + 1}:00.000Z`,
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

describe("template switching entry points", () => {
  const user = { id: USER_ID };
  const profile = makeProfile();

  it("uses the shared catalogue path from the dashboard", () => {
    expect(TEMPLATE_CATALOGUE_PATH).toBe("/templates");
  });

  it("opens another template as a Studio candidate without a database write", () => {
    const client = { from: vi.fn() };
    const destination = getTemplateSelectionDestination({
      user,
      profile,
      templateId: "hotel-template",
    });

    expect(destination).toBe(
      "/profile/template-owner/edit?template=hotel-template",
    );
    expect(destination).toBe(
      getTemplateSwitchStudioPath(profile, "hotel-template"),
    );
    expect(client.from).not.toHaveBeenCalled();
  });

  it("edits the active template normally and labels it as current", () => {
    expect(
      getTemplateSelectionDestination({
        user,
        profile,
        templateId: "buzz-template",
      }),
    ).toBe(getProfileStudioPath(profile));
    expect(getTemplateCatalogueActionLabel(profile, "buzz-template")).toBe(
      "Edit current template",
    );
    expect(getTemplateCatalogueActionLabel(profile, "hotel-template")).toBe(
      "Use this template",
    );
  });

  it("continues profile creation for an authenticated user without a profile", () => {
    expect(
      getTemplateSelectionDestination({
        user,
        profile: null,
        templateId: "doctor-template",
      }),
    ).toBe("/onboarding?template=doctor-template");
  });

  it("preserves the selected template through authentication for a logged-out user", () => {
    expect(
      getTemplateSelectionDestination({
        user: null,
        profile: null,
        templateId: "coiffeur-template",
      }),
    ).toBe(
      "/auth?mode=signup&returnTo=%2Ftemplates%3Fuse%3Dcoiffeur-template",
    );
  });

  it("cancels back to the canonical active-template Studio path", () => {
    expect(getProfileStudioPath(profile)).toBe("/profile/template-owner/edit");
  });
});

describe("candidate hydration and persistence", () => {
  it("uses deterministic defaults for a template never used before", () => {
    const profile = makeProfile();
    const hydrated = hydrateProfileEditor(
      { ...profile, template_id: "hotel-template" },
      hotelConfig,
    );

    expect(hydrated.source).toBe("empty");
    expect(hydrated.data.name).toBe(profile.full_name);
    expect(hydrated.data.role).toBe(hotelConfig.defaults.role);
    expect(hydrated.data.bio).toBe(hotelConfig.defaults.bio);
  });

  it("restores a previously saved candidate template entry", () => {
    const profile = makeProfile({
      template_data: {
        version: 1,
        templates: {
          "hotel-template": {
            version: 1,
            data: { bio: "Saved riad description" },
          },
        },
      },
    });
    const hydrated = hydrateProfileEditor(
      { ...profile, template_id: "hotel-template" },
      hotelConfig,
    );

    expect(hydrated.source).toBe("saved");
    expect(hydrated.data.bio).toBe("Saved riad description");
  });

  it("saves only candidate template data while preserving the active template and identity", async () => {
    const buzzEntry = { version: 1, data: { role: "Existing Buzz role" } };
    const profile = makeProfile({
      status: "published",
      first_published_at: FIRST_PUBLISHED_AT,
      template_data: {
        version: 1,
        templates: { "buzz-template": buzzEntry },
      },
    });
    const fake = makeMutationClient(profile);
    const result = await saveProfileEditor({
      client: fake.client,
      userId: USER_ID,
      profile,
      templateId: "hotel-template",
      config: hotelConfig,
      editorData: editorDataFor(profile, "hotel-template", hotelConfig, {
        bio: "Candidate hotel description",
        name: "Should remain profile-wide",
      }),
      mode: "candidate",
    });

    expect(fake.updates[0]).toEqual({
      template_data: {
        version: 1,
        templates: {
          "buzz-template": buzzEntry,
          "hotel-template": {
            version: 1,
            data: expect.objectContaining({
              bio: "Candidate hotel description",
            }),
          },
        },
      },
    });
    expect(fake.updates[0]).not.toHaveProperty("template_id");
    expect(fake.updates[0]).not.toHaveProperty("full_name");
    expect(fake.updates[0]).not.toHaveProperty("avatar_url");
    expect(result.profile.template_id).toBe("buzz-template");
    expect(result.profile.status).toBe("published");
    expect(result.profile.first_published_at).toBe(FIRST_PUBLISHED_AT);
    expect(fake.builders[0].eq).toHaveBeenNthCalledWith(
      2,
      "template_id",
      "buzz-template",
    );
  });
});

describe("applying a candidate template", () => {
  it.each([
    ["draft", null],
    ["published", FIRST_PUBLISHED_AT],
  ])("changes only the active template for a %s profile", async (status, firstPublishedAt) => {
    const profile = makeProfile({
      status,
      first_published_at: firstPublishedAt,
      lifecycle_status: "active_customer",
    });
    const fake = makeMutationClient(profile);
    const result = await applyTemplateSwitch({
      client: fake.client,
      userId: USER_ID,
      profile,
      candidateTemplateId: "hotel-template",
      config: hotelConfig,
      editorData: editorDataFor(profile, "hotel-template", hotelConfig, {
        bio: "Ready to apply",
      }),
    });

    expect(fake.updates).toHaveLength(2);
    expect(fake.updates[0]).toHaveProperty("template_data");
    expect(fake.updates[0]).not.toHaveProperty("template_id");
    expect(fake.updates[1]).toEqual({ template_id: "hotel-template" });
    expect(result.profile).toMatchObject({
      id: USER_ID,
      template_id: "hotel-template",
      status,
      first_published_at: firstPublishedAt,
      lifecycle_status: "active_customer",
    });
    expect(fake.builders[1].eq).toHaveBeenNthCalledWith(
      2,
      "template_id",
      "buzz-template",
    );
    expect(fake.builders[1].eq).toHaveBeenNthCalledWith(
      3,
      "updated_at",
      "2026-08-30T11:01:00.000Z",
    );
  });

  it("preserves independent template entries across A to B to A", async () => {
    const profileA = makeProfile({
      template_data: {
        version: 1,
        templates: {
          "buzz-template": {
            version: 1,
            data: { role: "Original A customization" },
          },
        },
      },
    });
    const toBClient = makeMutationClient(profileA);
    const switchedToB = await applyTemplateSwitch({
      client: toBClient.client,
      userId: USER_ID,
      profile: profileA,
      candidateTemplateId: "hotel-template",
      config: hotelConfig,
      editorData: editorDataFor(profileA, "hotel-template", hotelConfig, {
        bio: "Saved B customization",
      }),
    });

    const restoredA = editorDataFor(
      switchedToB.profile,
      "buzz-template",
      buzzConfig,
    );
    expect(restoredA.role).toBe("Original A customization");

    const backToAClient = makeMutationClient(switchedToB.profile);
    const switchedBackToA = await applyTemplateSwitch({
      client: backToAClient.client,
      userId: USER_ID,
      profile: switchedToB.profile,
      candidateTemplateId: "buzz-template",
      config: buzzConfig,
      editorData: restoredA,
    });

    expect(switchedBackToA.profile.template_id).toBe("buzz-template");
    expect(
      switchedBackToA.profile.template_data.templates["buzz-template"].data.role,
    ).toBe("Original A customization");
    expect(
      switchedBackToA.profile.template_data.templates["hotel-template"].data.bio,
    ).toBe("Saved B customization");
  });

  it("leaves the old template active when activation fails after candidate save", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile, [null, { error: {
      code: "503",
      message: "activation unavailable",
    } }]);

    await expect(
      applyTemplateSwitch({
        client: fake.client,
        userId: USER_ID,
        profile,
        candidateTemplateId: "hotel-template",
        config: hotelConfig,
        editorData: editorDataFor(profile, "hotel-template", hotelConfig),
      }),
    ).rejects.toMatchObject({
      code: "503",
      savedResult: {
        profile: expect.objectContaining({ template_id: "buzz-template" }),
      },
    });
    expect(fake.updates[1]).toEqual({ template_id: "hotel-template" });
  });

  it("fails safely when updated_at detects a concurrent profile change", async () => {
    const profile = makeProfile();
    const fake = makeMutationClient(profile, [null, { noRow: true }]);

    await expect(
      applyTemplateSwitch({
        client: fake.client,
        userId: USER_ID,
        profile,
        candidateTemplateId: "hotel-template",
        config: hotelConfig,
        editorData: editorDataFor(profile, "hotel-template", hotelConfig),
      }),
    ).rejects.toMatchObject({
      code: "PROFILE_TEMPLATE_SWITCH_CONFLICT",
      savedResult: {
        profile: expect.objectContaining({ template_id: "buzz-template" }),
      },
    });
  });
});
