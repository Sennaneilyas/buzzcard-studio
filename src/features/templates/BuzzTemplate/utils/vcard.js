/**
 * Builds a vCard 3.0 string from a profile + its normalized phones/emails.
 * Pure function — easy to unit test independently of any DOM/React concerns.
 */
export function buildVCardString(profile = {}, phones = [], emails = []) {
  const { fullName, company, profession, website, avatarUrl } = profile;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName ?? ""}`,
    `ORG:${company ?? ""}`,
    `TITLE:${profession ?? ""}`,
    ...phones.map((p) => `TEL:${p}`),
    ...emails.map((e) => `EMAIL:${e}`),
    website ? `URL:${website}` : "",
    avatarUrl ? `PHOTO;VALUE=URI:${avatarUrl}` : "",
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Triggers a browser download of the given profile as a .vcf file.
 * Keeps Blob/URL/DOM side effects out of components.
 */
export function downloadVCard(profile = {}, phones = [], emails = []) {
  const vcard = buildVCardString(profile, phones, emails);

  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.fullName?.replace(/\s+/g, "_") ?? "contact"}.vcf`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
