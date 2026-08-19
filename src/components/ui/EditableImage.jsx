import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

export default function EditableImage({
  src,
  onChange,
  isEditMode,
  className,
  alt = "Image",
  fallbackIcon: FallbackIcon,
  containerClassName,
}) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (isEditMode && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden w-full h-full", 
        isEditMode && "cursor-pointer group hover:ring-2 hover:ring-blue-500/50 transition-all",
        containerClassName
      )}
      onClick={handleClick}
    >
      {src ? (
        <img src={src} alt={alt} className={cn("w-full h-full object-cover", className)} />
      ) : (
        <div className={cn("w-full h-full bg-gray-100 flex items-center justify-center text-gray-400", className)}>
          {FallbackIcon ? <FallbackIcon className="w-1/3 h-1/3 opacity-50" /> : <Camera className="w-1/3 h-1/3 opacity-50" />}
        </div>
      )}

      {isEditMode && (
        <>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
