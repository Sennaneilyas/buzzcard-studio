export const StylistProfileHeroSection = () => {
  return (
    <section
      className="relative self-stretch w-full h-[362.5px] bg-[#1e3d25]"
      aria-labelledby="stylist-profile-name"
    >
      <div
        className="absolute top-0 left-0 w-96 h-[362px] opacity-50 bg-[url(/img/container.png)] bg-cover bg-[50%_50%]"
        aria-hidden="true"
      />
      <img
        className="absolute top-[291px] left-[326px] w-[38px] h-[38px]"
        alt=""
        aria-hidden="true"
        src="/img/container-1.svg"
      />
      <div className="inline-flex flex-col items-start pt-0 pb-4 px-0 absolute top-10 left-[147px]">
        <div
          className="flex flex-col w-[90px] h-[90px] items-start relative bg-[#e8e4dc] rounded-[45px] overflow-hidden border-4 border-solid border-[#8b7355] shadow-[0px_10px_15px_-3px_#0000001a,0px_0px_0px_5.96px_#8b735501]"
          role="img"
          aria-label="Lara Miller"
        >
          <div className="relative self-stretch w-full h-[82px] bg-[url(/img/image-lara-miller.png)] bg-cover bg-[50%_50%]" />
          <div
            className="absolute top-[3px] left-52 w-[82px] h-[85px] rounded-[41.72px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0)_100%)]"
            aria-hidden="true"
          />
        </div>
      </div>
      <header>
        <h1
          id="stylist-profile-name"
          className="absolute top-[162px] left-32 [font-family:'Playfair_Display',Helvetica] font-semibold text-white text-2xl text-center tracking-[0.60px] leading-8 whitespace-nowrap"
        >
          Lara Miller
        </h1>
        <p className="absolute top-[196px] left-28 [font-family:'Lato',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
          Hair Dresser at New Salon
        </p>
      </header>
      <p className="absolute top-[220px] left-8 w-80 [font-family:'Lato',Helvetica] font-normal text-[#fef5e2] text-xs text-center tracking-[0] leading-[19.5px]">
        Passionate about creating beautiful styles that enhance your natural
        beauty. Over 10 years of professional experience in New York City.
      </p>
      <div className="absolute top-[258px] left-28 flex items-center gap-3">
        <button
          type="button"
          className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
          onClick={() => {
            try {
              const ev = new CustomEvent("profile:follow", { detail: { name: "Lara Miller" } });
              window.dispatchEvent(ev);
              // show a quick native toast fallback
              // real toast handled by ToastProvider via global event
            } catch (e) {
              // noop
            }
          }}
        >
          Follow
        </button>
        <button
          type="button"
          className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
          onClick={() => window.dispatchEvent(new CustomEvent("vcard:create"))}
        >
          Save
        </button>
      </div>
      <img
        className="absolute top-[298px] left-24 w-48 h-8"
        alt=""
        aria-hidden="true"
        src="/img/container-2.svg"
      />
    </section>
  );
};
