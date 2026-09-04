import { GLASS_SHADOW } from "../../utils/constants";
import EditableImage from "@/components/ui/EditableImage";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { PROFILE_MEDIA_CATEGORIES } from "@/features/editor/media/profileMedia";
import PreviewEditRegion from "@/features/editor/contextual/PreviewEditRegion";

/**
 * Cover image header with an optional italic quote banner overlaid at the top.
 */
export default function ProfileHeaderSection({
  coverImage,
  quote,
  isEditMode,
  contextualEditing = false,
  activeEditTarget,
  onEditTargetSelect,
}) {
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const inlineEditing = isEditMode && !contextualEditing;

  return (
    <header
      className="relative w-full h-[26vh] min-h-[170px] max-h-[260px] shrink-0 rounded-b-[40px] overflow-hidden bg-neutral-200"
      role="banner"
    >
      <PreviewEditRegion
        targetId="cover"
        label="Cover"
        isEditMode={contextualEditing}
        isActive={activeEditTarget === "cover"}
        onSelect={onEditTargetSelect}
        className="absolute inset-0 h-full w-full"
      >
        <EditableImage
          src={coverImage || ""}
          alt="Photo de couverture"
          isEditMode={inlineEditing}
          category={PROFILE_MEDIA_CATEGORIES.COVER}
          onChange={(val) => setProfileData({ bannerUrl: val })}
          containerClassName="absolute inset-0 w-full h-full"
        />
      </PreviewEditRegion>

      {(quote || isEditMode) && (
        <PreviewEditRegion
          targetId="quote"
          label="Quote"
          isEditMode={contextualEditing}
          isActive={activeEditTarget === "quote"}
          onSelect={onEditTargetSelect}
          className={`absolute top-0 inset-x-0 min-h-[47px] bg-black/20 backdrop-blur-sm ${GLASS_SHADOW} flex items-center justify-center px-6 py-2 rounded-b-[25px]`}
        >
          <EditableText
            as="p"
            value={quote || ""}
            onChange={(val) => setProfileData({ quote: val })}
            isEditMode={inlineEditing}
            placeholder="Add your favorite quote..."
            className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm font-bold italic text-center leading-normal font-serif relative z-10 before:content-['“'] after:content-['”']"
          />
        </PreviewEditRegion>
      )}
    </header>
  );
}
