import {
  getBuzzCardPreviewPath,
  getBuzzCardPreviewUrl,
} from "../api/cardPreviews";

export default function CustomBuzzCardPreview({
  color,
  side,
  name = "",
  profession = "",
  logoUrl = "",
  imageClassName = "",
  onImageLoad,
  onImageError,
}) {
  const isBlack = color !== "white";
  const isBack = side === "back";
  const selection = {
    variant: "custom",
    color: isBlack ? "black" : "white",
    side: isBack ? "back" : "front",
  };
  const basePreviewPath = getBuzzCardPreviewPath(selection);
  const basePreviewUrl = getBuzzCardPreviewUrl(selection);

  const handleImageError = (event) => {
    if (import.meta.env.DEV) {
      console.warn("Custom BuzzCard base image failed to load", {
        color: selection.color,
        path: basePreviewPath,
        publicUrl: basePreviewUrl,
      });
    }
    onImageError?.(event);
  };

  return (
    <div className="relative size-full [container-type:inline-size]">
      <img
        src={basePreviewUrl}
        alt={`Custom BuzzCard in ${isBlack ? "black" : "white"}, ${isBack ? "back" : "front"} side`}
        className={`absolute inset-0 z-0 size-full object-contain ${imageClassName}`}
        onLoad={onImageLoad}
        onError={handleImageError}
      />

      {!isBack && (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          {logoUrl && (
            <div className="absolute left-[36%] top-[18%] flex h-[42%] w-[28%] items-center justify-center">
              <img
                src={logoUrl}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <div className={`absolute bottom-[12%] left-[6%] max-w-[58%] ${isBlack ? "text-white" : "text-black"}`}>
            <p className="truncate font-heading text-[4.8cqw] font-bold uppercase leading-none tracking-[0.02em] lg:text-[5cqw]">
              {name || ""}
            </p>
            <p className="mt-[1.2cqw] truncate font-inter text-[3.69cqw] font-light italic leading-none">
              {profession || ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
