import { useEffect, useId, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  Mail,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { getSafeReturnTo } from "../utils/returnTo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address")
});

const magicLinkSignupSchema = magicLinkSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms")
});

export default function AuthForm() {
  const [searchParams] = useSearchParams();
  const [authMethod, setAuthMethod] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const user = useAuthStore((s) => s.user);
  const setError = useAuthStore((s) => s.setError);
  const navigate = useNavigate();
  const isSignup = searchParams.get("mode") !== "login";
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = getSafeReturnTo(requestedReturnTo);
  const authRedirectUrl = `${window.location.origin}/auth?returnTo=${encodeURIComponent(returnTo)}`;

  const currentSchema = isSignup
    ? (authMethod === "magic-link" ? magicLinkSignupSchema : signupSchema)
    : (authMethod === "magic-link" ? magicLinkSchema : loginSchema);

  const { register, handleSubmit: hookFormSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onTouched"
  });

  useEffect(() => {
    reset();
  }, [isSignup, authMethod, reset]);

  // ── Redirect to the requested internal route when authenticated ──
  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const handleOAuth = async (provider) => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: authRedirectUrl },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setError(error.message);
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);

    if (authMethod === "magic-link") {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: authRedirectUrl,
          shouldCreateUser: isSignup,
          ...(isSignup && {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              full_name: `${data.firstName} ${data.lastName}`,
            },
          }),
        },
      });
      if (error) setMessage({ type: "error", text: error.message });
      else setMessage({ type: "success", text: "Magic link sent! Check your inbox." });
    } else {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: authRedirectUrl,
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              full_name: `${data.firstName} ${data.lastName}`,
            },
          },
        });
        if (error) setMessage({ type: "error", text: error.message });
        else setMessage({ type: "success", text: "Check your inbox to confirm your email and activate your 7-day trial!" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
          setError(error.message);
        }
      }
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMessage(null);
    const params = new URLSearchParams({ mode: isSignup ? "login" : "signup" });
    if (requestedReturnTo) params.set("returnTo", returnTo);
    navigate(`/auth?${params.toString()}`);
  };

  // ─────────── Marketing Panel ───────────
  const marketingPanel = (
    <div className="relative hidden h-full flex-col items-center justify-between overflow-hidden bg-ink px-12 py-16 text-cloud lg:flex">
      
      {/* Cinematic Spotlight (Lamp effect) */}
      <div className="absolute left-1/2 top-[30%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/25 opacity-80 blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="flex h-full w-full flex-col items-center justify-between"
      >
        {/* Card images (Fanned out, Static) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
          }}
          className="relative flex w-full flex-1 items-center justify-center"
        >
          {/* Back Card (Tilted Left, Behind) */}
          <img
            src="/Card back.svg"
            alt="BuzzCard NFC Back"
            className="absolute w-[220px] -translate-x-6 -rotate-6 drop-shadow-xl sm:w-[260px] sm:-translate-x-8"
          />
          {/* Front Card (Tilted Right, Foreground) */}
          <img
            src="/Card front.svg"
            alt="BuzzCard NFC Front"
            className="absolute z-10 w-[220px] translate-x-4 translate-y-4 rotate-3 drop-shadow-2xl sm:w-[260px] sm:translate-x-6"
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
          }}
          className="mt-8 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Your digital identity,
            <br />
            one tap away.
          </h2>
          <p className="mx-auto mt-3 max-w-[300px] text-sm leading-relaxed text-cloud/60">
            Design your NFC card, share your profile instantly, and update your
            info anytime — no reprinting needed.
          </p>
        </motion.div>

        {/* Switch button — arrow flips direction based on mode */}
        <motion.button
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
          }}
          type="button"
          onClick={switchMode}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="mt-10 flex h-12 items-center gap-2 rounded-xl border border-cloud/20 px-6 text-sm font-medium text-cloud transition-colors hover:bg-cloud/10"
        >
          {isSignup ? (
            <>
              Log in instead
              <ArrowRight className="size-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="size-4" />
              Create an account
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );

  // ─────────── Form Panel ───────────
  const formPanel = (
    <div className="flex min-h-[100dvh] flex-col items-start justify-center bg-white px-5 py-6 sm:px-8 sm:py-10 lg:h-full lg:min-h-0 lg:items-center lg:overflow-hidden lg:px-14 lg:py-10">
      <div className="mb-10 flex w-full max-w-[420px] shrink-0 items-center justify-between lg:mb-8">
        <Link to="/" className="inline-flex items-center" aria-label="BuzzCard home">
          <img src="/logoHB.svg" alt="BuzzCard" className="h-7 w-auto" />
        </Link>
        <button
          type="button"
          onClick={switchMode}
          className="rounded-full bg-cloud px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-navy/10 lg:hidden"
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
        }}
        className="w-full max-w-[420px] lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
      >
        {/* Title */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-navy/45">
            {isSignup ? "Get started" : "Welcome back"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-[2rem]">
            {isSignup ? "Create an account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/55">
            {isSignup
              ? "Start your 7-day free trial today."
              : "Sign in to your BuzzCard dashboard."}
          </p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className={`overflow-hidden rounded-xl px-4 py-3 text-sm ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* OAuth Buttons */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-8 grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink/12 bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50"
          >
            <GoogleIcon />
            <span>Google</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleOAuth("facebook")}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink/12 bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50"
          >
            <FacebookIcon />
            <span>Facebook</span>
          </motion.button>
        </motion.div>

        {/* Magic Link */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
          <motion.button
            type="button"
            onClick={() => {
              setAuthMethod("magic-link");
              setMessage(null);
            }}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink/12 bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50"
          >
            <Mail className="size-4 shrink-0 text-ink/50" />
            <span>Magic link</span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={{ hidden: { opacity: 0, y: 7 }, visible: { opacity: 1, y: 0 } }} className="my-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/30">
          <div className="h-px flex-1 bg-ink/8" />
          or continue with email
          <div className="h-px flex-1 bg-ink/8" />
        </motion.div>

        {/* Form */}
        <form
          onSubmit={hookFormSubmit(onSubmit)}
          className="space-y-4"
        >
          <AnimatePresence>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-3 overflow-hidden"
              >
                <InputField
                  label="First name"
                  placeholder="Jane"
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <InputField
                  label="Last name"
                  placeholder="Doe"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </motion.div>

          {authMethod === "password" && (
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="relative">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                error={errors.password?.message}
                {...register("password")}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileTap={{ scale: 0.85 }}
                className="absolute right-3.5 top-[38px] text-ink/35 hover:text-ink transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </motion.button>
            </motion.div>
          )}

          {authMethod === "password" && !isSignup && (
            <div className="-mt-1 text-right">
              <Link
                to="/auth/forgot-password"
                className="text-xs font-medium text-navy/70 underline underline-offset-2 transition-colors hover:text-navy"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <AnimatePresence>
            {isSignup && authMethod === "password" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden pt-1" // pt-1 prevents border clipping during animation
              >
                <InputField
                  label="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileTap={{ scale: 0.85 }}
                  className="absolute right-3.5 top-[42px] text-ink/35 hover:text-ink transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms (signup only) */}
          <AnimatePresence>
            {isSignup && (
              <motion.label 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 overflow-hidden pt-1 text-xs leading-5 text-ink/50 cursor-pointer"
              >
                <span className="relative mt-0.5 size-4 shrink-0">
                  <input
                    type="checkbox"
                    className="peer size-full cursor-pointer appearance-none rounded border border-ink/20 bg-white checked:border-navy checked:bg-navy"
                    {...register("agreedToTerms")}
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
              </motion.label>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-navy text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,35,102,0.18)] transition-colors hover:bg-navy/90 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : authMethod === "magic-link" ? (
                "Send magic link"
              ) : isSignup ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </motion.button>
          </motion.div>

          {authMethod === "magic-link" && (
            <button
              type="button"
              onClick={() => {
                setAuthMethod("password");
                setMessage(null);
              }}
              className="w-full pt-1 text-xs font-medium text-navy/70 underline underline-offset-2 transition-colors hover:text-navy"
            >
              Use email and password instead
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );

  // ─────────── Layout ───────────
  return (
    <section className="relative min-h-[100dvh] overflow-x-hidden bg-cloud lg:flex lg:items-center lg:justify-center lg:p-6">
      <div className="pointer-events-none absolute -left-32 -top-28 h-72 w-72 rounded-full bg-mint/20 blur-3xl lg:hidden" />
      <div
        className={`relative mx-auto w-full max-w-[1120px] overflow-hidden bg-white lg:flex lg:h-[720px] lg:min-h-[720px] lg:rounded-3xl lg:shadow-[0_24px_80px_rgba(17,24,39,0.12)] ${
          isSignup ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <motion.div
          layout="position"
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="hidden h-full flex-1 bg-ink lg:block"
        >
          {marketingPanel}
        </motion.div>
        <motion.div
          layout="position"
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="h-full flex-1 bg-white"
        >
          {formPanel}
        </motion.div>
      </div>
    </section>
  );
}

// ── Reusable Input Field ──
import React from "react";

const InputField = React.forwardRef(({
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  ...props
}, ref) => {
  const inputId = useId();

  return (
    <div className="w-full space-y-1 text-left relative">
      <label htmlFor={inputId} className="text-xs font-semibold text-ink/60 ml-1">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`flex h-12 w-full rounded-xl border bg-white px-3.5 text-[16px] outline-none transition-colors ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-red-900 placeholder:text-red-300"
            : "border-ink/12 text-ink placeholder:text-ink/30 focus:border-navy/50 focus:ring-2 focus:ring-navy/10"
        }`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-medium ml-1 mt-0.5 absolute -bottom-4">{error}</p>}
    </div>
  );
});
InputField.displayName = "InputField";

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
