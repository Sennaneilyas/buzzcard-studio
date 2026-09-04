import { useEffect, useId, useMemo, useRef } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { getTemplateById } from "@/config/templates";
import { useProfile } from "@/features/auth";
import {
  getProfileStudioPath,
  getTemplateSwitchStudioPath,
} from "@/features/auth/utils/profileRouting";
import { getTemplateEditorConfig } from "@/features/editor/config/templateEditorConfigs";
import { hydrateProfileEditor } from "@/features/editor/persistence/templateData";
import {
  clearLegacyEditorStorage,
  useEditorStore,
} from "@/features/editor/store/useEditorStore";
import StudioEditor from "./StudioEditor";

export default function ProfileEditorRoute() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const profileQuery = useProfile({ refetchOnMount: "always" });
  const routeSessionId = useId();
  const hydratedSessionRef = useRef(null);
  const storeHydrationKey = useEditorStore((state) => state.hydrationKey);
  const hydrationStatus = useEditorStore((state) => state.hydrationStatus);
  const hydrateEditor = useEditorStore((state) => state.hydrateEditor);
  const setHydrationError = useEditorStore((state) => state.setHydrationError);
  const profile = profileQuery.data;
  const requestedTemplateId = searchParams.get("template");
  const requestedTemplate = getTemplateById(requestedTemplateId);
  const requestedEditorConfig = getTemplateEditorConfig(requestedTemplateId);
  const isInvalidCandidate = Boolean(
    requestedTemplateId && (!requestedTemplate || !requestedEditorConfig),
  );
  const isTemplateSwitchMode = Boolean(
    requestedTemplateId &&
      !isInvalidCandidate &&
      profile &&
      requestedTemplateId !== profile.template_id,
  );
  const editingTemplateId = isTemplateSwitchMode
    ? requestedTemplateId
    : profile?.template_id;
  const editorConfig = getTemplateEditorConfig(editingTemplateId);
  const hydrationProfile = useMemo(
    () => profile ? { ...profile, template_id: editingTemplateId } : null,
    [editingTemplateId, profile],
  );
  const expectedHydrationKey = profile
    ? `${profile.id}:${editingTemplateId}:${routeSessionId}`
    : null;

  useEffect(() => {
    if (
      !profile ||
      !editorConfig ||
      profileQuery.isFetching ||
      hydratedSessionRef.current === expectedHydrationKey
    ) {
      return;
    }

    hydratedSessionRef.current = expectedHydrationKey;
    const hydrated = hydrateProfileEditor(hydrationProfile, editorConfig);
    if (!hydrated.data) {
      setHydrationError(hydrated.warning, expectedHydrationKey);
      return;
    }

    hydrateEditor({
      profileId: profile.id,
      slug: profile.username,
      templateId: editingTemplateId,
      profileData: hydrated.data,
      hydrationKey: expectedHydrationKey,
      warning: hydrated.warning,
      canSave: hydrated.canSave,
    });
    clearLegacyEditorStorage();
  }, [
    editorConfig,
    editingTemplateId,
    expectedHydrationKey,
    hydrateEditor,
    hydrationProfile,
    profile,
    profileQuery.isFetching,
    setHydrationError,
  ]);

  if (profileQuery.isLoading || !profileQuery.isFetched) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (profileQuery.isError) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-navy">Studio could not load your profile</h1>
          <p className="mt-2 text-sm text-ink/60">
            {profileQuery.error?.message || "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => profileQuery.refetch()}
            className="mt-6 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!profile) return <Navigate to="/onboarding" replace />;

  if (profileQuery.isFetching) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (isInvalidCandidate) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold text-navy">Template unavailable</h1>
          <p className="mt-2 text-sm text-ink/60">
            The requested template is not registered in this version of Studio.
          </p>
          <Link
            to={getProfileStudioPath(profile)}
            className="mt-6 inline-flex rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white"
          >
            Return to current template
          </Link>
        </div>
      </main>
    );
  }

  if (!editorConfig) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold text-navy">Template unavailable</h1>
          <p className="mt-2 text-sm text-ink/60">
            The saved template “{profile.template_id || "unknown"}” is not registered in this version of Studio.
          </p>
        </div>
      </main>
    );
  }

  const canonicalPath = getProfileStudioPath(profile);
  if (!canonicalPath) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6 text-center">
        <p className="max-w-md text-sm font-medium text-red-700">
          This profile has no username, so Studio cannot build its editor route.
        </p>
      </main>
    );
  }

  if (slug !== profile.username) {
    const correctedPath = isTemplateSwitchMode
      ? getTemplateSwitchStudioPath(profile, editingTemplateId)
      : canonicalPath;
    return <Navigate to={correctedPath} replace />;
  }

  if (requestedTemplateId === profile.template_id) {
    return <Navigate to={canonicalPath} replace />;
  }

  if (storeHydrationKey !== expectedHydrationKey) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (hydrationStatus === "error") {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6 text-center">
        <p className="max-w-md text-sm font-medium text-red-700">
          Studio could not hydrate this profile safely. Reload the page or return to the dashboard.
        </p>
      </main>
    );
  }

  return (
    <StudioEditor
      profile={profile}
      editorConfig={editorConfig}
      editingTemplateId={editingTemplateId}
      isTemplateSwitchMode={isTemplateSwitchMode}
    />
  );
}
