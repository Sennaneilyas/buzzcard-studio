import React, { Suspense, useMemo } from "react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { TEMPLATE_LOADERS } from "@/lib/prefetch";

/**
 * Cache of initialized React.lazy components to prevent recreating them on each render.
 */
const lazyComponentCache = new Map();

function getLazyTemplate(templateId) {
  const targetId = TEMPLATE_LOADERS[templateId] ? templateId : "buzz-template";

  if (!lazyComponentCache.has(targetId)) {
    const loader = TEMPLATE_LOADERS[targetId];
    lazyComponentCache.set(targetId, React.lazy(loader));
  }

  return lazyComponentCache.get(targetId);
}

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
  const TemplateComponent = useMemo(() => getLazyTemplate(templateId), [templateId]);

  const appearanceStyles = useMemo(() => {
    const styles = {};
    if (profileData?.appearance?.themeColor) {
      styles["--primary-color"] = profileData.appearance.themeColor;
      styles["--hotel-cappuccino"] = profileData.appearance.themeColor;
    }
    if (profileData?.appearance?.font) {
      styles["fontFamily"] = profileData.appearance.font;
    }
    return styles;
  }, [profileData?.appearance?.themeColor, profileData?.appearance?.font]);

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

export default React.memo(TemplateRegistry);
