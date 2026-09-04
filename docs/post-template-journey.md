# Post-Template Journey: Studio Edit Mode & Architecture

This document outlines the architectural roadmap and UX flow for the BuzzCard Studio **after** the core template designs (like the Hotel Template) are finalized. It serves as our blueprint for the "Edit Mode" and database integration, strictly adhering to our "Optimization-friendly, No-bloat" project rule.

## 1. The "Split View" Studio Architecture (UX/UI)
The core editing experience will use a highly responsive **Left/Right Split View**:
- **Left Sidebar**: The control panel containing form fields, image uploaders (dropzones), and section managers.
- **Right Area**: A live, scaled-down (or responsive) interactive preview of the selected template.
- **Bi-directional Interactivity**: Editing a field on the left instantly updates the right. Clicking an element on the live preview (right) automatically scrolls the left sidebar to the corresponding input field, providing an intuitive, point-and-click experience without cluttering the template code with inline editors.

## 2. Dynamic Content Sections
Users will not be restricted to hardcoded sections (e.g., only "Rooms").
- **Flexible Data**: Users can add generic card-based elements to a section and name it whatever they want (e.g., "Night Events", "Gym", "Menu").
- **UI Implementation**: The sidebar will feature an "Add New Item" button for these dynamic sections, allowing users to upload an image, title, and description. The template will blindly and beautifully render these as premium cards.

## 3. Database Strategy: The "One Box" JSONB Approach
To keep the database lean, fast, and completely flexible across wildly different template types (Hotel vs. Personal vs. Restaurant), we will **avoid** creating dozens of relational tables (`profile_rooms`, `profile_events`, etc.).

- **Implementation**: The Supabase `profiles` table has a versioned `template_data` JSONB document with an isolated entry for each template. Saving the active template preserves every other entry.
- **Ownership split**: Shared identity fields such as `full_name` and `avatar_url` remain normal profile columns. Layout-specific content stays inside the selected template entry.
- **Benefits**: This stores template state (rooms, custom sections, gallery links) in a single query while allowing template contracts to evolve independently.

## 4. State Management (Performance First)
We will maintain 60fps performance during editing by separating the draft state from the server state:
- **Zustand (`useEditorStore`)**: Holds the live draft state in memory. As the user types, Zustand updates the preview instantly without triggering network requests.
- **TanStack Query**: Handles persistence when the user clicks "Save". It sends one validated, owner-scoped `UPDATE`, refreshes the cached profile from the returned row, and clears dirty state only after success.
- **Supabase**: Is the authoritative saved source. Studio hydrates from the profile before rendering; the old localStorage editor document is not read.
- **Supabase Storage**: Image uploads remain the next media milestone. Until then, browser-local `data:` or `blob:` preview values are rejected at save time instead of being written into JSONB.

## 5. Global Notifications & Feedback
- We will integrate **Shadcn UI's `sonner`** component.
- `sonner` will act as the universal, premium toast notification system across the Studio (handling "Profile saved", "Image uploaded", and error states).

## 6. Onboarding Integration
An authenticated account may exist without a profile. First-time setup now collects only a display name, optional profile label/avatar URL, and a template. Confirming the template inserts the user's single `draft` profile before opening Studio; skipping setup leaves the account without a profile.

Supabase is authoritative for the `no profile` / `draft` / `published` state and saved template content. Zustand is retained only for hydrated live values and unsaved changes; image uploads remain a separate Storage milestone.

## 7. Preview, Publication, and Public Profiles

- **Draft preview** stays inside authenticated Studio and renders the current live editor document, including unsaved values. Drafts are never exposed through the public URL.
- **Publish Profile** validates the selected template, saves valid dirty content first, and then performs a separate status-only update. The database owns `first_published_at`.
- **Public profiles** load by `profiles.username` with an explicit `status = 'published'` filter, normalize the selected versioned template entry, and render without Zustand or localStorage.
- **Published edits** use the normal Save action and become live immediately without republishing; publication and commercial lifecycle fields remain unchanged.

---
*Note: This architecture prioritizes a lean tech stack. We rely solely on Zustand, React Query, Supabase, and Framer Motion, avoiding unnecessary heavy libraries or complex relational database migrations.*
