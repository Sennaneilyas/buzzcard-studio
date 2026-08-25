import { lazy, memo, Suspense } from "react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { TEMPLATE_LOADERS } from "@/lib/prefetch";

const LAZY_TEMPLATES = Object.fromEntries(
  Object.entries(TEMPLATE_LOADERS).map(([templateId, loader]) => [
    templateId,
    lazy(loader),
  ]),
);

/**
 * TemplateRegistry dynamically renders the correct template component based on the provided templateId.
 * It passes all profile data directly to the template as props.
 */
function TemplateRegistry({
  templateId,
  profileData = {},
  isEditMode = false,
  onPreviewClick,
}) {
  const TemplateComponent =
    LAZY_TEMPLATES[templateId] || LAZY_TEMPLATES["buzz-template"];
  const appearanceStyles = {};

  if (profileData?.appearance?.themeColor) {
    appearanceStyles["--primary-color"] = profileData.appearance.themeColor;
    appearanceStyles["--hotel-cappuccino"] = profileData.appearance.themeColor;
  }
  if (profileData?.appearance?.font) {
    appearanceStyles.fontFamily = profileData.appearance.font;
  }

  return (
    <div style={appearanceStyles} className="w-full h-full">
      <Suspense fallback={<GlobalLoader className="bg-white/80 backdrop-blur-sm" />}>
        <TemplateComponent
          profile={profileData}
          profileData={profileData}
          isEditMode={isEditMode}
          onPreviewClick={onPreviewClick}
        />
      </Suspense>
    </div>
  );
}

export default memo(TemplateRegistry);
