import { useCallback, useMemo, useState } from "react";
import { downloadVCard } from "../utils/vcard";

/**
 * Encapsulates the "Enregistrer le contact" button behavior:
 * normalizes phones/emails, triggers the vCard download, and
 * tracks a local "saved" flag for the button label + aria-live announcement.
 */
export function useSaveContact(profile) {
  const [isSaved, setIsSaved] = useState(false);

  const phones = useMemo(
    () => profile.phones?.filter(Boolean) ?? [],
    [profile.phones]
  );

  const emails = useMemo(
    () => profile.emails?.filter(Boolean) ?? [],
    [profile.emails]
  );

  const handleSaveContact = useCallback(() => {
    downloadVCard(profile, phones, emails);
    setIsSaved(true);
  }, [profile, phones, emails]);

  return { phones, emails, isSaved, handleSaveContact };
}
