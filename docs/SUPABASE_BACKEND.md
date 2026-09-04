# BuzzCard Studio — Supabase Backend Context

**Last updated:** 2026-08-30
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
Optionally extends `auth.users` via the same UUID primary key (`auth.users` 1 : 0..1 `profiles`). Creating an auth account does not create a profile. The authenticated user inserts their profile only after selecting a template and starting setup; the shared primary key makes duplicate/racing creation attempts fail atomically.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID (PK, FK → auth.users) | |
| `username` | TEXT UNIQUE NOT NULL | supplied when the profile is created, user-editable later |
| `full_name` | TEXT NOT NULL | kept alongside first/last name — see §7 |
| `first_name` | TEXT | added post-launch |
| `last_name` | TEXT | added post-launch |
| `role` | TEXT | job title |
| `company` | TEXT | |
| `bio` | TEXT | |
| `quote` | TEXT | closing citation, per "Simple" template spec |
| `avatar_url` | TEXT | |
| `banner_url` | TEXT | added post-launch |
| `template_id` | TEXT | selected frontend template registry ID; no implicit default |
| `profile_label` | TEXT | optional owner-facing label |
| `status` | TEXT NOT NULL DEFAULT 'draft' | CHECK (`draft`, `published`); publication state only |
| `template_data` | JSONB NOT NULL DEFAULT `{}` | versioned, per-template Studio data; see §11 |
| `first_published_at` | TIMESTAMPTZ | set on first publication and never reset/overwritten |
| `tier` | TEXT DEFAULT 'free' | CHECK ('free','pro') |
| `lifecycle_status` | TEXT DEFAULT 'trial' | CHECK ('trial','interested','not_interested','converted','expired') — drives the 60-day deletion logic (not yet built, see §8) |
| `trial_started_at` | TIMESTAMPTZ | |
| `theme_color` | TEXT DEFAULT '#002366' | |
| `created_at` / `updated_at` | TIMESTAMPTZ | `updated_at` auto-maintained via trigger |

**Triggers:**
- No trigger runs on `auth.users` signup. `on_auth_user_created` and `handle_new_user()` were removed so an account can exist without a profile.
- `set_profiles_updated_at` → `set_updated_at()` — keeps `updated_at` accurate on every edit. `search_path` pinned.
- `set_profile_first_published_at` → `set_profile_first_published_at()` — records the first successful publication and preserves that value across unpublish/republish and later edits.

**Profile RLS:**
- `anon` and `authenticated` can select only rows where `status = 'published'`.
- An authenticated owner can additionally select their own row in either status.
- An authenticated user can insert only their own row, initially as `draft`, with a selected `template_id` and no publication timestamp.
- An authenticated owner can update only their own row. No client-side DELETE policy exists.
- `lifecycle_status` remains independent from `status`; this migration does not change commercial lifecycle behavior.

### `social_links`
`id`, `profile_id` (FK → profiles, CASCADE), `platform`, `url`, `order_index`, `created_at`. Owner-only write via `profile_id = auth.uid()`. SELECT follows the parent profile: anonymous users can read links only for published profiles, while an authenticated owner can also read their own draft links.

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
Same shape as `social_links` — child tables, not JSONB arrays, deliberately (see §7 for the reasoning). `id`, `profile_id` (FK, CASCADE), `phone_number`/`email`, `label`, `order_index`. Owner-only write; reads follow the parent profile's published/owner visibility.

### Profile reviews and replies
`profile_reviews` and `profile_review_replies` also follow the parent profile's publication visibility. Reviews or replies attached to a draft are not anonymously readable. Review reports have no public SELECT policy.

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
Legacy public bucket, MIME `image/png|jpeg|webp|gif`, 2MB limit. Path convention: `{user_id}/filename`. Owner-folder SELECT/INSERT/UPDATE/DELETE policies remain for compatibility; new Studio uploads do not use this bucket.

### `banners` bucket
Legacy public bucket with a 5MB limit and owner-folder policies. A broad historical public SELECT policy still exists on `storage.objects`; removing it requires a separate compatibility review. New Studio uploads do not use this bucket.

### `profile-media` bucket (current Studio uploads)

Public bucket for media rendered by `/profile/:username`, restricted to JPEG, PNG, and WebP with a bucket-level 5MB limit. The application applies a stricter 2MB limit to avatars. Canonical public URLs are persisted so the existing template string contract and logged-out rendering remain simple.

Paths are generated from MIME type and a random identifier; raw filenames are never trusted:

