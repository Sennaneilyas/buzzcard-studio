const contactItems = [
  {
    type: "phone",
    label: "+1 (212) 555-0147",
    href: "tel:+12125550147",
  },
  {
    type: "email",
    label: "jenny.wilson@mail.com",
    href: "mailto:jenny.wilson@mail.com",
  },
];

import { useCallback } from "react";
import { useToast } from "../../components/Toast/Toast";

export const ContactDetailsSection = () => {
  const addToast = useToast();

  const handleClick = useCallback(
    (e, item) => {
      e.preventDefault();
      if (item.type === "phone") {
        addToast("Opening phone app…");
        window.location.href = item.href;
        return;
      }

      if (item.type === "email") {
        addToast("Opening mail client…");
        window.location.href = item.href;
        return;
      }

      // fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(item.label).then(() => addToast("Copied to clipboard"));
      } else {
        addToast("Copy: " + item.label);
      }
    },
    [addToast]
  );

  return (
    <section className="bg-[#1e3d25] px-5 py-6 text-[#f5f4f0]" aria-labelledby="contact-details-heading">
      <div className="mb-4 flex items-center justify-center">
        <h2 id="contact-details-heading" className="text-lg font-semibold tracking-[0.4px]">
          Contact
        </h2>
      </div>

      <div className="space-y-3">
        {contactItems.map((item) => (
          <a
            key={item.type}
            href={item.href}
            onClick={(e) => handleClick(e, item)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition hover:bg-white/15 active:scale-[0.995]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b7355] text-sm font-semibold text-white">
              {item.type === "phone" ? "☎" : "✉"}
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};
