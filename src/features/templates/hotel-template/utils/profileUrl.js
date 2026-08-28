export function resolveProfileUrl(profile = {}) {
  if (profile.profileUrl || profile.publicUrl) {
    return profile.profileUrl || profile.publicUrl;
  }

  if (typeof window === "undefined") return "";

  if (profile.slug) {
    return `${window.location.origin}/profile/${encodeURIComponent(profile.slug)}`;
  }

  const currentUrl = new URL(window.location.href);
  currentUrl.pathname = currentUrl.pathname.replace(/\/edit\/?$/, "");
  return currentUrl.toString();
}
