import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Layout, User, Share2, ImageIcon, Plus, Loader2, GripVertical, Trash2, Type, AlignLeft, Image as ImageLucide, ChevronDown, ChevronUp } from "lucide-react";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { Reorder, AnimatePresence, motion } from "framer-motion";
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
  avatarUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  custom_sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  })).optional(),
});

const NAV_ITEMS = [
  { id: "profile", icon: User, label: "Profile Info" },
  { id: "links", icon: Share2, label: "Links & Socials" },
  { id: "sections", icon: Layout, label: "Custom Sections" },
  { id: "gallery", icon: ImageIcon, label: "Gallery" },
];

/** Generate a short unique id for new sections */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * SectionCard — A collapsible, draggable card for editing a custom section.
 * Contains: title input, description textarea, optional image upload, and delete button.
 */
function SectionCard({ section, onUpdate, onRemove }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Reorder.Item
      value={section}
      className="bg-white border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header: drag handle + title preview + collapse + delete */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-500 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-gray-900 truncate">
            {section.title || "Untitled Section"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body: editable fields */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Section Title */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Type className="w-3 h-3" />
                  Section Title
                </label>
                <input
                  type="text"
                  value={section.title || ""}
                  onChange={(e) => onUpdate(section.id, "title", e.target.value)}
                  placeholder="E.g. About Me, Our Services, Portfolio..."
                  className="w-full h-11 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              {/* Section Description */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <AlignLeft className="w-3 h-3" />
                  Description
                </label>
                <textarea
                  rows={3}
                  value={section.description || ""}
                  onChange={(e) => onUpdate(section.id, "description", e.target.value)}
                  placeholder="Write the content for this section..."
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-[13px] text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-gray-900 transition-colors resize-none"
                />
              </div>

              {/* Section Image (optional) */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <ImageLucide className="w-3 h-3" />
                  Image (optional)
                </label>
                {section.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdate(section.id, "image", "")}
                        className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageUploadZone
                    label="Add Image"
                    aspectRatio="video"
                    value=""
                    onChange={(val) => { if (val) onUpdate(section.id, "image", val); }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

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

  // Sync React Hook Form -> Zustand to power Live Preview (debounced to keep typing buttery-smooth at 60 FPS)
  useEffect(() => {
    let timeoutId;
    const subscription = watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setProfileData(value);
      }, 120);
    });
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
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
    if (item.id === "links") return !allowedFields.length || allowedFields.includes("socials");
    if (item.id === "gallery") return !allowedFields.length || allowedFields.includes("gallery");
    if (item.id === "sections") return !allowedFields.length || allowedFields.includes("custom_sections");
    return true;
  });

  // ── Custom Sections helpers ──
  const customSections = currentData.custom_sections || [];

  const addSection = useCallback(() => {
    const next = [...customSections, { id: uid(), title: "", description: "", image: "" }];
    setValue("custom_sections", next, { shouldDirty: true });
  }, [customSections, setValue]);

  const removeSection = useCallback((id) => {
    setValue("custom_sections", customSections.filter(s => s.id !== id), { shouldDirty: true });
  }, [customSections, setValue]);

  const updateSection = useCallback((id, field, value) => {
    setValue(
      "custom_sections",
      customSections.map(s => s.id === id ? { ...s, [field]: value } : s),
      { shouldDirty: true }
    );
  }, [customSections, setValue]);

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

          {/* SECTIONS TAB — Full section builder */}
          {activeTab === "sections" && (
            <div className="space-y-6">
              {/* Header + Add button */}
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
                        multiple={true}
                        onChange={(val) => {
                          if (val) {
                            const newImages = Array.isArray(val) ? val : [val];
                            // Only add up to maxImages
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
        <TemplateRegistry templateId={templateId} profileData={currentData} isEditMode={true} />
      </div>
    </div>
  );
}
