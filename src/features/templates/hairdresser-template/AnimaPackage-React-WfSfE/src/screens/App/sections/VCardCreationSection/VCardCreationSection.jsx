export const VCardCreationSection = () => {
  const handleGetStarted = () => {
    window.dispatchEvent(new CustomEvent("vcard:create"));
  };

  return (
    <section
      className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-4 self-stretch bg-[#f0ede6] px-5 py-7"
      aria-labelledby="vcard-creation-heading"
    >
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-center self-stretch">
        <h2
          id="vcard-creation-heading"
          className="relative mt-[-1px] w-fit whitespace-nowrap text-center font-semibold text-[#1e3d25] [font-family:'Playfair_Display',Helvetica] text-lg leading-7 tracking-[0]"
        >
          Create Your VCard
        </h2>
      </div>
      <button
        type="button"
        onClick={handleGetStarted}
        className="relative flex w-[344px] flex-[0_0_auto] items-center justify-center rounded-xl bg-[#8b7355] px-0 py-3 text-center font-semibold text-sm leading-[21px] tracking-[0.35px] text-white [font-family:'Lato',Helvetica] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e3d25]"
      >
        Get Started — It&apos;s Free
      </button>
    </section>
  );
};
