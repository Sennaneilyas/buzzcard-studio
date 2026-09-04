import { useEffect, useRef, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileMedia } from "@/features/editor/media/useProfileMedia";

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp";

export default function ImageUploadZone({
  value,
  onChange,
  label = "Upload Image",
  aspectRatio = "square",
  className,
  multiple = false,
  maxFiles = Infinity,
  category,
  maxMegabytes = 5,
}) {
  const media = useProfileMedia();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(
    () => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)),
    [previewUrls],
  );

  const processFiles = async (incomingFiles) => {
    const files = Array.from(incomingFiles || []).slice(0, maxFiles);
    if (files.length === 0 || isUploading) return;

    const localPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(localPreviews);
    setErrorMessage("");
    setIsUploading(true);

    try {
      if (!media) throw new Error("Image uploads are unavailable in this preview.");

      if (multiple) {
        const results = await Promise.allSettled(
          files.map((file) => media.uploadReplacement({ file, category })),
        );
        const uploadedUrls = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
        const failed = results.find((result) => result.status === "rejected");

        if (uploadedUrls.length > 0) onChange(uploadedUrls);
        if (failed) throw failed.reason;
      } else {
        const uploadedUrl = await media.uploadReplacement({
          file: files[0],
          category,
          currentValue: value,
        });
        onChange(uploadedUrl);
      }
    } catch (error) {
      setErrorMessage(error.message || "The image could not be uploaded.");
    } finally {
      setIsUploading(false);
      setPreviewUrls([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    void processFiles(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    void processFiles(event.dataTransfer.files);
  };

  const removeImage = (event) => {
    event.stopPropagation();
    media?.stageRemoval(value);
    onChange("");
    setErrorMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const aspectRatioClass =
    aspectRatio === "square" ? "aspect-square" : "aspect-video";
  const displayedPreview = previewUrls[0] || value;

  return (
    <div className={cn("w-full", className)}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </label>

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-none border-2 border-dashed bg-gray-50 p-4 transition-colors",
          aspectRatioClass,
          isDragging
            ? "border-gray-900"
            : "border-gray-300 hover:border-gray-400",
          displayedPreview && "border-solid border-gray-200",
          isUploading && "cursor-wait",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGES}
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
        />

        {displayedPreview ? (
          <>
            <img
              src={displayedPreview}
              alt="Upload preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Change Image
              </span>
            </div>
            {!multiple && !isUploading && value && (
              <button
                type="button"
                onClick={removeImage}
                aria-label={`Remove ${label}`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white text-red-500 opacity-0 shadow-md transition-colors hover:bg-red-50 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <UploadCloud className="mb-3 h-8 w-8 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">
              Click or drag image
            </span>
            <span className="mt-1 text-[11px] font-medium">
              JPEG, PNG or WebP · max {maxMegabytes} MB
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-white">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs font-bold">Uploading…</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
