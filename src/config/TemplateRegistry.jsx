import React, { Suspense } from "react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

// Lazy-load all available template components
const BuzzTemplate = React.lazy(() => import("@/features/templates/BuzzTemplate/BuzzTemplate"));
const DoctorTemplate = React.lazy(() => import("@/features/templates/doctor-template/DoctorTemplate"));
const CoiffeurTemplate = React.lazy(() => import("@/features/templates/coiffeur-template/CoiffeurTemplate"));
const HotelTemplate = React.lazy(() => import("@/features/templates/hotel-template/HotelTemplate"));

/**
 * Maps template IDs to their React Component implementations.
 */
const TEMPLATE_COMPONENTS = {
  "buzz-template": BuzzTemplate,
  "doctor-template": DoctorTemplate,
  "coiffeur-template": CoiffeurTemplate,
  "hotel-template": HotelTemplate,
};

/**
 * TemplateRegistry dynamically renders the correct template component based on the provided templateId.
 * It passes all profile data directly to the template as props.
 */
export default function TemplateRegistry({ templateId, profileData = {}, isEditMode = false, onPreviewClick }) {
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS["buzz-template"]; // Fallback

  const appearanceStyles = {};
  if (profileData?.appearance?.themeColor) {
    appearanceStyles["--primary-color"] = profileData.appearance.themeColor;
    appearanceStyles["--hotel-cappuccino"] = profileData.appearance.themeColor;
  }
  if (profileData?.appearance?.font) {
    appearanceStyles["fontFamily"] = profileData.appearance.font;
  }

  return (
    <div style={appearanceStyles} className="w-full h-full">
      <Suspense fallback={<GlobalLoader className="bg-white/80 backdrop-blur-sm" />}>
        <TemplateComponent profile={profileData} profileData={profileData} isEditMode={isEditMode} onPreviewClick={onPreviewClick} />
      </Suspense>
    </div>
  );
}
