import { create } from "zustand";

export const LEGACY_EDITOR_STORAGE_KEY = "studio-editor-storage";

const EMPTY_EDITOR_STATE = {
  profileId: null,
  slug: "",
  templateId: null,
  profileData: {},
  lastSavedData: {},
  hydrationKey: null,
  hydrationStatus: "idle",
  hydrationWarning: null,
  canSave: false,
  isDirty: false,
  activeMediaUploads: 0,
  pendingMediaCleanup: [],
};

function cloneEditorData(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

export function editorDataMatches(left, right) {
  return JSON.stringify(left || {}) === JSON.stringify(right || {});
}

export function clearLegacyEditorStorage(storage) {
  const targetStorage =
    storage || (typeof window !== "undefined" ? window.localStorage : null);
  try {
    targetStorage?.removeItem(LEGACY_EDITOR_STORAGE_KEY);
  } catch {
    // Storage may be unavailable or quota-blocked. The editor no longer reads
    // this key, so failure to remove it does not affect Supabase hydration.
  }
}

/**
 * Transient Studio state only. Supabase owns persisted profile/template data;
 * this store powers the live preview and unsaved-change indicator.
 */
export const useEditorStore = create((set) => ({
  ...EMPTY_EDITOR_STATE,

  hydrateEditor: ({
    profileId,
    slug,
    templateId,
    profileData,
    hydrationKey,
    warning = null,
    canSave = true,
  }) => {
    const hydratedData = cloneEditorData(profileData);
    set({
      profileId,
      slug,
      templateId,
      profileData: hydratedData,
      lastSavedData: cloneEditorData(hydratedData),
      hydrationKey,
      hydrationStatus: "ready",
      hydrationWarning: warning,
      canSave,
      isDirty: false,
      activeMediaUploads: 0,
      pendingMediaCleanup: [],
    });
  },

  setHydrationError: (message, hydrationKey = null) =>
    set({
      hydrationKey,
      hydrationStatus: "error",
      hydrationWarning: message,
      canSave: false,
    }),

  setProfileData: (patch) =>
    set((state) => {
      const nextData = { ...state.profileData, ...patch };
      if (editorDataMatches(nextData, state.profileData)) return state;

      return {
        profileData: nextData,
        isDirty: !editorDataMatches(nextData, state.lastSavedData),
      };
    }),

  beginMediaUpload: () =>
    set((state) => ({ activeMediaUploads: state.activeMediaUploads + 1 })),

  finishMediaUpload: () =>
    set((state) => ({
      activeMediaUploads: Math.max(0, state.activeMediaUploads - 1),
    })),

  queueMediaCleanup: (reference) =>
    set((state) => {
      if (!reference || state.pendingMediaCleanup.includes(reference)) {
        return state;
      }
      return {
        pendingMediaCleanup: [...state.pendingMediaCleanup, reference],
      };
    }),

  clearMediaCleanup: (references) =>
    set((state) => {
      const cleared = new Set(references || []);
      return {
        pendingMediaCleanup: state.pendingMediaCleanup.filter(
          (reference) => !cleared.has(reference),
        ),
      };
    }),

  markSaved: ({ profileData, warning = null }) => {
    const savedData = cloneEditorData(profileData);
    set({
      profileData: savedData,
      lastSavedData: cloneEditorData(savedData),
      hydrationWarning: warning,
      canSave: true,
      isDirty: false,
    });
  },

  resetEditor: () => set({ ...EMPTY_EDITOR_STATE }),
}));
