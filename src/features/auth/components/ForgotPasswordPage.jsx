import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthPageLayout, AuthStatusMessage } from "./AuthPageLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const emailInputId = useId();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage({ type: "error", text: "Enter your email address." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
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
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <label htmlFor={emailInputId} className="block space-y-1.5 text-left">
          <span className="text-xs font-semibold text-ink/55">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
            <input
              id={emailInputId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="h-11 w-full rounded-lg border border-ink/12 bg-white py-2 pl-10 pr-3.5 text-sm text-ink outline-none placeholder:text-ink/25 focus:border-navy/40 focus:ring-1 focus:ring-navy/20"
            />
          </div>
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
