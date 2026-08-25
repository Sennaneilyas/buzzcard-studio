import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function EditableText({
  value,
  onChange,
  isEditMode,
  as: Component = "p",
  className,
  placeholder = "Edit...",
  ...props
}) {
  const textRef = useRef(null);

  // Initial render content
  useEffect(() => {
    if (textRef.current && isEditMode) {
      if (textRef.current.innerText !== value) {
        textRef.current.innerText = value || "";
      }
    }
  }, [value, isEditMode]);

  const handleBlur = () => {
    if (textRef.current && isEditMode) {
      onChange(textRef.current.innerText);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textRef.current.blur();
    }
  };

  if (!isEditMode) {
    return (
      <Component className={className} {...props}>
        {value}
      </Component>
    );
  }

  return (
    <Component
      ref={textRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={cn(
        "outline-none transition-all rounded-sm hover:ring-2 hover:ring-blue-500/30 focus:ring-2 focus:ring-blue-500 cursor-text",
        (!value || value.length === 0) && "empty:before:content-[attr(data-placeholder)] empty:before:opacity-50 empty:before:pointer-events-none empty:block empty:min-w-[1ch] empty:min-h-[1em]",
        className
      )}
      {...props}
    >
      {value}
    </Component>
  );
}
