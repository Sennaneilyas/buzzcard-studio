import { Check, FileUp, Trash2 } from "lucide-react";
import ProductImageFrame from "./ProductImageFrame";
import ClassicCardLiveEditor from "./ClassicCardLiveEditor";
import {
  CONFIGURATION_FIELDS,
  getCartItemErrors,
  isClassiqueProduct,
} from "../checkout/configuration";

function ConfigurationFields({ item, onChange }) {
  if (item.configurationType === "profile") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">BuzzCard profile</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "new_profile", label: "Create a new profile" },
            { value: "existing_profile", label: "Link an existing profile" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ profileMode: option.value })}
              className={`min-h-12 rounded-xl border px-3 text-left text-xs font-semibold transition ${
                item.configuration.profileMode === option.value
                  ? "border-navy bg-navy text-white"
                  : "border-ink/15 bg-white text-ink hover:border-navy/40"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {item.configuration.profileMode === "existing_profile" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink/65">Profile username</span>
            <input
              type="text"
              value={item.configuration.profileUsername ?? ""}
              onChange={(event) => onChange({ profileUsername: event.target.value })}
              placeholder="your-buzzcard-username"
              className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
          </label>
        )}
      </div>
    );
  }

  const field = CONFIGURATION_FIELDS[item.configurationType];
  if (!field) return null;

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{field.label}</span>
      <input
        type={field.inputMode === "url" ? "url" : "text"}
        inputMode={field.inputMode}
        value={item.configuration[field.key] ?? ""}
        onChange={(event) => onChange({ [field.key]: event.target.value })}
        placeholder={field.placeholder}
        className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
      />
    </label>
  );
}

export default function CheckoutConfigurationItem({
  item,
  index,
  availableVariants,
  onConfigurationChange,
  onCustomizationChange,
  onFileChange,
  onVariantChange,
  onRemove,
}) {
  const errors = getCartItemErrors(item);
  const isComplete = !errors.configuration && !errors.customization;
  const supportsCustomization = item.customizationMode !== "none";
  const isClassicCard = isClassiqueProduct(item.slug);
  const designOptions = [
    { value: "standard", label: "Standard design" },
    { value: "custom", label: "Custom design" },
  ];

  return (
    <article className="rounded-[24px] border border-ink/10 bg-white p-4 shadow-lg shadow-navy/5 sm:p-5">
      <div className="flex items-start gap-4">
        <ProductImageFrame
          src={item.image}
          alt=""
          className="size-20 shrink-0 rounded-2xl sm:size-24"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40">Item {index + 1}</p>
              <h2 className="mt-1 font-heading text-lg font-bold leading-tight text-ink">{item.name}</h2>
              <p className="mt-1 text-xs text-ink/55">{item.variant.name} · Quantity {item.quantity}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`grid size-7 place-items-center rounded-full ${isComplete ? "bg-mint text-ink" : "bg-cloud text-ink/30"}`}>
                <Check className="size-4" />
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="grid size-8 place-items-center rounded-full text-ink/40 transition hover:bg-cloud hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`Remove ${item.name} from checkout`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-navy">{item.price * item.quantity} MAD</p>
        </div>
      </div>

      <div className="mt-5 border-t border-ink/10 pt-5">
        <ConfigurationFields
          item={item}
          onChange={(configuration) => onConfigurationChange(item.id, configuration)}
        />
        {errors.configuration && <p className="mt-2 text-xs font-medium text-primary">{errors.configuration}</p>}
      </div>

      {supportsCustomization && (
        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-sm font-semibold text-ink">{isClassicCard ? "Configure your Classique card" : "Product design"}</p>
          {!isClassicCard && <div className="mt-2 grid grid-cols-2 gap-2">
            {designOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onCustomizationChange(item.id, { designType: option.value })}
                className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition ${
                  item.customization.designType === option.value
                    ? "border-navy bg-navy text-white"
                    : "border-ink/15 bg-white text-ink hover:border-navy/40"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>}

          {isClassicCard && (
            <ClassicCardLiveEditor
              item={item}
              availableVariants={availableVariants ?? item.availableVariants ?? [item.variant]}
              onCustomizationChange={onCustomizationChange}
              onFileChange={onFileChange}
              onVariantChange={onVariantChange}
              onConfigurationChange={onConfigurationChange}
            />
          )}

          {!isClassicCard && item.customization.designType === "custom" && (
            <div className="mt-3 space-y-3 rounded-2xl bg-cloud p-3">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink/25 bg-white px-4 text-sm font-semibold text-ink transition hover:border-navy/50">
                <FileUp className="size-4 text-navy" />
                <span className="min-w-0 flex-1 truncate">
                  {item.customization.fileName || "Attach a design reference"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  className="sr-only"
                  onChange={(event) => onFileChange(item.id, event.target.files?.[0] ?? null)}
                />
              </label>
              <label className="block">
                <span className="sr-only">Custom design instructions</span>
                <textarea
                  rows="3"
                  value={item.customization.designNotes ?? ""}
                  onChange={(event) => onCustomizationChange(item.id, { designNotes: event.target.value })}
                  placeholder="Describe your logo, colors, text, or layout..."
                  className="w-full resize-none rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
                />
              </label>
              <p className="text-[11px] leading-4 text-ink/45">The file is kept in checkout state only and is not uploaded yet.</p>
            </div>
          )}
          {errors.customization && <p className="mt-2 text-xs font-medium text-primary">{errors.customization}</p>}
        </div>
      )}
    </article>
  );
}
