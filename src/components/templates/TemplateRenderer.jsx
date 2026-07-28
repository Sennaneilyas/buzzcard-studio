import { getTemplateById } from "@/config/templates";
import { HERO_LAYOUTS } from "./heroes";
import ThemeProvider from "./ThemeProvider";
import SectionContact from "./sections/SectionContact";
import SectionServices from "./sections/SectionServices";
import SectionAppointment from "./sections/SectionAppointment";
import SectionGallery from "./sections/SectionGallery";
import SectionProducts from "./sections/SectionProducts";
import SectionTestimonial from "./sections/SectionTestimonial";
import SectionBlog from "./sections/SectionBlog";
import SectionHours from "./sections/SectionHours";
import SectionQR from "./sections/SectionQR";
import SectionContactForm from "./sections/SectionContactForm";
import SectionCreateVCard from "./sections/SectionCreateVCard";

/**
 * TemplateRenderer — The core orchestrator.
 *
 * 1. Looks up the registry entry by templateId
 * 2. Resolves the hero component via layoutType
 * 3. Wraps everything in ThemeProvider
 * 4. Renders Hero + all 12 section components in order
 *
 * Props:
 *   templateId — ID from the template registry (e.g., "vcard12")
 *   userData   — Optional user data to populate sections (falls back to demo data)
 *   compact    — If true, renders a preview-friendly version (smaller, no interactivity)
 */
export default function TemplateRenderer({
  templateId,
  userData = {},
  compact = false,
}) {
  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500 text-sm">
        Template "{templateId}" not found
      </div>
    );
  }

  const HeroComponent = HERO_LAYOUTS[template.layoutType];

  if (!HeroComponent) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500 text-sm">
        Layout "{template.layoutType}" not found
      </div>
    );
  }

  const wrapperClass = compact
    ? "max-w-[375px] mx-auto overflow-y-auto rounded-2xl shadow-2xl"
    : "max-w-[430px] mx-auto";

  return (
    <ThemeProvider theme={template.theme} className={wrapperClass}>
      {/* Hero */}
      <HeroComponent data={userData} theme={template.theme} />

      {/* All 12 content sections in canonical order */}
      <SectionContact data={userData} />
      <SectionServices data={userData} />
      <SectionAppointment data={userData} />
      <SectionGallery data={userData} />
      <SectionProducts data={userData} />
      <SectionTestimonial data={userData} />
      <SectionBlog data={userData} />
      <SectionHours data={userData} />
      <SectionQR data={userData} />
      <SectionContactForm />
      <SectionCreateVCard data={userData} />
    </ThemeProvider>
  );
}
