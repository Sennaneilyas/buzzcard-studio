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
        phones: profileData.phone ? [profileData.phone] : rawProfile.phones,
        emails: profileData.email ? [profileData.email] : rawProfile.emails,
      }
    : rawProfile;

  let activeSocials = socials;
  if (profileData?.socials) {
    const rawSocials = profileData.socials;
    const order = profileData.socialOrder || Object.keys(rawSocials);
    activeSocials = order
      .filter(key => rawSocials[key])
      .map(key => ({
        platform: key.charAt(0).toUpperCase() + key.slice(1),
        href: rawSocials[key]
      }));
  }

  const [showQrCode, setShowQrCode] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState("qrcode");
  const shouldReduceMotion = useReducedMotion();

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
          <ProfileHeaderSection coverImage={profile.coverImage || profile.banner_url} quote={profile.quote} isEditMode={isEditMode} />

          <div className="flex flex-col gap-4 px-5 sm:px-6">
            <HeroSection profile={profile} isEditMode={isEditMode} />
            <DescriptionSection
              description={profile.bio || profile.description}
              isEditMode={isEditMode}
            />
            <SocialLinksSection socials={activeSocials} isEditMode={isEditMode} />
            <GallerySection gallery={profile.gallery || gallery} shouldReduceMotion={shouldReduceMotion} isEditMode={isEditMode} />
            {(profile.custom_sections || profileData?.custom_sections || []).map((section) => (
              <DynamicSection key={section.id} section={section} theme="dark" />
            ))}
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
