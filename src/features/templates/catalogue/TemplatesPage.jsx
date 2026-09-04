import { useEffect } from "react";
import { ArrowLeft, Check, Eye, LayoutTemplate, Pencil } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { TEMPLATES, getTemplateById } from "@/config/templates";
import { useAuthStore, useProfile } from "@/features/auth";
import {
  DASHBOARD_PATH,
  getTemplateCatalogueActionLabel,
  getTemplateSelectionDestination,
} from "@/features/auth/utils/profileRouting";
import { prefetchTemplate } from "@/lib/prefetch";

export default function TemplatesPage() {
  const user = useAuthStore((state) => state.user);
  const authIsLoading = useAuthStore((state) => state.isLoading);
  const profileQuery = useProfile({ enabled: Boolean(user) });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedTemplateId = searchParams.get("use");
  const requestedTemplate = getTemplateById(requestedTemplateId);

  useEffect(() => {
    if (
      !requestedTemplate ||
      !user ||
      !profileQuery.isFetched ||
      profileQuery.isFetching ||
      profileQuery.isError
    ) {
      return;
    }

    navigate(
      getTemplateSelectionDestination({
        user,
        profile: profileQuery.data,
        templateId: requestedTemplate.id,
      }),
      { replace: true },
    );
  }, [
    navigate,
    profileQuery.data,
    profileQuery.isError,
    profileQuery.isFetched,
    profileQuery.isFetching,
    requestedTemplate,
    user,
  ]);

  if (authIsLoading || (user && profileQuery.isLoading)) {
    return <GlobalLoader className="bg-cloud" />;
  }

  const profile = profileQuery.data;
  const returnPath = user ? DASHBOARD_PATH : "/";

  const handleUseTemplate = (templateId) => {
    navigate(getTemplateSelectionDestination({ user, profile, templateId }));
  };

  return (
    <main className="min-h-[100dvh] bg-cloud px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <Link
            to={returnPath}
            className="inline-flex items-center gap-2 text-sm font-bold text-navy/65 transition-colors hover:text-navy"
          >
            <ArrowLeft className="size-4" />
            {user ? "Dashboard" : "Home"}
          </Link>
          <Link to="/" aria-label="BuzzCard home">
            <img src="/logoHB.svg" alt="BuzzCard" className="h-8 w-auto" />
          </Link>
        </header>

        <section className="mt-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
              Template catalogue
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Choose the right look for your BuzzCard
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ink/60 sm:text-base">
              Preview every design before opening it in Studio. Your current profile stays unchanged until you explicitly apply another template.
            </p>
          </div>

          {profileQuery.isError && (
            <div role="alert" className="mt-8 rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-700">
              We could not identify your current template. You can still preview designs, but reload before selecting one.
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => {
              const isCurrent = profile?.template_id === template.id;

              return (
                <article
                  key={template.id}
                  onMouseEnter={() => prefetchTemplate(template.id)}
                  className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white shadow-sm"
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-navy/5">
                    <img
                      src={template.thumbnail}
                      alt={`${template.name} template preview`}
                      loading="lazy"
                      className="size-full object-cover object-top"
                    />
                    {isCurrent && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                        <Check className="size-3" />
                        Current template
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <LayoutTemplate className="size-4 text-navy/45" />
                      <h2 className="font-bold text-navy">{template.name}</h2>
                    </div>
                    <div className="mt-5 grid gap-2">
                      <Link
                        to={template.previewUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
                      >
                        <Eye className="size-4" />
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template.id)}
                        disabled={Boolean(user && profileQuery.isError)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Pencil className="size-4" />
                        {getTemplateCatalogueActionLabel(profile, template.id)}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
