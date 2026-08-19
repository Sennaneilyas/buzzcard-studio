import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Layout, Palette, User, Share2, ImageIcon, Plus, Loader2, GripVertical, Trash2 } from "lucide-react";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { Reorder } from "framer-motion";
import TemplateRegistry from "@/config/TemplateRegistry";
import { getTemplateById } from "@/config/templates";
import { SOCIAL_PLATFORMS } from "@/features/onboarding/steps/StepSocials";
import ImageUploadZone from "@/components/ui/ImageUploadZone";
import { useUpdateProfile } from "@/features/editor/api/useUpdateProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import * as z from "zod";

const editorSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  email: z.union([z.literal(""), z.string().email("Invalid email address")]).optional(),
  phone: z.string().optional(),
  socials: z.record(z.union([z.literal(""), z.string().url("Must be a valid URL")])).optional(),
  socialOrder: z.array(z.string()).optional(),
  gallery: z.array(z.string()).max(7, "Maximum 7 images allowed").optional(),
  appearance: z.object({
    themeColor: z.string().optional(),
    font: z.string().optional()
  }).optional(),
  avatarUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

const NAV_ITEMS = [
  { id: "profile", icon: User, label: "Profile Info" },
  { id: "links", icon: Share2, label: "Links & Socials" },
  { id: "sections", icon: Layout, label: "Custom Sections" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "gallery", icon: ImageIcon, label: "Gallery" },
];

const THEME_COLORS = [
  { label: "Noir", value: "#1A1A1A" },
  { label: "Gold", value: "#C5A880" },
  { label: "Steel Blue", value: "#4682b4" },
  { label: "Emerald", value: "#10b981" },
  { label: "Indigo", value: "#6366f1" }
];

const FONTS = [
  { label: "Inter (Modern)", value: "Inter, sans-serif" },
  { label: "Playfair (Elegant)", value: "'Playfair Display', serif" },
  { label: "Outfit (Geometric)", value: "Outfit, sans-serif" },
  { label: "Lora (Classic)", value: "Lora, serif" }
];

