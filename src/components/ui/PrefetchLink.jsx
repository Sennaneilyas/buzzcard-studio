import { Link } from "react-router-dom";
import { prefetchRoute } from "@/lib/prefetch";

/**
 * PrefetchLink
 *
 * Enhanced version of React Router's Link that automatically triggers
 * `prefetchRoute` on mouse enter or focus, loading the target JS chunk
 * in the ~200ms window before the user completes the click.
 */
export default function PrefetchLink({
  to,
  children,
  onMouseEnter,
  onFocus,
  ...props
}) {
  const handleMouseEnter = (e) => {
    prefetchRoute(typeof to === "string" ? to : to?.pathname);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleFocus = (e) => {
    prefetchRoute(typeof to === "string" ? to : to?.pathname);
    if (onFocus) onFocus(e);
  };

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Link>
  );
}
