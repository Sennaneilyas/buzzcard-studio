import { useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, UserCircle } from "lucide-react";
import * as z from "zod";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { getTemplateById } from "@/config/templates";
import { useAuthStore, useProfile } from "@/features/auth";
import {
  getOnboardingRedirect,
  getOnboardingSkipDestination,
  getProfileStudioPath,
} from "@/features/auth/utils/profileRouting";
import { cn } from "@/lib/utils";
import { useCreateDraftProfile } from "./api/useCreateDraftProfile";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepTemplate from "./steps/StepTemplate";

const onboardingSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
  profileLabel: z.string().trim().optional(),
  avatarUrl: z
    .union([z.literal(""), z.string().url("Enter a valid image URL")])
    .optional(),
});

const ONBOARDING_STEPS = [
  { id: "identity", label: "Identity", icon: UserCircle },
  { id: "template", label: "Template", icon: Sparkles },
];

function getIdentityDefaults(user) {
  const metadata = user?.user_metadata || {};
  const fullName =
    metadata.full_name ||
    metadata.name ||
    [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "";

  return {
    displayName: fullName,
    profileLabel: "",
    avatarUrl: metadata.avatar_url || metadata.picture || "",
  };
}

export default function OnboardingPage() {
  const user = useAuthStore((state) => state.user);
  const profileQuery = useProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createDraft = useCreateDraftProfile();
  const [activeStep, setActiveStep] = useState(0);
  const requestedTemplateId = getTemplateById(searchParams.get("template"))?.id;
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    requestedTemplateId || null,
  );

  const identityDefaults = useMemo(() => getIdentityDefaults(user), [user]);
  const methods = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onTouched",
    defaultValues: identityDefaults,
  });

  if (profileQuery.isLoading || !profileQuery.isFetched) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (profileQuery.isError) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-navy">We could not load your profile</h1>
          <p className="mt-2 text-sm text-ink/60">
            {profileQuery.error?.message || "Please check your connection and try again."}
          </p>
          <button
            type="button"
            onClick={() => profileQuery.refetch()}
            className="mt-6 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (profileQuery.data) {
    return <Navigate to={getOnboardingRedirect(profileQuery.data)} replace />;
  }

  const handleContinue = async () => {
    if (activeStep === 0) {
      const isValid = await methods.trigger([
        "displayName",
        "profileLabel",
        "avatarUrl",
      ]);
      if (isValid) setActiveStep(1);
      return;
    }

    if (!selectedTemplateId || createDraft.isPending) return;

    try {
      const values = methods.getValues();
      const { profile } = await createDraft.mutateAsync({
        ...values,
        templateId: selectedTemplateId,
        existingProfile: profileQuery.data,
      });

      const studioPath = getProfileStudioPath(profile);
      navigate(studioPath || getOnboardingSkipDestination(), { replace: true });
    } catch {
      // The mutation exposes the real Supabase error below; keep the form open.
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((step) => step - 1);
  };

  const handleSkip = () => {
    navigate(getOnboardingSkipDestination(), { replace: true });
  };

  const firstName = identityDefaults.displayName.split(" ")[0] || "there";

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-white font-sans">
      <header className="z-20 flex h-20 w-full shrink-0 items-center justify-between px-6 sm:px-10">
        <button
          type="button"
          onClick={handleBack}
          className={cn(
            "rounded-md px-2 py-1 text-sm font-bold tracking-wide text-navy transition-colors hover:text-navy/60",
            activeStep === 0 && "pointer-events-none opacity-0",
          )}
        >
          Back
        </button>

        <div className="mx-auto flex max-w-[200px] flex-1 items-center gap-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy/10"
            >
              <motion.div
                className="h-full bg-mint"
                animate={{ width: index <= activeStep ? "100%" : "0%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="rounded-md px-2 py-1 text-sm font-bold tracking-wide text-navy/45 transition-colors hover:text-navy"
        >
          Skip
        </button>
      </header>

      <main className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 sm:px-6">
        <div className="mb-8 shrink-0 pt-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {activeStep === 0
              ? `Welcome, ${firstName}!`
              : "Choose your starting template"}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-navy/60 sm:text-base">
            {activeStep === 0
              ? "Add only the essentials now. Everything else belongs in Studio."
              : "Preview each design, then create your draft and continue in Studio."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "mx-auto flex w-full flex-1 flex-col",
              activeStep === 0 ? "max-w-2xl" : "max-w-7xl",
            )}
          >
            {activeStep === 0 ? (
              <FormProvider {...methods}>
                <StepBasicInfo />
              </FormProvider>
            ) : (
              <StepTemplate
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {createDraft.isError && (
          <p role="alert" className="mt-5 text-center text-sm font-medium text-red-600">
            {createDraft.error?.message || "The draft profile could not be created."}
          </p>
        )}

        <div className="mx-auto mt-8 flex w-full max-w-2xl shrink-0 justify-center">
          <button
            type="button"
            onClick={handleContinue}
            disabled={
              createDraft.isPending ||
              (activeStep === 1 && !selectedTemplateId)
            }
            className="flex h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-[#6B97FF] text-base font-bold text-white shadow-md transition-all hover:bg-[#5A85EB] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {createDraft.isPending && <Loader2 className="size-4 animate-spin" />}
            {activeStep === 0
              ? "Continue"
              : createDraft.isPending
                ? "Creating Draft..."
                : "Create Draft & Open Studio"}
          </button>
        </div>
      </main>
    </div>
  );
}
