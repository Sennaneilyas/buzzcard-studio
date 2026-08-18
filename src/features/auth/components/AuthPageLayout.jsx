export function AuthPageLayout({ title, description, children }) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-cloud px-4 py-10">
      <section className="w-full max-w-[440px] rounded-2xl bg-white p-7 text-center shadow-xl sm:p-10">
        <img src="/logoHB.svg" alt="BuzzCard" className="mx-auto h-7 w-auto" />
        <h1 className="mt-7 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/50">{description}</p>
        {children}
      </section>
    </main>
  );
}

export function AuthStatusMessage({ message }) {
  return (
    <p
      className={`rounded-lg px-4 py-3 text-left text-sm ${
        message.type === "error"
          ? "bg-red-50 text-red-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
      role="status"
    >
      {message.text}
    </p>
  );
}
