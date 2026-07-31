# AGENTS.md

This repository is a React + Vite front end for BuzzCard Studio, with Supabase as the backend/auth/data layer and TanStack Query + Zustand for data and UI state. Use this file as the short, repo-specific guide for AI coding agents.

## Core project facts

- App entry: `src/main.jsx`
- Routing: `src/app/AppRouter.jsx` and route modules under `src/app/routes/`
- Feature layout: `src/features/*` for auth, marketing, onboarding, products, and public-profile flows
- Shared client setup: `src/lib/supabase.js`
- Global auth synchronization: `src/features/auth/components/AuthProvider.jsx` + `src/features/auth/store/useAuthStore.js`

## Working conventions

- Prefer the existing folder structure over introducing new top-level patterns.
- Keep frontend changes in JavaScript/React; this repo is intentionally not TypeScript-based.
- Use the `@` alias to import from `src/` (configured in `vite.config.js`).
- When touching auth or Supabase behavior, follow the product rules in the docs rather than inventing new conventions.
- Avoid duplicating documentation; if a behavior is described in `docs/*`, link to it and keep the change focused.

## Build and test commands

Run these from the repository root:

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npm run test:infra` — integration smoke tests against Supabase

## Architecture notes

- The product is a public-profile/customer-card platform, with authentication as a gateway for checkout and dashboard access.
- The docs are the source of truth for product intent and backend decisions:
  - [docs/project-context.md](docs/project-context.md)
  - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
  - [docs/SUPABASE_BACKEND.md](docs/SUPABASE_BACKEND.md)
- Important implementation guardrails:
  - Supabase env vars are read from `.env.local` or `.env.test.local` by the frontend client.
  - The test suite in [tests/supabase-infra.test.js](tests/supabase-infra.test.js) talks to the live Supabase project and should not be mocked.
  - Auth state is synchronized through a global provider/store rather than ad hoc component-level state.

## Template architecture

- Treat each premium design as its own engineered React component, not as a generic JSON-driven renderer.
- Use a shared template contract and adapter layer so templates consume a frontend view model instead of coupling directly to Supabase table shapes.
- Keep template-specific visual logic in dedicated template modules; do not add a huge conditional `UniversalTemplate` switch for every layout.
- Prefer a template registry that maps template IDs to metadata, controls, and the selected React component.
- Keep the editor preview and the public profile on the same template component implementation to avoid visual drift.
- Follow the existing state ownership split:
  - Zustand: current editor values, unsaved state, template selection, template options, editor UI state
  - TanStack Query: server profile/template metadata and persistence mutations
  - Supabase: final persisted data source
- When adding new template work, stay component-based and keep the template contract stable across category types such as personal, review card, and bracelet.

## Helpful guidance for agents

- Before changing routing, auth, or profile behavior, check the relevant feature folder and the linked docs.
- If a task touches database permissions, storage, or OAuth, treat [docs/SUPABASE_BACKEND.md](docs/SUPABASE_BACKEND.md) as authoritative.
- Keep changes minimal and aligned with the current React Router + Vite architecture; do not reintroduce Next.js or TypeScript unless the docs explicitly call for it.
- For new UI work, prefer existing feature/component organization in `src/features/` and `src/components/ui/` rather than creating a parallel structure.

## Recommended next customizations

If you want to make agent assistance even more effective in this repo, the next useful additions would be:

1. A frontend-focused instructions file for route/component conventions.
2. A Supabase-specific agent guide that captures table and RLS expectations.
3. A test-specific prompt for integration and infra coverage.
