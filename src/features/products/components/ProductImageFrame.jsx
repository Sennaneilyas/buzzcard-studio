import { ImageOff } from "lucide-react";

export default function ProductImageFrame({
  src,
  alt,
  className = "",
  imageClassName = "",
  loading,
}) {
  return (
    <div
      className={`relative aspect-square overflow-hidden bg-cloud ${className}`}
      data-product-image-frame=""
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width="1200"
          height="1200"
          loading={loading}
          className={`size-full object-cover object-center ${imageClassName}`}
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-ink/25" role="img" aria-label={alt || "Image unavailable"}>
          <ImageOff className="size-8" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
