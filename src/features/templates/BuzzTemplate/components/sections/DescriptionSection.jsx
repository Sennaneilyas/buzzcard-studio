import { GLASS_SHADOW, GLASS_BORDER } from "../../utils/constants";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

/**
 * "À propos" bio card.
 */
export default function DescriptionSection({ description, isEditMode }) {
  const setProfileData = useEditorStore((s) => s.setProfileData);

  if (!description && !isEditMode) return null;

  return (
    <section
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
        isEditMode={isEditMode}
        placeholder="Add a bio..."
        className="relative z-[2] text-neutral-950 text-sm leading-5 whitespace-pre-wrap"
      />
    </section>
  );
}
