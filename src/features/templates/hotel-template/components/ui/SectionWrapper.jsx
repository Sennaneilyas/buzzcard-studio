import { cn } from "@/lib/utils";

/**
 * A standard wrapper for all sections in the Hotel Template.
 * Enforces consistent vertical padding, margins, and lazy loading.
 */
export function SectionWrapper({ children, className, id, fullWidth = false }) {
  return (
    <section 
      id={id} 
      className={cn(
        "py-14 hotel-lazy-section relative z-10", // Standard vertical padding and lazy loading class
        !fullWidth && "px-6", // Respect margins and text spacing from borders
        className
      )}
    >
      {/* If the section needs standard side padding, we can wrap the inner content, but since some sections need full bleed (like scroll snaps), we apply px-6 conditionally or manually on the children where needed.
          Actually, the most standard approach is to let the wrapper handle vertical space, 
          and let the caller handle horizontal padding if it has full-bleed elements. */}
      {children}
    </section>
  );
}
