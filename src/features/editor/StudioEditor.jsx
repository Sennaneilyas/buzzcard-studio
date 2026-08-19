import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Layout, Palette, User, Share2, ImageIcon, Plus, Loader2 } from "lucide-react";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import TemplateRegistry from "@/config/TemplateRegistry";
import { getTemplateById } from "@/config/templates";
import { SOCIAL_PLATFORMS } from "@/features/onboarding/steps/StepSocials";
import ImageUploadZone from "@/components/ui/ImageUploadZone";
import { useUpdateProfile } from "@/features/editor/api/useUpdateProfile";

const NAV_ITEMS = [
  { id: "profile", icon: User, label: "Profile Info" },
  { id: "links", icon: Share2, label: "Links & Socials" },
  { id: "sections", icon: Layout, label: "Custom Sections" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "gallery", icon: ImageIcon, label: "Gallery" },
];

export default function StudioEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Zustand Store
  const profileData = useEditorStore((s) => s.profileData);
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const templateId = useEditorStore((s) => s.templateId);

  const activeTemplate = getTemplateById(templateId);
  const allowedFields = activeTemplate?.allowedFields || [];

  const updateProfile = useUpdateProfile();

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSocialChange = (network, value) => {
    setProfileData({ 
      ...profileData,
      socials: { ...(profileData.socials || {}), [network]: value } 
    });
  };

  const handlePublish = () => {
    updateProfile.mutate({
      username: slug, // using slug from URL as username (the schema identifier)
      profileData,
      templateId
    });
  };

  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (item.id === "profile") return true;
    if (item.id === "appearance") return true;
    if (item.id === "links") return !allowedFields.length || allowedFields.includes("socials");
    if (item.id === "gallery") return !allowedFields.length || allowedFields.includes("gallery");
    if (item.id === "sections") return !allowedFields.length || allowedFields.includes("custom_sections");
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#FAFAFA] overflow-hidden font-sans relative">
      {/* ── MOBILE NAV (TOP) ── */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 overflow-x-auto no-scrollbar flex items-center gap-2 px-4 py-3 shrink-0 z-20">
        <button onClick={() => navigate("/")} className="mr-2 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-full whitespace-nowrap shrink-0 border ${
              activeTab === item.id
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* ── LEFT PANE: Sidebar Navigation (DESKTOP) ── */}
      <div className="hidden md:flex w-64 h-full bg-white border-r border-gray-200 flex-col shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold transition-all rounded-none border-l-2 ${
                  isActive
                    ? "bg-gray-50 border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handlePublish}
            disabled={updateProfile.isPending}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-none text-sm font-bold shadow-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateProfile.isPending ? "Publishing..." : "Publish Profile"}
          </button>
        </div>
      </div>

      {/* ── MIDDLE PANE: Editor Form ── */}
      <div className="flex-1 max-w-[500px] h-full bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            {visibleNavItems.find(i => i.id === activeTab)?.label}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">
                  Profile Media
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  {(!allowedFields.length || allowedFields.includes("avatarUrl")) && (
                    <div className="w-full sm:w-1/3">
                      <ImageUploadZone
                        label="Avatar (1:1)"
                        aspectRatio="square"
                        value={profileData.avatarUrl || ""}
                        onChange={(val) => handleInputChange("avatarUrl", val)}
                      />
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("bannerUrl")) && (
                    <div className="w-full sm:w-2/3">
                      <ImageUploadZone
                        label="Cover Banner (16:9)"
                        aspectRatio="video"
                        value={profileData.bannerUrl || ""}
                        onChange={(val) => handleInputChange("bannerUrl", val)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  {(!allowedFields.length || allowedFields.includes("name")) && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your Name"
                        className="w-full h-12 rounded-none bg-gray-50 border border-gray-200 px-4 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("role")) && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Role</label>
                      <input
                        type="text"
                        value={profileData.role || ""}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                        placeholder="E.g. Senior Designer"
                        className="w-full h-12 rounded-none bg-gray-50 border border-gray-200 px-4 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("bio")) && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                      <textarea
                        value={profileData.bio || ""}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        placeholder="Write a short bio about yourself..."
                        className="w-full rounded-none bg-gray-50 border border-gray-200 p-4 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">
                  Contact Details
                </h2>
                <div className="space-y-4">
                  {(!allowedFields.length || allowedFields.includes("email")) && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="hello@example.com"
                        className="w-full h-12 rounded-none bg-gray-50 border border-gray-200 px-4 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("phone")) && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-12 rounded-none bg-gray-50 border border-gray-200 px-4 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-4 text-sm font-bold rounded-none shadow-sm hover:bg-blue-700 transition-all">
                <Plus className="w-5 h-5" />
                Add New Link
              </button>
              <div className="space-y-3 pt-4">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const value = profileData.socials?.[platform.id] || "";
                  return (
                    <div key={platform.id} className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <platform.icon className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => handleSocialChange(platform.id, e.target.value)}
                        placeholder={`${platform.name} URL`}
                        className="w-full h-12 rounded-none bg-gray-50 border border-gray-200 pl-12 pr-4 text-gray-900 font-medium focus:border-gray-900 focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTIONS TAB */}
          {activeTab === "sections" && (
            <div className="flex flex-col items-center justify-center h-40 opacity-50 text-sm font-medium">
              Custom Sections coming soon
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="flex flex-col items-center justify-center h-40 opacity-50 text-sm font-medium">
              Appearance settings coming soon
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="flex flex-col items-center justify-center h-40 opacity-50 text-sm font-medium">
              Gallery management coming soon
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANE: Live Template Preview ── */}
      <div className="flex-1 h-full relative overflow-hidden bg-gray-100 flex flex-col items-center justify-center p-0 md:p-8">
        <div className="w-full h-full md:max-w-[420px] md:max-h-[900px] bg-white md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/5 overflow-hidden relative z-10 flex flex-col transform md:scale-[0.85] lg:scale-[0.95] xl:scale-100 origin-center transition-transform">
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <TemplateRegistry templateId={templateId} profileData={profileData} isEditMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
