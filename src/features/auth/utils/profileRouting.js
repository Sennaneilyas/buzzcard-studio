export const DASHBOARD_PATH = "/dashboard";
export const TEMPLATE_CATALOGUE_PATH = "/templates";

function getProfileSlug(profile) {
  const slug = profile?.username?.trim();
  return slug ? encodeURIComponent(slug) : null;
}

export function getProfileStudioPath(profile) {
  const slug = getProfileSlug(profile);
  return slug ? `/profile/${slug}/edit` : null;
}

export function getPublicProfilePath(profile) {
  const slug = getProfileSlug(profile);
  return slug ? `/profile/${slug}` : null;
}

export function getTemplateSwitchStudioPath(profile, templateId) {
  const studioPath = getProfileStudioPath(profile);
  if (!studioPath || !templateId) return studioPath;
  return `${studioPath}?template=${encodeURIComponent(templateId)}`;
}

export function getOnboardingRedirect(profile) {
  if (!profile) return null;
  return profile.status === "draft"
    ? getProfileStudioPath(profile) || DASHBOARD_PATH
    : DASHBOARD_PATH;
}

export function getOnboardingSkipDestination() {
  return DASHBOARD_PATH;
}

export function getDefaultAuthDestination(isSignup) {
  return isSignup ? "/onboarding" : DASHBOARD_PATH;
}

export function getTemplateCatalogueActionLabel(profile, templateId) {
  return profile?.template_id === templateId
    ? "Edit current template"
    : "Use this template";
}

export function getTemplateSelectionDestination({ user, profile, templateId }) {
  const selectedTemplatePath = `${TEMPLATE_CATALOGUE_PATH}?use=${encodeURIComponent(templateId)}`;

  if (!user) {
    return `/auth?mode=signup&returnTo=${encodeURIComponent(selectedTemplatePath)}`;
  }
  if (!profile) {
    return `/onboarding?template=${encodeURIComponent(templateId)}`;
  }
  if (profile.template_id === templateId) {
    return getProfileStudioPath(profile) || DASHBOARD_PATH;
  }
  return getTemplateSwitchStudioPath(profile, templateId) || DASHBOARD_PATH;
}
