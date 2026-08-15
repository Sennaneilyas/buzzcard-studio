/**
 * Prev/next chevron button overlaid on the photo-stack gallery.
 */
export default function GalleryArrow({ direction, onClick }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Image précédente" : "Image suivante"}
      className={`absolute top-1/2 -translate-y-1/2 ${
        isPrev ? "left-[10px]" : "right-[10px]"
      } z-20 w-[30px] h-[30px] rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-neutral-800"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path
          d={isPrev ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
