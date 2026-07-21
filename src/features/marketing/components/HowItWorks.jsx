import HowItWorksComponent from "../../../components/ui/how-it-works";

const buzzcardFeatures = [
  {
    title: "Create your digital identity",
    description: "Design your premium profile in seconds. Add your contact info, social links, and portfolio with our beautiful templates.",
  },
  {
    title: "Tap to share instantly",
    description: "Simply tap your sleek NFC metal card to any modern smartphone. No app download is required.",
  },
  {
    title: "Grow your network",
    description: "Capture leads directly to your CRM, track views, and update your information on the fly.",
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-cloud text-ink relative pt-24 pb-12 overflow-hidden">
      <div className="text-center relative z-20 px-6 max-w-4xl mx-auto mb-2 sm:mb-6">
        
        {/* Hanzo-style Subtitle with horizontal lines */}
        <div className="flex items-center justify-center gap-4 mb-6 opacity-80">
          <div className="w-12 h-[1px] bg-ink/20"></div>
          <span className="font-serif italic text-lg sm:text-xl tracking-wide text-ink/80">Our Process, Explained</span>
          <div className="w-12 h-[1px] bg-ink/20"></div>
        </div>

        <h2 className="text-4xl sm:text-[3.5rem] font-medium tracking-tight mb-4">
          Here's how it works
        </h2>
      </div>

      <HowItWorksComponent features={buzzcardFeatures} />
    </section>
  );
}
