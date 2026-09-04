import { ArrowLeft, Check, Eye, Globe2, Loader2, Rocket, Save, Share2, Layout, ImageIcon, User, GripVertical, Trash2, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import TemplateRegistry from "@/config/TemplateRegistry";
import { SOCIAL_PLATFORMS } from "@/features/onboarding/steps/socialPlatforms";
import ImageUploadZone from "@/components/ui/ImageUploadZone";
import EditableImage from "@/components/ui/EditableImage";
import { PROFILE_MEDIA_CATEGORIES } from "@/features/editor/media/profileMedia";
import SectionCard from "./components/SectionCard";
import ContactFields from "./components/ContactFields";

const NAV_ITEMS = [
  { id: "profile", icon: User, label: "Profile Info" },
  { id: "links", icon: Share2, label: "Links & Socials" },
  { id: "sections", icon: Layout, label: "Custom Sections" },
  { id: "gallery", icon: ImageIcon, label: "Gallery" },
];

export default function ClassicEditorLayout({
  isTemplateSwitchMode,
  currentData,
  register,
  setValue,
  errors,
  allowedFields,
  documentIsDirty,
  isPublished,
  isBusy,
  isSaving,
  isPublishing,
  isApplying,
  isMediaUploading,
  canSave,
  hydrationWarning,
  activeTab,
  setActiveTab,
  handleSave,
  handlePreview,
  handlePublish,
  handleApplyTemplate,
  handleBack,
  customSections,
  addSection,
  removeSection,
  updateSection,
  templateId,
  profileData,
  media,
  showDraftPreview,
  setShowDraftPreview,
}) {
  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (item.id === "profile") return true;
    if (item.id === "links") return !allowedFields.length || allowedFields.includes("socials");
    if (item.id === "gallery") return !allowedFields.length || allowedFields.includes("gallery");
    if (item.id === "sections") return !allowedFields.length || allowedFields.includes("custom_sections");
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#FAFAFA] overflow-hidden font-sans relative">
      {/* ── MOBILE NAV (TOP) ── */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 flex items-center shrink-0 z-30 overflow-x-auto no-scrollbar gap-2 px-4 py-3">
        <button onClick={handleBack} className="mr-2 text-gray-500">
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
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isTemplateSwitchMode ? "Back to current template" : "Back to Home"}
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

        <div className="space-y-2 border-t border-gray-200 p-6">
          <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Profile status</span>
            <span className={isPublished ? "text-emerald-600" : "text-amber-600"}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <button
            type="button"
            onClick={handlePreview}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {isPublished && !isTemplateSwitchMode ? <Globe2 className="size-4" /> : <Eye className="size-4" />}
            {isPublished && !isTemplateSwitchMode ? "View Profile" : "Preview"}
          </button>
          {!isPublished && !isTemplateSwitchMode && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isBusy || isMediaUploading || !canSave}
              className="flex w-full items-center justify-center gap-2 bg-mint px-4 py-3 text-sm font-bold text-navy transition-colors hover:bg-mint/80 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              Publish Profile
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isBusy || isMediaUploading || !documentIsDirty || !canSave}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-none text-sm font-bold shadow-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving
              ? "Saving..."
              : documentIsDirty
                ? "Save Changes"
                : "Saved"}
          </button>
          {isTemplateSwitchMode && (
            <>
              <button
                type="button"
                onClick={handleApplyTemplate}
                disabled={isBusy || isMediaUploading || !canSave}
                className="flex w-full items-center justify-center gap-2 bg-mint px-4 py-3 text-sm font-bold text-navy transition-colors hover:bg-mint/80 disabled:opacity-50"
              >
                {isApplying ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                {isApplying ? "Applying..." : "Apply Template"}
              </button>
              <button
                type="button"
                onClick={handleBack}
                disabled={isBusy}
                className="w-full px-4 py-2 text-xs font-bold text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-50"
              >
                Cancel switch
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MIDDLE PANE: Editor Form ── */}
      <div className="flex-1 max-w-[500px] h-full bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="h-16 flex items-center justify-between gap-3 px-6 border-b border-gray-200 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            {visibleNavItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-bold ${documentIsDirty || isMediaUploading ? "text-amber-600" : "text-emerald-600"}`}>
              {isMediaUploading ? "Uploading image…" : documentIsDirty ? "Unsaved" : isPublished ? "Published" : "Saved"}
            </span>
            <button
              type="button"
              onClick={handlePreview}
              disabled={isBusy}
              aria-label={isPublished && !isTemplateSwitchMode ? "View public profile" : "Preview template"}
              className="inline-flex size-8 items-center justify-center border border-gray-200 bg-white text-gray-700 disabled:opacity-40 md:hidden"
            >
              {isPublished && !isTemplateSwitchMode ? <Globe2 className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
            {!isPublished && !isTemplateSwitchMode && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isBusy || isMediaUploading || !canSave}
                aria-label="Publish profile"
                className="inline-flex size-8 items-center justify-center bg-mint text-navy disabled:opacity-40 md:hidden"
              >
                {isPublishing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Rocket className="size-3.5" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isBusy || isMediaUploading || !documentIsDirty || !canSave}
              className="inline-flex items-center gap-2 bg-gray-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-40 md:hidden"
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save
            </button>
            {isTemplateSwitchMode && (
              <button
                type="button"
                onClick={handleApplyTemplate}
                disabled={isBusy || isMediaUploading || !canSave}
                aria-label="Apply template"
                className="inline-flex size-8 items-center justify-center bg-mint text-navy disabled:opacity-40 md:hidden"
              >
                {isApplying ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar p-6">
          {isTemplateSwitchMode && (
            <div role="status" className="border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900">
              You&apos;re customizing a new template. Your current profile remains unchanged until you apply this template. Profile name and avatar stay shared with your current profile.
            </div>
          )}
          {hydrationWarning && (
            <div
              role="status"
              className={`border px-4 py-3 text-xs leading-relaxed ${
                canSave
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {hydrationWarning}
            </div>
          )}
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Profile media</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  {!isTemplateSwitchMode && (!allowedFields.length || allowedFields.includes("avatarUrl")) && (
                    <div className="w-full sm:w-1/3">
                      <ImageUploadZone
                        label="Avatar (1:1)"
                        aspectRatio="square"
                        value={currentData.avatarUrl || ""}
                        category={PROFILE_MEDIA_CATEGORIES.AVATAR}
                        maxMegabytes={2}
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
                        category={PROFILE_MEDIA_CATEGORIES.COVER}
                        onChange={(val) => setValue("bannerUrl", val, { shouldDirty: true })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Basic Information</h2>
                <div className="space-y-4">
                  {!isTemplateSwitchMode && (!allowedFields.length || allowedFields.includes("name")) && (
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
                  {(!allowedFields.length || allowedFields.includes("quote")) && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quote</label>
                      <textarea
                        rows={3}
                        placeholder="Add a short quote..."
                        className={`w-full rounded-none bg-gray-50 border p-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors resize-none ${
                          errors.quote ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("quote")}
                      />
                      {errors.quote && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.quote.message}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Contact Details</h2>
                <div className="space-y-6">
                  <ContactFields currentData={currentData} setValue={setValue} errors={errors} />
                  {(!allowedFields.length || allowedFields.includes("website")) && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Website</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className={`w-full h-12 rounded-none bg-gray-50 border px-4 text-gray-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                          errors.website ? "border-red-300 focus:border-red-500 text-red-900" : "border-gray-200 focus:border-gray-900"
                        }`}
                        {...register("website")}
                      />
                      {errors.website && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.website.message}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {activeTab === "links" && (() => {
            const socials = currentData.socials || {};
            let activeSocialIds = currentData.socialOrder;
            if (!activeSocialIds) {
              activeSocialIds = SOCIAL_PLATFORMS.filter(p => socials[p.id]).map(p => p.id);
            }

            const activePlatforms = activeSocialIds
              .map(id => SOCIAL_PLATFORMS.find(p => p.id === id))
              .filter(Boolean);

            const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !activeSocialIds.includes(p.id));

            return (
              <div className="space-y-8">
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
                            setValue(`socials.${platform.id}`, "", { shouldDirty: true });
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
          {activeTab === "sections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Sections</h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Section
                </button>
              </div>

              {customSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 bg-gray-50/50">
                  <Layout className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-sm font-bold text-gray-500 mb-1">No sections yet</p>
                  <p className="text-[12px] text-gray-400 text-center max-w-[220px] mb-4">Add custom sections to showcase your content — about, services, portfolio, anything you want.</p>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-gray-900 hover:bg-black px-4 py-2.5 transition-colors active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create First Section
                  </button>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={customSections}
                  onReorder={(newOrder) => setValue("custom_sections", newOrder, { shouldDirty: true })}
                  className="space-y-4"
                >
                  <AnimatePresence initial={false}>
                    {customSections.map((section) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        onUpdate={updateSection}
                        onRemove={removeSection}
                        onRemoveImage={media?.stageRemoval || (() => {})}
                      />
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              )}

              {customSections.length > 0 && customSections.length < 8 && (
                <button
                  type="button"
                  onClick={addSection}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 text-[12px] font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Section
                </button>
              )}
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
                    <div key={img} className="group relative aspect-square overflow-hidden rounded-xl border border-black/5 bg-gray-100 shadow-sm">
                      <EditableImage
                        src={img}
                        alt={`Gallery image ${idx + 1}`}
                        isEditMode
                        category={PROFILE_MEDIA_CATEGORIES.GALLERY}
                        onChange={(uploadedUrl) => {
                          const nextGallery = [...gallery];
                          nextGallery[idx] = uploadedUrl;
                          setValue("gallery", nextGallery, { shouldDirty: true });
                        }}
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/55 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          aria-label={`Move gallery image ${idx + 1} earlier`}
                          disabled={idx === 0}
                          onClick={() => {
                            const nextGallery = [...gallery];
                            [nextGallery[idx - 1], nextGallery[idx]] = [nextGallery[idx], nextGallery[idx - 1]];
                            setValue("gallery", nextGallery, { shouldDirty: true });
                          }}
                          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-800 disabled:opacity-35"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove gallery image ${idx + 1}`}
                          onClick={() => {
                            media?.stageRemoval(img);
                            const newGallery = [...gallery];
                            newGallery.splice(idx, 1);
                            setValue("gallery", newGallery, { shouldDirty: true });
                          }}
                          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move gallery image ${idx + 1} later`}
                          disabled={idx === gallery.length - 1}
                          onClick={() => {
                            const nextGallery = [...gallery];
                            [nextGallery[idx], nextGallery[idx + 1]] = [nextGallery[idx + 1], nextGallery[idx]];
                            setValue("gallery", nextGallery, { shouldDirty: true });
                          }}
                          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-800 disabled:opacity-35"
                        >
                          <ChevronRight className="h-4 w-4" />
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
                        multiple={true}
                        maxFiles={maxImages - gallery.length}
                        category={PROFILE_MEDIA_CATEGORIES.GALLERY}
                        onChange={(val) => {
                          if (val) {
                            const newImages = Array.isArray(val) ? val : [val];
                            const spacesLeft = maxImages - gallery.length;
                            const imagesToAdd = newImages.slice(0, spacesLeft);
                            setValue("gallery", [...gallery, ...imagesToAdd], { shouldDirty: true });
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
      <div className="flex-1 h-full relative overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-gray-100 flex flex-col items-center justify-start">
        <TemplateRegistry
          templateId={templateId}
          profileData={profileData}
          isEditMode={true}
          lockProfileIdentity={isTemplateSwitchMode}
          onPreviewClick={setActiveTab}
        />
      </div>

      <AnimatePresence>
        {showDraftPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cloud"
          >
            <button
              type="button"
              onClick={() => setShowDraftPreview(false)}
              aria-label="Close draft preview"
              className="fixed right-4 top-4 z-[110] inline-flex size-11 items-center justify-center rounded-full bg-white text-navy shadow-lg transition-transform hover:scale-105"
            >
              <X className="size-5" />
            </button>
            <TemplateRegistry
              templateId={templateId}
              profileData={currentData}
              isEditMode={false}
              lockProfileIdentity={isTemplateSwitchMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
