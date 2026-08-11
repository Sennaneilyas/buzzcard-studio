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

- **Implementation**: We will add a single `template_data` column of type `JSONB` to the existing Supabase `profiles` table.
- **Benefits**: This allows us to store the entire template state (rooms, custom sections, gallery links) in a single, ultra-fast query.

## 4. State Management (Performance First)
We will maintain 60fps performance during editing by separating the draft state from the server state:
- **Zustand (`useEditorStore`)**: Holds the live draft state in memory. As the user types, Zustand updates the preview instantly without triggering network requests.
- **TanStack Query**: Handles the actual persistence when the user clicks "Save". It takes the Zustand JSON state and fires a single, optimized `UPDATE` to Supabase.
- **Supabase Storage**: Image uploads (e.g., Gallery, limited to 7 items max) will be uploaded to a Supabase bucket first. The resulting public URLs are then saved into the Zustand state.

## 5. Global Notifications & Feedback
- We will integrate **Shadcn UI's `sonner`** component.
- `sonner` will act as the universal, premium toast notification system across the Studio (handling "Profile saved", "Image uploaded", and error states).

## 6. Onboarding Integration
The transition from a new user to a published profile will flow seamlessly:
1. **Basic Onboarding**: Fast and minimal (Name, Logo, Phone, Email, 2 Core Socials).
2. **Completion**: Upon finishing the basic steps, a premium Bottom Popup appears with a success animation.
3. **Branching Choice**: The user is given two choices:
   - **"Preview"**: View their live public profile immediately.
   - **"Edit Mode"**: Enter the Split-View Studio to add rich content (gallery images, dynamic sections, theme tweaks).

---
*Note: This architecture prioritizes a lean tech stack. We rely solely on Zustand, React Query, Supabase, and Framer Motion, avoiding unnecessary heavy libraries or complex relational database migrations.*
