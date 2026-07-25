import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing env vars. Check tests/.env.test.local has SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY",
  );
}

// Two separate clients on purpose:
// - `anon`: mimics exactly what a logged-out browser sees
// - `admin`: bypasses RLS entirely, used ONLY to set up/tear down test data,
//   never to assert anything about permissions (that would defeat the point)
const anon = createClient(SUPABASE_URL, ANON_KEY);
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "Test1234!Secure";
const stamp = Date.now();

let userA; // the "owner" in ownership tests
let userB; // an unrelated second user, used to prove cross-user access is actually blocked
let clientA; // authenticated as userA, via the anon key (exactly like a real browser session)

async function createTestUser(label) {
  const { data, error } = await admin.auth.admin.createUser({
    email: `test-${label}-${stamp}@buzzcard.test`,
    password: PASSWORD,
    email_confirm: true, // skip real email delivery for automated runs
  });
  if (error) throw error;
  return data.user;
}

describe("Supabase infrastructure smoke tests", () => {
  beforeAll(async () => {
    userA = await createTestUser("a");
    userB = await createTestUser("b");

    // let the on_auth_user_created trigger commit before tests query it
    await new Promise((r) => setTimeout(r, 500));

    clientA = createClient(SUPABASE_URL, ANON_KEY);
    const { error } = await clientA.auth.signInWithPassword({
      email: userA.email,
      password: PASSWORD,
    });
    if (error) throw error;
  });

  afterAll(async () => {
    // cleanup runs even if a test above failed, so the project stays clean
    await admin.storage
      .from("avatars")
      .remove([`${userA?.id}/smoke-test.png`, `${userB?.id}/smoke-test.png`]);
    if (userA?.id) await admin.auth.admin.deleteUser(userA.id);
    if (userB?.id) await admin.auth.admin.deleteUser(userB.id);
  });

  describe("Schema + trigger", () => {
    it("signing up auto-creates a profiles row via the handle_new_user trigger", async () => {
      const { data, error } = await admin
        .from("profiles")
        .select("*")
        .eq("id", userA.id)
        .single();

      expect(error).toBeNull();
      expect(data.username).toBeTruthy();
      expect(data.tier).toBe("free"); // confirms column defaults applied
    });
  });

  describe("RLS — profiles", () => {
    it("anon (logged-out) can read profiles", async () => {
      const { data, error } = await anon.from("profiles").select("*").limit(1);
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("anon cannot insert a profile", async () => {
      const { error } = await anon.from("profiles").insert({
        id: "00000000-0000-0000-0000-000000000000",
        username: "should-fail",
        full_name: "Should Fail",
      });
      expect(error).not.toBeNull();
    });

    it("a user can update their own profile", async () => {
      const { data, error } = await clientA
        .from("profiles")
        .update({ bio: "Updated by integration test" })
        .eq("id", userA.id)
        .select();

      expect(error).toBeNull();
      expect(data.length).toBe(1);
      expect(data[0].bio).toBe("Updated by integration test");
    });

    it("a user cannot update a DIFFERENT real user's profile", async () => {
      // userB is a real, existing row — this isolates "RLS blocked it"
      // from "that row doesn't exist", which a fake UUID would not prove
      const { data, error } = await clientA
        .from("profiles")
        .update({ bio: "Should not apply" })
        .eq("id", userB.id)
        .select();

      expect(error).toBeNull(); // RLS filters silently, it doesn't throw
      expect(data.length).toBe(0); // zero rows affected = the real proof

      const { data: check } = await admin
        .from("profiles")
        .select("bio")
        .eq("id", userB.id)
        .single();
      expect(check.bio).not.toBe("Should not apply");
    });
  });

  describe("Storage — avatars", () => {
    it("a user can upload into their own avatar folder", async () => {
      const file = new Blob(["fake-image-bytes"], { type: "image/png" });
      const { error } = await clientA.storage
        .from("avatars")
        .upload(`${userA.id}/smoke-test.png`, file, { upsert: true });

      expect(error).toBeNull();
    });

    it("anyone (even logged-out) can read a public avatar URL", async () => {
      const { data } = clientA.storage
        .from("avatars")
        .getPublicUrl(`${userA.id}/smoke-test.png`);

      const res = await fetch(data.publicUrl);
      expect(res.ok).toBe(true);
    });

    it("a user cannot upload into someone ELSE's avatar folder", async () => {
      const file = new Blob(["fake-image-bytes"], { type: "image/png" });
      const { error } = await clientA.storage
        .from("avatars")
        .upload(`${userB.id}/smoke-test.png`, file);

      expect(error).not.toBeNull();
    });
  });
});
