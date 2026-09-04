import { ArrowLeft, Check, Eye, Globe2, Loader2, MousePointerClick, Rocket, Save, X, ChevronLeft, ChevronRight, GripVertical, Trash2, Plus, Layout } from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import TemplateRegistry from "@/config/TemplateRegistry";
import { SOCIAL_PLATFORMS } from "@/features/onboarding/steps/socialPlatforms";
import ImageUploadZone from "@/components/ui/ImageUploadZone";
import EditableImage from "@/components/ui/EditableImage";
import { PROFILE_MEDIA_CATEGORIES } from "@/features/editor/media/profileMedia";
import SectionCard from "./components/SectionCard";
import ContactFields from "./components/ContactFields";
import ConfiguredFields from "./components/ConfiguredFields";

export default function ContextualEditorLayout({
  editorConfig,
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
  activeEditTarget,
  setActiveEditTarget,
  activeTargetConfig,
  handleEditTargetSelect,
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
  const editorSections = editorConfig.sections || [];
  const activeSectionIndex = editorSections.findIndex(section => section.id === (activeEditTarget?.startsWith("section:") ? "sections" : activeEditTarget));
  const selectAdjacentSection = (offset) => {
    if (!editorSections.length) return;
    const nextIndex = (Math.max(activeSectionIndex, 0) + offset + editorSections.length) % editorSections.length;
    handleEditTargetSelect(editorSections[nextIndex].id);
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#FAFAFA] overflow-hidden font-sans relative">
      {/* ── MOBILE NAV (TOP) ── */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 flex items-center shrink-0 z-30 gap-2 px-3 py-2">
        <button
          type="button"
          onClick={handleBack}
          aria-label={isTemplateSwitchMode ? "Back to current template" : "Back to Home"}
          className="inline-flex size-10 shrink-0 items-center justify-center text-gray-600"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-950">Edit {editorConfig.label || "BuzzCard"}</p>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${documentIsDirty || isMediaUploading ? "text-amber-600" : "text-emerald-600"}`}>
            {isMediaUploading ? "Uploading" : documentIsDirty ? "Unsaved" : isPublished ? "Published" : "Saved draft"}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePreview}
          disabled={isBusy}
          aria-label={isPublished && !isTemplateSwitchMode ? "View public profile" : "Preview template"}
          className="inline-flex size-10 shrink-0 items-center justify-center border border-gray-200 text-gray-700 disabled:opacity-40"
        >
          {isPublished && !isTemplateSwitchMode ? <Globe2 className="size-4" /> : <Eye className="size-4" />}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isBusy || isMediaUploading || !documentIsDirty || !canSave}
          aria-label="Save changes"
          className="inline-flex size-10 shrink-0 items-center justify-center bg-gray-950 text-white disabled:opacity-40"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        </button>
        {!isPublished && !isTemplateSwitchMode && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isBusy || isMediaUploading || !canSave}
            aria-label="Publish profile"
            className="inline-flex size-10 shrink-0 items-center justify-center bg-mint text-navy disabled:opacity-40"
          >
            {isPublishing ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
          </button>
        )}
        {isTemplateSwitchMode && (
          <button
            type="button"
            onClick={handleApplyTemplate}
            disabled={isBusy || isMediaUploading || !canSave}
            aria-label="Apply template"
            className="inline-flex size-10 shrink-0 items-center justify-center bg-mint text-navy disabled:opacity-40"
          >
            {isApplying ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          </button>
        )}
      </div>

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-[80] flex max-h-[calc(100dvh-4.5rem)] flex-col rounded-t-[28px]",
          "border-t border-gray-200 bg-white shadow-[0_-18px_50px_rgba(15,23,42,0.18)]",
          "transition-transform duration-300 md:static md:order-1 md:h-full md:max-h-none",
          "md:w-[400px] md:max-w-[400px] md:shrink-0 md:translate-y-0 md:rounded-none",
          "md:border-r md:border-l-0 md:border-t-0 md:shadow-none",
          activeEditTarget
            ? "translate-y-0"
            : "pointer-events-none translate-y-full md:pointer-events-auto"
        ].join(" ")}
      >
        <div className="relative min-h-20 pb-3 pt-7 md:py-3 flex items-center justify-between gap-3 px-6 border-b border-gray-200 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-300 md:hidden" />
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={handleBack}
                aria-label={isTemplateSwitchMode ? "Back to current template" : "Back to Home"}
                className="hidden size-9 shrink-0 items-center justify-center border border-gray-200 text-gray-600 md:inline-flex rounded-full hover:bg-gray-50"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-gray-950">
                  {activeTargetConfig?.label || "Select an element"}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {activeTargetConfig?.description || "Choose any highlighted area in the preview to edit it."}
                </p>
              </div>
              {activeEditTarget && editorSections.length > 1 && (
                <div className="ml-auto hidden shrink-0 items-center gap-1 md:flex">
                  <button type="button" onClick={() => selectAdjacentSection(-1)} aria-label="Previous editable section" className="inline-flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="size-4" /></button>
                  <button type="button" onClick={() => selectAdjacentSection(1)} aria-label="Next editable section" className="inline-flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="size-4" /></button>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveEditTarget(null)}
            aria-label="Close editor controls"
            className="inline-flex size-10 shrink-0 items-center justify-center text-gray-500 md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar p-5 pb-8">
          {isTemplateSwitchMode && (
            <div role="status" className="border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900">
              You&apos;re customizing a new template. Your current profile remains unchanged until you apply this template.
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
          {!activeEditTarget && (
            <div className="hidden min-h-72 flex-col px-2 py-4 md:flex">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MousePointerClick className="size-5" />
              </span>
              <p className="text-center text-sm font-bold text-gray-900">Choose a section to edit</p>
              <p className="mt-2 text-center text-xs leading-relaxed text-gray-500">The same shared controls are used for every template.</p>
              <div className="mt-5 grid gap-2">
                {editorSections.map(section => (
                  <button key={section.id} type="button" onClick={() => handleEditTargetSelect(section.id)} className="border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-400 hover:bg-gray-50">
                    <span className="block text-xs font-bold text-gray-900">{section.label}</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-gray-500">{section.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && activeEditTarget && (
            <div className="space-y-6">
              {(activeEditTarget === "identity" || activeEditTarget === "cover") && (
              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">
                  {activeEditTarget === "cover" ? "Cover image" : "Profile media"}
                </h2>
                <div className="flex flex-col gap-6">
                  {activeEditTarget === "identity" && !isTemplateSwitchMode && (!allowedFields.length || allowedFields.includes("avatarUrl")) && (
                    <div className="w-full">
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
                  {activeEditTarget === "cover" && (!allowedFields.length || allowedFields.includes("bannerUrl")) && (
                    <div className="w-full">
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
              )}

              {(["identity", "bio", "quote"].includes(activeEditTarget)) && (
              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">
                  {activeEditTarget === "bio" ? "About" : activeEditTarget === "quote" ? "Cover quote" : "Profile identity"}
                </h2>
                <div className="space-y-4">
                  {activeEditTarget === "identity" && !isTemplateSwitchMode && (!allowedFields.length || allowedFields.includes("name")) && (
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
                  {activeEditTarget === "identity" && (!allowedFields.length || allowedFields.includes("role")) && (
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
                  {activeEditTarget === "bio" && (!allowedFields.length || allowedFields.includes("bio")) && (
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
                  {activeEditTarget === "bio" && activeTargetConfig?.fields?.includes("education") && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Education</label>
                      <textarea rows={4} className="w-full resize-none border border-gray-200 bg-gray-50 p-4 font-medium text-gray-900 outline-none focus:border-gray-900 focus:bg-white" {...register("education")} />
                    </div>
                  )}
                  {activeEditTarget === "bio" && activeTargetConfig?.fields?.includes("awards") && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Awards and recognition</label>
                      <textarea rows={4} className="w-full resize-none border border-gray-200 bg-gray-50 p-4 font-medium text-gray-900 outline-none focus:border-gray-900 focus:bg-white" {...register("awards")} />
                    </div>
                  )}
                  {activeEditTarget === "quote" && (!allowedFields.length || allowedFields.includes("quote")) && (
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
              )}

              {activeEditTarget === "contact" && (
              <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">
                  Contact Details
                </h2>
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
                  {activeTargetConfig?.fields?.includes("location") && (
                    <div className="relative mt-6">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                      <input type="text" placeholder="Business address" className="h-12 w-full border border-gray-200 bg-gray-50 px-4 font-medium text-gray-900 outline-none focus:border-gray-900 focus:bg-white" {...register("location")} />
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          )}

          {activeTargetConfig?.controls?.length > 0 && (
            <ConfiguredFields controls={activeTargetConfig.controls} register={register} errors={errors} />
          )}

          {/* LINKS TAB */}
          {activeTab === "links" && activeEditTarget === "socials" && (() => {
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
          {activeTab === "sections" && activeEditTarget && activeEditTarget.startsWith("section") && (
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
                        forceOpen={activeEditTarget === `section:${section.id}`}
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
          {activeTab === "gallery" && activeEditTarget === "gallery" && (() => {
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

        {/* Action Bottom Bar on Desktop */}
        <div className="hidden shrink-0 space-y-2 border-t border-gray-200 p-5 md:block">
          <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Profile status</span>
            <span className={isPublished ? "text-emerald-600" : "text-amber-600"}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={isBusy}
              className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-3 py-3 text-xs font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              {isPublished && !isTemplateSwitchMode ? <Globe2 className="size-4" /> : <Eye className="size-4" />}
              {isPublished && !isTemplateSwitchMode ? "View" : "Preview"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isBusy || isMediaUploading || !documentIsDirty || !canSave}
              className="flex items-center justify-center gap-2 bg-gray-950 px-3 py-3 text-xs font-bold text-white disabled:opacity-40"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? "Saving" : documentIsDirty ? "Save" : "Saved"}
            </button>
          </div>
          {!isPublished && !isTemplateSwitchMode && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isBusy || isMediaUploading || !canSave}
              className="flex w-full items-center justify-center gap-2 bg-mint px-4 py-3 text-sm font-bold text-navy disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
              {isPublishing ? "Publishing..." : "Publish Profile"}
            </button>
          )}
          {isTemplateSwitchMode && (
            <>
              <button
                type="button"
                onClick={handleApplyTemplate}
                disabled={isBusy || isMediaUploading || !canSave}
                className="flex w-full items-center justify-center gap-2 bg-mint px-4 py-3 text-sm font-bold text-navy disabled:opacity-50"
              >
                {isApplying ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {isApplying ? "Applying..." : "Apply Template"}
              </button>
              <button
                type="button"
                onClick={handleBack}
                disabled={isBusy}
                className="w-full px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 disabled:opacity-50"
              >
                Cancel switch
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT PANE: Live Template Preview ── */}
      <div className="order-1 md:order-2 flex-1 h-full relative overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-gray-100 flex flex-col items-center justify-start">
        <TemplateRegistry
          templateId={templateId}
          profileData={profileData}
          isEditMode={true}
          lockProfileIdentity={isTemplateSwitchMode}
          onPreviewClick={setActiveTab}
          contextualEditing={true}
          activeEditTarget={activeEditTarget}
          onEditTargetSelect={handleEditTargetSelect}
        />
        {!activeEditTarget && (
          <div className="fixed inset-x-3 bottom-24 z-[60] flex justify-center md:hidden">
            <div className="flex max-w-full gap-2 overflow-x-auto rounded-2xl bg-gray-950/95 p-2 shadow-xl backdrop-blur-sm [scrollbar-width:none]">
              {editorSections.map(section => (
                <button key={section.id} type="button" onClick={() => handleEditTargetSelect(section.id)} className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20">
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
