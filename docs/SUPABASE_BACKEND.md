# BuzzCard Studio — Supabase Backend Context

**Last updated:** 2026-08-21
**Supersedes:** any earlier backend notes in `PROJECT_CONTEXT.md` or `SETUP.md` that conflict with this document.

**Project:** `buzzcard-studio` · region `eu-central-1` (Frankfurt) · Free tier
**Stack:** React + Vite (no TypeScript, no Next.js), Supabase (Auth, Postgres + RLS, Storage), TanStack Query, Zustand, React Router.

---

## 1. What BuzzCard Studio actually is (expanded scope)

A physical NFC/QR business card paired with a mutable digital profile (`buzzcard.ma/c/{code}` → server-side lookup, so cards never need reissuing when content changes). Originally scoped as a simple personal profile card; scope has since expanded to:

- **Multiple product/template categories**, not one universal profile shape:
  - `personal` — standard personal profile card (name, role, socials, contact info)
  - `review_card` — Google Maps / TripAdvisor style cards for hotels/restaurants (name, phone, city, review link)
  - `bracelet` — transparent card/bracelet where the client picks a single service to expose (e.g. just a Google review link, or just WhatsApp)
- **7-day free trial** per signup, with a **manual human check-in via WhatsApp** at day 2–3 to gauge interest, and **hard deletion at day 60** if never converted.
- **Two distinct dashboards**: an end-user dashboard (edit own profile, change template, view analytics) and a separate admin dashboard (approvals, all-clients view, Recharts analytics, logs) — admin dashboard is **not yet designed**, flagged as future work.
- **QR generation** — dynamic, resolves server-side, same code forever (Tapni-style) — **not yet built**.
- **Templates from bipop-style flow** — user selects a template, then updates the content (Canva-like), with QR code pointing into the profile template.

---

## 2. Schema — current, confirmed state

### `profiles`
Extends `auth.users` 1:1 via shared UUID primary key.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID (PK, FK → auth.users) | |
| `username` | TEXT UNIQUE NOT NULL | auto-generated on signup, user-editable later |
| `full_name` | TEXT NOT NULL | kept alongside first/last name — see §7 |
| `first_name` | TEXT | added post-launch |
| `last_name` | TEXT | added post-launch |
| `role` | TEXT | job title |
| `company` | TEXT | |
| `bio` | TEXT | |
| `quote` | TEXT | closing citation, per "Simple" template spec |
| `avatar_url` | TEXT | |
| `banner_url` | TEXT | added post-launch |
| `template_id` | UUID (FK → templates) | nullable |
| `tier` | TEXT DEFAULT 'free' | CHECK ('free','pro') |
| `lifecycle_status` | TEXT DEFAULT 'trial' | CHECK ('trial','interested','not_interested','converted','expired') — drives the 60-day deletion logic (not yet built, see §8) |
| `trial_started_at` | TIMESTAMPTZ | |
| `theme_color` | TEXT DEFAULT '#002366' | |
| `created_at` / `updated_at` | TIMESTAMPTZ | `updated_at` auto-maintained via trigger |

**Triggers:**
- `on_auth_user_created` → `handle_new_user()` — auto-creates a `profiles` row on signup (username fallback = email prefix + random suffix). `SECURITY DEFINER`, `search_path` pinned to `public`, public EXECUTE revoked (trigger invocation is unaffected by this).
- `set_profiles_updated_at` → `set_updated_at()` — keeps `updated_at` accurate on every edit. `search_path` pinned.

### `social_links`
`id`, `profile_id` (FK → profiles, CASCADE), `platform`, `url`, `order_index`, `created_at`. Owner-only write via `profile_id = auth.uid()`.

### `orders`
`id`, `user_id` (FK → auth.users, SET NULL), `status` (pending/paid/shipped/delivered), `shipping_address` JSONB, `total_amount`, `created_at`. SELECT + INSERT policies only — **no UPDATE policy exists on purpose**, orders are immutable once placed from the user's side.

### `order_items`
Immutable checkout line snapshots linked to `orders` with `ON DELETE CASCADE`. Each row stores `product_id`, optional `variant_id`, SKU, product/variant names, quantity, unit price, and line total. Snapshot names and prices deliberately remain on the item so catalogue edits do not rewrite order history. Product and variant deletes are restricted while referenced by an order.

Per-item `configuration` JSONB stores the NFC destination/content configuration, while `customization` JSONB stores custom design data. Both default to an empty object. Authenticated users have SELECT + INSERT access only, scoped through the owning order; anonymous users have no table grants.

**Production checkout guardrail:** the current INSERT policy verifies order ownership, but prices and snapshot fields still come from the authenticated client. Before enabling real order submission or payment, move order creation behind a server-side transaction/RPC that reloads catalogue prices and stock. Do not treat client-submitted `unit_price` or `line_total` as authoritative.

