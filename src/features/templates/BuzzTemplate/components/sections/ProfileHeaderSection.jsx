import { GLASS_SHADOW } from "../../utils/constants";
import EditableImage from "@/components/ui/EditableImage";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

/**
 * Cover image header with an optional italic quote banner overlaid at the top.
 */
export default function ProfileHeaderSection({ coverImage, quote, isEditMode }) {
  const setProfileData = useEditorStore((s) => s.setProfileData);
  return (
    <header
      className="relative w-full h-[26vh] min-h-[170px] max-h-[260px] shrink-0 rounded-b-[40px] overflow-hidden bg-neutral-200"
      role="banner"
    >
      <EditableImage
        src={coverImage || ""}
        alt="Photo de couverture"
        isEditMode={isEditMode}
        onChange={(val) => setProfileData({ bannerUrl: val })}
        containerClassName="absolute inset-0 w-full h-full"
      />

      {(quote || isEditMode) && (
        <div
          className={`absolute top-0 inset-x-0 min-h-[47px] bg-black/20 backdrop-blur-sm ${GLASS_SHADOW} flex items-center justify-center px-6 py-2 rounded-b-[25px]`}
        >
          <EditableText
            as="p"
            value={quote || ""}
            onChange={(val) => setProfileData({ quote: val })}
            isEditMode={isEditMode}
            placeholder="Add your favorite quote..."
            className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm font-bold italic text-center leading-normal font-serif relative z-10 before:content-['“'] after:content-['”']"
          />
        </div>
      )}
    </header>
  );
}
