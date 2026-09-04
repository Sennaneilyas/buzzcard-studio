const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmails(values = []) {
  return values.map(value => String(value || "").trim()).filter(value => EMAIL_PATTERN.test(value)).slice(0, 3);
}

export function validPhones(values = []) {
  return values.map(value => String(value || "").trim()).filter(value => value.replace(/\D/g, "").length >= 7).slice(0, 3);
}

export function validHttpUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function configuredSocials(socials = {}, order) {
  const ids = Array.isArray(order) ? order : Object.keys(socials || {});
  return ids.flatMap((id) => {
    const href = validHttpUrl(socials?.[id]);
    return href ? [{ platform: id.charAt(0).toUpperCase() + id.slice(1), href }] : [];
  });
}

export function editorContactValues(profileData, rawProfile = {}) {
  const phoneSource = Array.isArray(profileData?.phones)
    ? profileData.phones
    : profileData?.phone ? [profileData.phone] : rawProfile.phones;
  const emailSource = Array.isArray(profileData?.emails)
    ? profileData.emails
    : profileData?.email ? [profileData.email] : rawProfile.emails;
  return { phones: validPhones(phoneSource), emails: validEmails(emailSource) };
}
