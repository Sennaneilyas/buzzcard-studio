import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"; // import dotenv object to specify custom file paths
// load environment variables from local test and development config files:
dotenv.config({ path: [".env.test.local", ".env.local", ".env"] });

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing env vars. Check project-root .env.test.local has SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY",
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

  describe("RLS — social_links", () => {
    let createdLinkId;

    afterAll(async () => {
      if (createdLinkId) {
        await admin.from("social_links").delete().eq("id", createdLinkId);
      }
    });

    it("anon can read social links", async () => {
      const { data, error } = await anon
        .from("social_links")
        .select("*")
        .limit(1);
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("a user can insert a social link for their own profile", async () => {
      const { data, error } = await clientA
        .from("social_links")
        .insert({
          profile_id: userA.id,
          platform: "linkedin",
          url: "https://linkedin.com/in/test",
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.profile_id).toBe(userA.id);
      createdLinkId = data.id;
    });

    it("a user cannot insert a social link for someone else's profile", async () => {
      const { error } = await clientA.from("social_links").insert({
        profile_id: userB.id,
        platform: "twitter",
        url: "https://twitter.com/hijacked",
      });

      expect(error).not.toBeNull();
    });

    it("a user cannot delete someone else's social link", async () => {
      // seed a link owned by userB directly via admin (bypasses RLS on purpose, this is setup not assertion)
      const { data: seeded } = await admin
        .from("social_links")
        .insert({
          profile_id: userB.id,
          platform: "instagram",
          url: "https://instagram.com/userb",
        })
        .select()
        .single();

      const { data, error } = await clientA
        .from("social_links")
        .delete()
        .eq("id", seeded.id)
        .select();

      expect(error).toBeNull();
      expect(data.length).toBe(0); // RLS silently blocked it, 0 rows affected

      await admin.from("social_links").delete().eq("id", seeded.id); // manual cleanup since userA's attempt didn't touch it
    });
  });

  describe("RLS — orders", () => {
    let createdOrderId;
    let otherOrderId;
    let product;
    let variant;

    beforeAll(async () => {
      const { data: productData, error: productError } = await admin
        .from("products")
        .select("id, name, base_price")
        .eq("is_active", true)
        .limit(1)
        .single();
      if (productError) throw productError;
      product = productData;

      const { data: variantData } = await admin
        .from("product_variants")
        .select("id, name, sku, price")
        .eq("product_id", product.id)
        .eq("is_active", true)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle();
      variant = variantData;

      const { data: otherOrder, error: otherOrderError } = await admin
        .from("orders")
        .insert({
          user_id: userB.id,
          shipping_address: { city: "Rabat", country: "MA" },
          total_amount: variant?.price ?? product.base_price,
        })
        .select("id")
        .single();
      if (otherOrderError) throw otherOrderError;
      otherOrderId = otherOrder.id;
    });

    afterAll(async () => {
      if (createdOrderId) {
        await admin.from("orders").delete().eq("id", createdOrderId);
      }
      if (otherOrderId) {
        await admin.from("orders").delete().eq("id", otherOrderId);
      }
    });

    it("a user can create their own order", async () => {
      const { data, error } = await clientA
        .from("orders")
        .insert({
          user_id: userA.id,
          shipping_address: { city: "Beni Mellal", country: "MA" },
          total_amount: 149.99,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.user_id).toBe(userA.id);
      createdOrderId = data.id;
    });

    it("a user cannot create an order for someone else", async () => {
      const { error } = await clientA.from("orders").insert({
        user_id: userB.id,
        shipping_address: { city: "Casablanca", country: "MA" },
        total_amount: 99.99,
      });

      expect(error).not.toBeNull();
    });

    it("a user can view their own orders but not someone else's", async () => {
      const { data, error } = await clientA.from("orders").select("*");
      expect(error).toBeNull();
      expect(data.every((order) => order.user_id === userA.id)).toBe(true);
    });

    it("a user can create a configured item for their own order", async () => {
      const unitPrice = Number(variant?.price ?? product.base_price);
      const { data, error } = await clientA
        .from("order_items")
        .insert({
          order_id: createdOrderId,
          product_id: product.id,
          variant_id: variant?.id ?? null,
          sku: variant?.sku ?? null,
          product_name: product.name,
          variant_name: variant?.name ?? null,
          quantity: 2,
          unit_price: unitPrice,
          line_total: unitPrice * 2,
          configuration: { type: "profile", profile_id: userA.id },
          customization: { design: "standard" },
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.product_name).toBe(product.name);
      expect(data.quantity).toBe(2);
      expect(data.configuration.type).toBe("profile");
    });

    it("a user cannot create or view items belonging to another user's order", async () => {
      const unitPrice = Number(variant?.price ?? product.base_price);
      const { error: insertError } = await clientA.from("order_items").insert({
        order_id: otherOrderId,
        product_id: product.id,
        variant_id: variant?.id ?? null,
        sku: variant?.sku ?? null,
        product_name: product.name,
        variant_name: variant?.name ?? null,
        quantity: 1,
        unit_price: unitPrice,
        line_total: unitPrice,
      });
      expect(insertError).not.toBeNull();

      const { data, error } = await clientA
        .from("order_items")
        .select("*")
        .eq("order_id", otherOrderId);
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it("there is no UPDATE policy — a user cannot edit an existing order", async () => {
      const { data, error } = await clientA
        .from("orders")
        .update({ status: "delivered" })
        .eq("id", createdOrderId)
        .select();

      expect(error).toBeNull();
      expect(data.length).toBe(0); // no UPDATE policy exists, so RLS blocks it entirely
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
