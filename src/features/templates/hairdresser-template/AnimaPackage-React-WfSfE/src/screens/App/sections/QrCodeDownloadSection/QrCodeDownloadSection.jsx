export const QrCodeDownloadSection = () => {
  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/img/container-13.svg";
    downloadLink.download = "contact-qr-code.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <section
      className="flex flex-col h-[359px] items-start px-5 py-7 relative self-stretch w-full bg-[#f0ede6]"
      aria-labelledby="qr-code-heading"
    >
      <div className="flex flex-col items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
        <h2
          id="qr-code-heading"
          className="relative w-fit mt-[-1.00px] [font-family:'Playfair_Display',Helvetica] font-semibold text-[#1e3d25] text-xl tracking-[0.50px] leading-7 whitespace-nowrap"
        >
          QR Code
        </h2>
        <img
          className="relative flex-[0_0_auto]"
          alt=""
          aria-hidden="true"
          src="/img/container-12.svg"
        />
      </div>
      <div className="flex flex-col h-[259px] items-center gap-4 pt-6 pb-0 px-0 relative self-stretch w-full">
        <img
          className="relative w-[150px] h-[151px]"
          alt="QR code for saving contact details"
          src="/img/container-13.svg"
        />
        <p className="relative w-fit [font-family:'Lato',Helvetica] font-normal text-[#6b6558] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
          Scan to save contact details
        </p>
        <button
          type="button"
          onClick={handleDownload}
          className="all-unset box-border flex-col w-[344px] px-8 py-2.5 bg-[#1e3d25] flex items-center justify-center relative flex-[0_0_auto] rounded-xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e3d25]"
          aria-label="Download QR code"
        >
          <span className="relative w-fit mt-[-1.00px] [font-family:'Lato',Helvetica] font-semibold text-[#f5f4f0] text-sm text-center tracking-[0.35px] leading-[21px] whitespace-nowrap">
            Download QR Code
          </span>
        </button>
      </div>
      <img
        className="absolute top-[37px] left-1.5 w-[38px] h-[37px]"
        alt=""
        aria-hidden="true"
        src="/img/container-14.svg"
      />
    </section>
  );
};
