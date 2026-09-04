import { useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";

import BuzzCardBackground from "./components/ui/BuzzCardBackground";
import ProfileHeaderSection from "./components/sections/ProfileHeaderSection";
import HeroSection from "./components/sections/HeroSection";
import SocialLinksSection from "./components/sections/SocialLinksSection";
import GallerySection from "./components/sections/GallerySection";
import DescriptionSection from "./components/sections/DescriptionSection";
import DynamicSection from "@/components/ui/DynamicSection";
import BottomNav from "./components/ui/BottomNav";
import QrCodeOverlay from "./components/overlays/QrCodeOverlay";
import ReviewOverlay from "./components/overlays/ReviewOverlay";
import PreviewEditRegion from "@/features/editor/contextual/PreviewEditRegion";
import { configuredSocials, editorContactValues } from "@/features/templates/shared/profileActions";

/**
 * Buzz profile template.
 *
 * This component only owns page-level layout and which overlay (QR code /
 * reviews) is open. All visual sections and their own local state live in
 * ./components — see the folder's structure for the breakdown.
 */
export default function BuzzTemplate({
  profile: rawProfile = {},
  profileData,
  socials = [],
  gallery = [],
  reviews = [],
  currentUser = null,
  onQrCode,
  onReview,
  isLoggedIn = false,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview,
  onSubmitReply,
  onUpdateReply,
  onDeleteReply,
  onReportReview,
  isEditMode,
  lockProfileIdentity = false,
  contextualEditing = false,
  activeEditTarget = null,
  onEditTargetSelect,
}) {
  // Merge flat editor store data on top of the profile object so preview updates instantly.
  const profile = profileData
    ? {
        ...rawProfile,
        ...profileData,
        full_name: profileData.name || rawProfile.full_name,
        role: profileData.role || rawProfile.role,
        bio: profileData.bio || rawProfile.bio,
        avatar_url: profileData.avatarUrl || rawProfile.avatar_url,
        banner_url: profileData.bannerUrl || rawProfile.banner_url,
        ...editorContactValues(profileData, rawProfile),
      }
    : rawProfile;

  let activeSocials = socials;
  if (profileData?.socials) {
    const rawSocials = profileData.socials;
    const order = profileData.socialOrder || Object.keys(rawSocials);
    activeSocials = configuredSocials(rawSocials, order);
  }

  const [showQrCode, setShowQrCode] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState("qrcode");
  const shouldReduceMotion = useReducedMotion();
  const customSections = profile.custom_sections || profileData?.custom_sections || [];

  const handleQrCode = useCallback(() => {
    setShowQrCode(true);
    setShowReview(false);
    setActiveTab("qrcode");
    if (onQrCode) onQrCode();
  }, [onQrCode]);

  const closeQrCode = useCallback(() => {
    setShowQrCode(false);
    setActiveTab(null);
  }, []);

  const handleReview = useCallback(() => {
    setShowReview(true);
    setShowQrCode(false);
    setActiveTab("avis");
    if (onReview) onReview();
  }, [onReview]);

  const closeReview = useCallback(() => {
    setShowReview(false);
    setActiveTab(null);
  }, []);

  return (
    <div
      className={`relative w-full min-h-0 overflow-hidden bg-[#f4f5f7] flex flex-col ${
        isEditMode ? "h-full" : "h-[100dvh]"
      }`}
    >
      <BuzzCardBackground />

      <main className="relative z-10 min-h-0 flex-1 w-full mx-auto max-w-[430px] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-4 pb-6">
          <ProfileHeaderSection
            coverImage={profile.coverImage || profile.banner_url}
            quote={profile.quote}
            isEditMode={isEditMode}
            contextualEditing={contextualEditing}
            activeEditTarget={activeEditTarget}
            onEditTargetSelect={onEditTargetSelect}
          />

          <div className="flex flex-col gap-4 px-5 sm:px-6">
            <HeroSection
              profile={profile}
              isEditMode={isEditMode}
              lockProfileIdentity={lockProfileIdentity}
              contextualEditing={contextualEditing}
              activeEditTarget={activeEditTarget}
              onEditTargetSelect={onEditTargetSelect}
            />
            <DescriptionSection
              description={profile.bio || profile.description}
              isEditMode={isEditMode}
              contextualEditing={contextualEditing}
              activeEditTarget={activeEditTarget}
              onEditTargetSelect={onEditTargetSelect}
            />
            <SocialLinksSection
              socials={activeSocials}
              isEditMode={isEditMode}
              contextualEditing={contextualEditing}
              activeEditTarget={activeEditTarget}
              onEditTargetSelect={onEditTargetSelect}
            />
            <GallerySection
              gallery={profile.gallery || gallery}
              shouldReduceMotion={shouldReduceMotion}
              isEditMode={isEditMode}
              contextualEditing={contextualEditing}
              activeEditTarget={activeEditTarget}
              onEditTargetSelect={onEditTargetSelect}
            />
            {customSections.map((section) => (
              <PreviewEditRegion
                key={section.id}
                targetId={`section:${section.id}`}
                label={section.title || "Custom section"}
                isEditMode={contextualEditing}
                isActive={activeEditTarget === `section:${section.id}`}
                onSelect={onEditTargetSelect}
                className="rounded-[18px]"
              >
                <DynamicSection section={section} theme="glass" />
              </PreviewEditRegion>
            ))}
            {contextualEditing && customSections.length === 0 && (
              <PreviewEditRegion
                targetId="sections"
                label="Custom sections"
                isEditMode
                isActive={activeEditTarget === "sections"}
                onSelect={onEditTargetSelect}
                className="flex min-h-24 items-center justify-center rounded-[18px] border border-dashed border-neutral-300 bg-white/60 px-4 text-center text-xs font-semibold text-neutral-500"
              >
                Add a custom section
              </PreviewEditRegion>
            )}
          </div>
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQrCode={handleQrCode}
        onReview={handleReview}
        shouldReduceMotion={shouldReduceMotion}
      />

      <QrCodeOverlay
        open={showQrCode}
        profile={profile}
        onClose={closeQrCode}
        shouldReduceMotion={shouldReduceMotion}
      />

      <ReviewOverlay
        open={showReview}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        profile={profile}
        reviews={reviews}
        onClose={closeReview}
        onSubmitReview={onSubmitReview}
        onUpdateReview={onUpdateReview}
        onDeleteReview={onDeleteReview}
        onSubmitReply={onSubmitReply}
        onUpdateReply={onUpdateReply}
        onDeleteReply={onDeleteReply}
        onReportReview={onReportReview}
        shouldReduceMotion={shouldReduceMotion}
      />
    </div>
  );
}
