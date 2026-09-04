import { Image as ImageIcon, Tag, User } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function StepBasicInfo() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none";
  const errorClass =
    "border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500";
  const labelClass =
    "mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-gray-500";

  return (
    <div className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-xl shadow-black/[0.04] sm:p-8">
      <div className="mb-7 flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cloud text-navy">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="size-full object-cover"
            />
          ) : (
            <User className="size-7" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-navy">Your profile identity</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink/55">
            Keep it simple. Profile content and sections are added later in Studio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="onboarding-display-name">
            Display name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="onboarding-display-name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Salma El Amrani"
              className={cn(inputClass, errors.displayName && errorClass)}
              {...register("displayName")}
            />
          </div>
          {errors.displayName && (
            <p className="ml-1 mt-1 text-xs font-medium text-red-500">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="onboarding-profile-label">
            Profile label <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <div className="relative">
            <Tag className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="onboarding-profile-label"
              type="text"
              placeholder="e.g. Personal card"
              className={inputClass}
              {...register("profileLabel")}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="onboarding-avatar-url">
            Avatar image URL <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="onboarding-avatar-url"
              type="url"
              inputMode="url"
              placeholder="https://example.com/avatar.jpg"
              className={cn(inputClass, errors.avatarUrl && errorClass)}
              {...register("avatarUrl")}
            />
          </div>
          {errors.avatarUrl ? (
            <p className="ml-1 mt-1 text-xs font-medium text-red-500">
              {errors.avatarUrl.message}
            </p>
          ) : (
            <p className="ml-1 mt-2 text-xs text-ink/45">
              Provider avatars are prefilled when available. File uploads arrive with Storage in a later milestone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
