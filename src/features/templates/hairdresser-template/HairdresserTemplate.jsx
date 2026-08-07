import { Suspense, memo, useCallback } from "react";
import { lazy } from "react";

// The original App.jsx exports a named `App` (not a default export).
// React.lazy requires the module to provide a default export — map the
// named export to `default` so lazy() works in both dev and prod.
const HairdresserApp = lazy(() =>
    import(
        "@/features/templates/hairdresser-template/AnimaPackage-React-WfSfE/src/screens/App/App.jsx"
    ).then((mod) => ({ default: mod.App || mod.default }))
);

function HairdresserTemplate({ profile = {}, socials = [], gallery = [], onSave, onQrCode }) {
    const handleSave = useCallback(() => {
        if (onSave) {
            onSave();
            return;
        }

        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({
                title: profile.fullName || "BuzzCard profile",
                text: "Visit this beauty profile",
                url: window.location.href,
            }).catch(() => undefined);
        }
    }, [onSave, profile.fullName]);

    const handleQrCode = useCallback(() => {
        if (onQrCode) {
            onQrCode();
            return;
        }

        window.dispatchEvent(new CustomEvent("vcard:create"));
    }, [onQrCode]);

    return (
        <div className="min-h-screen bg-[#f4f5f7] px-3 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl justify-center">
                <div className="w-full max-w-[420px] rounded-[30px] border border-black/5 bg-[#f4efe8] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
                    <Suspense
                        fallback={
                            <div className="flex min-h-[720px] items-center justify-center rounded-[24px] bg-[#f5f4f0] text-sm font-medium text-slate-600">
                                Loading profile…
                            </div>
                        }
                    >
                        <HairdresserApp />
                    </Suspense>
                </div>
            </div>

            <div className="mx-auto mt-4 flex max-w-[420px] gap-2">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 rounded-2xl bg-[#1e3d25] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#274a2d]"
                >
                    Save contact
                </button>
                <button
                    type="button"
                    onClick={handleQrCode}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                    Show QR
                </button>
            </div>
        </div>
    );
}

export default memo(HairdresserTemplate);