```text
profiles/{userId}/avatar/{uuid}.{ext}
profiles/{userId}/templates/{templateId}/cover/{uuid}.{ext}
profiles/{userId}/templates/{templateId}/gallery/{uuid}.{ext}
profiles/{userId}/templates/{templateId}/sections/{uuid}.{ext}
```

Authenticated users can list, insert, update, and delete only objects whose second folder segment equals their `auth.uid()`. The public bucket flag permits direct CDN reads for public profiles; it does not permit anonymous uploads, mutations, or bucket listing. The older `avatars` and `banners` buckets remain intact for compatibility but new Studio uploads use `profile-media`.

---

## 5. Auth — current provider status

| Provider | Status | Notes |
|---|---|---|
| Email + Password | ✅ Live, verified | "Confirm email" toggle ON — **do not disable**, see §6 |
| Magic Link | ✅ Live, verified end-to-end | Creates an auth session; profile creation is a later explicit action |
| Google OAuth | ✅ Live, verified end-to-end | Creates an auth session; profile creation is a later explicit action |
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
- **One dedicated bucket for current Studio media** — `profile-media` keeps one ownership policy and stable path contract across avatar, cover, gallery, and section media. The bucket enforces the broad 5MB ceiling; the shared upload service applies the stricter 2MB avatar ceiling before network activity.
- **Removed the public SELECT policy on `storage.objects` for avatars** — public bucket flag already grants direct URL access without RLS; the SELECT policy only added the ability to *list* the bucket, which let anyone enumerate every user's UUID via folder names. Same fix should be applied to `banners` if a similar policy was carried over.
- **`orders` has no UPDATE policy** — intentional; an order is immutable from the user's side once placed.
- **`full_name` kept alongside `first_name`/`last_name`** — preserves the existing profile shape while the explicit profile-creation flow is implemented.

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
- Auth users without profiles, explicit one-profile creation, duplicate rejection, and first-publication timestamp immutability
- Draft owner visibility, draft isolation from other authenticated/anonymous users, published public visibility, and profile write ownership
- Publication-aware RLS on `social_links`, `profile_phones`, `profile_emails`, profile reviews, and replies
- RLS on `orders` and `order_items` (including real cross-user denial proof, not just "no error")
- Storage folder-ownership on `avatars` and `profile-media`, including public delivery, owner replacement/deletion, cross-user denial, and bucket restrictions

