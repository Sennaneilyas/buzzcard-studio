import { useParams } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import TemplateRegistry from "@/config/TemplateRegistry";
import {
  buildPublicProfileViewModel,
  usePublishedProfile,
} from "@/features/public-profile/api/usePublishedProfile";

function PublicProfileMessage({ title, message }) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-6 text-center">
      <div className="max-w-md rounded-3xl border border-ink/[0.06] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-extrabold text-navy">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{message}</p>
      </div>
    </main>
  );
}

export default function PublicProfileRoute() {
  const { slug } = useParams();
  const profileQuery = usePublishedProfile(slug);

  if (profileQuery.isLoading || !profileQuery.isFetched) {
    return <GlobalLoader className="bg-cloud" />;
  }

  if (profileQuery.isError) {
    return (
      <PublicProfileMessage
        title="Profile unavailable"
        message="We could not load this BuzzCard right now. Please try again later."
      />
    );
  }

  const viewModel = buildPublicProfileViewModel(profileQuery.data);
  if (viewModel.state === "not_found") {
    return (
      <PublicProfileMessage
        title="Profile not found"
        message="This BuzzCard does not exist or is not publicly available."
      />
    );
  }

  if (viewModel.state === "template_unavailable") {
    return (
      <PublicProfileMessage
        title="Profile temporarily unavailable"
        message="This profile uses a template that is not supported by this version of BuzzCard."
      />
    );
  }

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-cloud font-sans">
      <TemplateRegistry
        templateId={viewModel.templateId}
        profileData={viewModel.profileData}
        isEditMode={false}
      />
    </div>
  );
}
