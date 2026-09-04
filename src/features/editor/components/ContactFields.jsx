import { Plus, Trash2 } from "lucide-react";

const MAX_CONTACTS = 3;

function valuesFor(data, plural, singular) {
  if (Array.isArray(data?.[plural])) return data[plural];
  return data?.[singular] ? [data[singular]] : [];
}

function ContactList({ type, label, plural, singular, currentData, setValue, errors }) {
  const values = valuesFor(currentData, plural, singular);
  const inputErrors = errors?.[plural];

  const update = (next) => {
    setValue(plural, next, { shouldDirty: true, shouldValidate: true });
    // Stop legacy singular fields from overriding a deliberately emptied list.
    setValue(singular, "", { shouldDirty: true, shouldValidate: false });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</label>
        {values.length < MAX_CONTACTS && (
          <button
            type="button"
            onClick={() => update([...values, ""])}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-gray-950"
          >
            <Plus className="size-3.5" /> Add
          </button>
        )}
      </div>
      {values.length === 0 ? (
        <button
          type="button"
          onClick={() => update([""])}
          className="flex h-12 w-full items-center justify-center gap-2 border border-dashed border-gray-300 bg-gray-50 text-xs font-semibold text-gray-500"
        >
          <Plus className="size-4" /> Add {label.toLowerCase()}
        </button>
      ) : values.map((value, index) => (
        <div key={`${plural}-${index}`} className="relative flex gap-2">
          <input
            type={type}
            value={value}
            onChange={(event) => update(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
            placeholder={type === "email" ? "hello@example.com" : "+1 (555) 000-0000"}
            aria-label={`${label} ${index + 1}`}
            className={`h-12 min-w-0 flex-1 border bg-gray-50 px-4 font-medium text-gray-900 outline-none focus:bg-white ${inputErrors?.[index] ? "border-red-300" : "border-gray-200 focus:border-gray-900"}`}
          />
          <button
            type="button"
            onClick={() => update(values.filter((_, itemIndex) => itemIndex !== index))}
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            className="inline-flex size-12 shrink-0 items-center justify-center border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="size-4" />
          </button>
          {inputErrors?.[index] && <p className="absolute -bottom-4 left-0 text-[10px] font-medium text-red-500">{inputErrors[index].message}</p>}
        </div>
      ))}
      <p className="text-[10px] text-gray-400">Up to {MAX_CONTACTS} {label.toLowerCase()}.</p>
    </div>
  );
}

export default function ContactFields(props) {
  return (
    <div className="space-y-6">
      <ContactList {...props} type="email" label="Email addresses" plural="emails" singular="email" />
      <ContactList {...props} type="tel" label="Phone numbers" plural="phones" singular="phone" />
    </div>
  );
}