### `templates`
`id`, `slug` (UNIQUE), `name`, `category` (CHECK: personal / review_card / bracelet), `trial_days` DEFAULT 7, `thumbnail_url`, `is_active`, `created_at`. Publicly readable where `is_active = true`.

**Seeded so far:** one row — `slug: 'simple'`, `category: 'personal'`. This is the only template with a fully specified field set (see §3). Other categories exist as schema/concept only — no seeded rows yet, no field spec finalized.

### `profile_phones` / `profile_emails`
Same shape as `social_links` — child tables, not JSONB arrays, deliberately (see §7 for the reasoning). `id`, `profile_id` (FK, CASCADE), `phone_number`/`email`, `label`, `order_index`. Owner-only write, public read.

**"Max 4" is a UI-enforced rule, not a DB constraint** — deliberate trade-off, see §7.

### Indexes
Every commerce FK has an explicit index (Postgres does not auto-index FK columns, only PKs):
`idx_orders_user_id`, `idx_order_items_order_id`, `idx_order_items_product_id`, and `idx_order_items_variant_id`.

---

## 3. Template field sets — per category

### `personal` — "Simple" template (fully specified)
All fields optional except where noted:

- Profile photo (avatar), banner image
- **Name, prename (required)** — first/last name
- Job title, enterprise/company, job description — rendered in italic
- Phone numbers — max 4
- Emails — max 4
- Social media links — unlimited, user-added
- Closing quote/citation

### `review_card` — Social media / Google Maps / TripAdvisor cards
- Name, prename, phone, city
- Review/avis link (optional)
- For Google Map + TripAdvisor: name, prename, phone, city, review link
- Social media cards: name, prename, city, phone, link of that social media

### `bracelet` — Transparent card/bracelet
- Client chooses **one** type of service to expose (e.g. Google review, one social link, WhatsApp only)
- Form shape still being finalized

### WhatsApp-specific behavior
No schema special-casing needed. A WhatsApp entry is just a `social_links` row where the URL is formatted as `https://wa.me/{number}` at write time. For WhatsApp cards specifically, the user enters the phone number they want to create the card for.

### Template-driven forms
**User data depends on the template they choose:** user selects a template first, then the form renders fields based on that template's category. Each template has a 7-day trial.

---

## 4. Storage

### Product catalogue

The public catalogue is stored in four RLS-enabled tables:

- `product_categories` — ordered catalogue categories; public read is limited to active rows.
- `products` — product copy, base price, stock, configuration metadata, features, and active/featured flags; public read is limited to active products in active categories.
- `product_variants` — SKU, color/material, variant price/stock, and default selection; public read is limited to active variants of active products.
- `product_media` — ordered product/variant media using `is_primary` and `position`; public read is limited to media belonging to active products and active variants.

Product files live in the public `product-images` bucket. Database rows store `storage_path`; the frontend generates public URLs with `supabase.storage.from("product-images").getPublicUrl(storagePath)`.

