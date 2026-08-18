import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthPageLayout, AuthStatusMessage } from "./AuthPageLayout";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });

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
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <PasswordField label="New password" value={password} onChange={setPassword} showPassword={showPassword} onToggleVisibility={() => setShowPassword((value) => !value)} />
        <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} showPassword={showPassword} onToggleVisibility={() => setShowPassword((value) => !value)} />

        {message && <AuthStatusMessage message={message} />}

        <button type="submit" disabled={isSubmitting} className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-navy text-sm font-medium text-white transition-colors hover:bg-navy/90 disabled:opacity-60">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
        </button>
      </form>
    </AuthPageLayout>
  );
}

function PasswordField({ label, value, onChange, showPassword, onToggleVisibility }) {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className="block space-y-1.5 text-left">
      <span className="text-xs font-semibold text-ink/55">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          required
          className="h-11 w-full rounded-lg border border-ink/12 bg-white px-3.5 pr-10 text-sm text-ink outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/20"
        />
        <button type="button" onClick={onToggleVisibility} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}
