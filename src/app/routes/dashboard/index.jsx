import { Link } from "react-router-dom";
import { ArrowRight, Eye, FilePlus2, LayoutDashboard, Palette } from "lucide-react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { getTemplateById } from "@/config/templates";
import { useAuthStore, useProfile } from "@/features/auth";
import {
  TEMPLATE_CATALOGUE_PATH,
  getProfileStudioPath,
  getPublicProfilePath,
} from "@/features/auth/utils/profileRouting";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const profileQuery = useProfile();

  if (profileQuery.isLoading || !profileQuery.isFetched) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (profileQuery.isError) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-navy">Your dashboard is unavailable</h1>
          <p className="mt-2 text-sm text-ink/60">
            {profileQuery.error?.message || "We could not load your profile."}
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

  const profile = profileQuery.data;
  const studioPath = getProfileStudioPath(profile);
  const actionPath = profile ? studioPath || "/onboarding" : "/onboarding";
  const isDraft = profile?.status === "draft";
  const publicPath = !isDraft ? getPublicProfilePath(profile) : null;
  const currentTemplate = getTemplateById(profile?.template_id);

  return (
    <main className="min-h-[100dvh] bg-cloud px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="BuzzCard home">
            <img src="/logoHB.svg" alt="BuzzCard" className="h-8 w-auto" />
          </Link>
          <span className="max-w-[50vw] truncate text-sm font-medium text-ink/55">
            {user?.email}
          </span>
        </header>

        <section className="mt-12 overflow-hidden rounded-3xl border border-ink/[0.06] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-navy text-white">
            {profile ? (
              <LayoutDashboard className="size-5" />
            ) : (
              <FilePlus2 className="size-5" />
            )}
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
            {profile
              ? isDraft
                ? "Draft profile"
                : "Published profile"
              : "No profile yet"}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {profile
              ? isDraft
                ? "Continue building your BuzzCard"
                : `Welcome back, ${profile.full_name}`
              : "Create your first BuzzCard when you are ready"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60 sm:text-base">
            {profile
              ? isDraft
                ? "Your draft is safe. Continue setup in Studio without restarting onboarding."
                : "Your profile is published. Open Studio whenever you want to edit it."
              : "Skipping setup does not create an empty profile. You can return here and start later."}
          </p>

          {profile && currentTemplate && (
            <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-navy/10 bg-cloud/55 p-4 sm:flex-row sm:items-center">
              <img
                src={currentTemplate.thumbnail}
                alt={`${currentTemplate.name} preview`}
                className="aspect-square w-full rounded-xl object-cover object-top sm:size-24"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy/45">
                  Current template · {isDraft ? "Draft" : "Published"}
                </p>
                <h2 className="mt-1 truncate text-lg font-bold text-navy">
                  {currentTemplate.name}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={studioPath}
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-bold text-white"
                  >
                    <Palette className="size-3.5" />
                    Customize
                  </Link>
                  <Link
                    to={TEMPLATE_CATALOGUE_PATH}
                    className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-xs font-bold text-navy"
                  >
                    Change Template
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={actionPath}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-navy/90"
            >
              {profile ? (isDraft ? "Continue Setup" : "Edit Profile") : "Create Profile"}
              <ArrowRight className="size-4" />
            </Link>
            {publicPath && (
              <Link
                to={publicPath}
                className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
              >
                <Eye className="size-4" />
                View Profile
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