### `avatars` bucket
Public, MIME `image/png|jpeg|webp`, 2MB limit. Path convention: `{user_id}/filename`. Policies: public SELECT removed deliberately (see §7 — public URL access doesn't need it, and it was leaking the ability to enumerate user IDs via bucket listing). INSERT/UPDATE restricted to own folder.

### `banners` bucket
Same pattern, 5MB limit (wider hero images run larger). Same three policies, same folder-ownership convention.

---

## 5. Auth — current provider status

| Provider | Status | Notes |
|---|---|---|
| Email + Password | ✅ Live, verified | "Confirm email" toggle ON — **do not disable**, see §6 |
| Magic Link | ✅ Live, verified end-to-end | Real session + auto-created profile confirmed |
| Google OAuth | ✅ Live, verified end-to-end | Real session + auto-created profile confirmed |
| Facebook OAuth | 🔧 In progress | App created, Use Cases (`public_profile`+`email`) configured, redirect URI set, tester role added. **Client ID/Secret not yet pasted into Supabase — this is the very next step.** |
| Apple Sign In | ⏸️ Deliberately deferred | Requires $99/yr Apple Developer account — **pending client payment approval**. Do not enable in Supabase until real credentials exist; a broken enabled provider is worse than an absent one |
| Phone / OTP | ❌ Not used | Deliberate decision — email-only baseline, no SMS cost. Do not touch this provider |

**UI decision, locked:** one single switchable Login/Signup component (`mode` state toggling only the password/confirm-password portion and which Supabase call fires). OAuth button row is identical and unconditional regardless of mode — `signInWithOAuth()` has no signup/login distinction, Supabase resolves that internally.

---

## 6. Identity linking

**"Same email = same account" is Supabase's default behavior, not a toggle we set.** When a user signs in via OAuth and their email matches an existing account's **verified** email, the identity auto-links. This is entirely dependent on the "Confirm email" setting under Email provider staying ON — if that ever gets disabled (e.g. "temporarily" during testing), auto-linking silently becomes unsafe and Supabase stops doing it. Treat that toggle as load-bearing.

Known rough edge (not yet hit in this project): adding a password to an account that started as OAuth-only doesn't always cleanly register as a second linked identity — low priority, revisit only if it actually causes a support issue.

---

## 7. Deliberate trade-offs (context for *why*, not just *what*)

- **`profile_phones`/`profile_emails` as child tables, not JSONB** — chosen because the admin dashboard will eventually want per-contact-method analytics (which number got tapped), which needs individually queryable/joinable rows, not a blob.
- **"Max 4 phones/emails" is UI-only** — a DB trigger enforcing this is real complexity for what's fundamentally a soft UX rule; worst case of bypass is a cluttered profile, not a security issue.
- **Avatars/banners in separate buckets, not one bucket with subpaths** — different realistic file size limits (banner ≈ 2-3x avatar weight) can't be enforced per-subfolder in one bucket, only per-bucket.
- **Removed the public SELECT policy on `storage.objects` for avatars** — public bucket flag already grants direct URL access without RLS; the SELECT policy only added the ability to *list* the bucket, which let anyone enumerate every user's UUID via folder names. Same fix should be applied to `banners` if a similar policy was carried over.
- **`orders` has no UPDATE policy** — intentional; an order is immutable from the user's side once placed.
- **`full_name` kept alongside `first_name`/`last_name`** — avoids breaking `handle_new_user`, which still writes to `full_name`. Needs reconciliation once the real signup wizard exists.

---

## 8. Explicitly deferred — not forgotten, not started

- **60-day trial deletion job** — needs a scheduled job (Supabase Edge Function on cron, or `pg_cron` if available on plan) filtering `trial_started_at < NOW() - INTERVAL '60 days' AND lifecycle_status NOT IN ('converted')`. Columns exist; the job does not.
- **WhatsApp check-in flow** (day 2-3 manual interest check) — no automation built; currently a manual admin action, `lifecycle_status` update via dashboard once one exists.
- **Admin dashboard** — analytics (Recharts), approvals, all-clients view, profile creation unlimited, user status tracking (approvals, rejecting, fulfilled). Not designed yet.
- **QR generation** — Tapni-style dynamic QR, 100% same pattern. Not built.
- **Subdomain routing** (`username.buzzcard.ma`) — flagged early as the highest-stakes performance/hosting decision, still open.
- **`review_card` and `bracelet` template field specs** — category exists in the CHECK constraint, no finalized form shape.
- **WhatsApp communication channel** — client communicates with end-users via WhatsApp.

---

## 9. Testing

`tests/supabase-infra.test.js` (Vitest, hits the live project directly — not mocked) currently covers:
- Schema + `handle_new_user` trigger
- RLS on `profiles`, `social_links`, `orders`, and `order_items` (including real cross-user denial proof, not just "no error")
- Storage folder-ownership on `avatars`

**Not yet covered** (same ownership-proof pattern needs extending to):
- `templates`, `profile_phones`, `profile_emails`
- `banners` bucket
- No automated test exists for Facebook/Apple OAuth (expected — these need a real browser redirect, can't be scripted the same way)

Requires `.env.test.local` (project root) with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (service role key only ever lives here, never in frontend `.env.local`).

---

## 10. Security Advisor status

Last full check: 0 errors. Fixed: function `search_path` hardening on `handle_new_user`/`set_updated_at`, revoked public EXECUTE on `handle_new_user`, removed the avatar-listing exposure. Remaining warnings (expected to persist, not actionable): `rls_auto_enable()` (Supabase's own internal function, not ours to touch), Leaked Password Protection (Pro-plan-only feature, unavailable on Free tier).

---

## 11. Frontend Supabase client

`src/lib/supabase.js` — exports a singleton `supabase` client created via `createClient()`.

- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local` (frontend Vite context)
- Falls back to `SUPABASE_URL` / `SUPABASE_ANON_KEY` for test/node contexts
- In dev mode, exposes `window.supabase` for browser console testing (guarded by `typeof window !== "undefined"`)
- Imported via `src/main.jsx` to ensure the client initializes on app load

---

## 12. Immediate next steps (Auth layer focus)

1. **Finish Facebook OAuth:** paste real App ID/Secret into Supabase, save, verify persisted, run a real login test.
2. **Create `banners` storage bucket + policies** if not already done this session.
3. **Extend `supabase-infra.test.js`** to cover `templates`, `profile_phones`, `profile_emails`, `banners`.
4. **Build the `AuthProvider` context** — session state, `onAuthStateChange` listener, loading/error states.
5. **Build the single switchable Login/Signup `AuthForm` component** per the locked UI decision in §5.
6. Everything in §8 comes after — none of it blocks starting the Auth layer.
