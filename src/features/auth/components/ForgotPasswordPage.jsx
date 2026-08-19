import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthPageLayout, AuthStatusMessage } from "./AuthPageLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address.")
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const emailInputId = useId();

  const { register, handleSubmit: hookFormSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onTouched"
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(
      data.email,
      { redirectTo: `${window.location.origin}/auth/reset-password` },
    );

    if (error) {
      const isRateLimited = error.status === 429 || /rate limit/i.test(error.message);
      setMessage({
        type: "error",
        text: isRateLimited
          ? "Too many email requests were sent. Please wait before trying again."
          : "We could not send the reset email. Please try again.",
      });
    } else {
      // Avoid revealing whether an email address is registered.
      setMessage({
        type: "success",
        text: "If an account exists for this email, a password reset link is on its way.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <AuthPageLayout
      title="Reset your password"
      description="Enter your email and we’ll send you a secure reset link."
    >
      <form onSubmit={hookFormSubmit(onSubmit)} className="mt-7 space-y-5">
        <label htmlFor={emailInputId} className="block space-y-1.5 text-left relative">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-ink/55">Email</span>
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
            <input
              id={emailInputId}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`h-11 w-full rounded-lg border bg-white py-2 pl-10 pr-3.5 text-sm outline-none transition-colors ${
                errors.email 
                  ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-red-900 placeholder:text-red-300"
                  : "border-ink/12 text-ink placeholder:text-ink/25 focus:border-navy/40 focus:ring-1 focus:ring-navy/20"
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0">{errors.email.message}</p>}
        </label>

        {message && <AuthStatusMessage message={message} />}

        <button type="submit" disabled={isSubmitting} className="flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90 disabled:opacity-60">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
        </button>
      </form>

      <Link to="/auth?mode=login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy/70 transition-colors hover:text-navy">
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </AuthPageLayout>
  );
}
