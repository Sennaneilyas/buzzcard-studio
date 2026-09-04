import { describe, expect, it } from "vitest";
import {
  BUZZ_CUSTOMIZABLE_FIELDS,
  BUZZ_EDIT_TARGETS,
  getBuzzEditTarget,
  getBuzzEditorTabForTarget,
} from "../src/features/editor/contextual/buzzContextualEditing";
import { serializeEditorData } from "../src/features/editor/persistence/templateData";
import { buzzTemplateEditorConfig } from "../src/features/templates/BuzzTemplate/editorConfig";

describe("BuzzCard contextual editor contract", () => {
  it("provides a contextual editing target for every editable BuzzCard field", () => {
    const contextualFields = new Set(BUZZ_CUSTOMIZABLE_FIELDS);

    expect(buzzTemplateEditorConfig.editableFields).toEqual(
      expect.arrayContaining([...contextualFields]),
    );
  });

  it("routes preview selections to the matching shared editor panel", () => {
    expect(getBuzzEditorTabForTarget("identity")).toBe("profile");
    expect(getBuzzEditorTabForTarget("socials")).toBe("links");
    expect(getBuzzEditorTabForTarget("gallery")).toBe("gallery");
    expect(getBuzzEditorTabForTarget("section:services")).toBe("sections");
    expect(getBuzzEditTarget("section:services")).toBe(
      BUZZ_EDIT_TARGETS.sections,
    );
  });

  it("persists the newly exposed quote and website controls", () => {
    const editorData = {
      ...buzzTemplateEditorConfig.defaults,
      name: "Yassine Amrani",
      quote: "Build with clarity.",
      website: "https://atlasgrowth.studio",
    };

    const serialized = serializeEditorData(
      buzzTemplateEditorConfig,
      editorData,
    );

    expect(serialized.templateFields).toMatchObject({
      quote: "Build with clarity.",
      website: "https://atlasgrowth.studio",
    });
  });

  it("keeps the existing shared validation for contextual controls", () => {
    const invalid = buzzTemplateEditorConfig.schema.safeParse({
      ...buzzTemplateEditorConfig.defaults,
      name: "Yassine Amrani",
      website: "not-a-url",
    });

    expect(invalid.success).toBe(false);
  });
});
