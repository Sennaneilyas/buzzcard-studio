import { useEffect, useMemo, useState } from "react";
import { FileUp, ImageOff } from "lucide-react";
import {
  getBuzzCardPreviewUrl,
  getBuzzCardVariantKey,
} from "../api/cardPreviews";
import CustomBuzzCardPreview from "./CustomBuzzCardPreview";

const createLogoPreview = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => {
      const scale = Math.min(1, 640 / image.width, 360 / image.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/webp", 0.82));
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function CardPreview({ item, side, onSideChange }) {
  const variantKey = getBuzzCardVariantKey(item.variant);
  const isCustom = variantKey === "custom";
  const supportsBack = variantKey !== "essential";
  const previewUrl = useMemo(() => getBuzzCardPreviewUrl({
    variant: variantKey,
    color: item.configuration.color,
    side,
  }), [item.configuration.color, side, variantKey]);
  const [displayedUrl, setDisplayedUrl] = useState("");
  const [failedUrl, setFailedUrl] = useState("");
  const isLoading = previewUrl !== displayedUrl && previewUrl !== failedUrl;
  const hasError = previewUrl === failedUrl;

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;
      setDisplayedUrl(previewUrl);
      setFailedUrl("");
    };
    image.onerror = () => {
      if (cancelled) return;
      setFailedUrl(previewUrl);
    };
    image.src = previewUrl;

    return () => {
      cancelled = true;
    };
  }, [previewUrl]);

  return (
    <div className="w-full lg:sticky lg:top-24">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">Live preview</p>
          <p className="mt-0.5 text-xs text-ink/55">{side === "front" ? "Front" : "Back"} · {item.variant.name}</p>
        </div>
        {supportsBack && (
          <div className="grid grid-cols-2 rounded-full border border-ink/15 bg-white p-1" aria-label="Card side">
            {["front", "back"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSideChange(option)}
                className={`min-h-8 rounded-full px-3 text-xs font-bold capitalize transition ${side === option ? "bg-navy text-white" : "text-ink/55 hover:text-ink"}`}
                aria-pressed={side === option}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative aspect-[1012/638] w-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-navy/15 sm:rounded-[10px]" aria-busy={isLoading}>
        {isCustom ? (
          <CustomBuzzCardPreview
            color={item.configuration.color}
            side={side}
            name={item.customization.displayName ?? item.customization.businessName ?? ""}
            profession={item.customization.profession ?? ""}
            logoUrl={item.customization.logoUrl ?? item.customization.logoPreviewUrl ?? ""}
            imageClassName={`transition-opacity duration-200 ${isLoading ? "opacity-75" : "opacity-100"}`}
            onImageLoad={() => {
              setDisplayedUrl(previewUrl);
              setFailedUrl("");
            }}
            onImageError={() => setFailedUrl(previewUrl)}
          />
        ) : displayedUrl && (
          <img
            src={displayedUrl}
            alt={`${item.variant.name} BuzzCard in ${item.configuration.color}, ${side} side`}
            className={`absolute inset-0 size-full object-contain transition-opacity duration-200 ${isLoading ? "opacity-75" : "opacity-100"}`}
          />
        )}
        {isLoading && <span className="absolute inset-x-0 bottom-0 h-1 animate-pulse bg-mint" />}
        {hasError && (
          <div className="absolute inset-0 grid place-items-center bg-cloud px-6 text-center text-ink/50">
            <div>
              <ImageOff className="mx-auto size-7" />
              <p className="mt-2 text-xs font-semibold">Card preview is temporarily unavailable.</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-[11px] leading-4 text-ink/45">
        Browser preview only. Final production artwork is reviewed separately.
      </p>
    </div>
  );
}

export default function ClassicCardLiveEditor({
  item,
  availableVariants,
  onCustomizationChange,
  onFileChange,
  onVariantChange,
  onConfigurationChange,
}) {
  const [activeField, setActiveField] = useState("");
  const [isPreparingLogo, setIsPreparingLogo] = useState(false);
  const side = item.customization.previewSide === "back" ? "back" : "front";

  const update = (values) => onCustomizationChange(item.id, values);
  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(item.id, file);
    if (!file) {
      update({ logoUrl: "", logoPreviewUrl: "" });
      return;
    }

    setIsPreparingLogo(true);
    try {
      const logoUrl = await createLogoPreview(file);
      update({ logoUrl, logoPreviewUrl: logoUrl });
    } catch {
      onFileChange(item.id, null);
      update({ logoUrl: "", logoPreviewUrl: "" });
    } finally {
      setIsPreparingLogo(false);
    }
  };

  return (
    <div className="mt-3 grid gap-5 rounded-2xl bg-cloud p-3 sm:p-4 lg:grid-cols-[minmax(260px,0.92fr)_minmax(300px,1.08fr)] lg:gap-6">
      <CardPreview
        item={item}
        side={side}
        onSideChange={(previewSide) => update({ previewSide })}
      />

      <div className="space-y-4">
        {availableVariants.length > 1 && (
          <fieldset>
            <legend className="mb-2 text-xs font-bold text-ink/65">Card design</legend>
            <div className="grid grid-cols-3 gap-2">
              {availableVariants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onVariantChange(item.id, variant)}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-xl border px-2 text-sm font-semibold transition ${item.variant.id === variant.id ? "border-navy bg-white text-navy ring-2 ring-navy/10" : "border-ink/15 bg-white text-ink hover:border-navy/40"}`}
                >
                  <span>{variant.name}</span>
                  <span className="text-[10px] font-medium opacity-60">{variant.price} MAD</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="mb-2 text-xs font-bold text-ink/65">Card color</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "black", label: "Black", swatch: "bg-ink" },
              { value: "white", label: "White", swatch: "bg-cloud" },
            ].map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => onConfigurationChange(item.id, { color: color.value })}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${item.configuration.color === color.value ? "border-navy bg-white text-navy ring-2 ring-navy/10" : "border-ink/15 bg-white text-ink hover:border-navy/40"}`}
              >
                <span className={`size-4 rounded-full border border-ink/20 ${color.swatch}`} />
                {color.label}
              </button>
            ))}
          </div>
        </fieldset>

        {item.customization.designType === "custom" && (
          <>
          <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink/65">Logo</span>
          <span className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed bg-white px-4 text-sm font-semibold text-ink transition ${activeField === "logo" ? "border-navy ring-2 ring-navy/10" : "border-ink/25 hover:border-navy/50"}`}>
            <FileUp className="size-4 text-navy" />
            <span className="min-w-0 flex-1 truncate">{isPreparingLogo ? "Preparing preview…" : item.customization.fileName || "Upload your logo"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onFocus={() => setActiveField("logo")}
              onBlur={() => setActiveField("")}
              onChange={handleLogoChange}
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink/65">Card name</span>
          <input
            type="text"
            maxLength="48"
            value={item.customization.displayName ?? item.customization.businessName ?? ""}
            onFocus={() => setActiveField("displayName")}
            onBlur={() => setActiveField("")}
            onChange={(event) => update({ displayName: event.target.value })}
            placeholder="Your name"
            className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink/65">Profession</span>
          <input
            type="text"
            maxLength="64"
            value={item.customization.profession ?? ""}
            onFocus={() => setActiveField("profession")}
            onBlur={() => setActiveField("")}
            onChange={(event) => update({ profession: event.target.value })}
            placeholder="Your profession"
            className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
        </label>

          <p className="text-[11px] leading-4 text-ink/45">Your name, profession, and logo remain attached to this cart item. The original file is not uploaded yet.</p>
          </>
        )}
      </div>
    </div>
  );
}
