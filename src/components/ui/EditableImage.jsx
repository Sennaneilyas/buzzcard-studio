import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProfileMedia } from "@/features/editor/media/useProfileMedia";

export default function EditableImage({
  src,
  onChange,
  isEditMode,
  className,
  alt = "Image",
  fallbackIcon: FallbackIcon,
  containerClassName,
  category,
}) {
  const inputRef = useRef(null);
  const media = useProfileMedia();
  const [localPreview, setLocalPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    },
    [localPreview],
  );

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || isUploading) return;

    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setIsUploading(true);

    try {
      if (!media) throw new Error("Image uploads are unavailable in this preview.");
      const uploadedUrl = await media.uploadReplacement({
        file,
        category,
        currentValue: src,
      });
      onChange(uploadedUrl);
    } catch (error) {
      toast.error("Image upload failed", {
        description: error.message || "Your previous image is still saved.",
      });
    } finally {
      setLocalPreview("");
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (isEditMode && !isUploading) inputRef.current?.click();
  };

  const displayedSource = localPreview || src;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        isEditMode &&
          "group cursor-pointer transition-all hover:ring-2 hover:ring-blue-500/50",
        isUploading && "cursor-wait",
        containerClassName,
      )}
      onClick={handleClick}
    >
      {displayedSource ? (
        <img
          src={displayedSource}
          alt={alt}
          className={cn("h-full w-full object-cover", className)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gray-100 text-gray-400",
            className,
          )}
        >
          {FallbackIcon ? (
            <FallbackIcon className="h-1/3 w-1/3 opacity-50" />
          ) : (
            <Camera className="h-1/3 w-1/3 opacity-50" />
          )}
        </div>
      )}

      {isEditMode && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void handleFileChange(event)}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <span className="sr-only">Uploading image</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
