import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8f5] px-5 py-10 text-[#1c2720]">
      <div className="pointer-events-none absolute -left-28 -top-32 size-[25rem] rounded-full bg-[#e2eadc] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-28 size-[28rem] rounded-full bg-[#f1e7db] blur-3xl" />
      <section className="relative w-full max-w-[440px] rounded-2xl border border-[#e7ebe3] bg-white/95 p-7 shadow-[0_24px_80px_rgba(36,54,43,.10)] sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#24362b] text-sm font-semibold tracking-wide text-white">
            PCPA
          </div>
          <div>
            <p className="text-sm font-semibold text-[#26342a]">
              Pimpri-Chinchwad Photography Association
            </p>
            <p className="mt-1 text-xs text-[#89938b]">Photography Admin</p>
          </div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#71866a]">
          Admin portal
        </p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-.04em]">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-[#7b857d]">
          Sign in to access your dashboard.
        </p>
        <LoginForm />
        <p className="mt-7 border-t border-[#edf0eb] pt-5 text-center text-[11px] text-[#9ba49c]">
          Pune Camera Photography Association
        </p>
      </section>
    </main>
  );
}
