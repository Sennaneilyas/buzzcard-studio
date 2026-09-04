import { GLASS_SHADOW, GLASS_BORDER } from "../../utils/constants";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import PreviewEditRegion from "@/features/editor/contextual/PreviewEditRegion";

/**
 * "À propos" bio card.
 */
export default function DescriptionSection({
  description,
  isEditMode,
  contextualEditing = false,
  activeEditTarget,
  onEditTargetSelect,
}) {
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const inlineEditing = isEditMode && !contextualEditing;

  if (!description && !isEditMode) return null;

  return (
    <PreviewEditRegion
      as="section"
      targetId="bio"
      label="About"
      isEditMode={contextualEditing}
      isActive={activeEditTarget === "bio"}
      onSelect={onEditTargetSelect}
      className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-[18px] pt-[14px] pb-[18px]`}
      aria-labelledby="description-title"
    >
      <h2
        id="description-title"
        className="relative z-[2] font-bold italic text-neutral-950 text-base text-center leading-normal mb-[10px] [font-family:'Georgia',serif]"
      >
        À propos
      </h2>

      <EditableText
        as="p"
        value={description || ""}
        onChange={(val) => setProfileData({ bio: val })}
        isEditMode={inlineEditing}
        placeholder="Add a bio..."
        className="relative z-[2] text-neutral-950 text-sm leading-5 whitespace-pre-wrap"
      />
    </PreviewEditRegion>
  );
}
