import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthPageLayout, AuthStatusMessage } from "./AuthPageLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const { register, handleSubmit: hookFormSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched"
  });

  const onSubmit = async (data) => {
    setMessage(null);
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      setMessage({ type: "error", text: "This reset link is invalid or expired. Request a new one and try again." });
      setIsSubmitting(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    navigate("/auth?mode=login", { replace: true });
  };

  return (
    <AuthPageLayout
      title="Choose a new password"
      description="Use a new password you have not used elsewhere."
    >
      <form onSubmit={hookFormSubmit(onSubmit)} className="mt-7 space-y-4">
        <PasswordField label="New password" error={errors.password?.message} {...register("password")} showPassword={showPassword} onToggleVisibility={() => setShowPassword((value) => !value)} />
        <PasswordField label="Confirm new password" error={errors.confirmPassword?.message} {...register("confirmPassword")} showPassword={showPassword} onToggleVisibility={() => setShowPassword((value) => !value)} />

        {message && <AuthStatusMessage message={message} />}

        <button type="submit" disabled={isSubmitting} className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90 disabled:opacity-60">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
        </button>
      </form>
    </AuthPageLayout>
  );
}

import React from "react";

const PasswordField = React.forwardRef(({ label, showPassword, onToggleVisibility, error, ...props }, ref) => {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className="block space-y-1.5 text-left relative">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-ink/55">{label}</span>
      </div>
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className={`h-11 w-full rounded-lg border bg-white px-3.5 pr-10 text-sm outline-none transition-colors ${
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-red-900 placeholder:text-red-300"
              : "border-ink/12 text-ink placeholder:text-ink/25 focus:border-navy/40 focus:ring-1 focus:ring-navy/20"
          }`}
          {...props}
        />
        <button type="button" onClick={onToggleVisibility} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{error}</p>}
    </label>
  );
});
PasswordField.displayName = "PasswordField";
