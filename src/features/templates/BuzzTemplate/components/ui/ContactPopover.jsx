import { useEffect, useRef, useState } from "react";

/**
 * Dropdown shown when a contact action (phone/email) has more than one
 * entry — lets the user pick which number/address to use.
 */
export default function ContactPopover({ icon: Icon, label, entries, prefix }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler, { passive: true });
    document.addEventListener("touchstart", handler, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative z-50">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="w-[45px] h-[45px] rounded-full bg-[#f4f5f7] flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),-1px_-1px_6px_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
      >
        <Icon className="w-5 h-5 text-neutral-950" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[54px] left-1/2 -translate-x-1/2 z-50 min-w-[160px] max-w-[80vw] rounded-[16px] overflow-hidden bg-[#f4f5f7cc] backdrop-blur-lg shadow-lg list-none m-0 p-0"
        >
          {entries.map((entry, i) => (
            <li key={i} role="option" aria-selected={false}>
              <a
                href={`${prefix}${entry}`}
                className="flex items-center gap-3 px-4 py-3 text-xs font-medium text-neutral-950 active:bg-white/40 transition-colors border-b border-neutral-950/5 last:border-0"
              >
                <Icon className="w-4 h-4 text-neutral-950/60 shrink-0" />
                {entry}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
