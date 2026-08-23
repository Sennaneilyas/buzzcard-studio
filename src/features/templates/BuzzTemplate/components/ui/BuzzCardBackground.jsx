import React from "react";

/**
 * The two decorative Vector SVGs used behind both the main profile page
 * and the review overlay. `fixed` makes them stay put when a scrollable
 * ancestor (like the review overlay) scrolls; omit it for the main page
 * where the SVGs should scroll away with the rest of the layout.
 */
function BuzzCardBackground({ fixed = false }) {
  const positionClass = fixed ? "fixed" : "absolute";

  return (
    <>
      <img
        src="/Vector 1.svg"
        alt=""
        fetchPriority="high"
        decoding="async"
        className={`${positionClass} left-0 top-[12%] w-full h-auto opacity-50 pointer-events-none z-0`}
      />

      <img
        src="/Vector 2.svg"
        alt=""
        loading="lazy"
        decoding="async"
        className={`${positionClass} left-[29%] bottom-0 w-[71%] h-auto opacity-50 pointer-events-none z-0`}
      />
    </>
  );
}

export default React.memo(BuzzCardBackground);
