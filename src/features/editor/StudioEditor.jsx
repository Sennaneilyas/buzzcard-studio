import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  editorDataMatches,
  useEditorStore,
} from "@/features/editor/store/useEditorStore";
import {
  getProfileStudioPath,
  getPublicProfilePath,
} from "@/features/auth/utils/profileRouting";
import { ProfileMediaProvider } from "@/features/editor/media/ProfileMediaProvider";
import { useProfileMedia } from "@/features/editor/media/useProfileMedia";
import { usePublishProfile } from "@/features/editor/api/usePublishProfile";
import { useApplyTemplate } from "@/features/editor/api/useApplyTemplate";
import { canPublishProfile } from "@/features/editor/persistence/publishProfile";
import { useUpdateProfile } from "@/features/editor/api/useUpdateProfile";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEditorSection, getEditorTabForSection } from "@/features/editor/config/editorSections";
import ContextualEditorLayout from "./ContextualEditorLayout";
import ClassicEditorLayout from "./ClassicEditorLayout";

/** Generate a short unique id for new sections */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function StudioEditorContent({ profile, editorConfig, isTemplateSwitchMode }) {
  const navigate = useNavigate();
  const media = useProfileMedia();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [editSelection, setEditSelection] = useState(null);

  // Supabase hydrates this store before Studio mounts. Zustand then owns only
  // the current live/unsaved editor document.
  const profileData = useEditorStore((s) => s.profileData);
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const templateId = useEditorStore((s) => s.templateId);
  const lastSavedData = useEditorStore((s) => s.lastSavedData);
  const isDirty = useEditorStore((s) => s.isDirty);
  const hydrationWarning = useEditorStore((s) => s.hydrationWarning);
  const canSave = useEditorStore((s) => s.canSave);
  const activeMediaUploads = useEditorStore((s) => s.activeMediaUploads);

  const { control, register, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(editorConfig.schema),
    mode: "onChange",
    defaultValues: profileData,
    values: profileData,
  });

  const currentData = useWatch({ control }) || profileData;

  // Sync React Hook Form -> Zustand to power Live Preview (debounced to keep typing buttery-smooth at 60 FPS)
  useEffect(() => {
    const timeoutId = setTimeout(() => setProfileData(currentData), 120);
    return () => clearTimeout(timeoutId);
  }, [currentData, setProfileData]);

  const allowedFields = editorConfig.editableFields;

  const updateProfile = useUpdateProfile();
  const publishProfile = usePublishProfile();
  const applyTemplate = useApplyTemplate();
  const documentIsDirty =
    isDirty || !editorDataMatches(currentData, lastSavedData);
  const canPublish = canPublishProfile(profile);
  const isPublished = profile.status === "published";
  const isBusy =
    updateProfile.isPending ||
    publishProfile.isPending ||
    applyTemplate.isPending;
  const isMediaUploading = activeMediaUploads > 0;
  const isContextualEditor = Boolean(editorConfig.sections?.length);
  const activeEditTarget =
    editSelection?.templateId === templateId ? editSelection.targetId : null;
  const activeTargetConfig = getEditorSection(editorConfig, activeEditTarget);

  const setActiveEditTarget = useCallback((targetId) => {
    setEditSelection(targetId ? { templateId, targetId } : null);
  }, [templateId]);

  const handleEditTargetSelect = useCallback((targetId) => {
    setActiveEditTarget(targetId);
    setActiveTab(getEditorTabForSection(editorConfig, targetId));
  }, [editorConfig, setActiveEditTarget]);

  const handleSave = () => {
    if (!documentIsDirty || !canSave || isBusy || isMediaUploading) return;
    setProfileData(currentData);
    updateProfile.mutate({
      profile,
      editorData: currentData,
      templateId,
      config: editorConfig,
      mode: isTemplateSwitchMode ? "candidate" : "active",
    });
  };

  const handlePreview = () => {
    if (isPublished && !isTemplateSwitchMode) {
      const publicPath = getPublicProfilePath(profile);
      if (publicPath) navigate(publicPath);
      return;
    }
    setShowDraftPreview(true);
  };

  const handlePublish = () => {
    if (
      isTemplateSwitchMode ||
      !canPublish ||
      !canSave ||
      isBusy ||
      isMediaUploading
    ) return;
    setProfileData(currentData);
    publishProfile.mutate({
      profile,
      editorData: currentData,
      templateId,
      config: editorConfig,
      isDirty: documentIsDirty,
    });
  };

  const handleApplyTemplate = async () => {
    if (!isTemplateSwitchMode || !canSave || isBusy || isMediaUploading) return;
    setProfileData(currentData);

    try {
      const result = await applyTemplate.mutateAsync({
        profile,
        candidateTemplateId: templateId,
        config: editorConfig,
        editorData: currentData,
      });
      navigate(getProfileStudioPath(result.profile) || "/dashboard", {
        replace: true,
      });
    } catch {
      // The mutation keeps local edits and reports whether candidate data saved.
    }
  };

  const handleBack = () => {
    if (isTemplateSwitchMode) {
      navigate(getProfileStudioPath(profile) || "/dashboard", { replace: true });
      return;
    }
    navigate("/");
  };

  // ── Custom Sections helpers ──
  const customSections = useMemo(
    () => currentData.custom_sections || [],
    [currentData.custom_sections],
  );

  const addSection = useCallback(() => {
    const next = [...customSections, { id: uid(), title: "", description: "", image: "" }];
    setValue("custom_sections", next, { shouldDirty: true });
  }, [customSections, setValue]);

  const removeSection = useCallback((id) => {
    const removedSection = customSections.find((section) => section.id === id);
    if (removedSection?.image) media?.stageRemoval(removedSection.image);
    setValue("custom_sections", customSections.filter(s => s.id !== id), { shouldDirty: true });
  }, [customSections, media, setValue]);

  const updateSection = useCallback((id, field, value) => {
    setValue(
      "custom_sections",
      customSections.map(s => s.id === id ? { ...s, [field]: value } : s),
      { shouldDirty: true }
    );
  }, [customSections, setValue]);

  const layoutProps = {
    profile,
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
    isSaving: updateProfile.isPending,
    isPublishing: publishProfile.isPending,
    isApplying: applyTemplate.isPending,
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
  };

  if (isContextualEditor) {
    return <ContextualEditorLayout {...layoutProps} />;
  }
  return <ClassicEditorLayout {...layoutProps} />;
}

export default function StudioEditor({
  profile,
  editorConfig,
  editingTemplateId = profile.template_id,
  isTemplateSwitchMode = false,
}) {
  return (
    <ProfileMediaProvider
      userId={profile.id}
      templateId={editingTemplateId}
    >
      <StudioEditorContent
        profile={profile}
        editorConfig={editorConfig}
        isTemplateSwitchMode={isTemplateSwitchMode}
      />
    </ProfileMediaProvider>
  );
}
