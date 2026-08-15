import { useCallback, useState } from "react";

const DRAG_THRESHOLD = 40;

/**
 * Drives the swipeable photo-stack carousel: current active index,
 * next/prev navigation, and drag-to-swipe gesture handling.
 */
export function useGalleryCarousel(itemCount) {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(
    () => setActive((p) => (p + 1) % itemCount),
    [itemCount]
  );

  const handlePrev = useCallback(
    () => setActive((p) => (p - 1 + itemCount) % itemCount),
    [itemCount]
  );

  const handleDragEnd = useCallback(
    (_e, { offset }) => {
      if (offset.x < -DRAG_THRESHOLD) handleNext();
      else if (offset.x > DRAG_THRESHOLD) handlePrev();
    },
    [handleNext, handlePrev]
  );

  return { active, setActive, handleNext, handlePrev, handleDragEnd };
}