export default function StudioEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Zustand Store
  const initialProfileData = useEditorStore((s) => s.profileData);
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const templateId = useEditorStore((s) => s.templateId);

  const { register, watch, setValue, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(editorSchema),
    mode: "onChange",
    defaultValues: initialProfileData
  });

  const currentData = watch();

  // Sync React Hook Form -> Zustand to power Live Preview
  useEffect(() => {
    const subscription = watch((value) => {
      setProfileData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, setProfileData]);

  const activeTemplate = getTemplateById(templateId);
  const allowedFields = activeTemplate?.allowedFields || [];

  const updateProfile = useUpdateProfile();

  const handlePublish = () => {
    if (!isValid) return;
    updateProfile.mutate({
      username: slug, // using slug from URL as username (the schema identifier)
      profileData: currentData,
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
            disabled={updateProfile.isPending || !isValid}
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
                        value={currentData.avatarUrl || ""}
                        onChange={(val) => setValue("avatarUrl", val, { shouldDirty: true })}
                      />
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("bannerUrl")) && (
                    <div className="w-full sm:w-2/3">
                      <ImageUploadZone
                        label="Cover Banner (16:9)"
                        aspectRatio="video"
                        value={currentData.bannerUrl || ""}
                        onChange={(val) => setValue("bannerUrl", val, { shouldDirty: true })}
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
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className={`w-full h-12 rounded-none bg-gray-50 border px-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                          errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("name")}
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.name.message}</p>}
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("role")) && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Role</label>
                      <input
                        type="text"
                        placeholder="E.g. Senior Designer"
                        className={`w-full h-12 rounded-none bg-gray-50 border px-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                          errors.role ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("role")}
                      />
                      {errors.role && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.role.message}</p>}
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("bio")) && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                      <textarea
                        rows={4}
                        placeholder="Write a short bio about yourself..."
                        className={`w-full rounded-none bg-gray-50 border p-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors resize-none ${
                          errors.bio ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("bio")}
                      />
                      {errors.bio && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.bio.message}</p>}
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
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        className={`w-full h-12 rounded-none bg-gray-50 border px-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                          errors.email ? "border-red-300 focus:border-red-500 text-red-900" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("email")}
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.email.message}</p>}
                    </div>
                  )}
                  {(!allowedFields.length || allowedFields.includes("phone")) && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={`w-full h-12 rounded-none bg-gray-50 border px-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                          errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("phone")}
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.phone.message}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {activeTab === "links" && (() => {
            const socials = currentData.socials || {};
            // If no order is defined, derive it from populated values
            let activeSocialIds = currentData.socialOrder;
            if (!activeSocialIds) {
              activeSocialIds = SOCIAL_PLATFORMS.filter(p => socials[p.id]).map(p => p.id);
              // We could setValue("socialOrder", activeSocialIds) here but it might cause render loops if not careful.
            }

            const activePlatforms = activeSocialIds
              .map(id => SOCIAL_PLATFORMS.find(p => p.id === id))
              .filter(Boolean);

            const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !activeSocialIds.includes(p.id));

            return (
              <div className="space-y-8">
                {/* Active Links (Draggable) */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Active Links</h3>
                  {activePlatforms.length === 0 ? (
                    <p className="text-sm text-gray-400 font-medium">No links added yet.</p>
                  ) : (
                    <Reorder.Group 
                      axis="y" 
                      values={activePlatforms} 
                      onReorder={(newOrder) => setValue("socialOrder", newOrder.map(p => p.id), { shouldDirty: true })}
                      className="space-y-3"
                    >
                      {activePlatforms.map((platform) => (
                        <Reorder.Item 
                          key={platform.id} 
                          value={platform}
                          className="flex items-center gap-3 bg-white border border-gray-200 p-2 shadow-sm relative group"
                        >
                          <div className="cursor-grab active:cursor-grabbing p-2 text-gray-300 hover:text-gray-500 transition-colors">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="flex-1 relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <platform.icon className="w-4 h-4" />
                            </div>
                            <input
                              type="url"
                              placeholder={`${platform.name} URL`}
                              className={`w-full h-10 bg-gray-50 border pl-10 pr-3 text-[13px] text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                                errors.socials?.[platform.id] ? "border-red-300 focus:border-red-500 text-red-900" : "border-gray-200 focus:border-gray-900"
                              }`}
                              {...register(`socials.${platform.id}`)}
                            />
                            {errors.socials?.[platform.id] && (
                              <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.socials[platform.id].message}</p>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              setValue(`socials.${platform.id}`, undefined, { shouldDirty: true });
                              setValue("socialOrder", activeSocialIds.filter(id => id !== platform.id), { shouldDirty: true });
                            }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all mr-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>

                {/* Available Links */}
                {availablePlatforms.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Add More Links</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePlatforms.map(platform => (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => {
                            setValue("socialOrder", [...activeSocialIds, platform.id], { shouldDirty: true });
                            setValue(`socials.${platform.id}`, platform.placeholder || "", { shouldDirty: true });
                          }}
                          className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors"
                        >
                          <platform.icon className={`w-4 h-4 ${platform.colorClass}`} />
                          <span className="text-[13px] font-bold text-gray-700">{platform.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* SECTIONS TAB */}
          {activeTab === "sections" && (() => {
            const allowedSections = activeTemplate?.allowedSections || [];
            if (allowedSections.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center h-40 opacity-50 text-sm font-medium">
                  No custom sections available for this template.
                </div>
              );
            }
            return (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Template Sections</h3>
                {allowedSections.map(section => (
                  <div key={section.id} className="bg-white border border-gray-200 p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:border-gray-300 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{section.label}</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Configure {section.label.toLowerCase()} content</p>
                    </div>
                    <button type="button" className="text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Theme Color</h2>
                <div className="flex flex-wrap gap-4">
                  {THEME_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue("appearance.themeColor", color.value, { shouldDirty: true })}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${currentData.appearance?.themeColor === color.value ? "border-gray-900 scale-110 shadow-md" : "border-transparent hover:scale-105"}`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
                {errors.appearance?.themeColor && <p className="text-[10px] text-red-500 font-medium mt-2">{errors.appearance.themeColor.message}</p>}
              </div>

              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Typography</h2>
                <div className="flex flex-col gap-3">
                  {FONTS.map(font => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => setValue("appearance.font", font.value, { shouldDirty: true })}
                      className={`w-full p-4 border text-left transition-all ${currentData.appearance?.font === font.value ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="text-[15px] font-medium text-gray-900">{font.label}</span>
                      <span className="block text-[12px] text-gray-500 mt-1">The quick brown fox jumps over the lazy dog.</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (() => {
            const gallery = currentData.gallery || [];
            const maxImages = 7;
            
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Photos</h3>
                  <span className="text-xs font-medium text-gray-400">{gallery.length} / {maxImages}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-square group rounded-xl overflow-hidden bg-gray-100 border border-black/5 shadow-sm">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = [...gallery];
                            newGallery.splice(idx, 1);
                            setValue("gallery", newGallery, { shouldDirty: true });
                          }}
                          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {gallery.length < maxImages && (
                    <div className="aspect-square">
                      <ImageUploadZone
                        label="Add Photo"
                        aspectRatio="square"
                        value=""
                        onChange={(val) => {
                          if (val) {
                            setValue("gallery", [...gallery, val], { shouldDirty: true });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── RIGHT PANE: Live Template Preview ── */}
      <div className="flex-1 h-full relative overflow-hidden bg-gray-100 flex flex-col items-center justify-center p-0 md:p-8">
        <div className="w-full h-full md:max-w-[420px] md:max-h-[900px] bg-white md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/5 overflow-hidden relative z-10 flex flex-col transform md:scale-[0.85] lg:scale-[0.95] xl:scale-100 origin-center transition-transform">
          <div className="flex-1 h-full overflow-hidden relative">
            <TemplateRegistry templateId={templateId} profileData={currentData} isEditMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
