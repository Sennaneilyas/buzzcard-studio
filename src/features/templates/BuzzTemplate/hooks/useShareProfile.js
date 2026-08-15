import { useCallback, useState } from "react";

/**
 * Handles sharing the current profile URL via the native Web Share API,
 * falling back to clipboard copy. Returns a screen-reader announcement
 * string so callers can surface an aria-live message.
 */
export function useShareProfile(onSave) {
  const [srMessage, setSrMessage] = useState("");

  const share = useCallback(async () => {
    if (onSave) {
      onSave();
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        setSrMessage("Lien partagé");
      } else {
        await navigator.clipboard?.writeText(window.location.href);
        setSrMessage("Lien copié dans le presse-papier");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        setSrMessage("Action indisponible");
      }
    }
  }, [onSave]);

  return { srMessage, share };
}