**Not yet covered** (same ownership-proof pattern needs extending to):
- `templates`
- Legacy `banners` bucket ownership
- No automated test exists for Facebook/Apple OAuth (expected — these need a real browser redirect, can't be scripted the same way)

Requires `.env.test.local` (project root) with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (service role key only ever lives here, never in frontend `.env.local`).

---

## 10. Security Advisor status

Profile publication RLS and the first-publication trigger use explicit roles, owner checks, and a pinned function `search_path`. `handle_new_user` no longer exists. Remaining project-wide warnings may include `rls_auto_enable()` (Supabase-managed, not ours to touch) and Leaked Password Protection (plan-dependent).

---

## 11. Frontend Supabase client

`src/lib/supabase.js` — exports a singleton `supabase` client created via `createClient()`.

- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local` (frontend Vite context)
- Falls back to `SUPABASE_URL` / `SUPABASE_ANON_KEY` for test/node contexts
- In dev mode, exposes `window.supabase` for browser console testing (guarded by `typeof window !== "undefined"`)
- Imported via `src/main.jsx` to ensure the client initializes on app load

### Frontend profile lifecycle

- `useProfile()` uses `maybeSingle()`: zero rows is the valid `no_profile` state, while genuine Supabase errors remain query errors.
- Signup defaults to `/onboarding`; returning login defaults to `/dashboard`. Explicit safe `returnTo` routes still win.
- Onboarding is two steps: minimal identity, then template selection. Confirming the template performs one plain `INSERT` with `status = 'draft'` and `template_data = {}`; it does not use `upsert`.
- A duplicate-key race (`23505`) is resolved by fetching the owner's existing row and continuing without overwriting it.
- Skip goes to the authenticated dashboard without inserting a profile. The dashboard represents no-profile, draft, and published states without redirect loops.
- Existing drafts bypass onboarding and continue at `/profile/:username/edit`; published owners bypass onboarding for the dashboard.
- `profiles.username` is the canonical editor-route identifier. There is no `profiles.slug` column.
- Zustand is the transient live-editor store only. It is hydrated from Supabase when Studio opens and is never authoritative for profile existence or saved content.
- Draft preview renders current live editor data inside the protected Studio route. It does not create a public draft URL and does not weaken RLS.
- Publishing is a dedicated mutation. It validates with the selected template's publication schema, saves dirty content first, then sends a separate status-only `draft → published` update.
- The frontend never writes `first_published_at`; the database trigger sets it on first publication and preserves it during later Studio saves.
- `/profile/:username` performs a published-only Supabase lookup and renders normalized `template_data` directly. It does not read Zustand, localStorage, or the authenticated owner's editor query.
- The dashboard shows the current template, profile publication status, Customize, and Change Template. No-profile users still enter the existing onboarding flow.

### Studio persistence contract

Studio reads the authenticated owner's complete `profiles` row, resolves the selected template's editor configuration, and hydrates Zustand once before rendering the editor. Each template configuration owns its deterministic defaults, schema version, validation schema, editable fields, persisted fields, and any supported dynamic field patterns.

`full_name` and `avatar_url` remain profile-level columns. Template visual/content fields are stored under the active template entry in `template_data`:

```json
{
  "version": 1,
  "templates": {
    "buzz-template": {
      "version": 1,
      "data": {
        "role": "Founder",
        "bio": "..."
      }
    }
  }
}
```

Saving performs one owner-scoped `UPDATE`, checks the database-active `template_id` and loaded `updated_at`, and returns the updated row. This prevents a stale Studio session from silently overwriting a newer save. Only the edited template entry is replaced; entries for other templates are preserved. Normal saves may update `full_name` and `avatar_url`; candidate-template saves update only `template_data`. Save payloads deliberately exclude `status`, `first_published_at`, `lifecycle_status`, `template_id`, ownership, and username.

The previous `studio-editor-storage` localStorage document is no longer read and is removed after successful hydration. Unsaved edits live only in memory. Existing flat `template_data` is loaded as legacy data and normalized on its next successful save. Malformed data falls back to validated defaults; data from a future unsupported document/template version is read-protected and cannot be overwritten.

Studio media is uploaded through one shared service before its value enters persisted editor state. The UI uses a temporary object URL only inside the upload component for immediate feedback, then replaces it with the canonical `profile-media` public URL after Storage succeeds. A failed upload leaves the previously saved value unchanged; `data:` and `blob:` references remain rejected by serialization as a final safety boundary.

`avatar_url` stores the profile-level avatar and continues to accept remote OAuth/provider URLs. Cover, gallery, and custom-section media stay inside the active template's versioned `template_data` entry. Gallery order is the array order. Reordering never deletes an object.

Replacement cleanup is ordered to avoid data loss: upload the new object, save the new database reference, then delete the old owned object. Provider/external URLs are never deleted. Cleanup failure does not roll back a successful profile save and remains a best-effort retry concern. A newly uploaded reference remains in transient Studio state after a failed save so the user can retry; abandoning the page before saving can leave an unreferenced object for a future maintenance job.

### Publication and public rendering

Normal Studio Save and Publish are intentionally separate. Save continues to update content without changing `status`. Publish accepts only an owned draft and updates `{ "status": "published" }` after template validation and any required dirty save. Both operations use the loaded `updated_at` value to surface concurrent-session conflicts.

The public profile query filters by both `username` and `status = 'published'`, even for an authenticated owner. This ensures a draft behaves exactly like a missing profile on the public route. The selected template is resolved through the same editor registry and hydrated with the same version/default/validation parser used by Studio; malformed saved content receives a safe default fallback, while an unknown or future template version shows an unavailable state.

### Template switching

`/templates` is the shared selection entry point for the dashboard and catalogue. Logged-out selections survive authentication through a safe internal `returnTo`; authenticated users without a profile continue onboarding with the selected registry ID. Existing owners enter Studio at `/profile/:username/edit?template={candidateId}`. The query parameter is validated against both the catalogue and editor registry and is never treated as persisted state.

Switch-mode hydration reads `template_data.templates[candidateId]` when present or uses that template's deterministic defaults. Profile-level name/avatar remain shared and read-only during candidate editing. Candidate Save validates and replaces only its own versioned entry, preserving the database-active `template_id`, the public rendering, and all inactive entries. Candidate Preview renders transient Studio data inside the protected editor.

Apply Template first saves the candidate entry, then performs a second owner-scoped update containing only `{ "template_id": candidateId }`. Both phases check the expected active template and `updated_at`; a conflict or failure leaves the previous template active, while a successfully saved candidate remains available for retry. Applying preserves the profile ID, `status`, `first_published_at`, `lifecycle_status`, and all template entries. Cancel returns to the canonical active-template Studio route without deleting saved candidate data.

---

## 12. Immediate next steps

1. **Storage maintenance:** add a scheduled cleanup process for old unreferenced `profile-media` objects after a conservative retention window.
2. **Finish Facebook OAuth** and extend the remaining infrastructure coverage listed in §9.
