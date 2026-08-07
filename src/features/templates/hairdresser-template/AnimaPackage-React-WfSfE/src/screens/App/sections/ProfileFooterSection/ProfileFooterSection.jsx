export const ProfileFooterSection = () => {
  const profileUrl = "https://buzzcard.ma";
  const copyright = "© Lara Miller · New Salon";

  return (
    <footer className="bg-[#1e3d25] px-5 py-5 text-center text-[#f5f4f0]" aria-label="Profile footer">
      <a
        className="text-xs tracking-[0.2px] text-[#f5f4f0]/80 transition hover:text-white"
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
      >
        {profileUrl}
      </a>
      <p className="mt-2 text-[11px] text-[#f5f4f0]/60">{copyright}</p>
    </footer>
  );
};
