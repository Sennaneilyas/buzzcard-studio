import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreviewEditRegion({
  as: Component = "div",
  targetId,
  label,
  isEditMode = false,
  isActive = false,
  onSelect,
  className,
  children,
  ...props
}) {
  if (!isEditMode) {
    return <Component className={className} {...props}>{children}</Component>;
  }

  const selectTarget = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect?.(targetId);
  };

  const handleClickCapture = (event) => {
    const closestEditRegion = event.target.closest?.("[data-editor-target]");
    if (closestEditRegion !== event.currentTarget) return;
    selectTarget(event);
  };

  return (
    <Component
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label}`}
      data-editor-target={targetId}
      onClickCapture={handleClickCapture}
      onKeyDown={(event) => {
        if (
          event.currentTarget === event.target &&
          (event.key === "Enter" || event.key === " ")
        ) {
          selectTarget(event);
        }
      }}
      className={cn(
        "group/editor relative cursor-pointer outline-none transition-shadow",
        "hover:ring-2 hover:ring-blue-500/70 hover:ring-inset focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset",
        isActive && "ring-2 ring-blue-600 ring-inset",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-2 top-2 z-[80] inline-flex min-h-7 items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg transition-opacity",
          isActive
            ? "opacity-100"
            : "opacity-100 md:opacity-0 md:group-hover/editor:opacity-100 md:group-focus-visible/editor:opacity-100",
        )}
      >
        <Pencil className="size-3" />
        {label}
      </span>
    </Component>
  );
}
