import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionContact — 2×2 grid showing email, phone, DOB, location.
 */

const CONTACT_FIELDS = [
  { key: "email", icon: Mail, label: "E-mail address", fallback: "hello@example.com" },
  { key: "phone", icon: Phone, label: "Mobile Number", fallback: "+1 234 567 890" },
  { key: "dob", icon: Calendar, label: "Date of Birth", fallback: "1st January, 1990" },
  { key: "location", icon: MapPin, label: "Location", fallback: "New York, USA" },
];

export default function SectionContact({ data = {} }) {
  return (
    <section className="px-6 py-8">
      <SectionHeading title="Contact" icon={Phone} />

      <div className="grid grid-cols-2 gap-3">
        {CONTACT_FIELDS.map((field) => {
          const Icon = field.icon;
          const value = data[field.key] || field.fallback;

          return (
            <div
              key={field.key}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                backgroundColor: "var(--t-bg-section)",
                boxShadow: "var(--t-card-shadow)",
                borderRadius: "var(--t-card-radius)",
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5"
                style={{
                  backgroundColor: "var(--t-accent)",
                  color: "var(--t-bg-primary)",
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[10px] uppercase tracking-wider font-medium mb-0.5"
                  style={{ color: "var(--t-text-secondary)" }}
                >
                  {field.label}
                </p>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--t-text-primary)" }}
                >
                  {value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
