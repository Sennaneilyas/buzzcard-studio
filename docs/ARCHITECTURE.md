# BuzzCard Architecture & UX Decision Report

Based on your vision to streamline the checkout process into a slide-out panel, enforce authentication across all tiers, and create a stepped profile creation wizard, I have designed a comprehensive architectural plan. 

This report covers three critical layers: the **UX Journey**, **Data Fetching/Caching (TanStack)**, and **React Component Optimization**.

---

## 1. Full User Journey & UX Architecture

Your idea to minimize page loads and keep the user in context is exactly how modern, high-converting SaaS platforms are built. Here is the defined workflow:

### A. The "Always Logged-In" Gateway
Since both the free-trial and premium physical card purchases require an account, **Authentication is the gateway**. 
- **Decision:** We implement an OAuth (Google/LinkedIn) or Magic Link modal. 
- **UX Impact:** Users don't feel "blocked" by a heavy registration form. We capture their email instantly, allowing us to remarket to them if they abandon the checkout.

### B. The Slide-Out Checkout (Right-Side Drawer)
- **Decision:** Instead of routing to `/checkout`, clicking "Get Product" opens a global **Slide-Out Drawer** (using Shadcn's `Sheet` component).
- **UX Impact:** End-to-end purchasing happens over the current page. The user can review their cart, enter shipping details, and process payment securely without a jarring page reload.

### C. The Profile Wizard (Stepped UI)
After checkout (or upon starting a free trial), the user enters the Profile Wizard.
- **Decision:** A multi-step form chunked logically:
  1. **Personal Data:** Auto-filled using data from their Auth/Checkout session.
  2. **Activity & Socials:** Role, company, and social links.
  3. **Template Selection:** Premium users see all templates unlocked. Free-trial users see premium templates grayed out with an "Upgrade" badge.
- **UX Impact:** Stepped forms significantly reduce cognitive overload and drastically improve completion rates compared to single long scrolling pages.

### D. Subdomain Routing & The Public Profile
- **Decision:** Once finished, they are instantly redirected to `username.buzzcard.ma`. 
- **UX Impact:** The public profile renders the chosen template. We inject a **Floating Action Button (FAB)** that is *only* visible to the authenticated owner. Clicking it opens a modal to quickly edit info or swap templates on the fly.
- **QR Code:** The system automatically generates a QR code pointing to this exact subdomain, available for download in their dashboard or printed on their physical card.

---

## 2. Integration of TanStack & Caching

To make this complex flow feel instantaneous, we must separate our state into two distinct layers: **Server State** and **Client State**.

### A. Server State (TanStack Query)
- **Decision:** Use TanStack Query (React Query) for all database interactions (User Profile, Order Status, Template Lists).
- **Why it matters:** 
  - **Optimistic Updates:** When a user edits their profile from their subdomain, TanStack will instantly update the UI *before* the server responds. It feels butter-smooth.
  - **Caching:** If they toggle between templates, the data is cached. No loading spinners.

### B. Client UI State (Zustand)
- **Decision:** Use Zustand for transient UI state.
- **Why it matters:** We need a global state to track `isCheckoutDrawerOpen`, `cartItems`, and `currentWizardStep`. Zustand is lightweight and avoids the massive boilerplate of Redux.

### C. Advanced Loading UX (Skeletons & Brand Logo)
- **Decision:** Generic loading spinners will be strictly avoided. Instead, we will implement two primary loading states:
  1. **Component-Level Shimmer Skeletons:** When fetching data via TanStack Query (e.g., loading the template grid or profile data), we will display high-fidelity skeleton loaders that mimic the final UI layout to reduce perceived wait times.
  2. **Global Brand Logo Loader:** For critical full-page blocking operations (e.g., initial auth checks or heavy route transitions), we will use a custom animated SVG of the BuzzCard brand logo.
- **Why it matters:** This elevates the platform's perceived performance and reinforces brand identity, making the app feel premium even during network delays.

---

## 3. React Component Optimization

With slide-outs, stepped wizards, and heavy templates, the React tree can get bloated. We will enforce strict optimization rules.

### A. Lazy Loading Templates (Dynamic Imports)
- **Decision:** Use React's `lazy()` and `Suspense` for the templates. 
- **Why it matters:** If a user selects "Template A", the browser should *only* download the CSS and JS for Template A. It should not download the code for all 20 other templates. This guarantees lightning-fast load times for the public `username.buzzcard.ma` profiles.

### B. Uncontrolled Forms (React-Hook-Form)
- **Decision:** The multi-step Profile Wizard will be built using `react-hook-form` paired with `zod` for validation.
- **Why it matters:** Standard React forms re-render the entire component on every single keystroke. `react-hook-form` isolates re-renders, meaning typing in a heavy form won't cause the wizard UI to lag or stutter.

### C. Conditionally Mounted Drawers
- **Decision:** The Checkout Drawer will be placed in the root layout, but its heavy contents (like the Stripe payment iframe) will be conditionally mounted (`if (isOpen) render()`).
- **Why it matters:** We don't want to load third-party payment scripts on the homepage unless the user actually opens the checkout drawer.
