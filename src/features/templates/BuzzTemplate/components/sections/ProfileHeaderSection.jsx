import { GLASS_SHADOW } from "../../utils/constants";

/**
 * Cover image header with an optional italic quote banner overlaid at the top.
 */
export default function ProfileHeaderSection({ coverImage, quote }) {
  return (
    <header
      className="relative w-full h-[26vh] min-h-[170px] max-h-[260px] shrink-0 bg-cover bg-center rounded-b-[40px] overflow-hidden bg-neutral-200"
      style={{ backgroundImage: coverImage ? `url(${coverImage})` : "none" }}
      role="img"
      aria-label="Photo de couverture"
    >
      {quote && (
        <div
          className={`absolute top-0 inset-x-0 min-h-[47px] bg-white/10 backdrop-blur-md ${GLASS_SHADOW} flex items-center justify-center px-6 py-2 rounded-b-[25px]`}
        >
          <p className="text-[#0A0A0A] text-sm font-bold italic text-center leading-normal font-serif line-clamp-2">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </header>
  );
}
