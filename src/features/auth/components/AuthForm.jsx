import { useState } from "react";
import { Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Unified Login / Register form.
 * Switches between modes via internal state — OAuth buttons render identically
 * in both modes because Supabase resolves signup vs login internally.
 */
export default function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const setError = useAuthStore((s) => s.setError);

  const isSignup = mode === "signup";

  // ── OAuth ──
  const handleOAuth = async (provider) => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setError(error.message);
    }
    setLoading(false);
  };

  // ── Magic Link ──
  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Enter your email first." });
      return;
    }
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Magic link sent! Check your inbox.",
      });
    }
    setLoading(false);
  };

  // ── Email + Password ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: "error", text: "Email and password are required." });
      return;
    }

    if (isSignup) {
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match." });
        return;
      }
      if (password.length < 6) {
        setMessage({
          type: "error",
          text: "Password must be at least 6 characters.",
        });
        return;
      }
      if (!agreedToTerms) {
        setMessage({
          type: "error",
          text: "You must agree to the terms to continue.",
        });
        return;
      }
    }

    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your inbox to confirm your email and activate your 7-day trial!",
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
        setError(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-cloud px-4 py-12">
      <div className="w-full max-w-[460px] rounded-2xl border border-ink/8 bg-white p-8 shadow-sm sm:p-10">
        {/* ── Header ── */}
        <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
          {isSignup ? "Create an account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-ink/50">
          {isSignup
            ? "Start your 7-day free trial today."
            : "Sign in to your BuzzCard dashboard."}
        </p>

        {/* ── Status Message ── */}
        {message && (
          <div
            className={`mt-5 rounded-lg px-4 py-3 text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ── OAuth Buttons ── */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-ink/12 bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50"
          >
            <GoogleIcon />
            <span className="whitespace-nowrap">Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("facebook")}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-ink/12 bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50"
          >
            <FacebookIcon />
            <span className="whitespace-nowrap">Facebook</span>
          </button>
        </div>

        {/* ── Magic Link ── */}
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-ink/12 bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50"
        >
          <Mail className="size-4 shrink-0 text-ink/50" />
          <span className="whitespace-nowrap">Magic link</span>
        </button>

        {/* ── Divider ── */}
        <div className="my-6 flex items-center gap-4 text-xs font-medium text-ink/30">
          <div className="h-px flex-1 bg-ink/8" />
          or continue with email
          <div className="h-px flex-1 bg-ink/8" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
          />

          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={setPassword}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[38px] text-ink/35 hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {isSignup && (
            <div className="relative">
              <InputField
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-[38px] text-ink/35 hover:text-ink"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          )}

          {/* ── Terms (signup only) ── */}
          {isSignup && (
            <label className="flex items-start gap-3 pt-1 text-xs leading-5 text-ink/45 cursor-pointer">
              <span className="relative mt-0.5 size-4 shrink-0">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="peer size-full cursor-pointer appearance-none rounded border border-ink/20 bg-white checked:border-navy checked:bg-navy"
                />
                <svg
                  viewBox="0 0 12 12"
                  className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-white peer-checked:block"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 6.2 5 8.1 9 3.9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-navy/70 underline underline-offset-2"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-navy/70 underline underline-offset-2"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isSignup ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* ── Mode Toggle ── */}
        <p className="mt-6 text-center text-sm text-ink/45">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setMessage(null);
            }}
            className="font-medium text-navy hover:underline"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </section>
  );
}

// ── Reusable Input Field ──
function InputField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="space-y-1.5 text-left w-full">
      <label className="text-xs font-semibold text-ink/55">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-11 w-full rounded-lg border border-ink/12 bg-white px-3.5 text-sm text-ink outline-none placeholder:text-ink/25 focus:border-navy/40 focus:ring-1 focus:ring-navy/20 transition-colors"
      />
    </div>
  );
}

// ── SVG Icons ──

function GoogleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#1877F2"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.098 24 12.073Z" />
    </svg>
  );
}
