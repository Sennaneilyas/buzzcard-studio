# BuzzCard Studio — Project Context

Single source of truth for _what this product is and why the decisions
so far were made_. Supersedes the stack/framework parts of the original
`PROJECT_OVERVIEW.md` (that doc's product overview, data model, and
roadmap sections still hold — only its Next.js-based architecture
section is now out of date).

## 1. What BuzzCard Studio is

A digital business card platform built around physical NFC cards. Each
card holds a static short code (`/c/[code]`). The code maps, server-side,
to a dynamic, editable customer profile. Tapping or scanning the card
shows the live profile — editable anytime, reassignable to a different
card/user without touching hardware. This mechanic is the product; every
architecture decision protects it.

## 2. Current stack decision (superseding earlier Next.js/TS plan)

The project started scoped as Next.js + TypeScript + Supabase. That was
changed deliberately:

- **No TypeScript, no Next.js — plain React (JS) + Vite.** Client
  decision, not a technical dead-end — revisit only if a specific,
  named need for SSR/TS emerges (see §4).
- Full stack, rationale, and optimization posture live in
  `docs/TECH_STACK.md` — that's the authoritative doc for tooling
  decisions. This doc stays product/context-focused.

## 3. Creative direction — where freedom applies and where it doesn't

- **Landing page: full creative freedom.** Explicitly not a Tapni clone
  — Tapni's marketing site was only ever used as structural scaffolding
  (section order), never as a design source. Nothing here constrains the
  visual direction.
- **Customer dashboard / profile-setup flow: inspired by registered-user
  workflows in this product category** (Tapni, Popl, similar) —
  specifically the **live-preview-as-you-type** pattern (edit fields on
  one side, rendered template updates in real time on the other) and a
  **guided first-setup wizard** rather than a blank settings page. This
  applies to `features/profile` and `features/templates`, not marketing.
- **Products Showcase / Store UX:** When a user clicks on a specific product category card on the Landing Page, they must be redirected to a dedicated products page showcasing all categories. This page must use an **Accordion layout** where the specifically requested category is opened by default, and all other categories are rendered but closed.

## 4. Inspiration sources — what to take, what not to

| Source                                                           | What to take                                                                                                                                                                                              | What not to take                                                                                                                    |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Tapni**                                                        | QR-code system: the QR encodes the _same dynamic URL_ as the NFC tap — never raw profile data — so edits sync to both instantly. Confirms the existing static-code/dynamic-profile model needs no change. | Landing page design                                                                                                                 |
| **Popl** (found in place of "Popcard" — see open question below) | Same QR/NFC-sync principle, independently confirmed from a second product in the category                                                                                                                 | —                                                                                                                                   |
| **bipop**                                                        | Real Moroccan vCard/QR platform (bipop.packservice.ma) — template-selection UX and local market-fit reference                                                                                             | Don't assume feature parity is the goal; verify their pattern is actually good UX before copying it, not just "what exists locally" |
| **Refero**                                                       | Design research only (75k+ real product screens) — _not_ a code source                                                                                                                                    | Never pull code from here — see `TECH_STACK.md` §3                                                                                  |

## 5. Open questions (carried forward, not yet resolved)

- **"Popcard" vs "Popl"** — research turned up detailed, well-documented
  info on Popl; nothing under the exact name "Popcard." Likely the same
  reference, but not confirmed. Flag if it's actually a different,
  smaller product.
- **`/c/:code` rendering strategy** — CSR now (matches "no Next.js at
  the beginning"); the SSR/prerendering question for this specific route
  is real and explicitly deferred, not dismissed. Revisit before real
  traffic, not after — this was flagged as the single biggest risk to
  "website perfectness" in the optimization review.
- **React Router version** — no strong reason to pick v6 vs v7 yet;
  defaulting to latest stable unless there's a preference.
- **Admin auth boundary** — current plan is same Supabase project with
  role-based RLS, not a separate auth flow. Holds unless something
  changes that.

## 6. Companion docs

- `docs/FRONTEND_ARCHITECTURE.md` — app shape, folder structure, QR
  generation architecture
- `docs/TECH_STACK.md` — full stack table, optimization posture, design
  tokens/palette, component resources
- `docs/SETUP.md` — local + GitHub setup walkthrough

---

## Next concrete steps

- Confirm or correct the Popcard/Popl question
- Decide the `/c/:code` rendering-strategy timeline explicitly (a date
  or a trigger condition, not just "later")
- Once `features/marketing` scoping starts, this doc's §3 is the
  reference for what's fair game creatively vs what carries a specific
  UX pattern to follow
