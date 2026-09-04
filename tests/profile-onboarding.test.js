import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import {
  fetchProfileByUserId,
  getProfileQueryKey,
  getProfileQueryOptions,
  getProfileState,
} from "../src/features/auth/hooks/useProfile";
import {
  DASHBOARD_PATH,
  getDefaultAuthDestination,
  getOnboardingRedirect,
  getOnboardingSkipDestination,
} from "../src/features/auth/utils/profileRouting";
import {
  buildDraftProfilePayload,
  createDraftProfile,
} from "../src/features/onboarding/api/useCreateDraftProfile";

const USER_ID = "2c52445d-4bb5-4f8b-b41e-a16e8b18ba6a";

function makeReadClient(response) {
  const maybeSingle = vi.fn().mockResolvedValue(response);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  return { client: { from }, from, select, eq, maybeSingle };
}

function makeCreateClient({ insertResponse, readResponse }) {
  const single = vi.fn().mockResolvedValue(insertResponse);
  const selectInserted = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select: selectInserted }));

  const maybeSingle = vi.fn().mockResolvedValue(readResponse);
  const eq = vi.fn(() => ({ maybeSingle }));
  const selectExisting = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ insert, select: selectExisting }));

  return {
    client: { from },
    from,
    insert,
    selectInserted,
    single,
    maybeSingle,
  };
}

describe("authenticated profile query state", () => {
  it("resolves zero profile rows as a successful null query result", async () => {
    const { client, maybeSingle } = makeReadClient({ data: null, error: null });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const result = await queryClient.fetchQuery(
      getProfileQueryOptions(client, USER_ID),
    );

    expect(result).toBeNull();
    expect(maybeSingle).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(getProfileQueryKey(USER_ID))).toBeNull();
    expect(queryClient.getQueryState(getProfileQueryKey(USER_ID))?.status).toBe(
      "success",
    );
    queryClient.clear();
  });

  it("keeps a real database failure as an error", async () => {
    const databaseError = { code: "42501", message: "permission denied" };
    const { client } = makeReadClient({ data: null, error: databaseError });

    await expect(fetchProfileByUserId(client, USER_ID)).rejects.toBe(databaseError);
  });

  it.each([
    [null, "no_profile"],
    [{ status: "draft" }, "draft"],
    [{ status: "published" }, "published"],
  ])("maps the persisted profile to %s state", (profile, expected) => {
    expect(getProfileState(profile)).toBe(expected);
  });
});

describe("draft profile creation", () => {
  const user = { id: USER_ID };

  it("builds a minimal draft for the authenticated owner and selected template", () => {
    expect(
      buildDraftProfilePayload({
        user,
        templateId: "hotel-template",
        displayName: "  Youssef El Idrissi  ",
        profileLabel: "  Hotel card  ",
        avatarUrl: "",
      }),
    ).toEqual({
      id: USER_ID,
      username: "youssef-el-idrissi-2c52445d",
      full_name: "Youssef El Idrissi",
      profile_label: "Hotel card",
      avatar_url: null,
      template_id: "hotel-template",
      status: "draft",
      template_data: {},
    });
  });

  it("inserts exactly one draft when the query already confirmed no profile", async () => {
    const insertedProfile = {
      id: USER_ID,
      username: "salma-2c52445d",
      full_name: "Salma",
      template_id: "buzz-template",
      status: "draft",
      template_data: {},
    };
    const fake = makeCreateClient({
      insertResponse: { data: insertedProfile, error: null },
      readResponse: { data: null, error: null },
    });

    const result = await createDraftProfile({
      client: fake.client,
      user,
      displayName: "Salma",
      templateId: "buzz-template",
      existingProfile: null,
    });

    expect(result).toEqual({ profile: insertedProfile, created: true });
    expect(fake.insert).toHaveBeenCalledOnce();
    expect(fake.insert.mock.calls[0][0]).toMatchObject({
      id: USER_ID,
      template_id: "buzz-template",
      status: "draft",
      template_data: {},
    });
  });

  it("returns an existing profile without issuing any write", async () => {
    const existingProfile = {
      id: USER_ID,
      username: "existing-owner",
      full_name: "Existing Owner",
      template_id: "doctor-template",
      status: "published",
    };
    const client = { from: vi.fn() };

    const result = await createDraftProfile({
      client,
      user,
      displayName: "Replacement Name",
      templateId: "hotel-template",
      existingProfile,
    });

    expect(result).toEqual({ profile: existingProfile, created: false });
    expect(client.from).not.toHaveBeenCalled();
  });

  it("checks Supabase first when no authoritative profile result was supplied", async () => {
    const existingProfile = {
      id: USER_ID,
      username: "existing-draft",
      full_name: "Existing Draft",
      template_id: "doctor-template",
      status: "draft",
    };
    const fake = makeCreateClient({
      insertResponse: { data: null, error: null },
      readResponse: { data: existingProfile, error: null },
    });

    const result = await createDraftProfile({
      client: fake.client,
      user,
      displayName: "Do Not Replace",
      templateId: "hotel-template",
    });

    expect(result).toEqual({ profile: existingProfile, created: false });
    expect(fake.maybeSingle).toHaveBeenCalledOnce();
    expect(fake.insert).not.toHaveBeenCalled();
  });

  it("recovers a concurrent duplicate insert by fetching the owner's row", async () => {
    const concurrentProfile = {
      id: USER_ID,
      username: "concurrent-owner",
      full_name: "Concurrent Owner",
      template_id: "coiffeur-template",
      status: "draft",
    };
    const fake = makeCreateClient({
      insertResponse: {
        data: null,
        error: { code: "23505", message: "duplicate key value" },
      },
      readResponse: { data: concurrentProfile, error: null },
    });

    const result = await createDraftProfile({
      client: fake.client,
      user,
      displayName: "Concurrent Owner",
      templateId: "coiffeur-template",
      existingProfile: null,
    });

    expect(result).toEqual({ profile: concurrentProfile, created: false });
    expect(fake.insert).toHaveBeenCalledOnce();
    expect(fake.maybeSingle).toHaveBeenCalledOnce();
  });
});

describe("profile-aware onboarding routes", () => {
  it("skips to the dashboard without invoking profile creation", () => {
    const client = { from: vi.fn() };

    expect(getOnboardingSkipDestination()).toBe(DASHBOARD_PATH);
    expect(client.from).not.toHaveBeenCalled();
  });

  it("sends an existing draft directly to its canonical Studio route", () => {
    expect(
      getOnboardingRedirect({ status: "draft", username: "salma-el-amrani" }),
    ).toBe("/profile/salma-el-amrani/edit");
  });

  it("sends an existing published profile to the dashboard", () => {
    expect(
      getOnboardingRedirect({ status: "published", username: "published-owner" }),
    ).toBe(DASHBOARD_PATH);
  });

  it("uses onboarding only as the default signup destination", () => {
    expect(getDefaultAuthDestination(true)).toBe("/onboarding");
    expect(getDefaultAuthDestination(false)).toBe(DASHBOARD_PATH);
  });
});
