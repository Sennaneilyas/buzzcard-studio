import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageUploadZone({ 
  value, 
  onChange, 
  label = "Upload Image", 
  aspectRatio = "square",
  className 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Check if it's an image
    if (!file.type.startsWith("image/")) return;
    
    // Convert to Base64 Data URL for instant preview (simulating upload)
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const aspectRatioClass = aspectRatio === "square" ? "aspect-square" : "aspect-video";

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      
      <div 
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "w-full rounded-none border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-colors relative overflow-hidden group",
          aspectRatioClass,
          isDragging ? "border-gray-900 bg-gray-50" : "border-gray-300 bg-gray-50 hover:border-gray-400",
          value ? "border-solid border-gray-200" : ""
        )}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />

        {value ? (
          <>
            <img src={value} alt="Uploaded preview" className="w-full h-full object-cover absolute inset-0" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
            </div>
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-white text-red-500 flex items-center justify-center shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">Click or drag image</span>
            <span className="text-[11px] font-medium mt-1">SVG, PNG, JPG</span>
          </div>
        )}
      </div>
    </div>
  );
}
