# Forms & Notifications Strategy

**Decided on**: 2026-08-14

To maintain our "Lean & Fast Architecture" while delivering a premium, luxurious user experience in the BuzzCard Studio Edit Mode, we will adopt the following libraries:

### 1. Notifications: Sonner
- **Why**: Extremely lightweight, highly customizable, and natively supports swipe-to-dismiss.
- **Vibe**: Buttery smooth, stacking notifications that match our glassmorphism aesthetic out of the box. Used by Vercel and other premium apps.

### 2. Form State & Validation: react-hook-form + zod
- **Why**: 
  - `react-hook-form`: Optimized for performance. Prevents full-component re-renders on keystrokes by utilizing refs. Essential for a complex Editor dashboard.
  - `zod`: Clean, declarative schema validation. Easily integrates with `react-hook-form` to block invalid submissions.

*These will be installed and implemented when we build the Edit Mode layer.*
