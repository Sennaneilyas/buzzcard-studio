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
let userC; // starts without a profile, then exercises the complete profile lifecycle
let clientA; // authenticated as userA, via the anon key (exactly like a real browser session)
let clientC; // authenticated as userC

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
    userC = await createTestUser("c");

    clientA = createClient(SUPABASE_URL, ANON_KEY);
    const { error: clientAError } = await clientA.auth.signInWithPassword({
      email: userA.email,
      password: PASSWORD,
    });
    if (clientAError) throw clientAError;

    clientC = createClient(SUPABASE_URL, ANON_KEY);
    const { error: clientCError } = await clientC.auth.signInWithPassword({
      email: userC.email,
      password: PASSWORD,
    });
    if (clientCError) throw clientCError;

    // Most existing infrastructure tests need profile-owned records. Seed A and
    // B explicitly because auth signup intentionally no longer creates them.
    const { error: seedError } = await admin.from("profiles").insert([
      {
        id: userA.id,
        username: `infra-a-${stamp}`,
        full_name: "Infrastructure User A",
        template_id: "buzz-template",
      },
      {
        id: userB.id,
        username: `infra-b-${stamp}`,
        full_name: "Infrastructure User B",
        template_id: "buzz-template",
      },
    ]);
    if (seedError) throw seedError;
  });

  afterAll(async () => {
    // cleanup runs even if a test above failed, so the project stays clean
    await admin.storage
      .from("avatars")
      .remove([
        `${userA?.id}/smoke-test.png`,
        `${userB?.id}/smoke-test.png`,
        `${userC?.id}/smoke-test.png`,
      ]);
    await admin.storage.from("profile-media").remove([
      `profiles/${userA?.id}/templates/buzz-template/gallery/smoke-test.png`,
      `profiles/${userB?.id}/templates/buzz-template/gallery/smoke-test.png`,
      `profiles/${userA?.id}/templates/buzz-template/gallery/rejected.svg`,
    ]);
    if (userA?.id) await admin.auth.admin.deleteUser(userA.id);
    if (userB?.id) await admin.auth.admin.deleteUser(userB.id);
    if (userC?.id) await admin.auth.admin.deleteUser(userC.id);
  });

  describe("Schema + optional profile creation", () => {
    it("an auth user can exist without a profile", async () => {
      const { data, error } = await admin
        .from("profiles")
        .select("id")
        .eq("id", userC.id);

      expect(error).toBeNull();
      expect(data).toEqual([]);
    });
  });

  describe.sequential("RLS + lifecycle — profiles", () => {
    let firstPublishedAt;

    it("anon cannot insert a profile", async () => {
      const { error } = await anon.from("profiles").insert({
        id: "00000000-0000-0000-0000-000000000000",
        username: "should-fail",
        full_name: "Should Fail",
      });
      expect(error).not.toBeNull();
    });

    it("a user cannot create a profile for another authenticated user", async () => {
      const { error } = await clientA.from("profiles").insert({
        id: userC.id,
        username: `infra-hijack-${stamp}`,
        full_name: "Should Fail",
        template_id: "buzz-template",
      });

      expect(error).not.toBeNull();
    });

    it("a user can create exactly one draft profile for themselves", async () => {
      const { data, error } = await clientC
        .from("profiles")
        .insert({
          id: userC.id,
          username: `infra-c-${stamp}`,
          full_name: "Infrastructure User C",
          profile_label: "My BuzzCard",
          template_id: "buzz-template",
          template_data: { headline: "Integration test profile" },
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.id).toBe(userC.id);
      expect(data.status).toBe("draft");
      expect(data.first_published_at).toBeNull();
      expect(data.lifecycle_status).toBe("trial");
      expect(data.template_data).toEqual({ headline: "Integration test profile" });
    });

    it("duplicate profile creation fails at the primary-key constraint", async () => {
      const { error } = await clientC.from("profiles").insert({
        id: userC.id,
        username: `infra-c-duplicate-${stamp}`,
        full_name: "Duplicate Profile",
        template_id: "hotel-template",
      });

      expect(error).not.toBeNull();
      expect(error.code).toBe("23505");
    });

    it("the owner can read their own draft profile", async () => {
      const { data, error } = await clientC
        .from("profiles")
        .select("id, status")
        .eq("id", userC.id)
        .single();

      expect(error).toBeNull();
      expect(data).toEqual({ id: userC.id, status: "draft" });
    });

    it("another authenticated user cannot read someone else's draft", async () => {
      const { data, error } = await clientA
        .from("profiles")
        .select("id")
        .eq("id", userC.id)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data).toBeNull();
    });

    it("anonymous users cannot read a draft profile", async () => {
      const { data, error } = await anon
        .from("profiles")
        .select("id")
        .eq("id", userC.id)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data).toBeNull();
    });

    it("a user can update their own draft profile", async () => {
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

    it("the first draft-to-published transition records first_published_at", async () => {
      const { data, error } = await clientC
        .from("profiles")
        .update({ status: "published" })
        .eq("id", userC.id)
        .select("status, first_published_at")
        .single();

      expect(error).toBeNull();
      expect(data.status).toBe("published");
      expect(data.first_published_at).toBeTruthy();
      firstPublishedAt = data.first_published_at;
    });

    it("anonymous users can read a published profile", async () => {
      const { data, error } = await anon
        .from("profiles")
        .select("id, status")
        .eq("id", userC.id)
        .single();

      expect(error).toBeNull();
      expect(data).toEqual({ id: userC.id, status: "published" });
    });

    it("unpublish, republish, template edits, and direct edits preserve first_published_at", async () => {
      const { data: draftAgain, error: unpublishError } = await clientC
        .from("profiles")
        .update({ status: "draft" })
        .eq("id", userC.id)
        .select("status, first_published_at")
        .single();

      expect(unpublishError).toBeNull();
      expect(draftAgain.status).toBe("draft");
      expect(draftAgain.first_published_at).toBe(firstPublishedAt);

      const { data: republished, error: republishError } = await clientC
        .from("profiles")
        .update({ status: "published", template_id: "hotel-template" })
        .eq("id", userC.id)
        .select("status, template_id, first_published_at")
        .single();

      expect(republishError).toBeNull();
      expect(republished.status).toBe("published");
      expect(republished.template_id).toBe("hotel-template");
      expect(republished.first_published_at).toBe(firstPublishedAt);

      const { data: protectedTimestamp, error: timestampError } = await clientC
        .from("profiles")
        .update({ first_published_at: "2000-01-01T00:00:00.000Z" })
        .eq("id", userC.id)
        .select("first_published_at")
        .single();

      expect(timestampError).toBeNull();
      expect(protectedTimestamp.first_published_at).toBe(firstPublishedAt);
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

  describe("RLS — profile child rows follow publication", () => {
    const seeded = {};

    beforeAll(async () => {
      const { error: publishError } = await admin
        .from("profiles")
        .update({ status: "published" })
        .eq("id", userC.id);
      if (publishError) throw publishError;

      const childRows = await Promise.all([
        admin
          .from("social_links")
          .insert([
            {
              profile_id: userA.id,
              platform: "draft-visibility",
              url: "https://example.com/draft-social",
            },
            {
              profile_id: userC.id,
              platform: "published-visibility",
              url: "https://example.com/published-social",
            },
          ])
          .select("id, profile_id"),
        admin
          .from("profile_phones")
          .insert([
            { profile_id: userA.id, phone_number: "+212600000001" },
            { profile_id: userC.id, phone_number: "+212600000002" },
          ])
          .select("id, profile_id"),
        admin
          .from("profile_emails")
          .insert([
            { profile_id: userA.id, email: `draft-${stamp}@buzzcard.test` },
            { profile_id: userC.id, email: `published-${stamp}@buzzcard.test` },
          ])
          .select("id, profile_id"),
        admin
          .from("profile_reviews")
          .insert([
            {
              profile_id: userA.id,
              reviewer_id: userB.id,
              rating: 4,
              comment: "Draft visibility review",
            },
            {
              profile_id: userC.id,
              reviewer_id: userB.id,
              rating: 5,
              comment: "Published visibility review",
            },
          ])
          .select("id, profile_id"),
      ]);

      for (const result of childRows) {
        if (result.error) throw result.error;
      }

      [seeded.socials, seeded.phones, seeded.emails, seeded.reviews] =
        childRows.map((result) => result.data);

      const draftReview = seeded.reviews.find(
        (row) => row.profile_id === userA.id,
      );
      const publishedReview = seeded.reviews.find(
        (row) => row.profile_id === userC.id,
      );
      const { data: replies, error: repliesError } = await admin
        .from("profile_review_replies")
        .insert([
          {
            review_id: draftReview.id,
            author_id: userA.id,
            comment: "Draft visibility reply",
          },
          {
            review_id: publishedReview.id,
            author_id: userC.id,
            comment: "Published visibility reply",
          },
        ])
        .select("id, review_id");
      if (repliesError) throw repliesError;
      seeded.replies = replies;
    });

    it.each([
      ["social_links", "socials"],
      ["profile_phones", "phones"],
      ["profile_emails", "emails"],
      ["profile_reviews", "reviews"],
    ])("anonymous users see only published-parent rows in %s", async (table, key) => {
      const draftRow = seeded[key].find((row) => row.profile_id === userA.id);
      const publishedRow = seeded[key].find(
        (row) => row.profile_id === userC.id,
      );

      const { data, error } = await anon
        .from(table)
        .select("id")
        .in("id", [draftRow.id, publishedRow.id]);

      expect(error).toBeNull();
      expect(data).toEqual([{ id: publishedRow.id }]);
    });

    it("anonymous users cannot read replies attached to draft profiles", async () => {
      const { data, error } = await anon
        .from("profile_review_replies")
        .select("id")
        .in("id", seeded.replies.map((reply) => reply.id));

      const publishedReview = seeded.reviews.find(
        (row) => row.profile_id === userC.id,
      );
      const publishedReply = seeded.replies.find(
        (reply) => reply.review_id === publishedReview.id,
      );

      expect(error).toBeNull();
      expect(data).toEqual([{ id: publishedReply.id }]);
    });

    it("the authenticated owner can still read draft child rows", async () => {
      const draftSocial = seeded.socials.find(
        (row) => row.profile_id === userA.id,
      );
      const { data, error } = await clientA
        .from("social_links")
        .select("id")
        .eq("id", draftSocial.id)
        .single();

      expect(error).toBeNull();
      expect(data.id).toBe(draftSocial.id);
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

  describe.sequential("Storage — profile media", () => {
    const ownPath = () =>
      `profiles/${userA.id}/templates/buzz-template/gallery/smoke-test.png`;
    const otherPath = () =>
      `profiles/${userB.id}/templates/buzz-template/gallery/smoke-test.png`;

    it("uses a public bucket with centralized MIME and size limits", async () => {
      const { data, error } = await admin.storage.getBucket("profile-media");

      expect(error).toBeNull();
      expect(data.public).toBe(true);
      expect(data.file_size_limit).toBe(5 * 1024 * 1024);
      expect(data.allowed_mime_types).toEqual([
        "image/jpeg",
        "image/png",
        "image/webp",
      ]);
    });

    it("lets an authenticated owner upload into their own profile path", async () => {
      const file = new Blob(["profile-media-bytes"], { type: "image/png" });
      const { error } = await clientA.storage
        .from("profile-media")
        .upload(ownPath(), file, { upsert: false });

      expect(error).toBeNull();
    });

    it("serves the canonical profile-media URL without authentication", async () => {
      const { data } = clientA.storage
        .from("profile-media")
        .getPublicUrl(ownPath());

      const response = await fetch(data.publicUrl);
      expect(response.ok).toBe(true);
    });

    it("lets the owner replace their own object", async () => {
      const replacement = new Blob(["replacement-image-bytes"], {
        type: "image/png",
      });
      const { error } = await clientA.storage
        .from("profile-media")
        .update(ownPath(), replacement, { upsert: false });

      expect(error).toBeNull();
    });

    it("blocks cross-user path uploads and updates", async () => {
      const file = new Blob(["cross-user-image"], { type: "image/png" });
      const { error: uploadError } = await clientA.storage
        .from("profile-media")
        .upload(otherPath(), file, { upsert: false });
      expect(uploadError).not.toBeNull();

      const { error: seedError } = await admin.storage
        .from("profile-media")
        .upload(otherPath(), file, { upsert: true });
      expect(seedError).toBeNull();

      const { error: updateError } = await clientA.storage
        .from("profile-media")
        .update(otherPath(), file, { upsert: false });
      expect(updateError).not.toBeNull();
    });

    it("enforces the bucket MIME allowlist", async () => {
      const svg = new Blob(["<svg></svg>"], { type: "image/svg+xml" });
      const { error } = await clientA.storage
        .from("profile-media")
        .upload(
          `profiles/${userA.id}/templates/buzz-template/gallery/rejected.svg`,
          svg,
        );

      expect(error).not.toBeNull();
    });

    it("lets the owner delete their own object", async () => {
      const { data, error } = await clientA.storage
        .from("profile-media")
        .remove([ownPath()]);

      expect(error).toBeNull();
      expect(data.map((object) => object.name)).toContain(ownPath());
    });
  });
});
